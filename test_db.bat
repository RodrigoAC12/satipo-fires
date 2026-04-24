@echo off
REM ================================================
REM TEST DE CONEXION A POSTGRESQL
REM ================================================
REM Verifica que PostgreSQL esté disponible y accesible

echo.
echo ================================================
echo   TEST DE CONEXION - POSTGRESQL
echo ================================================
echo.

REM Leer variables del .env
setlocal enabledelayedexpansion
for /f "usebackq tokens=1,* delims==" %%a in ("backend\.env") do (
    if "%%a"=="DB_USER" set "DB_USER=%%b"
    if "%%a"=="DB_PASSWORD" set "DB_PASSWORD=%%b"
    if "%%a"=="DB_HOST" set "DB_HOST=%%b"
    if "%%a"=="DB_PORT" set "DB_PORT=%%b"
    if "%%a"=="DB_NAME" set "DB_NAME=%%b"
)

echo 📋 Configuración cargada desde backend\.env:
echo    Usuario: !DB_USER!
echo    Host: !DB_HOST!
echo    Puerto: !DB_PORT!
echo    BD: !DB_NAME!
echo.

REM Verificar que psql está disponible
echo [1/3] Verificando que psql está disponible...
psql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ psql no está en el PATH
    echo    Opción 1: Instala PostgreSQL
    echo    Opción 2: Agrega PostgreSQL\bin al PATH
    pause
    exit /b 1
) else (
    echo ✅ psql encontrado
)
echo.

REM Intentar conectar
echo [2/3] Intentando conectar a PostgreSQL...
psql -U !DB_USER! -h !DB_HOST! -p !DB_PORT! -d postgres -c "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo ❌ No se puede conectar a PostgreSQL
    echo    - ¿PostgreSQL está corriendo?
    echo    - ¿Usuario '!DB_USER!' existe?
    echo    - ¿Contraseña es correcta?
    echo.
    echo    Intenta conectar manualmente:
    echo    psql -U !DB_USER! -h !DB_HOST! -p !DB_PORT!
    pause
    exit /b 1
) else (
    echo ✅ Conexión exitosa a PostgreSQL
)
echo.

REM Verificar BD
echo [3/3] Verificando base de datos '!DB_NAME!'...
psql -U !DB_USER! -h !DB_HOST! -p !DB_PORT! -d postgres -c "SELECT 1 FROM pg_database WHERE datname='!DB_NAME!';" >nul 2>&1
if errorlevel 1 (
    echo ❌ La base de datos '!DB_NAME!' no existe
    echo.
    echo    Créala ejecutando:
    echo    psql -U !DB_USER! -h !DB_HOST! -p !DB_PORT! -d postgres -c "CREATE DATABASE !DB_NAME!;"
    echo.
    echo    O usa setup.sql:
    echo    psql -U !DB_USER! -f setup.sql
    pause
    exit /b 1
) else (
    echo ✅ Base de datos '!DB_NAME!' existe
)
echo.

echo ================================================
echo   ✅ TODAS LAS PRUEBAS PASARON
echo ================================================
echo.
echo PostgreSQL está listo para usar con Satipo Fire Prediction
echo.
pause
