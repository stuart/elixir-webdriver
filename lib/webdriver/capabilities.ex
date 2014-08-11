defmodule WebDriver.Capabilities do
  defstruct browserName: "",
            version: "",
            driverName: "",
            driverVersion: "",
            platform: "",
            javascriptEnabled: true,
            takesScreenshot: false,
            handlesAlerts: false,
            databaseEnabled: false,
            locationContextEnabled: false,
            applicationCacheEnabled: false,
            browserConnectionEnabled: false,
            cssSelectorsEnabled: false,
            webStorageEnabled: false,
            rotatable: false,
            acceptSslCerts: false,
            nativeEvents: false,
            proxy: []

  @moduledoc """
    The capabilities record is defined in the WebDriver specification.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#Capabilities_JSON_Object

    The current version of this code does not actually use the capabilities object.
    Support for various capabilities will be forthcoming.

    * `browserName` - The name of the browser being used.
    * `version` - The browser version or an empty string if unknown.
    * `driverName` - The name of the driver used
    * `driverVersion` - The driver version or an empty string if unknown.
    * `platform` - A key specifying which platform (OS) the browser is running on.
    * `javascriptEnabled` - specifies wether Javascript is enabled on the browser or not.
    * `takesScreenshot` - specifies wether the browser can take a screenshot or not.
    * `handlesAlerts` - wether the session can interact with popups or not.
    * `databaseEnabled` - wether the session can use database storage
    * `locationContextEnabled` - wether the session can use geolocation features.
    * `applicationCacheEnabled` - wether the session can use the application cache.
    * `browserConnectionEnabled` - wether the session can interrogate for browser connectivity.
    * `cssSelectorsEnabled` - wether the session can use CSS selectors for finding elements.
    * `webStorageEnabled` - wether the session can use web storage.
    * `rotatable` - wether the session can set the screen layout either Landscape or Portrait.
    * `acceptSslCerts` - wether the session should accept all SSL certificates by default.
    * `nativeEvents` - wether the session can produce native events when simulating user input.
    * `proxy` - details of any web proxy to use.
  """

  def from_response response do
    struct(WebDriver.Capabilities, Enum.map(response, fn({k,v}) -> {String.to_atom(k),v} end))
  end
end
