#!/bin/bash
# Script pentru publish + release automat
# Usage: ./publish.sh <version>

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: ./publish.sh <version>"
  echo "Example: ./publish.sh 0.2.1"
  exit 1
fi

echo "🐸 Publishing @gratiaos/gratia@$VERSION..."

# 1. Update version în package.json
cd /Users/razvan/Sites/gratia
npm version $VERSION --no-git-tag-version

# 2. Publish la npm
echo "📦 Publishing to npm..."
npm publish

# 3. Commit și push
git add package.json
git commit -m "chore: bump version to $VERSION"
git push

# 4. Create GitHub Release
echo "🏷️  Creating GitHub release..."
git tag -a "v$VERSION" -m "Release v$VERSION"
git push origin "v$VERSION"

echo "✅ Publish complet! GitHub Action va rebuild-ui gratiaos.dev automat."
echo "🌐 Verifică: https://gratiaos.dev"
