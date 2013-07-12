defmodule WebDriver.PortFinder do
  @doc """
    Attempt to find a free port to connect to.
    Relies on the OS to give us a free port.
  """
  def select_port do
    {:ok, socket} = :gen_tcp.listen 0, [:binary, {:packet, 0}, {:active, false}]
    response = :inet.port(socket)
    :gen_tcp.close(socket)
    response  # {:ok, port}
  end
end
