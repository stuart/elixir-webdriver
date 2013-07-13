defmodule WebDriver.Protocol do
  @moduledoc """
    Implements the HTTP JSON wire protocol for WebDriver.
    This is the internal protocol and is supposed to be called via the
    WebDriver session server rather than directly.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol

    All these calls take a WebDriver.Config record as a first parameter.
    The other parameters depend on the specific protocol call.

    All successful calls return {:ok, response} where response is a
    WebDriver.Protocol.Response record.

    Failed calls return {:error, status, body} where the status is the
    HTTP status returned and the body is the raw body of the returned
    response.

    A WebDriver response consists of a session id, status and return value.
    The session id is an opaque string provided by the server.
    The status can be one of the WebDriver status codes:
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/status

    The value varies according to the call made.

    The Response record defined here also appends the request details to 
    that response.
  """
  defrecord Response, session_id: :null, status: 0, value: :null, request: :null
  defrecord Request, method: "GET", url: "", headers: :null, body: :null

  def shutdown(root_url) do
    get root_url, ["shutdown"]
  end

  @doc """
    Returns the status of the WebDriver server.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/status

    ## Examples:

      iex> config = WebDriver.Config[host: "localhost", port: 8080]
      iex> resp = WebDriver.Protocol.status(config)
      iex> resp.status
      0
      iex> resp.session_id
      :null
      iex> resp.value
      [{"build",[{"version","1.0.3"}]},{"os",[{"name","mac"},{"version","10.8 (Mountain Lion)"},{"arch","32bit"}]}]
  """
  def status(root_url, _session_id // :null) do
    get root_url, ["status"]
  end

  @doc """
    Creates a new session on the server.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session

    Parameters: [desiredCapabilities: WebDriver.Protocol.Capabilities]
    ## Examples:

      iex> config = WebDriver.Config[host: "localhost", port: 8080]
      iex> resp = WebDriver.Protocol.start_session(config, [desiredCapabilities: []])
      iex> resp.session_id
      "370f0750-e1dd-11e2-af7a-8562953caa56"
  """
  def start_session(root_url, parameters) do
    post root_url, ["session"], parameters
  end

  @doc """
    Gets a list of all sessions on the server.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/sessions
  """
  def sessions(root_url, _session_id // :null) do
    get root_url, ["sessions"]
  end

  @doc """
    Retreive information about a session.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId
  """
  def session(root_url, session_id) do
    get root_url, ["session", session_id]
  end

  @doc """
    Stop the current session on the server.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId
  """
  def stop_session(root_url, session_id) do
    delete root_url, ["session", session_id]
  end

  @doc """
    Set timeouts on the server.
    Parameters must include the type of timeout and the length in milliseconds (ms).
    Valid types are "script" and "implicit"

    Parameters [type: "script"|"implicit", ms: number]
  """
  def set_timeout(root_url, session_id, parameters) do
    session_post root_url, session_id, "timeouts", parameters
  end

  @doc """
    Set the script timeout for the session.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/async_script

    Parameters: [ms: number]
  """
  def set_async_script_timeout(root_url, session_id, parameters) do
    post root_url, ["session", session_id, "timeouts", "async_script"], parameters
  end

  @doc """
    Set the implicit wait timeout for the session.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/implicit_wait

    Parameters: [ms: number]
  """
  def set_implicit_wait_timeout(root_url, session_id, parameters) do
    post root_url, ["session", session_id, "timeouts", "implicit_wait"], parameters
  end

  @doc """
    Get the current window handle for the session.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/window_handle
  """
  def window_handle(root_url, session_id) do
    session_get root_url, session_id, "window_handle"
  end

  @doc """
    Retreive a list of window handles available for the session.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/window_handles
  """
  def window_handles(root_url, session_id) do
    session_get root_url, session_id, "window_handles"
  end

  @doc """
    Retreive the URL of the current page.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/url
  """
  def url(root_url, session_id) do
    session_get root_url, session_id, "url"
  end

  @doc """
    Navigate to a new URL.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/url

    Parameters: [url: new_url]
  """
  def url(root_url, session_id, parameters) do
    session_post root_url, session_id, "url", parameters
  end

  @doc """
    Navigate forward to the next page.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/forward
  """
  def forward(root_url, session_id) do
    session_post root_url, session_id, "forward"
  end

  @doc """
    Navigate back to the previous page.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/back
  """
  def back(root_url, session_id) do
    session_post root_url, session_id, "back"
  end

  @doc """
    Refresh the current page.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/refresh
  """
  def refresh(root_url, session_id) do
    session_post root_url, session_id, "refresh"
  end

  @doc """
    Execute Javascript on the page.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/execute

    Parameters: [script: string, args: list]

    ## Example:

      iex> config = WebDriver.Config[host: "localhost", port: 8080]
      iex> sid = WebDriver.Protocol.start_session(config, [desiredCapabilities: []]).session_id
      iex> resp = WebDriver.Protocol.execute(config, sid, [script: "return 1+1", args: []])
      iex> resp.value
      2

  """
  def execute(root_url, session_id, parameters) do
    session_post root_url, session_id, "execute", parameters
  end

  @doc """
    Execute asynchronous Javascript on the page.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/execute_async

    Parameters: [script: string, args: list]
  """
  def execute_async(root_url, session_id, parameters) do
    session_post root_url, session_id, "execute_async", parameters
  end

  @doc """
    Retreive a screenshot of the current page.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/screenshot

    Returns a base64 encoded PNG image.
  """
  def screenshot(root_url, session_id) do
    session_get root_url, session_id, "screenshot"
  end

  @doc """
    IME FUNCTIONS ARE NOT YET IMPLEMENTED
  """
  def ime(_root_url, _session_id) do
    raise "Not Implemented"
  end

  @doc """
    Change the frame that has focus in the current window.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/frame

    Parameters: [id: string | number | :null | WebElement]
  """
  def frame(root_url, session_id, parameters) do
    session_post root_url, session_id, "frame", parameters
  end

  @doc """
    Change the focus to another window.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/window

    The window may be specified by the server assigned window handle or the value of it's name attribute.

    Parameters: [name: string]
  """
  def window(root_url, session_id, parameters) do
    session_post root_url, session_id, "window", parameters
  end

  @doc """
    Closes the current window.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/window
  """
  def close_window(root_url, session_id) do
    session_delete root_url, session_id, "window"
  end

  @doc """
    Retreive the window size. If a window handle is not specified it retreives the
    current window.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window/:windowHandle/size

    When the parameters are specified this will change the window size.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/window/:windowHandle/size

    Parameters: [height: number, width: number]
  """
  def window_size(root_url, session_id, window_handle // "current", parameters // :null) do
    do_window_size(root_url, session_id, window_handle, parameters)
  end

  defp do_window_size(root_url, session_id, window_handle, :null) do
    session_get root_url, session_id,  "window/#{window_handle}/size"
  end

  defp do_window_size(root_url, session_id, window_handle, parameters) do
    session_post root_url, session_id, "window/#{window_handle}/size", parameters
  end

  @doc """
    Retreive the window position for the specified window or if not specified, the current window.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window/:windowHandle/position

    Set the window position for the specified window if parameters are sent.
    Set window handle to "current" to set the current window position.

    Parameters: [x: number, y: number]
  """
  def window_position(root_url, session_id, window_handle // "current", parameters // :null) do
    do_window_position(root_url, session_id, window_handle, parameters)
  end

  defp do_window_position(root_url, session_id, window_handle, :null) do
    session_get root_url, session_id, "window/#{window_handle}/position"
  end

  defp do_window_position(root_url, session_id, window_handle, parameters) do
    session_post root_url, session_id, "window/#{window_handle}/position", parameters
  end

  @doc """
    Maximise the specified window. Use "current" or simply do not specify a handle to
    maximise the current window.

  """
  def maximize_window(root_url, session_id, window_handle // "current") do
    session_post root_url, session_id, "window/#{window_handle}/maximize"
  end

  @doc """
    Retreive all the cookies associated with the current page.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/cookie
  """
  def cookies(root_url, session_id) do
    session_get root_url, session_id, "cookie"
  end

  @doc """
    Set a cookie for the current page.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/cookie

    Parameters: [cookie: object]
  """
  def set_cookie(root_url, session_id, parameters) do
    session_post root_url, session_id, "cookie", parameters
  end

  @doc """
    Delete all cookies for the current page.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie
  """
  def delete_cookies(root_url, session_id) do
    session_delete root_url, session_id, "cookie"
  end

  @doc """
    Delete the cookie with the given name.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/cookie/:name
  """
  def delete_cookie(root_url, session_id, name) do
    session_delete root_url, session_id, "cookie/#{name}"
  end

  @doc """
    Retreive the curent page source.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/source
  """
  def source(root_url, session_id) do
    session_get root_url, session_id, "source"
  end

  @doc """
    Retreive the current page title.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/title
  """
  def title(root_url, session_id) do
    session_get root_url, session_id, "title"
  end

  @doc """
    Retreive an element from the page using the specified search strategy.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element

    Parameters [using: "class name" | "css selector" | "id" | "name" |
     "link text" | "partial link test" | "tag name" | "xpath",
     value: string]
  """
  def element(root_url, session_id, parameters) do
    session_post root_url, session_id, "element", parameters
  end

  @doc """
    Retreive an element from the page starting from the specified
    element using the specified search strategy.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/element

    Parameters [using: "class name" | "css selector" | "id" | "name" |
     "link text" | "partial link test" | "tag name" | "xpath",
     value: string]
  """
  def element(root_url, session_id, element_id, parameters) do
    element_post root_url, session_id, element_id, "element", parameters
  end

  @doc """
    Retreive all elements from the page using the specified search strategy.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element

    Parameters [using: "class name" | "css selector" | "id" | "name" |
     "link text" | "partial link test" | "tag name" | "xpath",
     value: string]
  """
  def elements(root_url, session_id, parameters) do
    session_post root_url, session_id, "elements", parameters
  end

  @doc """
    Retreive all elements starting from the specified element using the specified search strategy.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/elements

    Parameters [using: "class name" | "css selector" | "id" | "name" |
     "link text" | "partial link test" | "tag name" | "xpath",
     value: string]
  """
  def elements(root_url, session_id, element_id, parameters) do
    element_post root_url, session_id, element_id, "elements", parameters
  end

  @doc """
    Get the element on the page that currently has focus.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/active
  """
  def active_element(root_url, session_id) do
    session_get root_url, session_id, "element/active"
  end

  @doc """
    Get the element identified by the id.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id
  """
  def element_by_id(root_url, session_id, element_id) do
    session_get root_url, session_id, "element/#{element_id}"
  end

  @doc """
    Click on the specified element.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/click
  """
  def click(root_url, session_id, element_id) do
    element_post root_url, session_id, element_id, "click"
  end

  @doc """
    Submit a FORM element. May be applied to any descendent of a FORM element.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/submit
  """
  def submit(root_url, session_id, element_id) do
    element_post root_url, session_id, element_id, "submit"
  end

  @doc """
    Retreives the visible text of the element.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/text
  """
  def text(root_url, session_id, element_id) do
    element_get root_url, session_id, element_id, "text"
  end

  @doc """
    Send a list of keystrokes to the specified element.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/value

    Parameters: [value: Array<string>]
  """
  def value(root_url, session_id, element_id, parameters) do
    element_post root_url, session_id, element_id, "value", parameters
  end

  @doc """
    Send a list of keystrokes to the currently active element.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/keys

    Parameters: [value: Array<string>]
  """
  def keys(root_url, session_id, parameters) do
    session_post root_url, session_id, "keys", parameters
  end

  @doc """
    Get the name of the specified element.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/name
  """
  def name(root_url, session_id, element_id) do
    element_get root_url, session_id, element_id, "name"
  end

  @doc """
    Clears the specified form field or textarea element.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/clear
  """
  def clear(root_url, session_id, element_id) do
    element_post root_url, session_id, element_id, "clear"
  end

  @doc """
    Returns a boolean denoting if the element is selected or not.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/selected
  """
  def selected(root_url, session_id, element_id) do
    element_get root_url, session_id, element_id, "selected"
  end

  @doc """
    Returns a boolean denoting if the element is enabled or not.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/enabled
  """
  def enabled(root_url, session_id, element_id) do
    element_get root_url, session_id, element_id, "enabled"
  end

  @doc """
    Returns the value of the given element's attribute.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/attribute/:name
  """
  def attribute(root_url, session_id, element_id, name) do
    element_get root_url, session_id, element_id, "attribute/#{name}"
  end

  @doc """
    Determine if two element ids refer to the same DOM element.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/equals/:other
  """
  def equals(root_url, session_id, element_id, other_id) do
    element_get root_url, session_id, element_id, "equals/#{other_id}"
  end

  @doc """
    Returns a boolean denoting if the element is currently visible.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/displayed
  """
  def displayed(root_url, session_id, element_id) do
    element_get root_url, session_id, element_id, "displayed"
  end

  @doc """
    Returns the current location of the specified element
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/location
  """
  def location(root_url, session_id, element_id) do
    element_get root_url, session_id, element_id, "location"
  end

  @doc """
    Determine an element's location once it has been scrolled into view.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/location_in_view
  """
  def location_in_view(root_url, session_id, element_id) do
    element_get root_url, session_id, element_id, "location_in_view"
  end

  @doc """
    Get the size of an element in pixels.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/size
  """
  def size(root_url, session_id, element_id) do
    element_get root_url, session_id, element_id, "size"
  end

  @doc """
    Get the computed value of an element's CSS property.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/css/:propertyName
  """
  def css(root_url, session_id, element_id, property_name) do
    element_get root_url, session_id, element_id, "css/#{property_name}"
  end

  @doc """
    Get the current browser screen orientation.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/orientation
  """
  def orientation(root_url, session_id) do
    session_get root_url, session_id, "orientation"
  end

  @doc """
    Set the current browser screen orientation
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/orientation
  """
  def orientation(root_url, session_id, parameters) do
    session_post root_url, session_id, "orientation", parameters
  end

  @doc """
    Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/alert_text
  """
  def alert_text(root_url, session_id) do
    session_get root_url, session_id, "alert_text"
  end

  @doc """
    Sends keystrokes to a Javascript prompt() dialog.
  """
  def alert_text(root_url, session_id, parameters) do
    session_post root_url, session_id, "alert_text", parameters
  end

  @doc """
    Accepts the currently displayed alert dialog
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/accept_alert
  """
  def accept_alert(root_url, session_id) do
    session_post root_url, session_id, "accept_alert"
  end

  @doc """
    Dismisses the currently displayed alert dialog
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/dismiss_alert
  """
  def dismiss_alert(root_url, session_id) do
    session_post root_url, session_id, "dismiss_alert"
  end

  @doc """
    Move the mouse by an offset to the specified element.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/moveto

    Parameters: [element: element_id, offsetx: number, offsety: number]
  """
  def move_to(root_url, session_id, parameters) do
    session_post root_url, session_id, "moveto", parameters
  end

  @doc """
    Send a mouse click at the position of the last move_to command.
    The parameter is a number indicating which button is to be clicked.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/click
    Defaults to the left button if not specified.

    Parameters: [button: 1(left) | 2(middle) | 3(right)]
  """
  def mouse_click(root_url, session_id, parameters // []) do
    session_post root_url, session_id, "click", parameters
  end

  @doc """
    Send a mouse button down event.
    The parameter is a number indicating which button is to be pressed.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/buttondown
    Defaults to the left button if not specified.

    Parameters: [button: 1(left) | 2(middle) | 3(right)]
  """
  def mouse_button_down(root_url, session_id, parameters // []) do
    session_post root_url, session_id, "buttondown", parameters
  end

  @doc """
    Send a mouse button up event. Every button down event needs to be followed by this.
    The parameter is a number indicating which button is to be raised.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/buttondown
    Defaults to the left button if not specified.

    Parameters: [button: 1(left) | 2(middle) | 3(right)]
  """
  def mouse_button_up(root_url, session_id, parameters // []) do
    session_post root_url, session_id, "buttonup", parameters
  end

  @doc """
    Send a double click at the position of the last move_to command.
    The parameter is a number indicating which button is to be double clicked.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/click
    Defaults to the left button if not specified.

    Parameters: [button: 1(left) | 2(middle) | 3(right)]
  """
  def mouse_double_click(root_url, session_id, parameters // []) do
    session_post root_url, session_id, "doubleclick", parameters
  end

 @doc """
    Finger tap on an element on the screen.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/click

    Parameters: [element: element_id] The element to tap on.
  """
  def touch_click(root_url, session_id, parameters) do
    session_post root_url, session_id, "touch/click", parameters
  end

  @doc """
    Finger down on the screen.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/down

    Parameters: [x: number, y: number]
  """
  def touch_down(root_url, session_id, parameters) do
    session_post root_url, session_id, "touch/down", parameters
  end

  @doc """
    Finger up on the screen
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/up

    Parameters: [x: number, y: number]
  """
  def touch_up(root_url, session_id, parameters) do
    session_post root_url, session_id, "touch/up", parameters
  end

  @doc """
    Move the finger on the screen to the specified position.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/move

    Parameters: [x: number, y: number]
  """
  def touch_move(root_url, session_id, parameters) do
    session_post root_url, session_id, "touch/move", parameters
  end

  @doc """
    Scroll on the touch screen using finger based motion events.
    The element parameter is optional and can be left out if you dont
    care where the scroll starts.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_session/:sessionId/touch/scroll

    Parameters [element: element, x: number, y:number]
  """
  def touch_scroll(root_url, session_id, parameters) do
    session_post root_url, session_id, "touch/scroll", parameters
  end

  @doc """
    Double finger tap on an element on the screen.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/doubleclick

    Parameters: [element: element_id] The element to tap on.
  """
  def touch_double_click(root_url, session_id, parameters) do
    session_post root_url, session_id, "touch/doubleclick", parameters
  end

  @doc """
    Long finger tap on an element on the screen.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/longclick

    Parameters: [element: element_id] The element to tap on.
  """
  def touch_long_click(root_url, session_id, parameters) do
    session_post root_url, session_id, "touch/longclick", parameters
  end

  @doc """
    Flick on the touch screen using finger motion events.
    The element, xoffset and yoffset parameters are optional if you do not care
    where the flick starts.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/flick

    Parameters: [element: element_id, xoffset: number, yoffset: number, xSpeed: number, ySpeed: number]
  """
  def touch_flick(root_url, session_id, parameters) do
    session_post root_url, session_id, "touch/flick", parameters
  end

  @doc """
    Retreive the current geo location of the browser.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/location
  """
  def geo_location(root_url, session_id) do
    session_get root_url, session_id, "location"
  end

 @doc """
    Set the current geo location of the browser.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/location

    Parameters: [lattitude: number, longitude: number, altitude: number]
  """
  def geo_location(root_url, session_id, parameters) do
    session_post root_url, session_id, "location", parameters
  end

  @doc """
    LOCAL STORAGE NOT YET IMPLEMENTED
  """
  def local_storage do
  end


###########################################################################
# Private Functions
###########################################################################

  defp url_for root_url, path_elements do
    path = Enum.join(path_elements, '/')
    "#{root_url}/#{path}"
  end

  defp session_get root_url, session_id, command do
    get root_url, ["session", session_id, command]
  end

  defp element_get root_url, session_id, element_id, command do
    get root_url, ["session", session_id, "element", element_id, command]
  end

  defp get root_url, path_elements do
    url = url_for root_url, path_elements
    request = Request[method: :GET, url: url, headers: [{"Accept", "application/json;charset=UTF-8"}]]

    send_request root_url, request
  end

  defp session_post root_url, session_id, command, params // [] do
    post root_url, ["session", session_id, command], params
  end

  defp element_post root_url, session_id, element_id, command, params // [] do
    post root_url, ["session", session_id, "element", element_id, command], params
  end

  defp post root_url, path_elements, params do
    url = url_for root_url, path_elements
    json =  Jsonex.encode params
    request = Request[method: :POST, url: url,
         headers: ["Content-Type": "application/json;charset=UTF-8","Content-Length": String.length(json)],
         body: json]

    send_request root_url, request
  end

  defp session_delete root_url, session_id, command do
    delete root_url, ["session", session_id, command]
  end

  defp delete root_url, path_elements do
    url = url_for root_url, path_elements
    request = Request[method: :DELETE, url: url, headers: [{"Accept", "application/json;charset=UTF-8"}]]

    send_request root_url, request
  end

  defp send_request root_url, request do
    send_request root_url, request, 0
  end
  
  defp send_request root_url, _request, 5 do
    raise "We seem to have lost the connection to the browser at #{root_url}"
  end

  # Send the request to the underlying HTTP protocol.
  defp send_request root_url, request, attempts do
    try do 
      case request.method do
        :GET ->
          HTTPotion.get(request.url, request.headers)
        :POST ->
          HTTPotion.post(request.url, request.body, request.headers)
        :DELETE ->
          HTTPotion.delete(request.url, request.headers)
      end |> handle_response(root_url) |> add_request(request)
    rescue 
      [HTTPotion.HTTPError, :econnrefused] -> 
        # Try again a bit later cause Firefox is a sluggard.
        :timer.sleep(:random.uniform(1000) + 200)
        send_request root_url, request, (attempts + 1)
    end
  end

  defp handle_response(HTTPotion.Response[body: body, status_code: status, headers: _headers], _root_url)
      when status in 200..299 do
        {:ok, parse_response_body(body)}
  end

  defp handle_response(HTTPotion.Response[body: _body, status_code: status, headers: headers], root_url)
      when status in 302..303 do
        # Cause some use upper case and some dont...
        url = Keyword.get(headers, :Location, Keyword.get(headers, :location))
        # Follow redirect
        request = Request[method: :GET, url: url, headers: [{"Accept", "application/json;charset=UTF-8"}]]
        send_request root_url, request
  end

  defp handle_response(HTTPotion.Response[body: body, status_code: status, headers: _headers], _root_url)
     when status in 400..499 do
      {:invalid_request, status, body}
  end

  defp handle_response(HTTPotion.Response[body: body, status_code: status, headers: _headers], _root_url)
    when status == 500 do
     response = parse_response_body(body)
     {:failed_command, status, response}
  end

  defp parse_response_body body do
    build_response Jsonex.decode(body)
  end

  defp build_response([{"sessionId", session_id}, {"status", status}, {"value", value }])do
    Response[ session_id: session_id, status: status, value: value ]
  end

  defp build_response([{"name", _name}, {"sessionId", session_id}, {"status", status}, {"value", value }])do
    Response[ session_id: session_id, status: status, value: value ]
  end

  # Append the Request record to a response.
  defp add_request {:ok, response}, request do
    {:ok, response.request(request)}
  end

  defp add_request {:failed_command, _status, response}, request do
    {WebDriver.Error.summary(response.status), response.request(request)}
  end

  defp add_request {:invalid_request, status, response}, request do
    {:invalid_request, status, response, request}
  end
end
