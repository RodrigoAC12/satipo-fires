@echo off
echo =========================================
echo 1. Levantando Base de Datos (Docker)...
echo =========================================
docker-compose up -d

echo =========================================
echo 2. Iniciando Backend (FastAPI)...
echo =========================================
start cmd /k "cd backend && call venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo =========================================
echo 3. Iniciando Frontend (React)...
echo =========================================
start cmd /k "cd frontend && npm run dev"

echo Todos los servicios han sido lanzados en ventanas separadas.
pause