# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Development stage
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
# Copy already-compiled dist from build stage to avoid needing src in dev
COPY --from=build /app/dist ./dist
# Create src directory for bind mount
RUN mkdir -p src
EXPOSE 5000
CMD ["npm", "run", "dev"]

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
EXPOSE 5000
CMD ["npm", "run", "start"]
