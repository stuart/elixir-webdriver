# HTTP Server for testing WebDriver
defmodule WebDriver.TestServer do
  @config [ port: 8888,
            server_root:   binary_to_list(Path.absname("../", __DIR__)),
            document_root: binary_to_list(Path.absname("../pages", __DIR__)),
            server_name:   'webdriver_test',
            directory_index: ['index.html']]

  def start do
    :inets.start
    case :inets.start(:httpd, @config) do
     {:ok, pid} -> pid
     {:error, {:already_started, pid}} -> pid
    end
  end

  def stop(pid) do
    :ok = :inets.stop(:httpd, pid)
  end

  def stop() do
    :ok = :inets.stop(:httpd, {{127,0,0,1}, 8888})
  end
end
