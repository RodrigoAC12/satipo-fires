@echo off
echo =========================================
echo INICIANDO PLATAFORMA DE RIESGO SATIPO
echo =========================================

echo Levantando Base de Datos Geoespacial (Docker)...
docker-compose up -d

echo Iniciando Backend Hexagonal (FastAPI)...
start cmd /k "cd backend && call venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo Iniciando Frontend (React)...
start cmd /k "cd frontend && npm run dev"

echo =========================================
echo Servicios iniciados en terminales separadas.
echo Backend Swagger: http://127.0.0.1:8000/docs
echo Frontend Web: http://localhost:5173
echo =========================================
pause