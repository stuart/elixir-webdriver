Code.require_file "../test_helper.exs", __DIR__
Code.require_file "test_server.exs", __DIR__
defmodule WebDriverSessionTest do
  use ExUnit.Case

  alias WebDriver.Session
  alias WebDriver.Element
  alias WebDriver.Mouse

# Testing Callbacks

  setup_all do
    http_server_pid = WebDriver.TestServer.start
    config = WebDriver.Config.new(browser: :chrome, name: :ctest_browser)
    WebDriver.start_browser config
    WebDriver.start_session :ctest_browser, :test
    {:ok, [http_server_pid: http_server_pid]}
  end

  teardown_all meta do
    WebDriver.stop_browser :test_browser
    WebDriver.stop_session :test
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

  test "status should show that the Session is up" do
    resp = WebDriver.Session.status(:test)
    assert [{"build", _},{"os",_}] = resp
  end

end
