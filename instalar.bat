@echo off
echo === INSTALANDO/ACTUALIZANDO SATIPO-IA ===

echo [1/2] Configurando Backend...
cd backend
:: Si no existe el venv lo crea, si existe solo lo usa
if not exist venv (
    python -m venv venv
    echo Entorno virtual creado.
)
call venv\Scripts\activate
pip install -r requirements.txt

echo.
echo [2/2] Configurando Frontend...
cd ../frontend
:: Usamos call para que el proceso de instalacion no mate al script .bat
call npm install

cd ..
echo.
echo === INSTALACION COMPLETADA CON EXITO ===
echo Ya puedes cerrar esta ventana y usar iniciar.bat
pause