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
REPO="yog27ray/logger4node"
TAG="$VERSION"
RELEASE_NAME="Release $VERSION"
RELEASE_BODY=""

# Ensure gh is installed
if ! command -v gh &> /dev/null
then
    echo "GitHub CLI (gh) could not be found. Please install it from https://cli.github.com/"
    exit 1
fi

# Ensure you are authenticated
if ! gh auth status &> /dev/null
then
    echo "You are not authenticated. Please run 'gh auth login' to login to GitHub."
    exit 1
fi
git tag -a "$TAG" -m "$RELEASE_NAME"
git push release "$TAG"
gh release create "$TAG" --title "$RELEASE_NAME" --notes "$RELEASE_BODY"

sed -i '' 's/"name": "logger4node"/"name": "@yog27ray\/logger4node"/g' package.json
sed -i '' 's/"name": "logger4node"/"name": "@yog27ray\/logger4node"/g' package-lock.json
npm publish --registry=https://npm.pkg.github.com/  --access=public
echo "Release $RELEASE_NAME created successfully!"
