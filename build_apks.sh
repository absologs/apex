#!/bin/bash
export ANDROID_HOME=/opt/android-sdk
export NDK_HOME=/opt/android-sdk/ndk/25.2.9519653
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

echo "yes" | sdkmanager --licenses

echo "Building APEX UI (Nodo 1)..."
cd /root/apex/apex-ui
cargo tauri android init
cargo tauri android build

echo "Building Marketplace UI (Nodo 2)..."
cd /root/apex/marketplace-ui/src-tauri
cargo tauri android init
cargo tauri android build

echo "Compilation process finished."
