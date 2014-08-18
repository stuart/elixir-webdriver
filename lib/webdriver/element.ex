defmodule WebDriver.Element do
  @moduledoc """
    This module handles WebDriver calls directed at specific DOM elements.

    They all take an WebDriver.Element struct as the first argument.
    The WebDriver.Element struct is supposed to be an opaque data type and
    is not meant to be manipulated. It contains the internal id of the element
    used by the webdriver client and a the session name.

    Elements are associated with a particular session and have no meaning
    outside that WedDriver session.

    Accessing an element that does not exist on the page will return a response
    of ```{ :stale_element_reference, response }```

    All the command functions will return ```{:ok, response}``` or
    ```{error, response}``` where ```error``` is one of those listed in
    WebDriver.Error.
  """

  defstruct id: "", session: :null

  @doc """
    Click on the specified element.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/click
  """
  def click element do
    cmd element, :click
  end

  @doc """
    Submit a FORM element. May be applied to any descendent of a FORM element.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/submit
  """
  def submit element do
    cmd element, :submit
  end

  @doc """
    Retreives the visible text of the element. Returns a string.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/text
  """
  def text element do
    get_value element, :text
  end

  @doc """
    Send a list of keystrokes to the specified element.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/value

    Parameters: %{value: String}
  """
  def value element, value do
    cmd element, :value, %{value: String.codepoints value}
  end

  @doc """
    Get the name of the specified element.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/name
  """
  def name element do
    get_value element, :name
  end

  @doc """
    Clears the specified form field or textarea element.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/clear
  """
  def clear element do
    cmd element, :clear
  end

  @doc """
    Returns a boolean denoting if the element is selected or not.
    Returns {:element_not_selectable, response} if it is not able to be selected.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/selected
  """
  def selected? element do
    value = get_value element, :selected
    case value do
      {:element_not_selectable, _resp} -> nil
      _ -> value
    end
  end

  @doc """
    Returns a boolean denoting if the element is enabled or not.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/enabled
  """
  def enabled? element do
    get_value element, :enabled
  end

  @doc """
    Returns the value of the given element's attribute.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/attribute/:name
  """
  def attribute element, attribute_name do
    get_value element, :attribute, attribute_name
  end

  @doc """
    Determine if two element ids refer to the same DOM element.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/equals/:other
  """
  def equals? element, other_element do
    get_value element, :equals, other_element.id
  end

  @doc """
    Returns a boolean denoting if the element is currently visible.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/displayed
  """
  def displayed? element do
    get_value element, :displayed
  end

  @doc """
    Returns the current location of the specified element in pixels
    from the top left corner.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/location

    Returns %{x: x, y: y}
  """
  def location element do
    case get_value element, :location do
    # Bug with Python Selenium
    # http://code.google.com/p/selenium/source/detail?r=bbcfab457b13
    %{"toString" => _,"x" => x,"y" => y} ->
        %{x: x, y: y}
    %{"x" => x, "y" => y} ->
        %{x: x, y: y}
    response -> # Pass error responses through.
        response
    end
  end

  @doc """
    Determine an element's location once it has been scrolled into view.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/location_in_view

    Returns %{x: x, y: y}
  """
  def location_in_view element do
    do_location_in_view(get_value(element, :location))
  end

  defp do_location_in_view {error, response} do
    {error, response}
  end

  defp do_location_in_view response do
    # Bugfix
    # http://code.google.com/p/selenium/source/detail?r=bbcfab457b13
    %{x: response["x"], y: response["y"]}
  end

  @doc """
    Returns size in pixels of the specified element.

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/size

    Returns %{width: w, height: h}
  """
  def size element do
    do_size(get_value(element, :size))
  end

  defp do_size {error, response} do
    {error, response}
  end

  defp do_size response do
    %{width: response["width"], height: response["height"]}
  end

  @doc """
    Get the computed value of an element's CSS property.
    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/css/:propertyName

    Returns a string.
  """
  def css element, property_name do
    get_value element, :css, property_name
  end

# Private Functions
  # Get a value from the server
  defp get_value element, command do
    case :gen_server.call element.session, {command, element.id} do
      {:ok, response} -> response.value
      response -> response
    end
  end

  defp get_value element, command, params do
    case :gen_server.call element.session, {command, element.id, params} do
      {:ok, response} -> response.value
      response -> response
    end
  end

  # Send a command to the server
  defp cmd element, command do
    :gen_server.call element.session, {command, element.id}, 20000
  end

  defp cmd element, command, params do
    :gen_server.call element.session, {command, element.id, params}, 20000
  end
end
