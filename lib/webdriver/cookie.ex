defmodule WebDriver.Cookie do
  defstruct name: "", value: "", path: nil, domain: nil, secure: false, expiry: 0
  @moduledoc """
    A module for querying and manipulation of cookies.
    Cookies are defined in a struct with the following fields:

    * `name`
    * `value`
    * `path`
    * `domain`
    * `secure`
    * `expiry`

  """

  @doc """
    Creates a cookie struct from a webdriver response.
  """
  def from_response cookie do
    struct(WebDriver.Cookie, Enum.map(cookie, fn({k,v}) -> {String.to_atom(k),v} end))
  end
end
