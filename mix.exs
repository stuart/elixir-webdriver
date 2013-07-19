defmodule WebDriver.Mixfile do
  use Mix.Project

  def project do
    [ app: :webdriver,
      version: "0.0.5",
      source_url: "https://github.com/stuart/elixir-webdriver",
      homepage_url: "http://stuart.github.io/elixir-webdriver",
      env: [
          dev:  [ deps: deps ++ dev_deps  ],
          test: [ deps: deps ++ test_deps ],
          prod: [ deps: deps ]
        ]
    ]
  end

  # Configuration for the OTP application
  def application do
    [
      mod: { WebDriver, []},
      registered: [ :webdriver ],
      applications: [ :httpotion ],
      env: [ debug_browser: false ]
    ]
  end

  # Returns the list of dependencies in the format:
  # { :foobar, "0.1", git: "https://github.com/elixir-lang/foobar.git" }
  defp deps do
    [{:httpotion, "0.1.0", github: "myfreeweb/httpotion"},
     {:jsonex,    "2.0",   github: "marcelog/jsonex", tag: 2.0},
     {:ex_doc,             github: "elixir-lang/ex_doc"},
     ]
  end

  defp test_deps do
    [{:mock,               github: "jjh42/mock"}]
  end

  defp dev_deps do
    [{:mock,               github: "jjh42/mock"}]
  end
end
