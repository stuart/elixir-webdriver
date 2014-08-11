defmodule WebDriver.SessionSup do
  use Supervisor
  @moduledoc """
    This supervisor maintians sessions for a browser instance.
    Will restart sessions that have died for some reason.
  """

  def start_link state do
    :supervisor.start_link __MODULE__, state
  end

  def init state do
    child_processes = [worker(WebDriver.Session, [state], [restart: :permanent])]
    supervise(child_processes,[ strategy: :simple_one_for_one ])
  end
end
