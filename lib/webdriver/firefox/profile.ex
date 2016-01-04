defmodule WebDriver.Firefox.Profile do

  @default_profile [
    {"app.update.auto", false},
    {"app.update.enabled", false},
    {"browser.EULA.3.accepted", true},
    {"browser.EULA.override", true},
    {"browser.dom.window.dump.enabled", true},
    {"browser.download.manager.showWhenStarting", false},
    {"browser.link.open_external", 2},
    {"browser.link.open_newwindow", 2},
    {"browser.newtab.url", "about:blank"},
    {"browser.newtabpage.enabled", false},
    {"browser.offline", false},
    {"browser.safebrowsing.enabled", false},
    {"browser.safebrowsing.malware.enabled", false},
    {"browser.search.update", false},
    {"browser.sessionstore.resume_from_crash", false},
    {"browser.shell.checkDefaultBrowser", false},
    {"browser.startup.homepage", "about:blank"},
    {"browser.startup.page", 0},
    {"browser.tabs.warnOnClose", false},
    {"browser.tabs.warnOnOpen", false},
    {"browser.selfsupport.url", ""},
    {"devtools.errorconsole.enabled", true},
    {"dom.disable_open_during_load", false},
    {"dom.max_chrome_script_run_time", 30},
    {"dom.max_script_run_time", 30},
    {"dom.report_all_js_exceptions", true},
    {"extensions.autoDisableScopes", 10},
    {"extensions.blocklist.enabled", false},
    {"extensions.logging.enabled", true},
    {"extensions.update.enabled", false},
    {"extensions.update.notifyUser", false},
    {"javascript.options.showInConsole", true},
    {"network.http.max-connections-per-server", 10},
    {"network.http.phishy-userpass-length", 255},
    {"network.manage-offline-status", false},
    {"offline-apps.allow_by_default", true},
    {"prompts.tab_modal.enabled", false},
    {"security.csp.enable", false},
    {"security.fileuri.origin_policy", 3},
    {"security.fileuri.strict_origin_policy", false},
    {"security.warn_entering_secure", false},
    {"security.warn_entering_secure.show_once", false},
    {"security.warn_entering_weak", false},
    {"security.warn_entering_weak.show_once", false},
    {"security.warn_leaving_secure", false},
    {"security.warn_leaving_secure.show_once", false},
    {"security.warn_submit_insecure", false},
    {"security.warn_viewing_mixed", false},
    {"security.warn_viewing_mixed.show_once", false},
    {"signon.rememberSignons", false},
    {"startup.homepage_welcome_url", "about:blank"},
    {"toolkit.networkmanager.disable", true},
    {"toolkit.telemetry.enabled", false},
    {"toolkit.telemetry.prompted", 2},
    {"toolkit.telemetry.rejected", true},
    {"webdriver_accept_untrusted_certs", true},
    {"webdriver_assume_untrusted_issuer", true},
    {"webdriver_enable_native_events", false},
    {"webdriver.log.file", "/tmp/webdriver.log"}
  ]

  @webdriver_prefs [
    native_events:    "webdriver_enable_native_events",
    untrusted_certs:  "webdriver_accept_untrusted_certs",
    untrusted_issuer: "webdriver_assume_untrusted_issuer",
    port:             "webdriver_firefox_port",
    log_file:         "webdriver.log.file" ]


  def default_profile do
    @default_profile |> Enum.into(HashDict.new)
  end

  def to_user_js profile do
    Enum.map(profile, fn({k,v}) -> "user_pref(\"#{k}\", #{quote_string(v)});" end)
    |> Enum.join("\n")
  end

  def set_port(profile, port) when is_number(port) and port > 0 do
    HashDict.put profile, Keyword.get(@webdriver_prefs, :port), port
  end

  def set_port(profile, _port) do
    profile
  end

  def write_profile profile, directory do
    file_path = Path.join(directory, "user.js")
    :ok = File.write(file_path, to_user_js(profile))
    file_path
  end

  def install_extension destination do
    source = Path.join [__DIR__,"..","..","..","plugins","firefox","webdriver.xpi"]
    install_extension destination, source
  end

  def install_extension destination, source do
    if !File.regular?(source) do
      IO.puts """
      =====================================================

      Webdriver plugin for firefox not found at:
        #{source}
      Run `mix webdriver.firefox.install` to install it.

      =====================================================
      """
      raise RuntimeError, "Webdriver plugin for firefox not found at:\n#{source}.\nRun `mix webdriver.firefox.install` to install it."
    end
    destination = Path.join [destination,"extensions","fxdriver@googlecode.com"]
    File.mkdir_p destination
    { :ok, _ } = :zip.unzip String.to_char_list(source), [{:cwd, String.to_char_list(destination)}]
  end

  def make_temp_directory do
    dir = Path.join(System.tmp_dir, "webdriver-firefox-profile#{random_extension}")
    :ok = File.mkdir_p dir
    dir
  end

  # Generate a filename safe random string.
  defp random_extension do
    Regex.replace(~r/[=\/+]/, :base64.encode(:crypto.rand_bytes(8)), "")
    |> String.downcase
  end

  defp quote_string(v) when is_binary v do
      "\"#{v}\""
  end

  defp quote_string(v) when is_boolean(v) or is_number(v)do
    v
  end
end
