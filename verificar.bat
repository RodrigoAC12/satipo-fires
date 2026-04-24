@echo off
REM Script de verificación del proyecto Satipo Fire Prediction
REM Este script verifica que todas las dependencias estén correctas

echo ========================================
echo   Verificador de Satipo Fire Prediction
echo ========================================
echo.

REM Verificar Python
echo [1/4] Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python no está instalado o no está en el PATH
    exit /b 1
) else (
    echo ✅ Python OK: & python --version
)
echo.

REM Verificar venv
echo [2/4] Verificando entorno virtual...
if exist "venv\Scripts\activate.bat" (
    echo ✅ Entorno virtual existe
    call venv\Scripts\activate.bat
) else (
    echo ⚠️  Entorno virtual no encontrado. Creando...
    python -m venv venv
    call venv\Scripts\activate.bat
)
echo.

REM Verificar dependencias
echo [3/4] Verificando dependencias (backend)...
pip install -q -r backend\requirements.txt 2>nul
if errorlevel 1 (
    echo ❌ Error instalando dependencias del backend
    exit /b 1
) else (
    echo ✅ Dependencias backend OK
)
echo.

REM Verificar archivo de modelo
echo [4/4] Verificando archivos críticos...
if exist "backend\app\infrastructure\modelo_rf.joblib" (
    echo ✅ Modelo ML encontrado
) else (
    echo ⚠️  Modelo ML no encontrado en backend\app\infrastructure\
    echo    Por favor, asegúrate de copiarlo a esa ubicación
)
echo.

REM Verificar .env
if exist "backend\.env" (
    echo ✅ Archivo .env configurado
) else (
    echo ⚠️  Archivo .env no encontrado
    echo    Copia backend\.env.example a backend\.env y configúralo
)
echo.

echo ========================================
echo Verificación completada
echo ========================================
echo.
echo Próximos pasos:
echo 1. Asegúrate que PostgreSQL esté corriendo
echo 2. Configura backend\.env con tus credenciales
echo 3. Ejecuta: cd backend ^& python -m uvicorn app.main:app --reload
echo.
pause
