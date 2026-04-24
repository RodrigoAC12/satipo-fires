# Guía de Solución de Problemas - Satipo Fire Prediction

## Problemas Resueltos

### 1. ⚠️ Pydantic V2 Warning: "orm_mode has been renamed to from_attributes"

**Problema:** 
```
UserWarning: Valid config keys have changed in V2:
* 'orm_mode' has been renamed to 'from_attributes'
```

**Solución Implementada:**
- ✅ Actualizado `backend/app/domain/entities.py`
- ✅ Actualizado `backend/app/domain/entities/entities.py`
- Cambio: `class Config: orm_mode = True` → `model_config = ConfigDict(from_attributes=True)`

---

### 2. ❌ Error: "No such file or directory: 'modelo_rf.joblib'"

**Problema:**
```
Error al cargar el modelo: [Errno 2] No such file or directory: 
'C:\\Users\\TEROS\\...\\modelo_rf.joblib'
```

**Solución Implementada:**
- ✅ Actualizado `backend/app/infrastructure/ml_service.py`
- ✅ Actualizado `backend/app/infrastructure/adapters/output/ml_service.py`
- Ahora busca el modelo en múltiples ubicaciones posibles
- Mejor manejo de errores con logging

**Asegúrate de:**
- El archivo `modelo_rf.joblib` está en `backend/app/infrastructure/`
- Si no existe, consulta con el equipo de ML para generar el modelo

---

### 3. 🔌 Error: "UnicodeDecodeError" en conexión a PostgreSQL

**Problema:**
```
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xf3 in position 85
```

**Causa:** Caracteres especiales en la contraseña de la BD (ñ, @, %, etc.)

**Solución Implementada:**
- ✅ Actualizado `backend/app/infrastructure/database.py`
- Ahora usa `urllib.parse.quote_plus()` para codificar correctamente la contraseña
- Soporta variables de entorno

**Pasos para usar:**

1. Copia el archivo de ejemplo:
```bash
cp backend/.env.example backend/.env
```

2. Edita `backend/.env` con tus credenciales:
```env
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña  # Puede contener caracteres especiales
DB_HOST=localhost
DB_PORT=5432
DB_NAME=satipo_fires
```

3. El código ahora carga estas variables automáticamente.

---

## Verificación Final

Ejecuta el servidor con:

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Deberías ver:
- ✅ Sin warnings de Pydantic
- ✅ Modelo cargado correctamente
- ✅ Conexión a BD exitosa
- ✅ Servidor corriendo en http://0.0.0.0:8000

---

## Checklist de Instalación en Nueva Máquina

- [ ] PostgreSQL instalado y corriendo
- [ ] Python 3.8+ instalado
- [ ] Venv creado: `python -m venv venv`
- [ ] Dependencias instaladas: `pip install -r requirements.txt`
- [ ] `.env` configurado (copia desde `.env.example`)
- [ ] `modelo_rf.joblib` presente en `backend/app/infrastructure/`
- [ ] Base de datos creada en PostgreSQL: `satipo_fires`
- [ ] Servidor FastAPI iniciado correctamente

---

## Si Aún Hay Errores

1. Verifica los logs detallados (ahora usa `logging` en lugar de `print`)
2. Asegúrate que PostgreSQL está escuchando en el puerto correcto
3. Prueba la conexión manualmente:
   ```bash
   psql -U admin -d satipo_fires -h localhost
   ```
4. Verifica rutas de archivos (especialmente `modelo_rf.joblib`)

