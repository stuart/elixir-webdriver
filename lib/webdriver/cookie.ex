defmodule WebDriver.Cookie do
  defstruct name: "", value: "", path: nil, domain: nil, secure: false, expiry: 0
  @moduledoc """
    A module for querying and manipulation of cookies.
  """
  def from_response cookie do
    # new(Enum.reduce cookie, [], fn({k,v}, c) -> c ++ [{binary_to_atom(k), v}] end)
  end
end
