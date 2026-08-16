# Cosmos App Launcher Guide

## Quick Start

### Windows (PowerShell)
```powershell
# Clean launch with default settings (no crashes/failures)
.\launch.ps1

# Launch with 10% crash probability
.\launch.ps1 -Mode development -CrashProb 0.1 -FailureProb 0 -MaxFailures 5

# Launch with 5% failure probability, max 3 consecutive failures
.\launch.ps1 -Mode development -CrashProb 0 -FailureProb 0.05 -MaxFailures 3
```

### Linux / Git Bash
```bash
# Clean launch with default settings
./launch.sh

# Launch with 10% crash probability
./launch.sh development 0.1 0 5

# Launch with 5% failure probability, max 3 consecutive failures
./launch.sh development 0 0.05 3
```

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| Mode | string | development | - | Environment (development/production) |
| CrashProb | float | 0 | 0-1 | Probability API will crash (0.1 = 10%) |
| FailureProb | float | 0 | 0-1 | Probability request fails (0.05 = 5%) |
| MaxFailures | int | 5 | 1+ | Max consecutive failures before recovery |

## What the Launcher Does

1. **Stops all running containers** - `docker compose down --remove-orphans`
2. **Cleans up dangling images** - Removes orphaned build layers
3. **Pulls latest images** - `--pull always` ensures fresh builds
4. **Sets environment variables** - Configures crash/failure probabilities
5. **Starts all services** - API, Frontend, and optional Nginx

## Endpoints

### Health & Config
- `GET /api/health` - API status + failure metrics
- `GET /api/config` - Current crash/failure configuration

### Cosmic Data
- `GET /api/transits` - All planetary transits
- `GET /api/transits/:planet` - Single transit (e.g., `/api/transits/Mercury`)
- `GET /api/tarot` - All tarot cards
- `GET /api/tarot/draw` - Random tarot card
- `GET /api/events` - Astrological events
- `GET /api/bomb` - Random "true bomb" wisdom

## Testing Crash/Failure Behavior

### Low Stress (Safe Testing)
```powershell
.\launch.ps1 -CrashProb 0.05 -FailureProb 0.05 -MaxFailures 10
```
Crash: 5% chance after each request | Failure: 5% chance per request

### Medium Stress (Integration Testing)
```powershell
.\launch.ps1 -CrashProb 0.2 -FailureProb 0.15 -MaxFailures 5
```
Crash: 20% chance | Failure: 15% chance (capped at 5 consecutive)

### High Stress (Resilience Testing)
```powershell
.\launch.ps1 -CrashProb 0.5 -FailureProb 0.3 -MaxFailures 3
```
Crash: 50% chance | Failure: 30% chance (tight limit = rapid recovery)

## Services

| Service | Port | URL |
|---------|------|-----|
| API | 5000 | http://localhost:5000 |
| Frontend | 5173 | http://localhost:5173 |
| Nginx | 80/443 | http://localhost |

## Stopping Services

Press `Ctrl+C` in the terminal running the launcher, or in another terminal:
```bash
docker compose down
```

## Debugging

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f frontend

# Recent logs only
docker compose logs --tail 50
```

### Check container status
```bash
docker compose ps
```

### Inspect API config
```bash
curl http://localhost:5000/api/config
```

## Environment Variables (Manual Override)

If you prefer to set env vars manually before launching:
```bash
export CRASH_PROBABILITY=0.1
export FAILURE_PROBABILITY=0.05
export MAX_FAILURES=5
docker compose up --pull always
```
