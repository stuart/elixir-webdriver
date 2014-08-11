Code.require_file "../../test_helper.exs", __DIR__

defmodule FirefoxProfileTest do
  use ExUnit.Case

  alias WebDriver.Firefox.Profile

  setup do
    {:ok, [tempdir: Profile.make_temp_directory]}
  end

  teardown meta do
    File.rm_rf meta.tempdir
    {:ok, meta}
  end

  test "set port sets the port key correctly" do
    profile = Profile.set_port Profile.default_profile, 6666
    assert 6666 == HashDict.get(profile, "webdriver_firefox_port")
  end

  test "cannot set the port to an invalid value" do
    profile = Profile.set_port Profile.default_profile, -2
    assert HashDict.get(profile, "webdriver_firefox_port") == nil
    profile = Profile.set_port Profile.default_profile, "6666"
    assert HashDict.get(profile, "webdriver_firefox_port") == nil
  end

  test "to_user_js is the correct format" do
    assert Regex.match? ~r/^(user_pref\("[^"]+",[^)]+\);\n?)+$/, Profile.to_user_js Profile.default_profile
  end

  test "write_profile writes the profile to a tempfile", meta do
    assert File.exists?(Profile.write_profile(Profile.default_profile, meta[:tempdir]))
  end

  test "install extension unzips the webdrive.xpi to the directory", meta do
    Profile.install_extension meta[:tempdir]
    assert File.exists?(Path.join([meta[:tempdir],
       "extensions","fxdriver@googlecode.com","install.rdf"]))
  end
end
