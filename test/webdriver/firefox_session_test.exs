Code.require_file "../test_helper.exs", __DIR__
Code.require_file "test_server.exs", __DIR__
defmodule WebDriverFirefoxSessionTest do
  use ExUnit.Case, async: false

  alias WebDriver.Session
  alias WebDriver.Element
  alias WebDriver.Mouse
  @moduletag :firefox
# Testing Callbacks

  setup_all do
    http_server_pid = WebDriver.TestServer.start
    config = %WebDriver.Config{browser: :firefox, name: :ftest_browser}
    WebDriver.start_browser config
    WebDriver.start_session :ftest_browser, :fftest

    on_exit fn ->
      WebDriver.stop_browser :ftest_browser
      WebDriver.TestServer.stop(http_server_pid)
      :ok
    end

    {:ok, [http_server_pid: http_server_pid]}
  end

  setup do
    {:ok, []}
  end

# Tests

  # test "status should show that the Session is up" do
  #   resp = WebDriver.Session.status(:fftest)
  #   # FIXME assert [{"build", _},{"os", _}] = resp
  # end

  test "start_session and stop_session" do
    assert {:ok, _pid} = WebDriver.start_session :ftest_browser, :test2
    assert :ok = WebDriver.stop_session :test2
  end

  test "sessions lists the sessions on the Session" do
    # GET Sessions does not work on firefox!
    # response = Session.sessions(:fftest)
    # Enum.each response, fn(session) ->
    #   assert [{"id",_},{"capabilities",_}] = session
    # end
  end

  test "session returns the current session data" do
    { :ok, _ } = Session.start_session(:fftest)
    response = Session.session(:fftest)
    assert response.browserName == "firefox"
    assert response.javascriptEnabled
  end

  test "set_timeout" do
    check :set_timeout, ["script", 2000]
  end

  test "set_async_script_timeout" do
    check :set_async_script_timeout, [2000]
  end

  test "set_implicit_wait_timeout" do
    check :set_implicit_wait_timeout, [2000]
  end

  test "window_handle" do
    assert Regex.match? uuid_regexp, Session.window_handle :fftest
  end

  test "window_handles" do
    handles = Session.window_handles :fftest
    Enum.each handles, fn(handle) ->
      assert Regex.match? uuid_regexp, handle
    end
  end

   test "url/1" do
    Session.url :fftest, "about:blank"
    assert "about:blank" == Session.url :fftest
   end

  test "url/2" do
    check :url, ["http://localhost:8888/index.html"]
    assert Session.url(:fftest) == "http://localhost:8888/index.html"
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
    Session.url :fftest, "http://localhost:8888/index.html"
    Session.url :fftest, "http://localhost:8888/page_1.html"
    Session.back :fftest
    assert "http://localhost:8888/index.html" == Session.url :fftest
    Session.forward :fftest
    assert "http://localhost:8888/page_1.html" == Session.url :fftest
  end

  test "execute returns the value of the Javascript." do
    assert Session.execute(:fftest, "return 23 * 2") == 46
  end

  test "execute with arguments returns the correct value" do
    assert Session.execute(:fftest, "return arguments[0] + \" \" + arguments[1]", ["hello", "world"])
       == "hello world"
  end

  test "execute_async returns the correct result" do
    assert Session.execute_async(:fftest, "return 123 + 2") == 125
  end

  test "screenshot returns a PNG image" do
    assert <<137,80,78,71,13,10,26,10,_ :: binary >> = :base64.decode(Session.screenshot :fftest)
  end

  test "no such frame error" do
    assert {:no_such_frame, _ } = Session.frame :fftest, 123
  end

  test "window" do
    handle = Session.window_handle :fftest
    check :window, [handle]
  end

  test "error when there is no such window" do
    assert {:no_such_window, _} = Session.window :fftest, "xyz"
  end

  test "close window" do
    config = %WebDriver.Config{browser: :firefox, name: :window_close_browser}
    WebDriver.start_browser config
    WebDriver.start_session :window_close_browser, :window_close
    assert {:ok, _} = Session.close_window :window_close
    WebDriver.stop_session :window_close
    WebDriver.stop_browser :window_close_browser
  end

  test "window size" do
    size = Session.window_size :fftest
    assert is_number(Keyword.get(size, :height))
    assert is_number(Keyword.get(size, :width))
  end

  # Window operations only supported for currently focussed window
  test "set the window size" do
    check :window_size, ["current", 240, 480]
  end

  test "maximize window" do
    check :maximize_window, ["current"]
  end

  test "set cookie from a cookie record" do
    cookie = %WebDriver.Cookie{name: "cookie", value: "value", path: "/", domain: "localhost"}
    Session.set_cookie :fftest, cookie
    [ cookie ] = Session.cookies :fftest

    assert cookie.domain == "localhost"
    assert cookie.name == "cookie"
    assert cookie.value == "value"
    assert cookie.path == "/"
    Session.delete_cookies :fftest
  end

  test "delete cookies" do
    cookie = %WebDriver.Cookie{name: "cookie", value: "value", path: "/", domain: "localhost"}
    Session.set_cookie :fftest, cookie
    Session.delete_cookies :fftest
    assert [] == Session.cookies :fftest
  end

  test "delete cookie" do
    cookie = %WebDriver.Cookie{name: "name", value: "value", path: "/", domain: "localhost"}
    Session.set_cookie :fftest, cookie
    Session.delete_cookie :fftest, "name"
    assert [] == Session.cookies :fftest
  end

  test "page source" do
    Session.url :fftest, "http://localhost:8888"
    assert <<"<!DOCTYPE html>", _ :: binary >> = Session.source :fftest
  end

  test "page title" do
    Session.url :fftest, "http://localhost:8888"
    assert "Test Index" == Session.title :fftest
  end

  test "find element by class name" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :fftest, :class_name, "blue"
  end

  test "find element by css" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :fftest, :css, "div.blue"
  end

  test "find element by id" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :fftest, :id, "1234"
  end

  test "find element by name" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :fftest, :name, "foo"
  end

  test "find element by link text" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :fftest, :link, "Back to Index"
  end

  test "find element by partial link text" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :fftest, :partial_link, "Back"
  end

  test "find element by tag name" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    assert is_element?  Session.element :fftest, :tag, "div"
  end

  test "find element by xpath" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    assert is_element? Session.element :fftest, :xpath, "//div/a[@class='link']"
  end

  test "a non existing element" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    assert nil = Session.element :fftest, :tag, "nothing"
  end

  test "running a command on an non-existent element" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    nil_element = Session.element :fftest, :tag, "nothing"
    assert {:error, "Expected argument to be %WebDriver.Element{} but got nil"} = Element.click(nil_element)
  end

  test "find an element starting from a specified element" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    start = Session.element :fftest, :class_name, "blue"
    assert is_element? Session.element(:fftest, :tag, "ul", start)
  end

  test "find multiple elements" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    [a,b,c,d] = Session.elements :fftest, :tag, "li"

    assert is_element? a
    assert is_element? b
    assert is_element? c
    assert is_element? d
  end

  test "a non existing element when finding multiple" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    assert [] = Session.elements :fftest, :tag, "none"
  end

  #FIXME: firefox does not support this
  #test "active element" do
  #  Session.url :fftest, "http://localhost:8888/page_1.html"
  #  assert is_element? Session.active_element :fftest
  #end

  test "get orientation" do
    assert {:error, "Session does not support device rotation."} == Session.orientation(:fftest)
  end

  test "set orientation" do
    assert {:error, "Session does not support device rotation."} == Session.orientation(:fftest, [:landscape])
  end

  # test "element by id" do
  #   # This behaviour is currently undefined in the specification.
  #   # Phantomjs returns a url encoded version of the internal element id.
  #   Session.url :fftest, "http://localhost:8888/page_1.html"
  #   element = Session.element :fftest, :class_name, "blue"
  #   assert Session.element_by_id :fftest, element
  # end

  test "click on an element" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    element = Session.element :fftest, :link, "Back to Index"
    {:ok, _} = Element.click element
    assert "http://localhost:8888/index.html" = Session.url :fftest
  end

  test "submit a form" do
    Session.url :fftest, "http://localhost:8888/page_2.html"
    form = Session.element :fftest, :tag, "form"
    Element.submit form
    assert "http://localhost:8888/page_3.html?some_text=Text&other_text=TextArea" == Session.url :fftest
  end

  test "text value of an element" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    element = Session.element :fftest, :xpath, "//div/p"
    assert "Test Div" == Element.text element
  end

  test "send keystrokes to an element" do
    Session.url :fftest, "http://localhost:8888/page_2.html"
    field = Session.element :fftest, :id, "123"
    Element.value field, "Val"
    {:ok, _} = Element.submit field
    assert "http://localhost:8888/page_3.html?some_text=TextVal&other_text=TextArea" == Session.url :fftest
  end

  # Firefox does not clear the element before sending keys. PhantomJS does.
  test "send keystrokes to the current element" do
    Session.url :fftest, "http://localhost:8888/page_2.html"
    field = Session.element :fftest, :id, "123"
    Element.click field
    Session.keys :fftest, "New Text"
    Element.submit field
    assert "http://localhost:8888/page_3.html?some_text=TextNew+Text&other_text=TextArea" == Session.url :fftest
  end

  test "send special keystrokes to the current element" do
    Session.url :fftest, "http://localhost:8888/page_2.html"
    text_area = Session.element :fftest, :id, "textarea1"
    Element.click text_area
    key = WebDriver.Keys.key(:key_back_space)
    Session.keys :fftest, "TESTME#{key}#{key}IT"
    Element.submit text_area
    assert "http://localhost:8888/page_3.html?some_text=Text&other_text=TextAreaTESTIT" == Session.url :fftest
  end

  test "name" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    element = Session.element :fftest, :class_name, "blue"
    assert "div" == Element.name element
  end

  test "clear an element" do
    Session.url :fftest, "http://localhost:8888/page_2.html"
    field = Session.element :fftest, :id, "123"
    Element.clear field
    Element.submit field
    assert "http://localhost:8888/page_3.html?some_text=&other_text=TextArea" == Session.url :fftest
  end

  test "selected? returns boolean if an element is selected" do
    Session.url :fftest, "http://localhost:8888/page_2.html"
    selected_option = Session.element :fftest, :xpath, "//option[@value='dave']"
    other_option = Session.element :fftest, :xpath, "//option[@value='stu']"

    assert true  === Element.selected? selected_option
    assert false === Element.selected? other_option
  end

  # Firefox returns false here whereas PhantomJS returns nil
  test "selected? returns false if element is unselectable" do
    Session.url :fftest, "http://localhost:8888/page_2.html"
    option = Session.element :fftest, :tag, "label"
    assert false == Element.selected? option
  end

   test "selected? returns boolean if an element is enabled" do
    Session.url :fftest, "http://localhost:8888/page_2.html"
    submit = Session.element :fftest, :id, "s1"
    disabled_submit = Session.element :fftest, :id, "s2"

    assert true === Element.enabled?  submit
    assert false === Element.enabled? disabled_submit
  end

  test "attribute gives the value of an attribute" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    element = Session.element :fftest, :id, "1234"
    assert "blue" = Element.attribute element, "class"
  end

  test "equals returns a boolean" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    element = Session.element :fftest, :id, "1234"
    other_element = Session.element :fftest, :class_name, "blue"
    another_element = Session.element :fftest, :tag, "ul"

    assert Element.equals? element, other_element
    refute Element.equals? element, another_element
  end

  test "displayed?" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    visible = Session.element :fftest, :id, "visible"
    invisible = Session.element :fftest, :id, "invisible"

    assert Element.displayed? visible
    refute Element.displayed? invisible
  end

  test "location" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    element = Session.element :fftest, :id, "fixed"
    assert [x: 100,y: 100] = Element.location element
  end

  test "location_in_view" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    element = Session.element :fftest, :id, "fixed"
    assert [x: 100,y: 100] = Element.location_in_view element
  end

  test "size" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    element = Session.element :fftest, :id, "fixed"
    assert [width: 100,height: 50] = Element.size element
  end

  test "css gives the value of an elements css" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    element = Session.element :fftest, :id, "fixed"
    assert "fixed" == Element.css element, "position"
    assert "100px" == Element.css element, "top"
  end

  test "accessing a non existing element" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    element = %Element{id: ":wdc:12345678899", session: :fftest}
    assert {:stale_element_reference, _ } = Element.size element
  end

  test "moving mouse to an element" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    element = Session.element :fftest, :id, "1234"
    assert {:ok, _resp} = Mouse.move_to element
  end

  test "click mouse in a session" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    Session.element(:fftest, :id, "1234") |> Mouse.move_to
    assert {:ok, resp} = Mouse.click :fftest, :middle
    assert resp.status == 0
  end

  test "button_down" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    Session.element(:fftest, :id, "1234") |> Mouse.move_to
    assert {:ok, resp} = Mouse.button_down :fftest, :left
    assert resp.status == 0
    Mouse.button_up :fftest, :left
  end

  test "button_up" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    Session.element(:fftest, :id, "1234") |> Mouse.move_to
    Mouse.button_down :fftest, :right
    assert {:ok, resp} = Mouse.button_up :fftest, :right
    assert resp.status == 0
  end

  test "double click" do
    Session.url :fftest, "http://localhost:8888/page_1.html"
    Session.element(:fftest, :id, "1234") |> Mouse.move_to
    assert {:ok, resp} = Mouse.double_click :fftest
    assert resp.status == 0
  end

############################################################################

  # Check that a request returns {ok, response} and the response status is 0
  defp check func, params \\ [] do
    assert_response :erlang.apply Session, func, [:fftest | params]
  end

  defp assert_response {:ok, response} do
    assert response.status == 0
  end

  defp assert_response resp do
    assert { :ok, _ } = resp
  end

  defp uuid_regexp do
    # Firefox wraps uuids in {}.
    ~r/^\{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\}$/
  end

  defp is_element? elem do
    assert WebDriver.Element == elem.__struct__
  end
end
