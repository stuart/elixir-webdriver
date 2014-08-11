# Web Driver for Elixir
[![Build Status](https://travis-ci.org/stuart/elixir-webdriver.png?branch=master)](https://travis-ci.org/stuart/elixir-webdriver)

[Current Version 0.4.1](https://github.com/stuart/elixir-webdriver/tree/0.4.1)

This is an implementation of the WebDriver protocol client.
It currently supports PhantomJS, FireFox, ChromeDriver and remote webdriver
servers (e.g. Selenium).

Most of the basic functionality of the WebDriver JSON wire protocol works with
all three browsers. Notable missing elements are touch events, local storage and
session storage.

## Installation

This library has been set up as a Mix application, so just
add this to mix.exs dep block:

```{:webdriver, github: "stuart/elixir-webdriver"} ```

and make sure the application block of mix.exs includes:
``` applications: [ :webdriver ] ```
or call
``` :application.start :webdriver ``` in your code.

Generate documentation with ```mix docs```.
Run the tests with ```mix test```.
The tests will check if PhantomJS, ChromeDriver and Firefox are installed and
only run the appropriate ones. It uses
```:os.find_executable``` to find the appropriate paths so check that if a
browser is not found.

##[Documentation](http://stuart.github.io/elixir-webdriver/)

## Usage

When the application starts it will fire up a supervision tree for
the browsers to be run under.

You can start a browser instance with ```WebDriver.start_browser config```
where ```config``` is a WebDriver.Config record.

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
```WebDriver.start_session browser_name, session_name```

Once the session is started you can do commands on it, see the edoc documentation
for more on specific commands.

An example session is shown here:

```Elixir

  iex(1)> config = %WebDriver.Config{name: :browser}
  WebDriver.Config[browser: :phantomjs, name: :browser]
  iex(2)> WebDriver.start_browser config
  {:ok,#PID<0.138.0>}
  ex(3)> WebDriver.start_session :browser, :session
  {:ok,#PID<0.141.0>}

  iex(4)> WebDriver.Session.url :session
  "about:blank"
  iex(5)> WebDriver.Session.url :session, "http://elixir-lang.org"
  {:ok,WebDriver.Protocol.Response[session_id: "d39b91d0-eabe-11e2-9e84-9dbe69660f4a", status: 0, value: [{}], request: WebDriver.Protocol.Request[method: :POST, url: "http://localhost:57202/wd/hub/session/d39b91d0-eabe-11e2-9e84-9dbe69660f4a/url", headers: ["Content-Type": "application/json;charset=UTF-8", "Content-Length": 32], body: "{\"url\":\"http://elixir-lang.org\"}"]]}

  iex(6)> element =  WebDriver.Session.element :session, :css, ".news"
  WebDriver.Element.Reference[id: ":wdc:1373611746692", session: :session]
  iex(8)> WebDriver.Element.text element
  "News: Elixir v0.9.0 released"
  iex(9)> WebDriver.stop_browser :browser
  :ok

```

## Requirements

You will need one or more of the following installed in the usual place
for your OS:

* PhantomJS version 1.9.7 or later: http://phantomjs.org/
* FireFox: Get a recent version, please... https://www.mozilla.org/en-US/firefox/new/
* ChromeDriver version 2.9 or later and Chrome (or Chromium): http://chromedriver.storage.googleapis.com/index.html
* Remote Driver: This driver does not manage starting and stopping the browser for you. To
use this you must have a webdriver server such as Selenium or PhantomJS running at a known url.

Currently I have only tested extensively on OSX, and Ubuntu Linux.
It should work on most UNIX like platforms. There is some rudimentary
Windows support code in here, but I'm pretty sure that it won't work.

## Changelog
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
