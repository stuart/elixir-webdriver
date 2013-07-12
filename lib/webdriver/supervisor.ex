defmodule WebDriver.Supervisor do
  use Supervisor.Behaviour

  def start_link _state do
    :supervisor.start_link {:local, :webdriver}, __MODULE__, []
  end

  def init _state do
    supervise [], strategy: :one_for_one
  end

  def start_browser config do
    :supervisor.start_child :webdriver, worker(WebDriver.BrowserSup,[config],[id: config.name])
  end

  def stop_browser name do
    :supervisor.terminate_child :webdriver, name
    :supervisor.delete_child :webdriver, name
  end
end
