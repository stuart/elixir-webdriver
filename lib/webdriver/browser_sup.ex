defmodule WebDriver.BrowserSup do
  use Supervisor.Behaviour

  @browsers [ firefox: WebDriver.Firefox.Port, 
              phantomjs: WebDriver.PhantomJS.Port ]
  
  def start_link config do
    :supervisor.start_link __MODULE__, config
  end

  @doc """
    Starts up a browser of the requested type and a session supervisor
    for sessions on that browser.
  """
  def init config do
    child_processes = [ worker(Keyword.get(@browsers, config.browser), 
                        [config, self])]
    supervise child_processes, strategy: :rest_for_one
  end
end
