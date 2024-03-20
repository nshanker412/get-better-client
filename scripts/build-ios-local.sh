#!/bin/bash

# Prevent script from continuing if any commands fail
set -e

# Set environment variables for local EAS build
export EAS_LOCAL_BUILD_SKIP_CLEANUP=1
export EAS_LOCAL_BUILD_WORKINGDIR="./eas-build-local/build-tmp"

# Run the EAS build command for iOS
eas build -p ios --profile production --local --clear-cache

# Optional: Add any post-build commands here