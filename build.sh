#!/bin/sh

readonly DEPLOY="deploy"
readonly BRANCH="gh-pages"

if [ ! -d "./${DEPLOY}" ]; then
    mkdir "./${DEPLOY}"
fi

rm -rf "./${DEPLOY}/*"
mkdir "./${DEPLOY}/css/"
mkdir "./${DEPLOY}/js/"

cp -rfv ./css/* "./${DEPLOY}/css/"
cp -rfv ./js/* "./${DEPLOY}/js/"
cp -fv ./index.html "./${DEPLOY}/"

lessc -x ./css/timer.css > "./${DEPLOY}/css/timer.css"
uglifyjs2 -v ./js/timer.js -o "./${DEPLOY}/js/timer.js"
echo "" >> "./${DEPLOY}/js/timer.js"

echo "\n""Checkout ${BRANCH}""\n"
git checkout ${BRANCH}

if [ ! -d ./css/ ]; then
    mkdir ./css/
fi

if [ ! -d ./js/ ]; then
    mkdir ./js/
fi

cp -rfv "./${DEPLOY}/css/"* ./css/
cp -rfv "./${DEPLOY}/js/"* ./js/
cp -fv "./${DEPLOY}/index.html" ./index.html

git add .
echo "\n""Ready to commit""\n"
