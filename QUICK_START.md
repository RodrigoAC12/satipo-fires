# 🔥 INSTALACIÓN RÁPIDA - Satipo Fire Prediction

## 📋 Checklist Previo

Antes de comenzar, asegúrate de tener:
- ✅ **Python 3.8+** (`python --version`)
- ✅ **PostgreSQL 12+** descargado e instalado
- ✅ **Node.js 16+** (`node --version`)
- ✅ **Git** (opcional)

---

## ⚡ INSTALACIÓN EN 5 MINUTOS

### Paso 1️⃣: Descargar el Proyecto
```bash
# Si tienes Git
git clone https://github.com/tuusuario/satipo-fire-prediction.git
cd satipo-fire-prediction

# O descargar ZIP y extraer
```

### Paso 2️⃣: Verificar la Instalación
**Windows:**
```bash
diagnostico.bat
```

**Linux/Mac:**
```bash
chmod +x diagnostico.sh
./diagnostico.sh
```

Este script verifica Python, PostgreSQL, dependencias y archivos críticos.

---

### Paso 3️⃣: Configurar Base de Datos

#### 🔧 Opción A: Automática (RECOMENDADO)
```powershell
# Windows - Abre PostgreSQL como Admin y ejecuta:
psql -U postgres -f setup.sql
```

#### 🔧 Opción B: Manual
```sql
-- Abre pgAdmin o psql y ejecuta:
CREATE USER admin WITH PASSWORD 'admin';
CREATE DATABASE satipo_fires OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE satipo_fires TO admin;
```

#### ✅ Verificar Conexión
```bash
test_db.bat
```

---

### Paso 4️⃣: Configurar Archivo .env

```bash
# Copia la plantilla
cp backend\.env.example backend\.env

# Edita backend/.env con TUS credenciales:
```

**backend/.env:**
```env
DB_USER=admin
DB_PASSWORD=admin
DB_HOST=localhost
DB_PORT=5432
DB_NAME=satipo_fires
ENVIRONMENT=development
```

**frontend/.env.local:**
```env
VITE_API_URL=http://localhost:8000
```

---

### Paso 5️⃣: Instalar Dependencias

```bash
# Backend
cd backend
python -m venv venv

# Activar venv
# Windows:
venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Instalar paquetes
pip install -r requirements.txt

# Frontend (en otra carpeta)
cd ../frontend
npm install
```

---

### Paso 6️⃣: Iniciar la Aplicación

**OPCIÓN AUTOMÁTICA (RECOMENDADA):**
```bash
# Windows
iniciar.bat

# Linux/Mac
chmod +x iniciar.sh
./iniciar.sh
```

**OPCIÓN MANUAL (2 terminales):**

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate.bat  # Windows: venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

### Paso 7️⃣: Acceder a la Aplicación

Abre en tu navegador:
```
http://localhost:5173
```

Deberías ver:
- ✅ Interfaz de Satipo Fire Prediction
- ✅ Sin errores en la consola (F12 → Console)
- ✅ Backend corriendo en `http://localhost:8000`

---

## 🆘 Si Algo Falla

### ❌ "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xf3"

**Problema:** Contraseña con caracteres especiales

**Solución:**
1. Edita `backend/.env`
2. Usa contraseña sin ñ, ó, @, %
3. Ejemplo: `DB_PASSWORD=admin_segura123`

### ❌ "Failed to load resource: net::ERR_CONNECTION_REFUSED :8000"

**Problema:** Backend no está corriendo

**Solución:**
1. Verifica Terminal 1 (Backend):
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
2. Si dice "Port 8000 in use", usa otro puerto:
   ```bash
   python -m uvicorn app.main:app --reload --port 8001
   ```

### ❌ "Advertencia al crear tablas de BD"

**Problema:** PostgreSQL no está disponible

**Solución:**
1. Abre pgAdmin o PostgreSQL
2. Verifica que PostgreSQL está corriendo
3. Ejecuta `test_db.bat` para diagnosticar

### ❌ "Error al crear zona" en Frontend

**Problema:** Backend retorna error

**Solución:**
1. Abre DevTools (F12) → Console
2. Busca el error exacto
3. Verifica `backend/.env`
4. Revisa los logs del backend en Terminal 1

---

## 📊 Verificar que Todo Funciona

### Checklist Final:
- [ ] `diagnostico.bat` sin ❌
- [ ] `test_db.bat` sin errores
- [ ] Backend corriendo sin errores
- [ ] Frontend accesible en localhost:5173
- [ ] Console del navegador (F12) sin errores rojo
- [ ] Puedo ver el formulario "Registrar Nueva Zona"
- [ ] Puedo guardar una zona sin errores

---

## 🚀 Próximos Pasos

1. Lee [TROUBLESHOOTING.md](TROUBLESHOOTING.md) para más ayuda
2. Consulta [INSTALACION.md](INSTALACION.md) para instalación en producción
3. Revisa el código en `backend/app/` y `frontend/src/`

---

## 📞 Soporte

Si tienes problemas:
1. Ejecuta `diagnostico.bat`
2. Verifica los logs en Terminal 1 (Backend)
3. Abre Console en navegador (F12)
4. Consulta [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**¡Felicidades! 🎉 Ya tienes Satipo Fire Prediction corriendo en tu máquina.**

Última actualización: 2026-04-24
