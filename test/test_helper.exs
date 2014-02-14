# Exclude tests where the appropriate browser is not installed.
ExUnit.configure exclude: [
  chrome: !:os.find_executable('chromedriver'),
  phantomjs: !:os.find_executable('phantomjs'),
  firefox: !WebDriver.Firefox.Port.installed?
]
ExUnit.start

