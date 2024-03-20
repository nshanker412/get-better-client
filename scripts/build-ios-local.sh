#!/bin/bash

# Prevent script from continuing if any commands fail
set -e


if which sentry-cli >/dev/null; then
export SENTRY_ORG=benson-e4
export SENTRY_PROJECT=get-better
export SENTRY_AUTH_TOKEN=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
ERROR=$(sentry-cli debug-files upload --include-sources "$DWARF_DSYM_FOLDER_PATH" --force-foreground 2>&1 >/dev/null)
if [ ! $? -eq 0 ]; then
echo "error: sentry-cli - $ERROR"
fi
else
echo "error: sentry-cli not installed, download from https://github.com/getsentry/sentry-cli/releases"
fi

# Get the full path of the current working directory
BASE_DIR=$(pwd)

# Define the working directory and archive directory paths with full path
WORKING_DIR="$BASE_DIR/eas-build-local/build-tmp"
ARCHIVE_DIR="$BASE_DIR/eas-build-local/archive"

# Set environment variables for local EAS build
export EAS_LOCAL_BUILD_SKIP_CLEANUP=1
export EAS_LOCAL_BUILD_WORKINGDIR="$WORKING_DIR"

# Clear the Archive directory before proceeding
echo "Clearing the Archive directory..."
rm -rf "$ARCHIVE_DIR/*"
echo "Archive directory cleared."

# Check if the working directory exists
if [ -d "$WORKING_DIR" ]; then
  echo "Found old build files. Archiving..."
  
  # Ensure the archive directory exists
  mkdir -p "$ARCHIVE_DIR"

  # Create a timestamp
  TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
  ARCHIVE_NAME="build-tmp_$TIMESTAMP.tar.gz"

  # Compress and move the working directory to the archive directory
  tar -czf "$ARCHIVE_DIR/$ARCHIVE_NAME" -C "$WORKING_DIR" .
  echo "Archiving completed. New archive name: $ARCHIVE_NAME"

  # Remove the original working directory after archiving
  rm -rf "$WORKING_DIR"
  echo "Old build files removed."
else
  echo "No old build files found. Proceeding..."
fi

# Ensure the working directory exists for the build process
mkdir -p "$WORKING_DIR"
echo "Prepared new build directory: $WORKING_DIR"

# Run the EAS build command for iOS
eas build -p ios --profile production --local --clear-cache

# Optional: Add any post-build commands here