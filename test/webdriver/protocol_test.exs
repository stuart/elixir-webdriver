Code.require_file "../test_helper.exs", __DIR__

defmodule WebDriverProtocolTest do
  use ExUnit.Case, async: true
  use Jazz
  import Mock

  alias WebDriver.Protocol

  @config "http://127.0.0.1:8080"
  @session_id ":session_id"

  test "status" do
    test_get &Protocol.status/1, "/status"
  end

  test "start_session" do
    test_post &Protocol.start_session(&1,%{desiredCapabilities: []}), "/session", "{\"desiredCapabilities\":[]}"
  end

  test "sessions" do
    test_get &Protocol.sessions/1, "/sessions"
  end

  test "session" do
    test_get &Protocol.session(&1, @session_id), "/session/:session_id"
  end

  test "stop_session" do
    test_delete &Protocol.stop_session(&1, @session_id), "/session/:session_id"
  end

  test "set_timeout" do
    test_post &Protocol.set_timeout(&1, @session_id, %{type: "script", ms: 1000}),
              "/session/:session_id/timeouts", "{\"type\":\"script\",\"ms\":1000}"
  end

  test "set_async_script_timeout" do
    test_post &Protocol.set_async_script_timeout(&1, @session_id, %{ms: 1000}),
              "/session/:session_id/timeouts/async_script",
              "{\"ms\":1000}"
  end

  test "set_implicit_wait_timeout" do
    test_post &Protocol.set_implicit_wait_timeout(&1, @session_id, %{ms: 1000}),
              "/session/:session_id/timeouts/implicit_wait","{\"ms\":1000}"
  end

  test "window_handle" do
    test_get &Protocol.window_handle(&1, @session_id), "/session/:session_id/window_handle"
  end

  test "window_handles" do
    test_get &Protocol.window_handles(&1, @session_id), "/session/:session_id/window_handles"
  end

  test "url/3" do
    test_post &Protocol.url(&1, @session_id, %{url: "http://google.com"}),
              "/session/:session_id/url", "{\"url\":\"http://google.com\"}"
  end

  test "url/2" do
    test_get &Protocol.url(&1, @session_id), "/session/:session_id/url"
  end

  test "forward" do
    test_post &Protocol.forward(&1, @session_id), "/session/:session_id/forward", "{}"
  end

  test "back" do
    test_post &Protocol.back(&1, @session_id), "/session/:session_id/back", "{}"
  end

  test "refresh" do
    test_post &Protocol.refresh(&1, @session_id), "/session/:session_id/refresh", "{}"
  end

  test "execute" do
    test_post &Protocol.execute(&1, @session_id, %{script: "alert('Hello world!')", args: []}),
         "/session/:session_id/execute", "{\"script\":\"alert('Hello world!')\",\"args\":[]}"
  end

  test "execute_async" do
    test_post &Protocol.execute_async(&1, @session_id, %{script: "alert('Hello world!')", args: []}),
     "/session/:session_id/execute_async","{\"script\":\"alert('Hello world!')\",\"args\":[]}"
  end

  test "screenshot" do
    test_get &Protocol.screenshot(&1, @session_id), "/session/:session_id/screenshot"
  end

  test "frame" do
    test_post &Protocol.frame(&1, @session_id, %{id: "frame"}),
    "/session/:session_id/frame","{\"id\":\"frame\"}"
  end

  test "window" do
    test_post &Protocol.window(&1, @session_id, %{name: "window"}),
              "/session/:session_id/window", "{\"name\":\"window\"}"
  end

  test "close_window" do
    test_delete &Protocol.close_window(&1, @session_id), "/session/:session_id/window"
  end

  test "window_size/2" do
    test_get &Protocol.window_size(&1, @session_id), "/session/:session_id/window/current/size"
  end

  test "window_size/3" do
    test_get &Protocol.window_size(&1, @session_id, "window_handle"),
             "/session/:session_id/window/window_handle/size"
  end

  test "window_size/4" do
    test_post &Protocol.window_size(&1, @session_id, "window_handle", %{height: 240, width: 320}),
     "/session/:session_id/window/window_handle/size", "{\"height\":240,\"width\":320}"
  end

  test "window_position/2" do
    test_get &Protocol.window_position(&1, @session_id),
             "/session/:session_id/window/current/position"
  end

  test "window_position/3" do
    test_get &Protocol.window_position(&1, @session_id, "window_handle"),
    "/session/:session_id/window/window_handle/position"
  end

  test "window_position/4" do
    test_post &Protocol.window_position(&1, @session_id, "window_handle", %{x: 100, y: 200}),
    "/session/:session_id/window/window_handle/position", "{\"x\":100,\"y\":200}"
  end

  test "maximize_window" do
    test_post &Protocol.maximize_window(&1, @session_id, "window_handle"),
              "/session/:session_id/window/window_handle/maximize", "{}"
  end

  test "cookies" do
    test_get &Protocol.cookies(&1, @session_id), "/session/:session_id/cookie"
  end

  test "set_cookie" do
    test_post &Protocol.set_cookie(&1, @session_id, %{cookie: %{key: "value"}}),
     "/session/:session_id/cookie", "{\"cookie\":{\"key\":\"value\"}}"
  end

  test "delete cookies" do
    test_delete &Protocol.delete_cookies(&1, @session_id), "/session/:session_id/cookie"
  end

  test "delete cookie" do
    test_delete &Protocol.delete_cookie(&1, @session_id, "name"),
     "/session/:session_id/cookie/name"
  end

  test "source" do
    test_get &Protocol.source(&1, @session_id), "/session/:session_id/source"
  end

  test "title" do
    test_get &Protocol.title(&1, @session_id), "/session/:session_id/title"
  end

  test "element/3" do
    test_post &Protocol.element(&1, @session_id, %{using: "css selector", value: "special"}),
              "/session/:session_id/element", "{\"using\":\"css selector\",\"value\":\"special\"}"
  end

  test "element/4" do
    test_post &Protocol.element(&1, @session_id, ":element_id", %{using: "css selector", value: "special"}),
      "/session/:session_id/element/:element_id/element",
      "{\"using\":\"css selector\",\"value\":\"special\"}"
  end

  test "elements/3" do
    test_post &Protocol.elements(&1, @session_id, %{using: "css selector", value: "special"}),
      "/session/:session_id/elements",
      "{\"using\":\"css selector\",\"value\":\"special\"}"
  end

  test "elements/4" do
    test_post &Protocol.elements(&1, @session_id, ":element_id", %{using: "css selector", value: "special"}),
      "/session/:session_id/element/:element_id/elements",
      "{\"using\":\"css selector\",\"value\":\"special\"}"
  end

  test "active_element" do
    test_get &Protocol.active_element(&1, @session_id), "/session/:session_id/element/active"
  end

  test "element_by_id" do
    test_get &Protocol.element_by_id(&1, @session_id, ":element_id"),
     "/session/:session_id/element/:element_id"
  end

  test "click" do
    test_post &Protocol.click(&1, @session_id, ":element_id"),
     "/session/:session_id/element/:element_id/click", "{}"
  end

  test "submit" do
    test_post &Protocol.submit(&1, @session_id, ":element_id"),
      "/session/:session_id/element/:element_id/submit", "{}"
  end

  test "text" do
    test_get &Protocol.text(&1, @session_id, ":element_id"),
      "/session/:session_id/element/:element_id/text"
  end

  test "value" do
    test_post &Protocol.value(&1, @session_id, ":element_id", %{value: ["a","b","c"]}),
      "/session/:session_id/element/:element_id/value",
      "{\"value\":[\"a\",\"b\",\"c\"]}"
  end

  test "keys" do
    test_post &Protocol.keys(&1, @session_id, %{value: ["a","b","c"]}),
      "/session/:session_id/keys",
      "{\"value\":[\"a\",\"b\",\"c\"]}"
  end

  test "name" do
    test_get &Protocol.name(&1, @session_id, ":element_id"),
    "/session/:session_id/element/:element_id/name"
  end

  test "clear" do
    test_post &Protocol.clear(&1, @session_id, ":element_id"),
    "/session/:session_id/element/:element_id/clear", "{}"
  end

  test "selected" do
    test_get &Protocol.selected(&1, @session_id, ":element_id"),
       "/session/:session_id/element/:element_id/selected"
  end

  test "enabled" do
    test_get &Protocol.enabled(&1, @session_id, ":element_id"),
       "/session/:session_id/element/:element_id/enabled"
  end

  test "attribute" do
    test_get &Protocol.attribute(&1, @session_id, ":element_id", "attribute_name"),
       "/session/:session_id/element/:element_id/attribute/attribute_name"
  end

  test "equals" do
    test_get &Protocol.equals(&1, @session_id, ":element_id", "other_id"),
       "/session/:session_id/element/:element_id/equals/other_id"
  end

  test "displayed" do
    test_get &Protocol.displayed(&1, @session_id, ":element_id"),
       "/session/:session_id/element/:element_id/displayed"
  end

  test "location" do
    test_get &Protocol.location(&1, @session_id, ":element_id"),
       "/session/:session_id/element/:element_id/location"
  end

  test "location_in_view" do
    test_get &Protocol.location_in_view(&1, @session_id, ":element_id"),
       "/session/:session_id/element/:element_id/location_in_view"
  end

  test "size" do
    test_get &Protocol.size(&1, @session_id, ":element_id"),
       "/session/:session_id/element/:element_id/size"
  end

  test "css" do
    test_get &Protocol.css(&1, @session_id, ":element_id", "property_name"),
       "/session/:session_id/element/:element_id/css/property_name"
  end

  test "orientation/2" do
    test_get &Protocol.orientation(&1, @session_id),
       "/session/:session_id/orientation"
  end

  test "orientation/3" do
    test_post &Protocol.orientation(&1, @session_id, %{orientation: "LANDSCAPE"}),
       "/session/:session_id/orientation",
                  "{\"orientation\":\"LANDSCAPE\"}"
  end

  test "alert_text/2" do
    test_get &Protocol.alert_text(&1, @session_id),
       "/session/:session_id/alert_text"
  end

  test "alert_text/3" do
    test_post &Protocol.alert_text(&1, @session_id, %{text: "Help!"}),
       "/session/:session_id/alert_text",
                "{\"text\":\"Help!\"}"
  end

  test "accept_alert" do
    test_post &Protocol.accept_alert(&1, @session_id),
       "/session/:session_id/accept_alert",
                "{}"
  end

  test "dismiss_alert" do
    test_post &Protocol.dismiss_alert(&1, @session_id),
       "/session/:session_id/dismiss_alert",
                "{}"
  end

  test "move_to" do
    test_post &Protocol.move_to(&1, @session_id, %{element: "element_id", offsetx: 10, offsety: 20}),
       "/session/:session_id/moveto",
          "{\"element\":\"element_id\",\"offsetx\":10,\"offsety\":20}"
  end

  test "mouse_click/2" do
    test_post &Protocol.mouse_click(&1, @session_id),
       "/session/:session_id/click", "{}"
  end

  test "mouse_click/3" do
    test_post &Protocol.mouse_click(&1, @session_id, %{button: 2}),
       "/session/:session_id/click", "{\"button\":2}"
  end

  test "mouse_button_down/2" do
    test_post &Protocol.mouse_button_down(&1, @session_id),
       "/session/:session_id/buttondown", "{}"
  end

  test "mouse_button_down/3" do
    test_post &Protocol.mouse_button_down(&1, @session_id, %{button: 1}),
       "/session/:session_id/buttondown", "{\"button\":1}"
  end

  test "mouse_button_up/2" do
    test_post &Protocol.mouse_button_up(&1, @session_id),
       "/session/:session_id/buttonup",  "{}"
  end

  test "mouse_button_up/3" do
    test_post &Protocol.mouse_button_up(&1, @session_id, %{button: 1}),
       "/session/:session_id/buttonup", "{\"button\":1}"
  end

  test "mouse_double_click/2" do
    test_post &Protocol.mouse_double_click(&1, @session_id),
       "/session/:session_id/doubleclick", "{}"
  end

  test "mouse_double_click/3" do
    test_post &Protocol.mouse_double_click(&1, @session_id, %{button: 2}),
       "/session/:session_id/doubleclick", "{\"button\":2}"
  end

  test "touch_click" do
    test_post &Protocol.touch_click(&1, @session_id, %{element: "element_id"}),
       "/session/:session_id/touch/click", "{\"element\":\"element_id\"}"
  end

  test "touch_down" do
    test_post &Protocol.touch_down(&1, @session_id, %{x: 100, y: 200}),
       "/session/:session_id/touch/down",
                   "{\"x\":100,\"y\":200}"
  end

  test "touch_up" do
    test_post &Protocol.touch_up(&1, @session_id, %{x: 100, y: 200}),
       "/session/:session_id/touch/up", "{\"x\":100,\"y\":200}"
  end

  test "touch_move" do
    test_post &Protocol.touch_move(&1, @session_id, %{x: 100, y: 200}),
       "/session/:session_id/touch/move", "{\"x\":100,\"y\":200}"
  end

  test "touch_scroll" do
    test_post &Protocol.touch_scroll(&1, @session_id, %{element: "element_id", x: 100, y: 200}),
       "/session/:session_id/touch/scroll",
                   "{\"element\":\"element_id\",\"x\":100,\"y\":200}"
  end

  test "touch_double_click" do
    test_post &Protocol.touch_double_click(&1, @session_id, %{element: "element_id"}),
       "/session/:session_id/touch/doubleclick",
                   "{\"element\":\"element_id\"}"
  end

  test "touch_long_click" do
    test_post &Protocol.touch_long_click(&1, @session_id, %{element: "element_id"}),
       "/session/:session_id/touch/longclick",
                   "{\"element\":\"element_id\"}"
  end

  test "touch_flick" do
    test_post &Protocol.touch_flick(&1, @session_id, %{xSpeed: 10, ySpeed: 0}),
       "/session/:session_id/touch/flick", "{\"xSpeed\":10,\"ySpeed\":0}"
  end

  test "geo_location/2" do
    test_get &Protocol.geo_location(&1, @session_id),
       "/session/:session_id/location"
  end

  test "geo_location/3" do
    test_post &Protocol.geo_location(&1, @session_id, %{longitude: 23.34, lattitude: 40.3, altitude: 10.3}),
       "/session/:session_id/location", "{\"longitude\":23.34,\"lattitude\":40.3,\"altitude\":10.3}"
  end

## Test Harness Functions
  #  Mocks a response to a request.
  #  The response just echoes the request body.
  def test_get command, path do
    with_mock HTTPotion, [], [get: fn(url, options) -> get(url, options) end] do
      {:ok, _response} = command.("http://127.0.0.1:8080")
      assert_get path
    end
  end

  def test_post command, path, options do
    with_mock HTTPotion, [], [post: fn(url, options) -> post(url, options) end] do
      {:ok, _response} = command.("http://127.0.0.1:8080")
      assert_post path, options
    end
  end

  def test_delete command, path do
    with_mock HTTPotion, [], [delete: fn(url, options) -> delete(url, options) end] do
      {:ok, _response} = command.("http://127.0.0.1:8080")
      assert_delete path
    end
  end

  def post(_url, options) do
    body = Keyword.get(options, :body)
    %HTTPotion.Response{ body: "{\"sessionId\": \"1234\", \"status\": 0, \"value\": #{JSON.encode! body}}",
                       status_code: 201, headers: []}
  end

  # Mocks a response to a GET request. Just returns an HTTPotion Response
  def get(_url, _options) do
    %HTTPotion.Response{ body: "{\"sessionId\": \"1234\", \"status\": 0, \"value\": #{JSON.encode!(%{})}}",
                       status_code: 200, headers: [] }
  end

  # Mocks a response to a DELETE request. Just returns an HTTPotion Response
  def delete(_url, _options) do
    %HTTPotion.Response{ body: "{\"sessionId\": \"1234\", \"status\": 0, \"value\": #{JSON.encode!(%{})}}",
                       status_code: 204, headers: [] }
  end

  defp assert_get path do
    assert called HTTPotion.get("http://127.0.0.1:8080#{path}", :_)
  end

  defp assert_post path, body do
    # Jazz shuffles map keys around.
    b = JSON.decode!(body) |> JSON.encode!
    assert called HTTPotion.post("http://127.0.0.1:8080#{path}", [body: b, headers: :_])
  end

  defp assert_delete path do
    assert called HTTPotion.delete("http://127.0.0.1:8080#{path}", :_)
  end
end
