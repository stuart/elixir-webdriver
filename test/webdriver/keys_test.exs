Code.require_file "../test_helper.exs", __DIR__

defmodule WebDriverKeysTest do
  use ExUnit.Case, async: true
  import Mock

  alias WebDriver.Keys

  test "a valid key code" do
    assert "\x{e000}" == Keys.key(:key_null)
  end

  test "an invalid key code" do
    assert {:error, :invalid_key_code } == Keys.key(:not_a_key)
  end

  test "A string containing key codes" do
    assert "Test#{Keys.key(:key_enter)}String" == "Test\x{e007}String"
  end
end
