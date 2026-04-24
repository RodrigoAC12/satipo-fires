@echo off
echo === INICIANDO SISTEMA SATIPO-IA ===

:: Iniciar Backend
:: Usamos app.main:app porque tu main.py ahora vive dentro de la carpeta "app"
start cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

:: Iniciar Frontend
start cmd /k "cd frontend && npm run dev"

echo Servidores iniciando...
echo Esperando a que React este listo...
timeout /t 8

:: Abrir el navegador automaticamente
start http://localhost:5173