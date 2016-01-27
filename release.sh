if [ $# -eq 0 ]
  then
    echo "No version argument supplied. Usage: release.sh VERSION"
    exit
fi

VERSION=$1
CURRENT_VERSION=`cat VERSION`
echo Updating version from ${CURRENT_VERSION} to ${VERSION}

sed -i.bak s/"Current Version ${CURRENT_VERSION}"/"Current Version ${VERSION}"/ README.md
sed -i.bak s/"version: \"${CURRENT_VERSION}\""/"version: \"${VERSION}\""/ mix.exs

git add README.md mix.exs
git commit -m "Release Version ${VERSION}"
git tag ${VERSION}
git push
git push --tags

mix hex.publish
mix hex.docs
