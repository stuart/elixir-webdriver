defmodule WebDriverTest do
  use ExUnit.Case

  teardown do
    WebDriver.stop_all_browsers
  end

  test "browsers returns all current browsers that are running" do
    assert WebDriver.browsers == []
    config = WebDriver.Config.new(browser: :phantomjs, name: :test_browser_1)
    WebDriver.start_browser config
    assert WebDriver.browsers == [:test_browser_1]
    config = WebDriver.Config.new(browser: :firefox, name: :test_browser_2)
    WebDriver.start_browser config
    assert WebDriver.browsers == [:test_browser_2, :test_browser_1]
  end

  test "sessions returns the session name" do
    assert WebDriver.sessions == []
    config = WebDriver.Config.new(browser: :phantomjs, name: :test_browser_1)
    WebDriver.start_browser config
    WebDriver.start_session :test_browser_1, :test_session_1
    assert WebDriver.sessions == [:test_session_1]
  end

  test "sessions returns session names for all browsers" do
    config = WebDriver.Config.new(browser: :phantomjs, name: :test_browser_1)
    WebDriver.start_browser config
    config = WebDriver.Config.new(browser: :phantomjs, name: :test_browser_2)
    WebDriver.start_browser config
    WebDriver.start_session :test_browser_1, :test_session_1
    WebDriver.start_session :test_browser_2, :test_session_2
    assert WebDriver.sessions == [:test_session_2, :test_session_1]
  end


end
