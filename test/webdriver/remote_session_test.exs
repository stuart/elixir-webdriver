Code.require_file "../test_helper.exs", __DIR__
Code.require_file "test_server.exs", __DIR__
defmodule WebDriverRemoteSessionTest do
  use ExUnit.Case

  setup_all do
    :os.cmd 'phantomjs --webdriver=localhost:5555 &'
    on_exit fn ->
      :os.cmd 'killall phantomjs'
    end
    {:ok, []}
  end

  setup do
    on_exit fn ->
      WebDriver.stop_browser :remote_test_browser
      WebDriver.stop_session :remote_session
    end
  end

  test "can start a remote 'browser'" do
    config = %WebDriver.Config{browser: :remote, name: :remote_test_browser,
      root_url: "http://localhost:5555/wd/hub"}
    assert {:ok, _} = WebDriver.start_browser config
  end

  test "can start a session on a remote browser" do
    config = %WebDriver.Config{browser: :remote, name: :remote_test_browser,
      root_url: "http://localhost:5555/wd/hub"}
    assert {:ok, _} = WebDriver.start_browser config
    assert {:ok, _} = WebDriver.start_session :remote_test_browser, :remote_session
  end

  test "can do a url command" do
    config = %WebDriver.Config{browser: :remote, name: :remote_test_browser,
      root_url: "http://localhost:5555/wd/hub"}
    {:ok, _} = WebDriver.start_browser config
    {:ok, _} = WebDriver.start_session :remote_test_browser, :remote_session
    WebDriver.Session.url :remote_session, "http://elixir-lang.org"
    assert WebDriver.Session.url(:remote_session) == "http://elixir-lang.org/"
  end
end
