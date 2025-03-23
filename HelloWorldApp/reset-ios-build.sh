#!/bin/bash

# Clean iOS build directories
echo "Cleaning iOS build directories..."
rm -rf ios/build
rm -rf ios/Pods
rm -rf ios/Podfile.lock

# Clean CocoaPods cache
echo "Cleaning CocoaPods cache..."
rm -rf ~/Library/Caches/CocoaPods

# Install pods
echo "Installing pods..."
cd ios && pod install --repo-update

echo "Done! If successful, you can now run 'npx expo run:ios --device'" 