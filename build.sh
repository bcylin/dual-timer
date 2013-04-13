#!/bin/sh

readonly DEPLOY="deploy"

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
