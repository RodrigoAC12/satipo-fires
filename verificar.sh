#!/bin/bash

# Script de verificación del proyecto Satipo Fire Prediction
# Este script verifica que todas las dependencias estén correctas

echo "========================================"
echo "  Verificador de Satipo Fire Prediction"
echo "========================================"
echo ""

# Verificar Python
echo "[1/4] Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python no está instalado"
    exit 1
else
    echo "✅ Python OK: $(python3 --version)"
fi
echo ""

# Verificar venv
echo "[2/4] Verificando entorno virtual..."
if [ -d "venv" ] && [ -f "venv/bin/activate" ]; then
    echo "✅ Entorno virtual existe"
    source venv/bin/activate
else
    echo "⚠️  Entorno virtual no encontrado. Creando..."
    python3 -m venv venv
    source venv/bin/activate
fi
echo ""

# Verificar dependencias
echo "[3/4] Verificando dependencias (backend)..."
if pip install -q -r backend/requirements.txt; then
    echo "✅ Dependencias backend OK"
else
    echo "❌ Error instalando dependencias del backend"
    exit 1
fi
echo ""

# Verificar archivo de modelo
echo "[4/4] Verificando archivos críticos..."
if [ -f "backend/app/infrastructure/modelo_rf.joblib" ]; then
    echo "✅ Modelo ML encontrado"
else
    echo "⚠️  Modelo ML no encontrado en backend/app/infrastructure/"
    echo "   Por favor, asegúrate de copiarlo a esa ubicación"
fi
echo ""

# Verificar .env
if [ -f "backend/.env" ]; then
    echo "✅ Archivo .env configurado"
else
    echo "⚠️  Archivo .env no encontrado"
    echo "   Copia backend/.env.example a backend/.env y configúralo"
fi
echo ""

echo "========================================"
echo "Verificación completada"
echo "========================================"
echo ""
echo "Próximos pasos:"
echo "1. Asegúrate que PostgreSQL esté corriendo"
echo "2. Configura backend/.env con tus credenciales"
echo "3. Ejecuta: cd backend && python -m uvicorn app.main:app --reload"
echo ""
