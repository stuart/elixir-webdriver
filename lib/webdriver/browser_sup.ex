defmodule WebDriver.BrowserSup do
  use Supervisor

  @moduledoc """
    The WebDriver.BrowserSup is a supervisor responsible for overseeing
    the running of browser instances and their associated session supervisors.

    If a browser crashes for any reason this will restart the browser and the
    sessions that connect to it. Of course those sessions will have lost their
    state.
  """

  @browsers [ firefox: WebDriver.Firefox.Port,
              phantomjs: WebDriver.PhantomJS.Port,
              chrome: WebDriver.Chrome.Port,
              remote: WebDriver.Remote.Port ]

  @doc """
    Starts up a browser. The browser is then
    responsible for starting a session supervisor attached to this
    supervisor.
  """
  def start_link config do
    :supervisor.start_link __MODULE__, config
  end

  def init config do
    child_processes = [ worker(Keyword.get(@browsers, config.browser),
                        [config, self])]
    supervise child_processes, strategy: :rest_for_one
  end
end
