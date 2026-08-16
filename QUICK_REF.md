# 🌌 Cosmos App - Quick Reference

## Clean Launch (One Command)

### Windows PowerShell
```powershell
.\launch.ps1
```

### Linux / Git Bash
```bash
./launch.sh
```

---

## Launch with Crash/Failure Testing

### Default (0% crash, 0% failure)
```powershell
.\launch.ps1
```

### 10% Crash Probability
```powershell
.\launch.ps1 -CrashProb 0.1
```

### 5% Failure Probability
```powershell
.\launch.ps1 -FailureProb 0.05 -MaxFailures 5
```

### Full Test (10% crash, 15% failure, max 3 consecutive)
```powershell
.\launch.ps1 -CrashProb 0.1 -FailureProb 0.15 -MaxFailures 3
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health status + failure metrics |
| `/api/config` | GET | Current crash/failure configuration |
| `/api/transits` | GET | All planetary transits |
| `/api/transits/:planet` | GET | Single planet (Mercury, Venus, Earth, Sun, Moon, Saturn) |
| `/api/tarot` | GET | All tarot cards |
| `/api/tarot/draw` | GET | Random tarot card |
| `/api/events` | GET | Astrological events |
| `/api/bomb` | GET | Random wisdom quote |

---

## Service URLs

- **API**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **Nginx**: http://localhost:80

---

## Commands

### Stop All Services
```bash
docker compose down
```

### View Logs
```bash
docker compose logs -f api
```

### Check Status
```bash
docker compose ps
```

### Check API Config
```bash
curl http://localhost:5000/api/config
```

---

## Parameters

| Parameter | Type | Range | Default |
|-----------|------|-------|---------|
| `CrashProb` | float | 0-1 | 0 |
| `FailureProb` | float | 0-1 | 0 |
| `MaxFailures` | int | 1+ | 5 |

---

## How It Works

**Crash Probability**: Random chance API process exits after each request
- 0.1 = 10% chance to crash
- Once triggered, server waits 2s then terminates

**Failure Probability**: Random chance individual requests fail (503 error)
- 0.05 = 5% chance per request
- Capped at MaxFailures consecutive failures before auto-recovery

**Use Cases**:
- Test client retry logic
- Validate circuit breaker behavior
- Simulate unreliable services
- Integration testing resilience

---

## Debugging

❌ Containers not starting?
```bash
docker compose logs -f
```

❌ Port already in use?
```bash
netstat -ano | findstr :5000
```

❌ Need fresh rebuild?
```bash
docker compose down -v
docker system prune -a
.\launch.ps1
```
