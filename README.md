# Web Driver for Elixir

Current Version 0.2.0

This is an implementation of the WebDriver protocol client.
It currently supports PhantomJS for headless browser goodness or
FireFox.

This is a very new project and is not considered to be production
ready as yet. Both Firefox and PhantomJS support is a bit patchy.

## Installation

This library has been set up as a Mix application, so just
add this to mix.exs dep block:

```{:webdriver, github: "stuart/elixir-webdriver"} ```

and make sure the application block of mix.exs includes:
``` applications: [ :webdriver ] ```

generate documentation with ```mix docs```.
run the tests with ```mix test```. The tests currently assume that you have
PhantomJS and Firefox installed in the usual locations. It does use
```:os.find_executable``` to find the appropriate paths.

## Usage

When the application starts it will fire up a supervision tree for
the browsers to be run under.

You can start a browser instance with ```WebDriver.start_browser config```
where ```config``` is a WebDriver.Config record.

Currently the config is very simple it just consists of two fields:
 * :browser - the type of browser to open, either :phantomjs or :firefox
 * :name - an atom to refer to the browser in later calls.

You can then start up a session on the browser with
```WebDriver.start_session browser_name, session_name```

Once the session is started you can do commands on it, see the edoc documentation
for more on specific commands.

An example session is shown here:

```Elixir

  iex(1)> config = WebDriver.Config.new(name: :browser)
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

You will need to have PhantomJS and/or FireFox installed for this to work.
Currently I have only tested extensively on OSX, and Ubuntu Linux.
It should work on most UNIX like platforms. There is some rudimentary
windows support code in here but I'm pretty sure that Firfox won't work.

## Changelog

* 2014-02-08 Update to version 0.2.0 Supports Elixir 0.12.3
             Latest ibrowse, which fixes a phantomjs issue.





