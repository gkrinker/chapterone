#!/bin/bash

# Stop on errors
set -e

echo "🧹 Cleaning build artifacts..."
rm -rf ~/Library/Developer/Xcode/DerivedData/ChapterOne-*
rm -rf build
rm -rf Pods
rm -rf Podfile.lock

echo "📦 Installing pods..."
pod install

echo "✅ Done! Now try opening ChapterOne.xcworkspace and building"
echo "If you still encounter issues, run this from Xcode menu: Product > Clean Build Folder"
echo "Then try building again." 