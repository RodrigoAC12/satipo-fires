@echo off
echo === INICIANDO SISTEMA ===
start cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"
start cmd /k "cd frontend && npm run dev"
echo Servidores iniciando...
timeout /t 5
start http://localhost:5173