@echo off
echo === INSTALANDO SATIPO-IA ===
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ../frontend
call npm install
echo === INSTALACION COMPLETADA ===
pause