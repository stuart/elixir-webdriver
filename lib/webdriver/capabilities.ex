defrecord Capabilities,
          browser_name: "",
          version: "",
          driver_name: "",
          driver_version: "",
          platform: "",
          javascript_enabled: false,
          takes_screenshot: false,
          handles_alerts: false,
          database_enabled: false,
          location_context_enabled: false,
          application_cache_enabled: false,
          browser_connection_enabled: false,
          css_selectors_enabled: false,
          web_storage_enabled: false,
          rotatable: false,
          accept_ssl_certs: false,
          native_events: true,
          proxy: [] do 

  @moduledoc """
    The capabilities record is defined in the WebDriver specification.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#Capabilities_JSON_Object

    The current version of this code does not actually use the capabilities object.
    Support for various capabilities will be forthcoming.
    
    * `browser_name` - The name of the browser being used.
    * `version` - The browser version or an empty string if unknown.
    * `driver_name` - The name of the driver used
    * `driver_version` - The driver version or an empty string if unknown.
    * `platform` - A key specifying which platform (OS) the browser is running on. 
    * `javascript_enabled` - specifies wether Javascript is enabled on the browser or not.
    * `takes_screenshot` - specifies wether the browser can take a screenshot or not.
    * `handles_alerts` - wether the session can interact with popups or not.
    * `database_enabled` - wether the session can use database storage
    * `location_context_enabled` - wether the session can use geolocation features.
    * `application_cache_enabled` - wether the session can use the application cache.
    * `browser_connection_enabled` - wether the session can interrogate for browser connectivity.
    * `css_selectors_enabled` - wether the session can use CSS selectors for finding elements.
    * `web_storage_enabled` - wether the session can use web storage.
    * `rotatable` - wether the session can set the screen layout either Landscape or Portrait.
    * `accept_ssl_certs` - wether the session should accept all SSL certificates by default.
    * `native_events` - wether the session can produce native events when simulating user input.
    * `proxy` - details of any web proxy to use.
  """
end
