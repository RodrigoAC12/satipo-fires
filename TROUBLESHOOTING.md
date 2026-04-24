# 🔧 Guía de Solución de Problemas - Satipo Fire Prediction

## 🚨 Problemas Críticos Encontrados

### 1. ❌ UnicodeDecodeError: 'utf-8' codec can't decode byte 0xf3

**Error Completo:**
```
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xf3 in position 85: invalid continuation byte
```

**Causa:** La contraseña de PostgreSQL tiene caracteres especiales (ñ, ó, etc.) que no están siendo codificados correctamente en la URL de conexión.

**✅ Soluciones Implementadas:**

1. **database.py mejorado:**
   - Usa `urllib.parse.quote_plus()` para codificar la contraseña
   - Añade `client_encoding='utf8'` en connect_args
   - Ejecuta `SET client_encoding = 'UTF8'` en cada conexión

2. **Archivo .env correcto:**
   ```env
   DB_USER=admin
   DB_PASSWORD=admin  # IMPORTANTE: sin caracteres especiales si es posible
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=satipo_fires
   ```

**📋 Pasos para Arreglarlo:**

1. Edita `backend/.env`:
   ```bash
   DB_USER=admin
   DB_PASSWORD=admin_simple  # Usa una contraseña sin ñ, ó, @, %
   ```

2. En PostgreSQL, crea un usuario con esa contraseña:
   ```sql
   CREATE USER admin WITH PASSWORD 'admin_simple';
   ALTER USER admin CREATEDB;
   CREATE DATABASE satipo_fires OWNER admin;
   ```

3. Reinicia el backend

---

### 2. ❌ CORS Error: "Access to XMLHttpRequest has been blocked by CORS policy"

**Error en Frontend:**
```
Error al conectar con la API del Backend: AxiosError: Network Error
Failed to load resource: net::ERR_CONNECTION_REFUSED :8000/zonas/:1
Access to XMLHttpRequest has been blocked by CORS policy
```

**Causa:** El frontend en `localhost:5173` no puede acceder al backend en `localhost:8000` por política CORS.

**✅ Soluciones Implementadas:**

1. **main.py mejorado:**
   ```python
   allowed_origins = [
       "http://localhost:5173",
       "http://127.0.0.1:5173",
       "http://localhost:8000",
   ]
   ```

2. **vite.config.js con proxy:**
   ```javascript
   server: {
       proxy: {
           '/api': {
               target: 'http://localhost:8000',
               changeOrigin: true,
           }
       }
   }
   ```

**📋 Pasos para Verificar:**

1. Asegúrate que el backend está corriendo:
   ```bash
   # Terminal 1
   cd backend
   python -m uvicorn app.main:app --reload --port 8000
   ```

2. Verifica que el frontend está corriendo:
   ```bash
   # Terminal 2
   cd frontend
   npm run dev
   ```

3. Abre en navegador: `http://localhost:5173`

4. Abre DevTools (F12) → Console y busca errores

---

### 3. ❌ "Error al persistir en base de datos"

**Mensaje completo:**
```
Error al persistir en base de datos: 'utf-8' codec can't decode byte 0xf3
```

**Causa:** La conexión a PostgreSQL falla al intentar enviar/recibir datos con caracteres especiales.

**✅ Solución:**

Ver **Problema #1** (UnicodeDecodeError) arriba.

---

### 4. ❌ "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Error en Frontend:**
```
Failed to load resource: net::ERR_CONNECTION_REFUSED :8000/zonas/:1
```

**Causas Posibles:**
- Backend no está corriendo
- Backend está en otro puerto
- Puerto 8000 está en uso

**📋 Soluciones:**

**Opción A: Verificar que el backend corre**
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

**Opción B: Si puerto 8000 está en uso**
```bash
# Cambiar a otro puerto
python -m uvicorn app.main:app --reload --port 8001

# Y luego actualizar el frontend:
# En .env o vite.config.js:
VITE_API_URL=http://localhost:8001
```

**Opción C: Ver qué está usando el puerto 8000**
```powershell
# PowerShell
Get-NetTCPConnection -LocalPort 8000

# Matar el proceso si es necesario
Stop-Process -Id <PID> -Force
```

---

### 5. ❌ "No such file or directory: 'modelo_rf.joblib'"

**Error:**
```
Error al cargar el modelo: [Errno 2] No such file or directory: 'modelo_rf.joblib'
```

**Causa:** El archivo del modelo ML no está en `backend/app/infrastructure/`

**📋 Solución:**

1. Obtén el archivo `modelo_rf.joblib` del equipo de ML
2. Colócalo en: `backend/app/infrastructure/modelo_rf.joblib`
3. Verifica que existe:
   ```bash
   ls backend/app/infrastructure/modelo_rf.joblib
   ```

---

## ✅ Checklist de Instalación Correcta

- [ ] **Python 3.8+** instalado (`python --version`)
- [ ] **PostgreSQL corriendo** en `localhost:5432`
- [ ] **Base de datos creada**: `satipo_fires`
- [ ] **Archivo .env** existe en `backend/.env`
- [ ] **Contraseña sin caracteres especiales** (ñ, ó, @, %)
- [ ] **modelo_rf.joblib** en `backend/app/infrastructure/`
- [ ] **Backend levanta sin errores**: `python -m uvicorn app.main:app --reload`
- [ ] **Frontend accesible**: `http://localhost:5173`
- [ ] **Console (F12) del navegador sin errores CORS**

---

## 🔍 Script de Diagnóstico

Para verificar automáticamente todos los problemas, ejecuta:

**Windows:**
```bash
diagnostico.bat
```

**Linux/Mac:**
```bash
chmod +x diagnostico.sh
./diagnostico.sh
```

---

## 📊 Verificar Logs Detallados

**Backend:**
```bash
# Ver logs completos
python -m uvicorn app.main:app --reload --log-level=debug
```

**Frontend (Console):**
- Abre DevTools: `F12`
- Pestaña "Console"
- Busca líneas con ❌ o 🔴

---

## 🐳 Alternativa: Usar Docker

Si PostgreSQL te da problemas, usa Docker:

```bash
# Iniciar PostgreSQL en Docker
docker-compose up -d

# Verificar que está corriendo
docker ps

# Ver logs
docker-compose logs -f db
```

---

## 🚀 Iniciar Correctamente

### Opción 1: Script automático (RECOMENDADO)
```bash
iniciar.bat
```

### Opción 2: Manual en 2 terminales

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📞 Preguntas Frecuentes

**P: ¿Cómo reseteo la base de datos?**
```bash
# En PostgreSQL
psql -U admin
DROP DATABASE satipo_fires;
CREATE DATABASE satipo_fires;
```

**P: ¿El modelo de ML no carga?**
- Verifica que existe en: `backend/app/infrastructure/modelo_rf.joblib`
- Revisa los logs del backend

**P: ¿Cómo cambio el puerto del backend?**
```bash
python -m uvicorn app.main:app --reload --port 9000
```
Luego actualiza `frontend/.env` si es necesario.

**P: ¿El navegador dice "Connection refused"?**
- Asegúrate backend corre en terminal 1
- Verifica puerto (8000)
- Prueba: `curl http://localhost:8000/`

---

Última actualización: 2026-04-24


