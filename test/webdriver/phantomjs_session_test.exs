Code.require_file "../test_helper.exs", __DIR__
Code.require_file "test_server.exs", __DIR__
defmodule WebDriverPhantomJSSessionTest do
  use ExUnit.Case, async: false

  alias WebDriver.Session
  alias WebDriver.Element
  alias WebDriver.Mouse

  @moduletag :phantomjs
# Testing Callbacks

  setup_all do
    http_server_pid = WebDriver.TestServer.start
    config = %WebDriver.Config{browser: :phantomjs, name: :test_browser}
    WebDriver.start_browser config
    WebDriver.start_session :test_browser, :test
    {:ok, [http_server_pid: http_server_pid]}
  end

  teardown_all meta do
    WebDriver.stop_browser :test_browser
    WebDriver.stop_session :test
    WebDriver.TestServer.stop(meta.http_server_pid)
    :ok
  end

  setup do
    {:ok, []}
  end

  teardown do
    Session.delete_cookies :test
    :ok
  end

# Tests
  test "status should show that the Session is up" do
    resp = WebDriver.Session.status(:test)
    assert [{"build", _},{"os",_}] = resp
  end

  test "start_session should start a WebDriver session", meta do
    assert meta[:session_id] != :null
  end

  test "negotiated_capabilities returns a capabilities struct" do
    cap = Session.negotiated_capabilities(:test)
    assert cap.browserName == "phantomjs"
    assert cap.javascriptEnabled
  end

  test "sessions lists the sessions on the Session" do
    response = Session.sessions(:test)
    Enum.each response, fn(session) ->
      assert [{"id",_},{"capabilities",_}] = session
    end
  end

  test "session returns the current session data" do
    { :ok, _ } = Session.start_session(:test)
    response = Session.session(:test)
    assert response.browserName == "phantomjs"
    assert response.javascriptEnabled
  end

  test "stop session" do
    # Use a separate session so we dont break everything else.
    WebDriver.start_session :test_browser, :test2
    assert {:ok, _} = Session.stop_session :test2
    WebDriver.stop_session :test2
  end

  test "set_timeout" do
    check :set_timeout, ["script", 1000]
  end

  test "set_async_script_timeout" do
    check :set_async_script_timeout, [1000]
  end

  test "set_implicit_wait_timeout" do
    check :set_implicit_wait_timeout, [1000]
  end

  test "window_handle" do
    assert Regex.match? uuid_regexp, Session.window_handle :test
  end

  test "window_handles" do
    handles = Session.window_handles :test
    Enum.each handles, fn(handle) ->
      assert Regex.match? uuid_regexp, handle
    end
  end

  test "url/1" do
    Session.url :test, "about:blank"
    assert "about:blank" == Session.url :test
  end

  test "url/2" do
    check :url, ["http://localhost:8888/index.html"]
    assert Session.url(:test) == "http://localhost:8888/index.html"
  end

  test "forward" do
    check :forward
  end

  test "back" do
    check :back
  end

  test "refresh" do
    check :refresh
  end

  test "navigation back and forth" do
    Session.url :test, "http://localhost:8888/index.html"
    Session.url :test, "http://localhost:8888/page_1.html"
    Session.back :test
    assert "http://localhost:8888/index.html" == Session.url :test
    Session.forward :test
    assert "http://localhost:8888/page_1.html" == Session.url :test
  end

  test "execute returns the value of the Javascript." do
    assert Session.execute(:test, "return 23 * 2") == 46
  end

  test "execute with arguments returns the correct value" do
    assert Session.execute(:test, "return arguments[0] + \" \" + arguments[1]", ["hello", "world"])
       == "hello world"
  end

  test "execute_async returns the correct result" do
    assert Session.execute_async(:test, "return 123 + 2") == 125
  end

  test "screenshot returns a PNG image" do
    assert <<137,80,78,71,13,10,26,10,_ :: binary >> = :base64.decode(Session.screenshot :test)
  end

  # test "no such frame error" do
  #   assert {:no_such_frame, _ } = Session.frame :test, 123
  # end
  #
  test "window" do
    handle = Session.window_handle :test
    check :window, [handle]
  end

  # test "error when there is no such window" do
  #   assert {:no_such_window, _} = Session.window :test, "xyz"
  # end
  #
  test "close window" do
    WebDriver.start_session :test_browser, :window_close
    assert {:ok, _} = Session.close_window :window_close
    WebDriver.stop_session :window_close
  end

  test "window size" do
    size = Session.window_size :test
    assert is_number(Keyword.get(size, :height))
    assert is_number(Keyword.get(size, :width))
  end

  test "set the window size" do
    check :window_size, [Session.window_handle(:test), 240, 480]
  end

  test "maximize window" do
    check :maximize_window
  end

  test "set and retreive cookie" do
    Session.url :test, "http://localhost:8888/index.html"
    check :set_cookie, ["cookie", "value", "/", ".localhost"]

    [ cookie ] = Session.cookies :test
    assert cookie.domain == ".localhost"
    assert cookie.name == "cookie"
    assert cookie.value == "value"
    assert cookie.path == "/"
    Session.delete_cookies :test
  end

  test "set cookie from a cookie record" do
    cookie = %WebDriver.Cookie{name: "cookie", value: "value", path: "/", domain: "localhost"}
    Session.set_cookie :test, cookie
    [ cookie ] = Session.cookies :test
    assert cookie.domain == ".localhost"
    assert cookie.name == "cookie"
    assert cookie.value == "value"
    assert cookie.path == "/"
  end

  test "delete cookies" do
    Session.set_cookie :test, "name", "value", "/", ".localhost"
    Session.delete_cookies :test
    assert [] == Session.cookies :test
  end

  test "delete cookie" do
    Session.set_cookie :test, "name", "value", "/", ".localhost"
    Session.delete_cookie :test, "name"
    assert [] == Session.cookies :test
  end

  test "page source" do
    Session.url :test, "http://localhost:8888"
    assert <<"<!DOCTYPE html>", _ :: binary >> = Session.source :test
  end

  test "page title" do
    Session.url :test, "http://localhost:8888"
    assert "Test Index" == Session.title :test
  end

  test "find element by class name" do
    Session.url :test, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :test, :class_name, "blue"
  end

  test "find element by css" do
    Session.url :test, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :test, :css, "div.blue"
  end

  test "find element by id" do
    Session.url :test, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :test, :id, "1234"
  end

  test "find element by name" do
    Session.url :test, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :test, :name, "foo"
  end

  test "find element by link text" do
    Session.url :test, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :test, :link, "Back to Index"
  end

  test "find element by partial link text" do
    Session.url :test, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :test, :partial_link, "Back"
  end

  test "find element by tag name" do
    Session.url :test, "http://localhost:8888/page_1.html"
    assert is_element?  Session.element :test, :tag, "div"
  end

  test "find element by xpath" do
    Session.url :test, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :test, :xpath, "//div/a[@class='link']"
  end

  test "a non existing element" do
    Session.url :test, "http://localhost:8888/page_1.html"
    assert nil = Session.element :test, :tag, "nothing"
  end

  test "find an element starting from a specified element" do
    Session.url :test, "http://localhost:8888/page_1.html"
    start = Session.element :test, :class_name, "blue"
    assert is_element? Session.element(:test, :tag, "ul", start)
  end

  test "find multiple elements" do
    Session.url :test, "http://localhost:8888/page_1.html"
    [a,b,c,d] = Session.elements :test, :tag, "li"

    assert is_element? a
    assert is_element? b
    assert is_element? c
    assert is_element? d
  end

  test "a non existing element when finding multiple" do
    Session.url :test, "http://localhost:8888/page_1.html"
    assert [] = Session.elements :test, :tag, "none"
  end

  test "active element" do
    Session.url :test, "http://localhost:8888/page_1.html"
    assert is_element? Session.active_element :test
  end

  test "get orientation" do
    assert {:error, "Session does not support device rotation."} == Session.orientation(:test)
  end

  test "set orientation" do
    assert {:error, "Session does not support device rotation."} == Session.orientation(:test, [:landscape])
  end

  # test "element by id" do
  #   # This behaviour is currently undefined in the specification.
  #   # Phantomjs returns a url encoded version of the internal element id.
  #   Session.url :test, "http://localhost:8888/page_1.html"
  #   element = Session.element :test, :class_name, "blue"
  #   assert Session.element_by_id :test, element
  # end

  test "click on an element" do
    Session.url :test, "http://localhost:8888/page_1.html"
    element = Session.element :test, :link, "Back to Index"
    assert {:ok, _} = Element.click element
    assert "http://localhost:8888/index.html" = Session.url :test
  end

  test "submit a form" do
    Session.url :test, "http://localhost:8888/page_2.html"
    form = Session.element :test, :tag, "form"
    Element.submit form
    assert "http://localhost:8888/page_3.html?some_text=Text&other_text=TextArea" == Session.url :test
  end

  test "text value of an element" do
    Session.url :test, "http://localhost:8888/page_1.html"
    element = Session.element :test, :xpath, "//div/p"
    assert "Test Div" == Element.text element
  end

  test "send keystrokes to an element" do
    Session.url :test, "http://localhost:8888/page_2.html"
    field = Session.element :test, :id, "123"
    Element.value field, "Val"
    Element.submit field
    assert "http://localhost:8888/page_3.html?some_text=TextVal&other_text=TextArea" == Session.url :test
  end

  test "send keystrokes to the current element" do
    Session.url :test, "http://localhost:8888/page_2.html"
    field = Session.element :test, :id, "123"
    Element.click field
    Session.keys :test, "New Text"
    Element.submit field
    assert "http://localhost:8888/page_3.html?some_text=New+Text&other_text=TextArea" == Session.url :test
  end

  test "send special keystrokes to the current element" do
    Session.url :test, "http://localhost:8888/page_2.html"
    text_area = Session.element :test, :id, "textarea1"
    Element.click text_area
    key = WebDriver.Keys.key(:key_back_space)
    Session.keys :test, "TESTME#{key}#{key}IT"
    Element.submit text_area
    assert "http://localhost:8888/page_3.html?some_text=Text&other_text=TESTITTextArea" == Session.url :test
  end

  test "name" do
    Session.url :test, "http://localhost:8888/page_1.html"
    element = Session.element :test, :class_name, "blue"
    assert "div" == Element.name element
  end

  test "clear an element" do
    Session.url :test, "http://localhost:8888/page_2.html"
    field = Session.element :test, :id, "123"
    Element.clear field
    Element.submit field
    assert "http://localhost:8888/page_3.html?some_text=&other_text=TextArea" == Session.url :test
  end

  test "selected? returns boolean if an element is selected" do
    Session.url :test, "http://localhost:8888/page_2.html"
    selected_option = Session.element :test, :xpath, "//option[@value='dave']"
    other_option = Session.element :test, :xpath, "//option[@value='stu']"

    assert true  === Element.selected? selected_option
    assert false === Element.selected? other_option
  end

  test "selected? returns nil if element is unselectable" do
    Session.url :test, "http://localhost:8888/page_2.html"
    option = Session.element :test, :tag, "label"
    assert nil == Element.selected? option
  end

   test "selected? returns boolean if an element is enabled" do
    Session.url :test, "http://localhost:8888/page_2.html"
    submit = Session.element :test, :id, "s1"
    disabled_submit = Session.element :test, :id, "s2"

    assert true === Element.enabled?  submit
    assert false === Element.enabled? disabled_submit
  end

  test "attribute gives the value of an attribute" do
    Session.url :test, "http://localhost:8888/page_1.html"
    element = Session.element :test, :id, "1234"
    assert "blue" = Element.attribute element, "class"
  end

  test "equals returns a boolean" do
    Session.url :test, "http://localhost:8888/page_1.html"
    element = Session.element :test, :id, "1234"
    other_element = Session.element :test, :class_name, "blue"
    another_element = Session.element :test, :tag, "ul"

    assert Element.equals? element, other_element
    refute Element.equals? element, another_element
  end

  test "displayed?" do
    Session.url :test, "http://localhost:8888/page_1.html"
    visible = Session.element :test, :id, "visible"
    invisible = Session.element :test, :id, "invisible"

    assert Element.displayed? visible
    refute Element.displayed? invisible
  end

  test "location" do
    Session.url :test, "http://localhost:8888/page_1.html"
    element = Session.element :test, :id, "fixed"
    assert [x: 100,y: 100] = Element.location element
  end

  test "location_in_view" do
    Session.url :test, "http://localhost:8888/page_1.html"
    element = Session.element :test, :id, "fixed"
    assert [x: 100,y: 100] = Element.location_in_view element
  end

  test "size" do
    Session.url :test, "http://localhost:8888/page_1.html"
    element = Session.element :test, :id, "fixed"
    assert [width: 100,height: 50] = Element.size element
  end

  test "css gives the value of an elements css" do
    Session.url :test, "http://localhost:8888/page_1.html"
    element = Session.element :test, :id, "fixed"
    assert "fixed" == Element.css element, "position"
    assert "100px" == Element.css element, "top"
  end

  test "accessing a non existing element" do
    Session.url :test, "http://localhost:8888/page_1.html"
    element = %Element.Reference{id: ":wdc:12345678899", session: :test}
    assert {:stale_element_reference, _ } = Element.size element
  end

  test "moving mouse to an element" do
    Session.url :test, "http://localhost:8888/page_1.html"
    element = Session.element :test, :id, "fixed"
    assert {:ok, _resp} = Mouse.move_to element
  end

  test "click mouse in a session" do
    assert {:ok, resp} = Mouse.click :test, :middle
    assert resp.status == 0
  end

  test "button_down" do
    assert {:ok, resp} = Mouse.button_down :test, :right
    assert resp.status == 0
  end

  test "button_up" do
    assert {:ok, resp} = Mouse.button_up :test, :right
    assert resp.status == 0
  end

  test "double click" do
    assert {:ok, resp} = Mouse.double_click :test
    assert resp.status == 0
  end

############################################################################

  # Check that a request returns {ok, response} and the response status is 0
  defp check func, params \\ [] do
    assert_response :erlang.apply Session, func, [:test | params]
  end

  defp assert_response {:ok, response} do
    assert response.status == 0
  end

  defp assert_response resp do
    assert { :ok, _ } = resp
  end

  defp uuid_regexp do
    ~r/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  end

  defp is_element? elem do
    assert WebDriver.Element.Reference == elem.__struct__
  end
end
