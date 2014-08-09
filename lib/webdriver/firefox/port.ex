defmodule WebDriver.Firefox.Port do
  use GenServer

  @moduledoc """
    This module is a server that controls the running of the Firefox browser.
    It uses an Erlang port to communicate with the browser.

    None of the functions here are user facing and are controlled by the
    BrowserSup.
  """

  @osx_path "/Applications/Firefox.app/Contents/MacOS/firefox-bin"
  @win_path "%PROGRAMFILES%\\Mozilla Firefox\\firefox.exe"
  @start_wait_timeout 10000

  alias WebDriver.Firefox.Profile

  defmodule State do
    defstruct port: nil,
             root_url: "",
             program_name: "",
             supervisor: nil,
             session_supervisor: nil,
             firefox_temp_dir: "",
             kill_command: "",
             sessions: [],
             http_port: nil
  end
  use WebDriver.Browser

  def program_name _state do
    Path.join [ __DIR__, "shim.sh"]
  end

  def installed? do
    [f|_] = arguments("")
    File.exists?(f)
  end

  # Because we are using a shim the Firefox program name becomes the argument.
  defp arguments _state do
    [ case platform do
        :osx ->     :os.find_executable('firefox-bin') or @osx_path
        # Windows is not actually supported yet, the startup shim wont work.
        :windows -> :os.find_executable('firefox') or @win_path
        :unix ->    :os.find_executable('firefox3') or
                    :os.find_executable('firefox2') or
                    :os.find_executable('firefox')
     end ]
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

  def set_root_url state do
    {:ok, http_port} = WebDriver.PortFinder.select_port
    state = state.http_port(http_port)
    state.root_url("http://localhost:#{http_port}/hub")
  end

  def do_init state do
    profile  = Profile.default_profile
               |> Profile.set_port(state.http_port)
    state = state.firefox_temp_dir(Profile.make_temp_directory)
    Profile.write_profile profile, state.firefox_temp_dir
    Profile.install_extension state.firefox_temp_dir
    set_env state.firefox_temp_dir
    state
  end

  def wait_for_start state do
    receive do
      {_port, {:data, info}} ->
      case String.from_char_list!(info) do
        <<"kill -9 ", pid::binary>> ->
          { :ok, state.kill_command(String.to_char_list("kill -9 #{pid}"))}
        info ->
          :error_logger.info_msg "#{__MODULE__}: #{info}"
          { :ok, state }
      end
    after @start_wait_timeout ->
        :error_logger.error_msg "FireFox has not started.\n\
            Check that you can start it with: #{arguments(state)}"
        { :error, state }
    end
  end

  def normal_termination state do
    Port.close(state.port)
    :os.cmd(state.kill_command)
    File.rm_rf state.firefox_temp_dir
    :ok
  end

  def browser_terminated state do
    File.rm_rf state.firefox_temp_dir
    :ok
  end
end

