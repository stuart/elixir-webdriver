defmodule WebDriver.PhantomJS.Port do
  use GenServer.Behaviour
  use WebDriver.Browser

  @program_name :phantomjs
  @start_wait_timeout 5000

  # port refers to the Erlang Port, not the HTTP port number!
  defrecord State, port: nil, 
                   root_url: "", 
                   program_name: @program_name, 
                   supervisor: nil, 
                   session_supervisor: nil,
                   sessions: [], 
                   http_port: nil

  
  def set_root_url state do
    {:ok, http_port} = WebDriver.PortFinder.select_port
    state = state.http_port(http_port)
    state.root_url("http://localhost:#{http_port}/wd/hub")
  end

  def do_init state do
    state
  end

  def program_name state do
    :os.find_executable state.program_name
  end

  def arguments state do
    ["--webdriver=#{state.http_port}"]
  end

  def wait_for_start state do
    receive do
      {_,{:data,'PhantomJS is launching GhostDriver...\n'}} -> { :ok, state }
      after @start_wait_timeout ->
        :error_logger.error_msg "PhantomJS has not started.\n\
                         Check that you can start it with: #{program_name(state)} #{arguments(state)}"
        { :error, state }
    end
  end

  def normal_termination state do
    # Send a shutdown signal to the PhantomJS process.
    HTTPotion.get "#{state.root_url}/shutdown"
    Port.close state.port
    :ok
  end

  def browser_terminated _state do
    :ok
  end
end
