Code.require_file "../test_helper.exs", __DIR__

defmodule CapabilitiesTest do
  use ExUnit.Case

  test "conversion from a response tuple list" do
    cap = WebDriver.Capabilities.from_response([
            {"browserName","phantomjs"},
            {"version","1.0"},
            {"driverName","GhostDriver"},
            {"driverVersion","1.0"},
            {"platform","darwin"},
            {"javascriptEnabled",true},
            {"takesScreenshot",true},
            {"handlesAlerts",true},
            {"databaseEnabled",false},
            {"locationContextEnabled",false},
            {"applicationCacheEnabled",true},
            {"browserConnectionEnabled",true},
            {"cssSelectorsEnabled",true},
            {"webStorageEnabled",true},
            {"rotatable",false},
            {"acceptSslCerts",true},
            {"nativeEvents",false},
            {"proxy",[]}])

    # Just test each type of field
    assert cap.browserName == "phantomjs"
    assert cap.javascriptEnabled
    assert cap.proxy == []
  end
end