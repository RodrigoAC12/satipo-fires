# 🔥 Satipo Fire Prediction - Guía de Instalación (Actualizada)

## ✅ Cambios Realizados

Este proyecto ha sido actualizado para funcionar correctamente en múltiples máquinas. Se han resuelto los siguientes problemas:

### Problemas Corregidos:

1. **Pydantic V2 Compatibility** 
   - ❌ Antes: `class Config: orm_mode = True`
   - ✅ Ahora: `model_config = ConfigDict(from_attributes=True)`

2. **Carga Dinámica de Modelo**
   - ❌ Antes: Ruta fija que fallaba en otras máquinas
   - ✅ Ahora: Búsqueda inteligente en múltiples ubicaciones

3. **Soporte para Caracteres Especiales en BD**
   - ❌ Antes: UnicodeDecodeError con contraseñas especiales
   - ✅ Ahora: URL encoding automático con `quote_plus()`

4. **Manejo Robusto de Errores**
   - ❌ Antes: La app fallaba si algo salía mal
   - ✅ Ahora: Usa logging para diagnóstico sin fallar

---

## 🚀 Instalación Rápida

### 1. Clonar/Descargar el Proyecto
```bash
cd d:\VSC\satipo-fire-prediction  # o tu ruta
```

### 2. Verificar Instalación (Automático)
```bash
# Windows
verificar.bat

# Linux/Mac
chmod +x verificar.sh
./verificar.sh
```

### 3. Configurar Base de Datos

Copia el archivo de configuración:
```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` con tus credenciales:
```env
DB_USER=admin
DB_PASSWORD=tu_contraseña_aqui
DB_HOST=localhost
DB_PORT=5432
DB_NAME=satipo_fires
```

**Nota:** La contraseña puede contener caracteres especiales (ñ, @, %, etc.)

### 4. Asegurar Archivos Críticos

- [ ] Verifica que `backend/app/infrastructure/modelo_rf.joblib` existe
- [ ] Verifica que PostgreSQL está corriendo en `localhost:5432`

### 5. Instalar Dependencias

```bash
python -m venv venv

# Windows
venv\Scripts\activate.bat

# Linux/Mac
source venv/bin/activate

pip install -r backend/requirements.txt
```

### 6. Ejecutar el Servidor

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Modelo Random Forest cargado exitosamente en la API.
```

---

## 📁 Estructura del Proyecto

```
satipo-fire-prediction/
├── backend/
│   ├── app/
│   │   ├── domain/
│   │   │   ├── entities.py                    ✅ ACTUALIZADO
│   │   │   └── entities/entities.py           ✅ ACTUALIZADO
│   │   ├── infrastructure/
│   │   │   ├── database.py                    ✅ ACTUALIZADO
│   │   │   ├── ml_service.py                  ✅ ACTUALIZADO
│   │   │   ├── modelo_rf.joblib               ⚠️ REQUERIDO
│   │   │   └── adapters/output/
│   │   │       └── ml_service.py              ✅ ACTUALIZADO
│   │   ├── application/
│   │   │   └── useCases/use_cases.py
│   │   └── main.py                            ✅ ACTUALIZADO
│   ├── requirements.txt
│   ├── .env.example                           ✨ NUEVO
│   └── .env                                   (Tu configuración local)
├── frontend/                                  (React)
├── ia/                                        (Scripts de ML)
├── verificar.bat                              ✨ NUEVO
├── verificar.sh                               ✨ NUEVO
└── TROUBLESHOOTING.md                         ✨ NUEVO
```

---

## 🔧 Variables de Entorno

Todos los parámetros de conexión ahora se leen de variables de entorno:

| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| `DB_USER` | `admin` | Usuario de PostgreSQL |
| `DB_PASSWORD` | `admin` | Contraseña (soporta caracteres especiales) |
| `DB_HOST` | `localhost` | Host de PostgreSQL |
| `DB_PORT` | `5432` | Puerto de PostgreSQL |
| `DB_NAME` | `satipo_fires` | Nombre de la base de datos |

---

## 🐛 Solución de Problemas

Si aún tienes errores, consulta [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### Errores Comunes:

**❌ "Cannot connect to database"**
- Verifica que PostgreSQL esté corriendo
- Comprueba credenciales en `.env`

**❌ "modelo_rf.joblib not found"**
- El archivo debe estar en `backend/app/infrastructure/`
- Coordina con el equipo de ML

**❌ "Port 8000 already in use"**
```bash
python -m uvicorn app.main:app --reload --port 8001
```

---

## 📞 Contacto y Soporte

Para dudas o problemas:
1. Revisa `TROUBLESHOOTING.md`
2. Ejecuta `verificar.bat` o `verificar.sh`
3. Verifica los logs en la consola

---

## 📝 Notas Técnicas

- **Python:** 3.8+
- **PostgreSQL:** 12+
- **FastAPI:** 0.100+
- **Pydantic:** 2.0+
- **SQLAlchemy:** 2.0+

---

Última actualización: 2026-04-24
