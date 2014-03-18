defmodule WebDriver.Error do

  @status_codes HashDict.new([
    { 0, :success },
    { 6, :no_such_driver },
    { 7, :no_such_element },
    { 8, :no_such_frame },
    { 9, :unknown_command },
    { 10, :stale_element_reference },
    { 11, :element_not_visible },
    { 12, :invalid_element_state },
    { 13, :unknown_error },
    { 15, :element_not_selectable },
    { 17, :javascript_error },
    { 19, :x_path_lookup_error },
    { 21, :timeout },
    { 23, :no_such_window },
    { 24, :invalid_cookie_domain },
    { 25, :unable_to_set_cookie },
    { 26, :unexpected_alert_open },
    { 27, :no_alert_open_error },
    { 28, :script_timeout },
    { 29, :invalid_element_coordinates },
    { 30, :ime_not_available },
    { 31, :ime_engine_activation_failed },
    { 32, :invalid_selector },
    { 33, :session_not_created_exception },
    { 34, :move_target_out_of_bounds }
  ])

  @moduledoc """
    Error handling for WebDriver.

    The error codes that are returned from the server are managed by this
    module.

    The codes that can be returned are:

  #{Enum.sort(HashDict.to_list(@status_codes), fn({a,_},{b,_}) -> a > b end) |> Enum.reverse |> Enum.map(fn({c,msg}) -> "* #{c} - ```:#{msg}```\n" end)}

  """

  defrecord ErrorMessage, message: "", screen: "", class: "", stack_trace: []

  @doc """
    Create an ErrorMessage record from raw protocol error data.
  """
  def build_message([{"message", message},{"screen", screen},{"class", class},{"stackTrace", stack_trace}]) do
    ErrorMessage[ message: message, screen: screen, class: class, stack_trace: stack_trace ]
  end

  @doc """
    Convert a code number to a status code summary atom.
  """
  def summary code do
    {:ok, val} = HashDict.fetch @status_codes, code
    val
  end
end
