defmodule WebDriver.Keys do
  @non_text_keys {
    { :key_null,      "\x{e000}" },
    { :key_cancel,    "\x{e001}"},
    { :key_help,      "\x{e002}"},
    { :key_back_space,"\x{e003}"},
    { :key_tab,       "\x{e004}"},
    { :key_clear,     "\x{e005}"},
    { :key_return,    "\x{e006}"},
    { :key_enter,     "\x{e007}"},
    { :key_shift,     "\x{e008}"},
    { :key_control,   "\x{e009}"},
    { :key_alt,       "\x{e00a}"},
    { :key_pause,     "\x{e00b}"},
    { :key_escape,    "\x{e00c}"},
    { :key_space,     "\x{e00d}"},
    { :key_page_up,   "\x{e00e}"},
    { :key_page_down, "\x{e00f}"},
    { :key_end,       "\x{e010}"},
    { :key_home,      "\x{e011}"},
    { :key_left,      "\x{e012}"},
    { :key_up,        "\x{e013}"},
    { :key_right,     "\x{e014}"},
    { :key_down,      "\x{e015}"},
    { :key_insert,    "\x{e016}"},
    { :key_delete,    "\x{e017}"},
    { :key_semicolon, "\x{e018}"},
    { :key_equals,    "\x{e019}"},
    { :key_numpad_0,  "\x{e01a}"},
    { :key_numpad_1,  "\x{e01b}"},
    { :key_numpad_2,  "\x{e01c}"},
    { :key_numpad_3,  "\x{e01d}"},
    { :key_numpad_4,  "\x{e01e}"},
    { :key_numpad_5,  "\x{e01f}"},
    { :key_numpad_6,  "\x{e020}"},
    { :key_numpad_7,  "\x{e021}"},
    { :key_numpad_8,  "\x{e022}"},
    { :key_numpad_9,  "\x{e023}"},
    { :key_multiply,  "\x{e024}"},
    { :key_add,       "\x{e025}"},
    { :key_separator, "\x{e026}"},
    { :key_subtract,  "\x{e027}"},
    { :key_decimal,   "\x{e028}"},
    { :key_divide,    "\x{e029}"},
    { :key_f1,        "\x{e031}"},
    { :key_f2,        "\x{e032}"},
    { :key_f3,        "\x{e033}"},
    { :key_f4,        "\x{e034}"},
    { :key_f5,        "\x{e035}"},
    { :key_f6,        "\x{e036}"},
    { :key_f7,        "\x{e037}"},
    { :key_f8,        "\x{e038}"},
    { :key_f9,        "\x{e039}"},
    { :key_f10,       "\x{e03a}"},
    { :key_f11,       "\x{e03b}"},
    { :key_f12,       "\x{e03c}"},
    { :key_meta,      "\x{e03d}"}
  }

  defp val {:ok, value} do
    value
  end

  defp val :error do
    {:error, :invalid_key_code}
  end

  @doc """
  This function is used to return the Unicode codes for simuluation non text key
  presses.

  See: https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/value

  Key codes that are available:

  """
  def key key_code do
    HashDict.fetch(@non_text_keys, key_code)
    |> val
  end

end
