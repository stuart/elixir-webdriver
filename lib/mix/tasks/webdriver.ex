defmodule Mix.Tasks.Webdriver do
  defmodule Firefox do
    use Mix.Task
    def run(_) do
      Mix.shell.info "Downloading the Firefox Webdriver plugin."
      
    end
  end
end
