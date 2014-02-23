defmodule WebDriver.Mouse do
  @moduledoc """
    MOUSE EVENTS CURRENTLY DO NOT WORK IN FIREFOX
  """

  @doc """
    Move the mouse to the specified element.

    Parameters:
      element: The element to move the mouse to.
      offsetx: X offset to the element coordinates
      offsety: Y offset to the element coordinates

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/moveto
  """
  def move_to element, offsetx \\ 0, offsety \\ 0 do
    cmd element.session, :move_to, [element: element.id, xoffset: offsetx, yoffset: offsety]
  end

  @doc """
    Click a mouse button.

    Parameters:
      session : The session server process to send the click to.
      button: The button to click, one of :left, :middle or :right

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/click
  """
  def click session, button \\ :left do
    cmd session, :mouse_click, [button: button_number(button)]
  end


  @doc """
    Send a Button Down event.

    Parameters:
      session : The session server process to send the event to.
      button: The button to press, one of :left, :middle or :right

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/buttondown
  """
  def button_down session, button \\ :left do
    cmd session, :mouse_button_down, [button: button_number(button)]
  end

  @doc """
    Send a Button Up event.

    Parameters:
      session : The session server process to send the event to.
      button: The button to raise, one of :left, :middle or :right

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/buttonup
  """
  def button_up session, button \\ :left do
    cmd session, :mouse_button_up, [button: button_number(button)]
  end

  @doc """
    Send a double click mouse event.

    Parameters:
      session : The session server process to send the event to.
      button: The button to double click, one of :left, :middle or :right

    https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/doubleclick
  """
  def double_click session, button \\ :left do
    cmd session, :mouse_double_click, [button: button_number(button)]
  end

  # Send a command to the server
  defp cmd session, command, params do
    :gen_server.call session, {command, params}, 20000
  end

  defp button_number :left   do 0 end
  defp button_number :middle do 1 end
  defp button_number :right  do 2 end
end
