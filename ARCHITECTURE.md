# Cosmos App - Multi-layered Architecture

## Project Structure

```
cosmos-app/
├── backend/                 # Node.js + Express API layer
│   ├── src/
│   │   └── server.ts       # Main API server
│   ├── Dockerfile          # Multi-stage build
│   ├── package.json
│   └── tsconfig.json
├── cosmos-app/             # Solid.js + Vite frontend
│   ├── src/
│   │   ├── components/     # Modular components
│   │   ├── services/       # API service layer
│   │   └── App.tsx
│   ├── Dockerfile          # Multi-stage build
│   ├── vite.config.ts
│   └── package.json
├── nginx/                  # Reverse proxy config
│   └── nginx.conf
└── docker-compose.yml      # Orchestration

```

## Architecture Layers

### 1. **Data Layer (Backend API)**
- Express server on port 5000
- RESTful endpoints for transits, tarot, events, bombs
- TypeScript for type safety
- Modular API design ready for database integration

### 2. **Service Layer (Frontend Services)**
- `src/services/api.ts` - All API communication
- Environment-based configuration
- Error handling and health checks

### 3. **Component Layer (Frontend UI)**
- `TransitPanel.tsx` - Planetary data display
- `TarotPanel.tsx` - Card selection and drawing
- `CosmicDispatch.tsx` - Event management
- Modular, reusable, testable components

### 4. **Network Layer (Docker Compose)**
- `api` service: Backend API (development mode with hot reload)
- `frontend` service: Vite dev server with HMR
- `nginx` service: Production reverse proxy (optional)
- Shared network for inter-service communication

## Running the Multi-layer Stack

### Development Mode
```bash
cd ~/Desktop/cosmos-app
docker compose up --pull always
```

Services available:
- Frontend: http://localhost:5173
- API: http://localhost:5000/api
- API Health: http://localhost:5000/api/health

### Production Build
```bash
docker compose --profile production build
docker compose --profile production up
```

Nginx proxies everything on port 80.

## Environment Configuration

Create `.env` files for each service:

**backend/.env**
```
PORT=5000
NODE_ENV=production
```

**cosmos-app/.env** (Vite config)
```
VITE_API_URL=http://localhost:5000/api
```

## Next Steps

1. **Database Integration**: Replace in-memory data with PostgreSQL
2. **Authentication**: Add JWT or OAuth2 layer
3. **Caching**: Redis for session and data caching
4. **Monitoring**: Add Prometheus + Grafana
5. **Testing**: Jest for backend, Vitest for frontend
6. **CI/CD**: GitHub Actions for automated builds and deployments

## Benefits of This Architecture

✅ **Separation of Concerns**: Frontend, backend, routing independent
✅ **Scalability**: Easy to add new microservices
✅ **Development**: Hot reload for both frontend and backend
✅ **Deployment**: Multi-stage builds optimize image sizes
✅ **Flexibility**: Swap components without breaking the system
