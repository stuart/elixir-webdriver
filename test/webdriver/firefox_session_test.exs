Code.require_file "../test_helper.exs", __DIR__
Code.require_file "test_server.exs", __DIR__
defmodule WebDriverFirefoxSessionTest do
  use ExUnit.Case

  alias WebDriver.Session
  alias WebDriver.Element


# Testing Callbacks
  setup_all do
    http_server_pid = WebDriver.TestServer.start
    config = WebDriver.Config.new(browser: :firefox, name: :ftest_browser)
    WebDriver.start_browser config
    WebDriver.start_session :ftest_browser, :fftest
    {:ok, [http_server_pid: http_server_pid]}
  end

  teardown_all meta do
    WebDriver.stop_browser :ftest_browser
    WebDriver.TestServer.stop(meta[:http_server_pid])
    :ok
  end

  setup do
   {:ok, []}
  end

  teardown do
    :ok
  end

# Tests

  # test "status should show that the Session is up" do
  #   resp = WebDriver.Session.status(:fftest)
  #   # FIXME assert [{"build", _},{"os", _}] = resp
  # end

  test "start_session and stop_session", meta do
    assert {:ok, pid} = WebDriver.start_session :ftest_browser, :test2
    assert :ok = WebDriver.stop_session :test2
  end

  # test "sessions lists the sessions on the Session" do
  #   # GET Sessions does not work on firefox!
  #   # response = Session.sessions(:fftest)
  #   # Enum.each response, fn(session) ->
  #   #   assert [{"id",_},{"capabilities",_}] = session
  #   # end
  # end

  test "session returns the current session data" do
    { :ok, _ } = Session.start_session(:fftest)
    response = Session.session(:fftest)
    # FIXME: Parse into a Capabilities Record.
    # assert [{"browserName",_},{"version",_},{"driverName",_},
    #         {"driverVersion",_},{"platform",_},{"javascriptEnabled",_},
    #         {"takesScreenshot",_},{"handlesAlerts",_},{"databaseEnabled",_},
    #         {"locationContextEnabled",_},{"applicationCacheEnabled",_},
    #         {"browserConnectionEnabled",_},{"cssSelectorsEnabled",_},
    #         {"webStorageEnabled",_},{"rotatable",_},{"acceptSslCerts",_},
    #         {"nativeEvents",_},{"proxy",_}] = response
  end


  test "set_timeout" do
    check :set_timeout, ["script", 5000]
  end

  test "set_async_script_timeout" do
    check :set_async_script_timeout, [5000]
  end

  test "set_implicit_wait_timeout" do
    check :set_implicit_wait_timeout, [5000]
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

  #JAVASCRIPT ERROR This test really buggers everything up
  #test "close window" do
  #  check :close_window
  #end

  # test "window size" do
  #   size = Session.window_size :fftest
  #   assert is_number(Keyword.get(size, :height))
  #   assert is_number(Keyword.get(size, :width))
  # end

  # Window operations only supported for currently focussed window
  # test "set the window size" do
  #   check :window_size, ["current", 240, 480]
  # end

  # test "maximize window" do
  #   # FIXME: Does not work on Firefox.
  #   check :maximize_window, ["current"]
  # end

  # FIXME: [[{"name","name"},{"value","value"},{"path","/"},{"domain","localhost"},{"secure",false},{"expiry",1373610137}]]
  # Cookie record.
  # test "set and retreive cookie" do
  #   Session.url :fftest, "http://localhost:8888/index.html"
  #   check :set_cookie, ["name", "value", "/", "localhost"]

  #   assert [[{"domain",".localhost"},{"expires",_},
  #   {"expiry",_},{"httponly",false},{"name","name"},{"path","/"},
  #   {"secure",false},{"value","value"}]] = Session.cookies :fftest
  # end

  test "delete cookies" do
    Session.set_cookie :fftest, "name", "value", "/", ".localhost"
    Session.delete_cookies :fftest
    assert [] == Session.cookies :fftest
  end

  test "delete cookie" do
    Session.set_cookie :fftest, "name", "value", "/", ".localhost"
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

  # Not working on phantomjs or firefox
  # test "get orientation" do
  #   check :orientation
  # end

  # test "set orientation" do
  #   check :orientation, [:landscape]
  # end

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
    assert "http://localhost:8888/page_3.html?some_text=Text" == Session.url :fftest
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
    assert "http://localhost:8888/page_3.html?some_text=TextVal" == Session.url :fftest
  end
  
  # Firefox does not clear the element before sending keys. PhantomJS does.
  test "send keystrokes to the current element" do
    Session.url :fftest, "http://localhost:8888/page_2.html"
    field = Session.element :fftest, :id, "123"
    Element.click field
    Session.keys :fftest, "New Text"
    Element.submit field
    assert "http://localhost:8888/page_3.html?some_text=TextNew+Text" == Session.url :fftest
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
    assert "http://localhost:8888/page_3.html?some_text=" == Session.url :fftest
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
    element = Element.Reference[id: ":wdc:12345678899", session: :fftest]
    assert {:stale_element_reference, _ } = Element.size element
  end

############################################################################

  # Check that a request returns {ok, response} and the response status is 0
  defp check func, params // [] do
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
    %r/^\{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\}$/
  end

  defp is_element? elem do
    assert WebDriver.Element.Reference == elem.__record__(:name)
  end
end
