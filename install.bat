@echo off
echo =========================================
echo 1. Instalando dependencias del Backend...
echo =========================================
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo =========================================
echo 2. Inicializando Frontend (Vite + React)...
echo =========================================
call npm create vite@latest frontend -- --template react
cd frontend
call npm install
call npm install axios react-leaflet leaflet lucide-react
cd ..

echo =========================================
echo Instalacion completada con exito.
echo =========================================
pause