defmodule WebDriver.Session do
  use GenServer

  alias WebDriver.Cookie

  defmodule State do
    defstruct name: nil,
              root_url: "",
              session_id: :null,
              desiredCapabilities: %{},
              negotiatedCapabilities: %{},
              browser: nil
  end

  @moduledoc """
    This module runs a browser session. Use these functions to drive the browser.
    The 'name' parameter is always the session name atom that is set when you
    start the session.

   Example Session:

      iex(1)>  config = %WebDriver.Config{browser: :phantomjs, name: :test_browser}
      %WebDriver.Config{browser: :phantomjs, name: :test_browser, root_url: ""}
      iex(2)> WebDriver.start_browser config
      {:ok, #PID<0.133.0>}
      iex(3)> WebDriver.start_session :test_browser, :session_name
      {:ok, #PID<0.137.0>}
      iex(4)> WebDriver.Session.url :session_name, "http://www.google.com"
      {:ok,
       %WebDriver.Protocol.Response{request: %WebDriver.Protocol.Request{body: "{\"url\":\"http://www.google.com\"}",
         headers: ["Content-Type": "application/json;charset=UTF-8",
          "Content-Length": 31], method: :POST,
         url: "http://localhost:53094/wd/hub/session/1f44bb00-2698-11e4-8216-49b0aee6bf1f/url"},
        session_id: "1f44bb00-2698-11e4-8216-49b0aee6bf1f", status: 0, value: %{}}}
      iex(5)> WebDriver.Session.url :session_name
      "http://www.google.com.au/?gfe_rd=cr&ei=ao7xU7TGNs3C8gednYCYBQ"
      iex(6)> WebDriver.stop_session :session_name
      :ok
      iex(7)> WebDriver.stop_browser :test_browser
      :ok
      iex(8)>

  """

  @doc """
    Starts the session.
  """
  def start_link state, name do
    state = %{state | name: name}
    :gen_server.start_link({:local, name}, __MODULE__ , state, [])
  end

  @doc """
    Stop the session.
  """
  def stop name do
    :gen_server.cast name, :stop
  end

  @doc """
    Returns the status of the WebDriver server.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/status
  """
  def status name do
    get_value name, :status
  end

  @doc """
    Returns the negotiated capabilities of the current session.
  """
  def negotiated_capabilities name do
    {:ok, capabilities} = :gen_server.call name, :capabilities
    capabilities
  end

  @doc """
    True if javascript is enabled for this session
  """
  def javascript_enabled? name do
    negotiated_capabilities(name).javascriptEnabled
  end

  @doc """
    True if this session can take screenshots.
  """
  def takes_screenshot? name do
    negotiated_capabilities(name).takesScreenshot
  end

  @doc """
    True if this session supports device rotation.
  """
  def rotatable? name do
    negotiated_capabilities(name).rotatable
  end

  @doc """
    True if this session can handle alerts
  """
  def handles_alerts? name do
    negotiated_capabilities(name).handlesAlerts
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
  def start_session name, desired_capabilities \\ %{} do
    :gen_server.call name, { :start_session,
                             %{desiredCapabilities: desired_capabilities}}
  end

  @doc """
    Stop the session with the given name. Does not stop the Erlang server, just sends
    a request to the WebDriver server to stop the session.
  """
  def stop_session name do
    :gen_server.call name, :stop_session
  end

  @doc """
    List all the sessions on the WebDriver browser.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId

    Returns a list of session ids.
  """
  def sessions name do
    get_value name, :sessions
  end

  @doc """
    Get details about the current session on the WebDriver server.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId

    Returns a capability record.
  """
  def session name do
    WebDriver.Capabilities.from_response(get_value name, :session)
  end

  @doc """
    Set timeouts on the server.
    Parameters must include the type of timeout and the length in milliseconds (ms).
    Valid types are "script" and "implicit"

    Parameters type: "script"|"implicit", ms: number
  """
  def set_timeout name, type, ms do
    cmd name, {:set_timeout, %{type: type, ms: ms}}
  end

  @doc """
    Set the script timeout for the session.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/async_script

    Parameters: [ms :: number]
  """
  def set_async_script_timeout name, ms do
    cmd name, {:set_async_script_timeout, %{ms: ms}}
  end

  @doc """
    Set the implicit wait timeout for the session.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/implicit_wait

    Parameters: [ms :: number]
  """
  def set_implicit_wait_timeout name, ms do
    cmd name, {:set_implicit_wait_timeout, %{ms: ms}}
  end

  @doc """
    Get the handle of the current window. A window handle is an opaque reference
    used for various window related functions.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/window_handle

    Returns: window_handle :: String
  """
  def window_handle name do
    get_value(name, :window_handle)
  end

  @doc """
    Get all the window handles associated with the browser.
    Returns a list of window handles.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/window_handles

    Returns: window_handles :: List[String]
  """
  def window_handles name do
    get_value(name, :window_handles)
  end

  @doc """
    Get the current page URL

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/url

    Returns: url :: String
  """
  def url name do
    get_value name, :url
  end

  @doc """
    Navigate to the specified url.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/url

    Note that this may take some time and calling
    other functions too soon may fail if the implicit wait is
    not set at a high enough value.

    ## Examples

      iex> WebDriver.Session.url :session
      "about:blank"
      iex> WebDriver.Session.url :session, "http://www.google.com.au/"
      iex> WebDriver.Session.url :session
      "http://www.google.com.au/"

    Parameters [url :: String]
  """
  def url name, url do
    cmd name, {:url, %{url: url}}
  end

  @doc """
    Navigate forward in the browser history.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/forward
  """
  def forward name do
    cmd name, :forward
  end

  @doc """
    Navigate back in the browser history.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/back
  """
  def back name do
    cmd name, :back
  end

  @doc """
    Refresh the current page in the browser.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/refresh
  """
  def refresh name do
    cmd name, :refresh
  end

  @doc """
    Execute Javascript in the browser and return the result.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/execute

    Example:

    ```
      iex> WebDriver.Session.execute :test, "return 2+2;"
      4
      iex> WebDriver.Session.execute :test, "return arguments[0] * arguments[1];", [5,3]
      15
    ```

    Parameters: [script :: String, args :: List]

    Returns: The Javascript return value, which may be a number,
             string, list or object (map).
  """
  def execute name, script, args \\ [] do
    case javascript_enabled?(name) do
      true -> get_value name, {:execute, %{script: script, args: args}}
      false -> {:error, "Javascript not enabled for this session."}
    end
  end

  @doc """
    Execute Javascript asynchronously in the browser and return the result.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/execute_async

    Parameters: [script :: String, args :: List]

    Returns: The Javascript return value, which may be a number,
             string, list or object (map).
  """
  def execute_async name, script, args \\ [] do
    case javascript_enabled?(name) do
      true -> get_value name, {:execute, %{script: script, args: args}}
      false -> {:error, "Javascript not enabled for this session."}
    end
  end

  @doc """
    Get a PNG screenshot of the current page.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/screenshot

    Returns: PngImage :: Binary
  """
  def screenshot name do
    case takes_screenshot?(name) do
      true -> get_value name, :screenshot
      false -> {:error, "Screenshot not enabled for this session."}
    end
  end

  @doc """
    Change the frame that has focus in the current window.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/frame

    Parameters: %{id: string | number | :null | WebElement}
  """
  def frame name, id do
    cmd name, {:frame, %{id: id}}
  end

  @doc """
    Change the focus to another window.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/window

    The window may be specified by the server assigned window handle or the value of it's name attribute.

    Parameters: %{window_handle : string}
  """
  def window name, window_handle do
    cmd name, {:window, %{name: window_handle}}
  end

  @doc """
    Closes the current window.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/window
  """
  def close_window name do
    cmd name, :close_window
  end

  @doc """
    Maximise the specified window. Use "current" or simply do not specify a handle to
    maximise the current window.

    http://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/window/:windowHandle/maximize
  """
  def maximize_window name, window_handle \\ "current" do
    cmd name, {:maximize_window, window_handle}
  end

 @doc """
    Retreive the window size. If a window handle is not specified it retreives the
    current window.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window/:windowHandle/size

    Returns: %{height: number, width: number}
  """
  def window_size name do
    do_window_size(get_value(name, :window_size))
  end

  defp do_window_size {error, response} do
    {error, response}
  end

  defp do_window_size response do
    resp = Enum.into response, HashDict.new()
    {:ok, h} = HashDict.fetch(resp,"height")
    {:ok, w} = HashDict.fetch(resp,"width")
    [height: h,  width: w]
  end

  @doc """
    Set the window size.

    NOTE: Firefox can only do manipulation on the currently focussed window.
    You MUST pass the window_handle parameter as "current" for Firefox or you
    will get an error response.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/window/:windowHandle/size

    Parameters: [height :: number, width :: number]
  """
  def window_size name, window_handle, width, height do
    cmd name, {:window_size, window_handle, %{width: width, height: height}}
  end

  @doc """
    Retreive all the cookies associated with the current page.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/cookie
  """
  def cookies name do
    Enum.map get_value(name, :cookies),
     fn(cookie) -> WebDriver.Cookie.from_response(cookie) end
  end

  defp in_one_hour do
    {mega, secs, _} = :os.timestamp()
    mega * 1000000 + secs + 3600
  end

  @doc """
    Set a cookie for the current page.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/cookie

    Parameters: [cookie :: object]
  """
  def set_cookie name, %Cookie{name: cookie_name, value: value, path: path, domain: domain, expiry: 0} do
    set_cookie name, cookie_name, value, path, domain
  end

  def set_cookie name, %Cookie{name: cookie_name, value: value, path: path, domain: domain, expiry: expiry} do
    set_cookie name, cookie_name, value, path, domain, expiry
  end

  def set_cookie name, cookie_name, value, path, domain, expiry \\ in_one_hour do
    cmd name, {:set_cookie,
        %{cookie: %{name: cookie_name, value: value, path: path, domain: domain, expiry: expiry}}}
  end

  @doc """
    Delete all cookies for the current page.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie
  """
  def delete_cookies name do
    cmd name, :delete_cookies
  end

  @doc """
    Delete the cookie with the given name.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/cookie/:name
  """
  def delete_cookie name, cookie_name do
    cmd name, {:delete_cookie, cookie_name}
  end

  @doc """
    Retreive the curent page source.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/source
  """
  def source name do
    get_value name, :source
  end

  @doc """
    Retreive the current page title.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/title
  """
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
      %{"ELEMENT" => id} -> %WebDriver.Element{id: URI.encode(id), session: name}
      resp -> resp
    end
  end

  @doc """
    Retreive an element from the page using the specified search strategy.
    Returns the first element found that fits the search criteria.

    The return value is an element reference that can be used by functions in
    the WebDriver.Element module for further queries.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element

    The parameter 'using' must be a valid search strategy.
    The parameter 'value' is a string to search for.

    Valid search strategies are:

      * :class - Search for an element with the given class attribute.
      * :class_name - alias for :class
      * :css - Search for an element using a CSS selector.
      * :id - Find an element with the given id attribute.
      * :name - Find an element with the given name attribute.
      * :link - Find an link element containing the given text.
      * :partial_link - Find a link element containing a superset of the given text.
      * :tag - Find a HTML tag of the given type.
      * :xpath - Use [XPath](http://www.w3.org/TR/xpath/) to search for an element.

    Parameters [using :: atom, value :: String]

    Returns: A (WebDriver.Element)[/WebDriver.Element.html] struct.

    ## Examples

      iex(12)> WebDriver.Session.element :test, :css, "img.logo"
      %WebDriver.Element{id: ":wdc:1373691496542", session: :test}
      iex(13)> WebDriver.Session.element :test, :id, "branding"
      %WebDriver.Element{id: ":wdc:1373691496543", session: :test}

  """
  def element name, using, value do
    get_value(name, {:element, %{ using: Keyword.get(@selectors,using), value: value }})
    |> element_value(name)
  end

  @doc """
    Retreive an element from the page starting from the specified
    element using the specified search strategy.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/element

    See WebDriver.Session.element/3 for details on search strategies.

    Parameters: [using :: atom, value :: String, start_element :: WebDriver.Element.Reference]

  """
  def element name, using, value, start_element do
    get_value(name, {:element, start_element.id,
                    %{ using: Keyword.get(@selectors,using), value: value }})
    |> element_value(name)
  end

  defp elements_value value, name do
    case value do
      {:no_such_element, _resp} -> []
      {:unknown_error, resp} -> {:unknown_error, resp}
      element_list -> Enum.map(element_list, fn(e) -> element_value(e,name) end)
    end
  end

  @doc """
    Retreive all elements from the page using the specified search strategy.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element

    See element/3 for details on the parameters used.
    Returns a list of Element structs.
  """
  def elements name, using, value do
    get_value(name, {:elements,
                     %{ using: Keyword.get(@selectors,using), value: value }})
    |> elements_value(name)
  end

  @doc """
    Retreive all elements starting from the specified element using the
    specified search strategy.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/elements

    See element/3 for details on the parameters used.
    The start_element parameter must be a WebDriver.Element struct.
    Returns a list of Element structs.
  """
  def elements name, using, value, start_element do
    get_value(name, {:elements, start_element.id,
                     %{ using: Keyword.get(@selectors,using), value: value }})
      0
    |> elements_value(name)
  end

  @doc """
    Get the element on the page that currently has focus.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/active
  """
  def active_element name do
    get_value(name, :active_element) |> element_value(name)
  end

  # def element_by_id name, element do
  #   get_value(name, {:element_by_id, element}) |> element_value name
  # end

  @doc """
    Send a list of keystrokes to the currently active element.
    If you want to send non-printable keystrokes you must call
    ```Webdriver.Keys.key(key_symbol)``` to convert it properly.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/keys

    Parameters: [ value :: String ]
  """
  def keys name, value do
    cmd name, {:keys, %{value: String.codepoints value}}
  end

  @doc """
    Get the current browser screen orientation.
    Only works on browsers with the `rotatable` capability.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/orientation
  """
  def orientation name do
    case rotatable? name do
      true -> get_value name, :orientation
      false -> {:error, "Session does not support device rotation."}
    end
  end

  @doc """
    Set the current browser screen orientation
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/orientation

    Parameters: [screen_orientation :: atom]

    Screen orientaton can be either :portrait or :landscape.
  """
  def orientation name, screen_orientation do
    case rotatable? name do
      true -> do_orientation name, screen_orientation
      false -> {:error, "Session does not support device rotation."}
    end
  end

  defp do_orientation name, screen_orientation do
    case screen_orientation do
      :landscape -> cmd name, {:orientation, %{ orientation: "LANDSCAPE"}}
      :portrait  -> cmd name, {:orientation, %{ orientation: "PORTRAIT"}}
    end
  end


  @doc """
    Gets the text of the currently displayed JavaScript alert(), confirm(),
    or prompt() dialog.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/alert_text
  """
  def alert_text name do
    case handles_alerts? name do
      true -> get_value name, :alert_text
      false -> {:error, "Session does not handle alert, confirm or prompt dialogs."}
    end
  end

  @doc """
    Sets the text of the currently displayed JavaScript prompt() dialog.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/alert_text
  """
  def alert_text name, keys do
    case handles_alerts? name do
      true -> cmd name, {:alert_text, %{text: keys}}
      false -> {:error, "Session does not handle alert, confirm or prompt dialogs."}
    end
  end

  @doc """
    Accepts the currently shown dialog. This usually means clicking the "OK" button.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/accept_alert
  """
  def accept_alert name do
    case handles_alerts? name do
      true -> cmd name, :accept_alert
      false -> {:error, "Session does not handle alert, confirm or prompt dialogs."}
    end
  end

  @doc """
    Dismisses the currently shown dialog. This usually means clicking the "Cancel" button.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/dismiss_alert
  """
  def dismiss_alert name do
    case handles_alerts? name do
      true -> cmd name, :dismiss_alert
      false -> {:error, "Session does not handle alert, confirm or prompt dialogs."}
    end
  end

###############################################################
#
# GenServer callbacks
#
###############################################################

  def init state do
    {:ok, response} = WebDriver.Protocol.start_session state.root_url,
               %{desiredCapabilities: state.desiredCapabilities}
    state = %{state | negotiatedCapabilities: WebDriver.Capabilities.from_response(response.value)}
    {:ok, %{state | session_id: response.session_id }}
  end

  def handle_cast(:stop, state) do
    {:stop, :normal, state}
  end

  def handle_call :capabilities, _sender, state do
    {:reply, {:ok, state.negotiatedCapabilities}, state }
  end

  def handle_call({:start_session, params}, _sender, state) do
    {:ok, response} = WebDriver.Protocol.start_session state.root_url, params
    {:reply, {:ok, response},  %{state | session_id: response.session_id }}
  end

  # Calls when no session is running.
  def handle_call({function, params}, _sender, state = %State{session_id: :null}) do
    response = :erlang.apply(WebDriver.Protocol, function,
                                  [state.root_url, params])
    {:reply, response, state}
  end

  def handle_call(function, _sender, state = %State{session_id: :null}) do
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
