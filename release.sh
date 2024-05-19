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
npm run build
VERSION=$(npm version patch)
cd dist
git add *
git commit -m "$VERSION"
git push release dist
npm publish
