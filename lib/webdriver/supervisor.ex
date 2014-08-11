defmodule WebDriver.Supervisor do
  use Supervisor

  @moduledoc """
    The root supervisor for the WebDriver application supervision tree.
    This is responsible for keeping the BrowserSup's alive.

    Each child of this supervisor runs an instance of a Browser and it's
    associated sessions.

    The functions here should not be called directly by client applications,
    use those provided in the WebDriver module instead.
  """

  def start_link _state do
    :supervisor.start_link {:local, :webdriver}, __MODULE__, []
  end

  def init _state do
    supervise [], strategy: :one_for_one
  end

  @doc """
    Start a web browser with the specified configuration.
  """
  def start_browser config do
    :supervisor.start_child :webdriver, worker(WebDriver.BrowserSup,[config],[id: config.name])
  end

  @doc """
    Stop a web browser identified by the given name.
  """
  def stop_browser name do
    :supervisor.terminate_child :webdriver, name
    :supervisor.delete_child :webdriver, name
  end
end
