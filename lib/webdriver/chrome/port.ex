defmodule WebDriver.Chrome.Port do
  use GenServer.Behaviour
  use WebDriver.Browser

  @moduledoc """
    This module is a server that controls the running of the Chrome browser.
    It uses an Erlang port to communicate with chromedriver.

    None of the functions here are user facing and are controlled by the
    BrowserSup.
  """
  @program_name :chromedriver
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
    {:ok, port_arg} = String.to_char_list("--port=#{state.http_port}")
    [port_arg,'--url-base=wd/hub']
  end

  def wait_for_start state do
    IO.puts "#{program_name(state)} #{arguments(state)}"
    start_string = String.to_char_list("Starting ChromeDriver")
    receive do
      {_,{:data, [start_string | _]}} -> { :ok, state }
      after @start_wait_timeout ->
        :error_logger.error_msg "Chromedriver has not started.\n\
                         Check that you can start it with: #{program_name(state)} #{arguments(state)}"
        { :error, state }
    end
  end

  def normal_termination state do
    # Send a shutdown signal to the ChromeDriver process.
    HTTPotion.get "#{state.root_url}/shutdown"
    Port.close state.port
    :ok
  end

  def browser_terminated state do
    :ok
  end
end
