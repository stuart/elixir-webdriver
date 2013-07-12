Code.require_file "../../test_helper.exs", __DIR__


defmodule WebDriver.PhantomJS.PortTest do
  use ExUnit.Case
  alias WebDriver.PhantomJS

  teardown_all do
    # Make sure we get rid of any stray processes.
    System.cmd "killall phantomjs"
    :ok
  end

  test "init starts phantomjs on the port" do
   { :ok, state, :hibernate } = PhantomJS.Port.init PhantomJS.Port.State[program_name: :phantomjs]
  	info = HashDict.new(Port.info(state.port))
  	name = HashDict.get info, :name
  	assert name == :os.find_executable(name)
  end

  test "init sets the trap_exit flag" do
  	refute HashDict.get(process_info, :trap_exit)
  	PhantomJS.Port.init PhantomJS.Port.State[program_name: :phantomjs]
  	assert HashDict.get(process_info, :trap_exit)
  end

  test "handle info with an Exit message" do
  	assert { :stop, { :browser_terminated, "reason" }, { :port, "port" } } =
  	       PhantomJS.Port.handle_info({:EXIT, "port", "reason"}, {:port, "port"})
  end

  test "terminate when phantomjs has died does not close the port" do
    { :ok, _state, :hibernate } = PhantomJS.Port.init PhantomJS.Port.State[program_name: :phantomjs]
    assert :ok = PhantomJS.Port.terminate {:browser_terminated, "reason"}, {}
  end

  def process_info do
  	HashDict.new Process.info(self)
  end
end
