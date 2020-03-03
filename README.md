# Web Driver for Elixir
[![Build Status](https://travis-ci.org/stuart/elixir-webdriver.png?branch=master)](https://travis-ci.org/stuart/elixir-webdriver)

[Current Version 0.8.2](https://github.com/stuart/elixir-webdriver/tree/0.7.0)

This is an implementation of the WebDriver protocol client.
It currently supports PhantomJS, FireFox, ChromeDriver and remote webdriver
servers (e.g. Selenium).

Most of the basic functionality of the WebDriver JSON wire protocol works with
all three browsers. Notable missing elements are touch events, local storage and
session storage.

## Installation

This library has been set up as a Mix application, so just
add this to mix.exs deps:

```elixir
{:webdriver, github: "stuart/elixir-webdriver"}
```

or if you do Hex.pm:

```elixir
{:webdriver, "~>0.8.0"}
```

and make sure the application block of mix.exs includes:
    applications: [ :webdriver ]
or call
    :application.start :webdriver
in your code.

Generate documentation with `mix docs`.
Run the tests with `mix test`.
The tests will check if PhantomJS, ChromeDriver and Firefox are installed and
only run the appropriate ones. It uses the
`:os.find_executable` function to find the appropriate paths so check
that if a browser is not found.

## Documentation

http://hexdocs.pm/webdriver

## Usage

When the application starts it will fire up a supervision tree for
the browsers to be run under.

You can start a browser instance with `WebDriver.start_browser config`
where `config` is a WebDriver.Config record.

Currently the config is very simple it just consists of two or three fields:
 * :browser - the type of browser to open, one of
      - :phantomjs
      - :firefox
      - :chrome
      - :remote
 * :name - an atom to refer to the browser in later calls.
 * :root_url - Only used for with the :remote browser. This is the base url for
 web driver calls.

You can then start up a session on the browser with

```elixir
WebDriver.start_session browser_name, session_name
```

Once the session is started you can do commands on it, see the edoc documentation
for more on specific commands.

An example session is shown here:

```Elixir
    iex(1)> config = %WebDriver.Config{name: :browser}
    %WebDriver.Config{browser: :phantomjs, name: :browser, root_url: ""}
    iex(2)> WebDriver.start_browser config
    {:ok, #PID<0.302.0>}
    iex(3)> WebDriver.start_session :browser, :session
    {:ok, #PID<0.306.0>}
    iex(4)> WebDriver.Session.url :session
    "about:blank"
    iex(5)> WebDriver.Session.url :session, "http://elixir-lang.org"
    {:ok,
     %WebDriver.Protocol.Response{request: %WebDriver.Protocol.Request{body: "{\"url\":\"http://elixir-lang.org\"}",
       headers: ["Content-Type": "application/json;charset=UTF-8",
        "Content-Length": 32], method: :POST,
       url: "http://localhost:56946/wd/hub/session/4dc12b20-2121-11e4-ace2-119365bfea27/url"},
      session_id: "4dc12b20-2121-11e4-ace2-119365bfea27", status: 0, value: [{}]}}
    iex(6)> element =  WebDriver.Session.element :session, :css, ".news"
    %WebDriver.Element{id: ":wdc:1407738793120", session: :session}
    iex(7)> WebDriver.Element.text element
    "News: Elixir v0.15.0 released"
    iex(8)> WebDriver.stop_browser :browser
    :ok
```

## Requirements

You will need one or more of the following installed in the usual place
for your OS:

* PhantomJS version 1.9.7: http://phantomjs.org/
Note that PhantomJS version 2.0 has issues with GhostDriver and may not work.
See: https://github.com/detro/ghostdriver/issues/394

* FireFox: Get a recent version, please... https://www.mozilla.org/en-US/firefox/new/
If you installed webdriver with hex you will not have the firefox plugin.
Run `mix webdriver.firefox.install` to get the plugin.

* ChromeDriver version 2.9 or later and Chrome (or Chromium): http://chromedriver.storage.googleapis.com/index.html

* Remote Driver: This driver does not manage starting and stopping the browser for you. To
use this you must have a webdriver server such as Selenium or PhantomJS running at a known url.

Currently I have only tested extensively on OSX, and Ubuntu Linux.
It should work on most UNIX like platforms. There is some rudimentary
Windows support code in here, but I'm pretty sure that it won't work.

## Support
Please report any issues you have with using this library in the Github
issues for the project:
  https://github.com/stuart/elixir-webdriver/issues


## Changelog
* 2015-12-12
    - Version 0.8.1
    - Support for Elixir 1.1.1
    - Support for Erlang OTP 18
    - Fix Firefox and Chrome issues with new versions of these browsers.

* 2014-10-23
    - Version 0.7.0
    - Added Alert handling

* 2014-10-21
    - Version 0.6.1
    - Update deps to new syntax

* 2014-08-18
    - Version 0.6.0
    - Changed JSON library to Jazz
    - Converted responses to be maps rather than Keywords
    - Use hex.pm dependencies as much as possible
    - Stability fixes to tests
    - Documentation updates and cleanup.

* 2014-08-17
    - Version 0.5.2
    - Moved webdriver.xpi out of hex accessed path
    - Added mix task to get the FireFox plugin.

* 2014-08-11
    - Version 0.5.0
    - Fixed Firefox Mouse
    - Updated to support Elixir v0.15.0

* 2014-02-24
    - Added Remote driver
    - Added listing of browsers
    - Added listing of sessions
    - Added stop_all_browsers function

* 2014-02-14
    - Update to version 0.3.0
    - Added non-text key support
    - Added ChromeDriver support

* 2014-02-09
    - Update to version 0.2.2.
    - Fixes Firefox issues with window sizing.
    - Added mouse support for PhantomJS.

* 2014-02-08
    - Update to version 0.2.0
    - Supports Elixir 0.12.3
    - Latest ibrowse, which fixes a phantomjs issue.
