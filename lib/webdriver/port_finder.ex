defmodule WebDriver.PortFinder do
  @moduledoc """
    A convenience module for finding a free port to connect to.
  """

  @doc """
    Attempt to find a free port to connect to.
    Relies on the OS to give us a free port.
  """
  def select_port do
    {:ok, socket} = :gen_tcp.listen 0, [:binary, {:packet, 0}, {:active, false}]
    {:ok, port}   = :inet.port(socket)
    :gen_tcp.close(socket)
    {:ok, port}
  end
end
