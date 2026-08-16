# Cosmos App Clean Launch Script
# Stops all running containers, cleans up, and starts fresh

param(
    [string]$Mode = "development",
    [float]$CrashProb = 0,
    [float]$FailureProb = 0,
    [int]$MaxFailures = 5
)

Write-Host "🌌 Cosmos App Launcher" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Validate probabilities
if ($CrashProb -lt 0 -or $CrashProb -gt 1) {
    Write-Host "❌ CrashProb must be 0-1" -ForegroundColor Red
    exit 1
}
if ($FailureProb -lt 0 -or $FailureProb -gt 1) {
    Write-Host "❌ FailureProb must be 0-1" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Configuration:" -ForegroundColor Green
Write-Host "   Mode: $Mode"
Write-Host "   Crash Probability: $CrashProb"
Write-Host "   Failure Probability: $FailureProb"
Write-Host "   Max Consecutive Failures: $MaxFailures"
Write-Host ""

# Stop and remove existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker compose down --remove-orphans 2>$null

# Clean up unused images (optional)
Write-Host "🧹 Cleaning up unused images..." -ForegroundColor Yellow
docker image prune -f --filter "dangling=true" 2>$null

Write-Host ""
Write-Host "🚀 Starting Cosmos App..." -ForegroundColor Green
Write-Host ""

# Set environment variables and launch
$env:CRASH_PROBABILITY = $CrashProb
$env:FAILURE_PROBABILITY = $FailureProb
$env:MAX_FAILURES = $MaxFailures
$env:NODE_ENV = $Mode

docker compose up --pull always

Write-Host ""
Write-Host "🌌 Cosmos services are running:" -ForegroundColor Cyan
Write-Host "   API: http://localhost:5000"
Write-Host "   API Health: http://localhost:5000/api/health"
Write-Host "   API Config: http://localhost:5000/api/config"
Write-Host "   Frontend: http://localhost:5173"
Write-Host "   Nginx: http://localhost"
Write-Host ""
Write-Host "Press Ctrl+C to stop services" -ForegroundColor Yellow
