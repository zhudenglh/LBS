#!/bin/bash

# Increase file descriptor limit
ulimit -n 65536 2>/dev/null || ulimit -n 10240 2>/dev/null || ulimit -n 4096

# Show current limit
echo "Current file descriptor limit: $(ulimit -n)"

# Start Metro bundler
exec npx react-native start --reset-cache
