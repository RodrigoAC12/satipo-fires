@echo off
REM ================================================
REM SCRIPT DE DIAGNOSTICO - SATIPO FIRE PREDICTION
REM ================================================
REM Este script diagnostica problemas comunes de instalación
REM ================================================

setlocal enabledelayedexpansion

echo.
echo ================================================
echo   DIAGNOSTICO DE SATIPO FIRE PREDICTION
echo ================================================
echo.

REM Color codes para mejor visualización
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "RESET=[0m"

REM ============ 1. VERIFICAR PYTHON ============
echo [1/7] Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Python no está instalado o no está en el PATH%RESET%
    echo    Descárgalo desde: https://www.python.org
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo %GREEN%✅ Python OK: !PYTHON_VERSION!%RESET%
)
echo.

REM ============ 2. VERIFICAR VENV ============
echo [2/7] Verificando entorno virtual...
if exist "venv\Scripts\activate.bat" (
    echo %GREEN%✅ Entorno virtual existe%RESET%
    call venv\Scripts\activate.bat
) else (
    echo %YELLOW%⚠️  Creando entorno virtual...%RESET%
    python -m venv venv
    call venv\Scripts\activate.bat
    echo %GREEN%✅ Entorno virtual creado%RESET%
)
echo.

REM ============ 3. VERIFICAR POSTGRESQL ============
echo [3/7] Verificando PostgreSQL...
psql --version >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ psql no está en el PATH%RESET%
    echo    Descárgalo desde: https://www.postgresql.org
    echo    O agrega PostgreSQL\bin a la variable PATH
) else (
    for /f "tokens=*" %%i in ('psql --version') do set PG_VERSION=%%i
    echo %GREEN%✅ PostgreSQL OK: !PG_VERSION!%RESET%
)
echo.

REM ============ 4. VERIFICAR CONEXION A BD ============
echo [4/7] Verificando conexión a BD PostgreSQL...
setlocal enabledelayedexpansion
for /f "tokens=*" %%i in ('where psql') do set PSQL_PATH=%%i

if exist "!PSQL_PATH!" (
    "!PSQL_PATH!" -U admin -d postgres -c "SELECT 1" >nul 2>&1
    if errorlevel 1 (
        echo %RED%❌ No se puede conectar a PostgreSQL%RESET%
        echo    - ¿PostgreSQL está corriendo? (postgresql://localhost:5432)
        echo    - ¿Usuario 'admin' existe?
        echo    - ¿Contraseña es 'admin'?
    ) else (
        echo %GREEN%✅ Conexión a PostgreSQL OK%RESET%
        
        REM Verificar si existe la BD
        "!PSQL_PATH!" -U admin -d postgres -c "SELECT 1 FROM pg_database WHERE datname = 'satipo_fires'" >nul 2>&1
        if errorlevel 1 (
            echo %YELLOW%⚠️  Base de datos 'satipo_fires' no existe%RESET%
            echo    Creándola...
            "!PSQL_PATH!" -U admin -d postgres -c "CREATE DATABASE satipo_fires;"
            echo %GREEN%✅ Base de datos creada%RESET%
        ) else (
            echo %GREEN%✅ Base de datos 'satipo_fires' existe%RESET%
        )
    )
) else (
    echo %YELLOW%⚠️  PostgreSQL no está en el PATH%RESET%
)
echo.

REM ============ 5. VERIFICAR .env ============
echo [5/7] Verificando archivo .env...
if exist "backend\.env" (
    echo %GREEN%✅ Archivo .env existe%RESET%
    
    REM Leer variables del .env
    for /f "usebackq tokens=1,* delims==" %%a in ("backend\.env") do (
        if "%%a"=="DB_HOST" set "DB_HOST=%%b"
        if "%%a"=="DB_PORT" set "DB_PORT=%%b"
        if "%%a"=="DB_USER" set "DB_USER=%%b"
    )
    
    if defined DB_HOST (
        echo    Host: !DB_HOST!
    )
    if defined DB_PORT (
        echo    Puerto: !DB_PORT!
    )
    if defined DB_USER (
        echo    Usuario: !DB_USER!
    )
) else (
    echo %RED%❌ Archivo .env NO existe%RESET%
    echo    Copia backend\.env.example a backend\.env
    copy backend\.env.example backend\.env
    echo %GREEN%✅ Archivo .env creado%RESET%
)
echo.

REM ============ 6. VERIFICAR DEPENDENCIAS ============
echo [6/7] Verificando dependencias Python...
pip list | findstr "fastapi sqlalchemy pydantic" >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%⚠️  Instalando dependencias...%RESET%
    pip install -q -r backend\requirements.txt
    echo %GREEN%✅ Dependencias instaladas%RESET%
) else (
    echo %GREEN%✅ Dependencias OK%RESET%
)
echo.

REM ============ 7. VERIFICAR ARCHIVOS CRITICOS ============
echo [7/7] Verificando archivos críticos...

if exist "backend\app\infrastructure\modelo_rf.joblib" (
    echo %GREEN%✅ Modelo ML existe%RESET%
) else (
    echo %YELLOW%⚠️  Modelo ML no encontrado en backend\app\infrastructure\%RESET%
    echo    Necesitas obtenerlo del equipo de ML
)

if exist "backend\app\main.py" (
    echo %GREEN%✅ main.py existe%RESET%
) else (
    echo %RED%❌ main.py NO existe%RESET%
)

if exist "frontend\package.json" (
    echo %GREEN%✅ Frontend existe%RESET%
) else (
    echo %RED%❌ Frontend NO existe%RESET%
)

echo.
echo ================================================
echo   DIAGNOSTICO COMPLETADO
echo ================================================
echo.
echo 🚀 Próximos pasos:
echo    1. Asegúrate que todos los ✅ estén verdes
echo    2. Corrige cualquier ❌ problema
echo    3. Ejecuta: iniciar.bat
echo.
pause
