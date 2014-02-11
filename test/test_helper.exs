# Exclude tests where the appropriate browser is not installed.
ExUnit.configure exclude: [
  chrome: !:os.find_executable('chromedriver'),
  phantomjs: !:os.find_executable('phantomjs'),
  firefox: !:os.find_executable('firefox-bin')
]
ExUnit.start

