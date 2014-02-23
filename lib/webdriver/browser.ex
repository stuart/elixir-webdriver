defmodule WebDriver.Browser do
  @moduledoc """
    This is the basic skeleton for a Browser port to control a browser.
    Implementations will need to use this and then implement the other required
    functions.
  """
  defmacro __using__(_opts) do
    quote do
      def start_link config, sup do
        { :ok, _pid } = :gen_server.start_link {:local, config.name}, __MODULE__,
                                                __MODULE__.State.new(supervisor: sup), [timeout: 30000]
      end

      def init state do
        {:ok, http_port} = WebDriver.PortFinder.select_port
        state = set_root_url state
        state = do_init state

        Process.flag :trap_exit, true
        port = Port.open { :spawn_executable, program_name(state) },
                          [{ :args, arguments(state) }, :exit_status]

        {:ok, state} = wait_for_start state
        send self(), { :start_session_supervisor, state.supervisor }
        { :ok, state.port(port), :hibernate }
      end

      def handle_call {:start_session, session_name}, _sender, state do
        {:ok, pid} = :supervisor.start_child state.session_supervisor, [session_name]
        {:reply, {:ok, pid}, state.sessions([session_name | state.sessions])}
      end

      def handle_call :sessions, _sender, state do
        {:reply, {:ok, state.sessions}, state}
      end

      def handle_cast(:stop, state) do
        {:stop, :normal, state}
      end

      def handle_info {:start_session_supervisor, sup}, state do
        config = WebDriver.Session.State.new(root_url: state.root_url, browser: self)
        spec = Supervisor.Behaviour.worker(WebDriver.SessionSup,[config],[restart: :temporary])
        {:ok, pid} = :supervisor.start_child sup, spec
        {:noreply, state.session_supervisor(pid)}
      end

      def handle_info {:EXIT, _port, reason}, state do
        { :stop, { :browser_terminated, reason }, state }
      end

      def handle_info({_port, {:data, info}}, state) do
        case :application.get_env(:debug_browser) do
          {:ok, true} ->
             :error_logger.info_msg "#{__MODULE__}: #{info}"
          _ ->
        end
        { :noreply, state }
      end

      def handle_info {_port ,{:exit_status, status}}, state do
        { :stop, { :browser_terminated, status }, state }
      end

      def terminate {:browser_terminated, _reason}, state do
        browser_terminated state
      end

      def terminate _reason, state do
        normal_termination state
      end
    end
  end
end
