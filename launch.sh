#!/bin/bash

# Cosmos App Clean Launch Script
# Stops all running containers, cleans up, and starts fresh

MODE="${1:-development}"
CRASH_PROB="${2:-0}"
FAILURE_PROB="${3:-0}"
MAX_FAILURES="${4:-5}"

echo "🌌 Cosmos App Launcher"
echo "━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Validate probabilities
if (( $(echo "$CRASH_PROB < 0 || $CRASH_PROB > 1" | bc -l) )); then
    echo "❌ CrashProb must be 0-1"
    exit 1
fi
if (( $(echo "$FAILURE_PROB < 0 || $FAILURE_PROB > 1" | bc -l) )); then
    echo "❌ FailureProb must be 0-1"
    exit 1
fi

echo "📋 Configuration:"
echo "   Mode: $MODE"
echo "   Crash Probability: $CRASH_PROB"
echo "   Failure Probability: $FAILURE_PROB"
echo "   Max Consecutive Failures: $MAX_FAILURES"
echo ""

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker compose down --remove-orphans 2>/dev/null

# Clean up unused images
echo "🧹 Cleaning up unused images..."
docker image prune -f --filter "dangling=true" 2>/dev/null

echo ""
echo "🚀 Starting Cosmos App..."
echo ""

# Launch with env vars
export CRASH_PROBABILITY=$CRASH_PROB
export FAILURE_PROBABILITY=$FAILURE_PROB
export MAX_FAILURES=$MAX_FAILURES
export NODE_ENV=$MODE

docker compose up --pull always

echo ""
echo "🌌 Cosmos services are running:"
echo "   API: http://localhost:5000"
echo "   API Health: http://localhost:5000/api/health"
echo "   API Config: http://localhost:5000/api/config"
echo "   Frontend: http://localhost:5173"
echo "   Nginx: http://localhost"
echo ""
echo "Press Ctrl+C to stop services"
