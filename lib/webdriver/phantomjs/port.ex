defmodule WebDriver.PhantomJS.Port do
  use GenServer.Behaviour

  @program_name :phantomjs
  @start_wait_timeout 5000

  # port refers to the Erlang Port, not the HTTP port number!
  defrecord State, port: nil, 
                   root_url: "", 
                   program_name: @program_name, 
                   supervisor: nil, 
                   session_supervisor: nil,
                   sessions: [] 

  def start_link config, sup do
    { :ok, _pid } = :gen_server.start_link {:local, config.name}, __MODULE__, 
                                            State.new(supervisor: sup), [timeout: 30000]
  end

  def start_session name do
    :gen_server.call name, :start_session
  end

  ## GenServer Callbacks
  def init state do
    program = :os.find_executable state.program_name

    {:ok, http_port} = WebDriver.PortFinder.select_port
    state = state.root_url("http://localhost:#{http_port}/wd/hub")

    Process.flag :trap_exit, true
    state = state.port(Port.open { :spawn_executable, program },
                       [ { :args, ["--webdriver=#{http_port}"] },
                       :exit_status ])
    # Wait for PhantomJS to start.
    receive do
      {_,{:data,'PhantomJS is launching GhostDriver...\n'}} -> { :ok, state, :hibernate }
      after @start_wait_timeout ->
        :error_logger.error_msg "PhantomJS has not started.\n\
                         Check that you can start it with: #{program} #{@args}"
        { :error, state }
    end

    self <- { :start_session_supervisor, state.supervisor }
    { :ok, state }
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
    { :stop, { :phantomjs_terminated, reason }, state }
  end

  def handle_info {_port ,{:exit_status, status}}, state do
    { :stop, { :phantomjs_terminated, status }, state }
  end

  def handle_info {_port ,{:data, _info }}, state do
    #:error_logger.info_msg info
    { :noreply, state }
  end

  def terminate {:phantomjs_terminated, _reason}, _state do
    :ok
  end

  def terminate _reason, state do
    # Send a shutdown signal to the PhantomJS process.
    HTTPotion.get "#{state.root_url}/shutdown"
    Port.close state.port
    :ok
  end
end
