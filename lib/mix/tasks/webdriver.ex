defmodule Mix.Tasks.Webdriver do
  defmodule Firefox.Install do
    use Mix.Task

    @download_url "https://raw.githubusercontent.com/stuart/elixir-webdriver/feature/load_firefox_plugin_task/plugins/firefox/webdriver.xpi"

    def run(_) do
      Mix.shell.info "Downloading the Firefox Webdriver plugin."
      File.mkdir_p Path.dirname(plugin_path)
      {data, _} = System.cmd "curl",[@download_url]
      :ok = File.write plugin_path, data
      Mix.shell.info "Done."
      :ok
    end

    defp plugin_path
      Path.join [__DIR__, "..", "..", "..", "plugins", "firefox","webdriver.xpi"]
    end
  end
end
