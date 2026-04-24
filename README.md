# 🔥 Satipo Fire Prediction - Sistema de Predicción de Incendios

## 📌 Descripción del Proyecto

Sistema de predicción de riesgo de incendios en la región de Satipo, Perú. Utiliza Machine Learning (Random Forest) para analizar datos meteorológicos y geográficos en tiempo real.

**Tech Stack:**
- **Backend:** FastAPI + SQLAlchemy + PostgreSQL
- **Frontend:** React + Vite
- **ML:** scikit-learn Random Forest
- **Datos:** NASA FIRMS, OpenWeatherMap

---

## ⚡ INICIO RÁPIDO (5 MINUTOS)

### 1️⃣ Requisitos Previos
- ✅ Python 3.8+
- ✅ PostgreSQL 12+
- ✅ Node.js 16+

### 2️⃣ Instalación Rápida
```bash
# 1. Ejecutar diagnóstico
diagnostico.bat

# 2. Configurar BD
psql -U postgres -f setup.sql

# 3. Crear archivos .env
cp backend\.env.example backend\.env

# 4. Iniciar
iniciar.bat
```

**Acceder:** http://localhost:5173

---

## 📚 DOCUMENTACIÓN

| Documento | Descripción |
|-----------|-------------|
| **[QUICK_START.md](QUICK_START.md)** | ⚡ Guía de instalación rápida |
| **[INSTALACION.md](INSTALACION.md)** | 📖 Guía completa de instalación |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | 🔧 Solución de problemas |
| **[CAMBIOS_REALIZADOS.md](CAMBIOS_REALIZADOS.md)** | ✅ Cambios técnicos realizados |

---

## 🛠️ Scripts Útiles

```bash
diagnostico.bat       # Verifica toda la instalación
test_db.bat          # Prueba conexión PostgreSQL  
iniciar.bat          # Inicia backend + frontend
verificar.bat        # Verifica dependencias
```

---

## 📋 Características

- ✅ Predicción de riesgo de incendios en tiempo real
- ✅ Análisis de datos meteorológicos automático
- ✅ Integración con NASA FIRMS para puntos de calor
- ✅ Dashboard interactivo con mapas
- ✅ Historial de zonas monitoreadas
- ✅ API REST documentada con Swagger

---

## 🔥 [COMIENZA AQUÍ: QUICK_START.md](QUICK_START.md)

Si es tu primera vez, abre **[QUICK_START.md](QUICK_START.md)** para una instalación en 5 minutos.

---

Última actualización: 2026-04-24
- `infrastructure`: PostgreSQL, APIs externas (NASA/OpenWeather).
- `presentation`: API con FastAPI.