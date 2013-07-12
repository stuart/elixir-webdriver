defmodule WebDriver.Firefox.Port do
  use GenServer.Behaviour

  @osx_path "/Applications/Firefox.app/Contents/MacOS/firefox-bin"
  @win_path "%PROGRAMFILES%\\Mozilla Firefox\\firefox.exe"
  
  alias WebDriver.Firefox.Profile

  defrecord State, port: nil,
                   root_url: "",
                   program_name: "",
                   supervisor: nil,
                   session_supervisor: nil,
                   firefox_temp_dir: "",
                   kill_command: ""

  def start_link config, sup do
    { :ok, _pid } = :gen_server.start_link {:local, config.name}, __MODULE__, 
                                            State.new(supervisor: sup), [timeout: 30000]
  end

  defp program_name do
    case platform do
      :osx ->     :os.find_executable('firefox-bin') or @osx_path
      # Windows is not actually supported yet, the startup shim wont work.
      :windows -> :os.find_executable('firefox') or @win_path
      :unix ->    :os.find_executable('firefox3') or 
                  :os.find_executable('firefox2') or 
                  :os.find_executable('firefox')
    end
  end

  defp platform do
    case :os.type do
      { :unix, :darwin } -> :osx
      { :unix,  _ }      -> :unix
      { :win32, _ }      -> :windows
    end
  end

  defp set_env profile_path do
    :os.putenv "XRE_CONSOLE_LOG", "console_log_path"
    :os.putenv "XRE_PROFILE_PATH", profile_path
    :os.putenv "MOZ_NO_REMOTE", "1"
    :os.putenv "MOZ_CRASHREPORTER_DISABLE", "1"
    :os.putenv "NO_EM_RESTART", "1"
  end

## GenServer Callbacks
  def init state do
    {:ok, http_port} = WebDriver.PortFinder.select_port
    state = state.root_url("http://localhost:#{http_port}/hub")
    profile  = Profile.default_profile
               |> Profile.set_port(http_port)
    state = state.firefox_temp_dir(Profile.make_temp_directory)
    Profile.write_profile profile, state.firefox_temp_dir
    Profile.install_extension state.firefox_temp_dir
    set_env state.firefox_temp_dir

    shim = Path.join [ __DIR__, "shim.sh"]
    
    Process.flag :trap_exit, true
    port = Port.open { :spawn_executable, shim }, 
                      [{ :args, [program_name] }, :exit_status]
    
    self <- { :start_session_supervisor, state.supervisor }
    { :ok, state.port(port), :hibernate }
  end

  def handle_call :root_url, _sender, state do
    {:reply, state.root_url, state}
  end
  
  def handle_call {:start_session, session_name}, _sender, state do
    {:ok, pid} = :supervisor.start_child state.session_supervisor, [session_name]
    {:reply, {:ok, pid}, state}
  end
  
  def handle_cast(:stop, state) do
    {:stop, :normal, state}
  end

  def handle_info {:start_session_supervisor, sup}, state do
    config = WebDriver.Session.State.new(root_url: state.root_url, browser: self)
    spec = Supervisor.Behaviour.worker(WebDriver.SessionSup,[config])
    {:ok, pid} = :supervisor.start_child sup, spec
    {:noreply, state.session_supervisor(pid)}
  end
  
  def handle_info {:EXIT, _port, reason}, state do
    { :stop, { :firefox_terminated, reason }, state }
  end

  def handle_info({_port, {:data, info}}, state) do
    case list_to_binary(info) do
    # Firefox won't shutdown on the port closing or on a WebDriver 
    # shutdown command, so the shim tells us what command to use to kill it.
    # TODO: fix this for Windows.
    <<"kill -9 ", _::binary>> ->
      { :noreply, state.kill_command(info) }
    _ ->
      :error_logger.info_msg "Firefox: #{info}"
      { :noreply, state }
    end
  end

  def handle_info {_port ,{:exit_status, status}}, state do
    { :stop, { :firefox_terminated, status }, state }
  end

  def terminate {:firefox_terminated, _reason}, state do
    File.rm_rf state.firefox_temp_dir
    :ok
  end

  # Kill Firefox, close the port and delete the profile directory.
  def terminate _reason, state do
    :os.cmd(state.kill_command)
    Port.close state.port
    File.rm_rf state.firefox_temp_dir
    :ok
  end
end

