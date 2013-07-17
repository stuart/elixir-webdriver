defrecord WebDriver.Cookie, name: "", value: "", path: nil, domain: nil, secure: false, expiry: 0  do
  @moduledoc """
    A record for querying and manipulation of cookies.
  """
  def from_response cookie do
    new(Enum.reduce cookie, [], fn({k,v}, c) -> c ++ [{binary_to_atom(k), v}] end)
  end 
end