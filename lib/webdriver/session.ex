defmodule WebDriver.Session do
  use GenServer.Behaviour

  alias WebDriver.Config
  alias WebDriver.Response
  alias WebDriver.Protocol
  alias WebDriver.Element

  defrecord State,  name: nil,
                    root_url: "",
                    session_id: :null,
                    desiredCapabilities: [],
                    browser: nil

  @doc """
    Starts the session.
  """
  def start_link state, name do
    state = state.name name
    :gen_server.start_link({:local, name},__MODULE__, state, [])
  end

  def stop name do
    :gen_server.cast name, :stop
  end

  @doc """
    Returns the status of the WebDriver server.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/status

    This returns a capability record.
  """
  def status name do
    get_value name, :status
  end

  @doc """
    Start a session with the desired capabilities on the browser.
    This is automatically called when the Session server starts, but in
    some cases you may want to stop and restart sessions without stopping
    and restarting the Session server.

    Parameters:
      name : The session server process to start the session on.
      desired_capabilities: Capability
  """
  def start_session name, desired_capabilities // [] do
    :gen_server.call name, { :start_session, 
                             [desiredCapabilities: desired_capabilities] }
  end

  @doc """
    Stop the session with the given name. Does not stop the Erlang server, just sends
    a request to the WebDriver server to stop the session.
  """
  def stop_session name do
    :gen_server.call name, :stop_session
  end

  @doc """
    List all the sessions on the WebDriver server.
  """
  def sessions name do
    get_value name, :sessions
  end

  @doc """
    Get details about the current session on the WebDriver server.
    Returns a capability record.
  """
  def session name do
    get_value name, :session
  end

  @doc """
    Set timeouts on the server.
    Parameters must include the type of timeout and the length in milliseconds (ms).
    Valid types are "script" and "implicit"

    Parameters type: "script"|"implicit", ms: number
  """
  def set_timeout name, type, ms do
    cmd name, {:set_timeout, [type: type, ms: ms]}
  end

  @doc """
    Set the script timeout for the session.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/async_script

    Parameters: ms: number
  """
  def set_async_script_timeout name, ms do
    cmd name, {:set_async_script_timeout, [ms: ms]}
  end

  @doc """
    Set the implicit wait timeout for the session.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/implicit_wait

    Parameters: [ms: number]
  """
  def set_implicit_wait_timeout name, ms do
    cmd name, {:set_implicit_wait_timeout, [ms: ms]}
  end

  def window_handle name do
    get_value(name, :window_handle)
  end

  def window_handles name do
    get_value(name, :window_handles)
  end

  def url name do
    get_value name, :url
  end

  def url name, url do
    cmd name, {:url, [url: url]}
  end

  def forward name do
    cmd name, :forward
  end

  def back name do
    cmd name, :back
  end

  def refresh name do
    cmd name, :refresh
  end

  def execute name, script, args // [] do
    get_value name, {:execute, [script: script, args: args]}
  end

  def execute_async name, script, args // [] do
    get_value name, {:execute, [script: script, args: args]}
  end

  def screenshot name do
    get_value name, :screenshot
  end

  def frame name, id do
    cmd name, {:frame, [id: id]}
  end

  def window name, window_handle do
    cmd name, {:window, [name: window_handle]}
  end

  def close_window name do
    cmd name, :close_window
  end

  def maximize_window name do
    cmd name, :maximize_window
  end

  def window_size name do
    resp = HashDict.new(get_value name, :window_size)
    {:ok, h} = HashDict.fetch(resp,"height")
    {:ok, w} = HashDict.fetch(resp,"width")
    [height: h,  width: w]
  end

  def window_size name, window_handle, width, height do
    cmd name, {:window_size, window_handle, [width: width, height: height]}
  end

  def cookies name do
    get_value name, :cookies
  end

  defp in_one_hour do
    {mega, secs, _} = :os.timestamp()
    mega * 1000000 + secs + 3600
  end

  def set_cookie name, cookie_name, value, path, domain, expiry // in_one_hour do
    cmd name, {:set_cookie,
        [cookie: [name: cookie_name, value: value, path: path, domain: domain, expiry: expiry]]}
  end

  def delete_cookies name do
    cmd name, :delete_cookies
  end

  def delete_cookie name, cookie_name do
    cmd name, {:delete_cookie, [cookie_name]}
  end

  def source name do
    get_value name, :source
  end

  def title name do
    get_value name, :title
  end

  @selectors [
      class_name: "class name",
      css: "css selector",
      id: "id",
      name: "name",
      link: "link text",
      partial_link: "partial link text",
      tag: "tag name",
      xpath: "xpath",
      class: "class name" ]

  defp element_value value, name do
    # Don't raise exceptions when we can't find an element. Just return nothing.
    case value do
      {:no_such_element, _resp} -> nil
      [{"ELEMENT", id}] -> WebDriver.Element.Reference[id: id, session: name]
    end
  end

  def element name, using, value do
    get_value(name, {:element, [ using: Keyword.get(@selectors,using), value: value ]})
    |> element_value(name)
  end

  def element name, using, value, start_element do
    get_value(name, {:element, start_element.id, 
                    [ using: Keyword.get(@selectors,using), value: value ]})
    |> element_value(name)
  end

  defp elements_value value, name do
    case value do
      {:no_such_element, _resp} -> []
      element_list -> Enum.map(element_list, fn(e) -> element_value(e,name) end)
    end
  end

  def elements name, using, value do
    get_value(name, {:elements, 
                     [ using: Keyword.get(@selectors,using), value: value ]})
    |> elements_value name
  end

  def elements name, using, value, start_element do
    get_value(name, {:elements, start_element.id, 
                     [ using: Keyword.get(@selectors,using), value: value ]})
      0
    |> elements_value name
  end

  def active_element name do
    get_value(name, :active_element) |> element_value name
  end

  # def element_by_id name, element do
  #   get_value(name, {:element_by_id, element}) |> element_value name
  # end

  def keys name, value do
    cmd name, {:keys, [value: String.codepoints value]}
  end

  def orientation name do
    get_value name, :orientation
  end

  def orientation name, screen_orientation do
    case screen_orientation do
      :landscape -> cmd name, {:orientation, [ orientation: "LANDSCAPE"]}
      :portrait  -> cmd name, {:orientation, [ orientation: "PORTRAIT"]}
    end
  end

###############################################################
#
# GenServer callbacks
#
###############################################################

  def init state do
    {:ok, response} = WebDriver.Protocol.start_session state.root_url, 
               [desiredCapabilities: state.desiredCapabilities]
    { :ok, state.session_id(response.session_id) }
  end

  def handle_cast(:stop, state) do
    {:stop, :normal, state}
  end

  def handle_call({:start_session, params}, _sender, state) do
    {:ok, response} = WebDriver.Protocol.start_session state.root_url, params
    {:reply, {:ok, response}, state.session_id(response.session_id)}
  end

  # Calls when no session is running.
  def handle_call({function, params}, _sender, state = State[session_id: :null]) do
    response = :erlang.apply(WebDriver.Protocol, function, 
                                  [state.root_url, params])
    {:reply, response, state}
  end

  def handle_call(function, _sender, state = State[session_id: :null]) do
    response = :erlang.apply(WebDriver.Protocol, function, [state.root_url])
    {:reply, response, state}
  end

  # Calls when there is a session.
  def handle_call({function, arg1, params}, _sender, state) do
    response = :erlang.apply(WebDriver.Protocol, function, 
                             [state.root_url, state.session_id, arg1, params])
    {:reply, response, state}
  end

  def handle_call({function, params}, _sender, state) do
    response = :erlang.apply(WebDriver.Protocol, function, 
                             [state.root_url, state.session_id, params])
    {:reply, response, state}
  end

  def handle_call(function, _sender, state) do
    response = :erlang.apply(WebDriver.Protocol, function, 
                             [state.root_url, state.session_id])
    {:reply, response, state}
  end

  defp get_value name, function do
    case :gen_server.call name, function do
      {:ok, response} -> response.value
      response -> response
    end
  end

  defp cmd name, request do
    :gen_server.call name, request, 20000
  end
end
