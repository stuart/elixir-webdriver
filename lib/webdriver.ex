defmodule WebDriver do
  use Application.Behaviour
  
  @moduledoc """
    This is the Elixir WebDriver application. It can be used to drive a
    WebDriver enabled webbrowser via Elixir code.

    The current version supports PhantomJS and FireFox.
  """

  defrecord Config, browser: :phantomjs, name: nil, root_url: "" do
    @moduledoc """
      Configuration for a WebDriver browser instance.
      Note that this record will have fields added as development of 
      the library progresses.

      * `browser` - The type of browser, :phantomjs or :firefox
      * `name` - An atom to refer to the browser for later calls.
      
    """
  end
  
  @doc """
    Start the application. This is a callback called by
    :application.start :webdriver
    and should probably not be called directly.
  """
  def start :normal, config do
    WebDriver.Supervisor.start_link config
  end

  @doc """
    Callback to clean up on exit. Currently does nothing much.
  """
  def stop _config do
    :ok
  end

  @doc """
    Start a browser with the given configuration. 
    The _config_ parameter is a WebDriver.Config record defined as

    ``` defrecord Config, browser: :phantomjs, name: nil ```

    Currently Config is very minimal, future versions will add to this.
    Browser can be eithes :phantomjs or :firefox.
    
    *Note that at the moment Firefox support is highly experimental.*

    The name parameter is an atom with which you can reference the browser
    process for further calls.

    Returns ```{:ok, pid}``` or ```{:error, reason}```

    Example:

      iex> config = WebDriver.Config.new(browser: :phantomjs, name: :test_browser)
      iex> WebDriver.start_browser config
      Starting phantomjs
      Phantom js started
      {:ok,#PID<0.235.0>}

  """
  def start_browser config do
    WebDriver.Supervisor.start_browser config
  end

  @doc """
    Stop the web browser referred to by name. You can also use the pid of the 
    process if you wish. 
    This causes the browser and all associated sessions to be terminated.
  """
  def stop_browser name do
    WebDriver.Supervisor.stop_browser name
  end

  @doc """
    Start a session on the specified browser.
    You must specify a name for the session in order to refer to it
    for further calls to the Session module.

    Returns ```{:ok, pid}``` or ```{:error, reason}```
  """
  def start_session browser, session_name do
    :gen_server.call browser, {:start_session, session_name}
  end

  @doc """
    Stop session. Kill a session on the current browser.
    This will attempt to terminate the session in the browser then it will 
    stop the process running the session in the VM.
  """
  def stop_session session_name do
    WebDriver.Session.stop session_name
  end
end
