#!/usr/bin/env bash
cd dist
git reset --hard
git checkout dist
rm -r *
cd ..
git checkout master
git pull
node_modules/eslint/bin/eslint.js  --ext .ts src
npm i
VERSION=$(npm version patch)
npm run build
cd dist
git add *
git commit -m "$VERSION"
git push release dist
npm publish
