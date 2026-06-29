#!/bin/bash
set -e

echo "Installing system dependencies..."
apt-get update
apt-get install -y openjdk-17-jdk wget unzip curl

echo "Installing rust targets..."
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android

echo "Installing cargo-tauri..."
cargo install tauri-cli --version "^2.0.0" --locked

echo "Setting up Android SDK..."
mkdir -p /opt/android-sdk/cmdline-tools
cd /opt/android-sdk/cmdline-tools
wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip
unzip -q cmdline-tools.zip
rm cmdline-tools.zip
mv cmdline-tools latest

export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

echo "yes" | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "ndk;25.2.9519653"

export NDK_HOME=/opt/android-sdk/ndk/25.2.9519653

echo "Android setup complete!"
