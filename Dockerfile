# ==========================================
# Stage 1: Build React Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY frontend/ ./
ENV VITE_API_URL=""
RUN npm run build

# ==========================================
# Stage 2: Python Backend & Production Server
# ==========================================
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend application
COPY backend/ ./backend/

# Copy built frontend assets from Stage 1 into backend/static
COPY --from=frontend-builder /app/frontend/dist ./backend/static

# Environment settings
ENV PORT=8080
ENV DEMO_MODE=true
ENV PYTHONUNBUFFERED=1

WORKDIR /app/backend

EXPOSE 8080

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
