# � Satipo Fire Prediction

Sistema inteligente de predicción de incendios forestales para la región de Satipo, Perú, basado en **Arquitectura Hexagonal (Clean Architecture)** y Machine Learning.

## 🎯 Objetivo

Predecir el riesgo de incendios forestales en la región de Satipo mediante análisis avanzado de:
- **Variables meteorológicas:** Temperatura, humedad relativa
- **Índices de vegetación:** NDVI (Normalized Difference Vegetation Index)
- **Topografía:** Pendiente del terreno
- **Datos satelitales:** Puntos de calor NASA en tiempo real

## 🛠️ Requisitos

- **Python:** 3.8+
- **Node.js:** 16+
- **PostgreSQL:** 12+
- **Docker:** (opcional, para ambiente aislado)

## 🚀 Instalación Rápida

### Opción 1: Automatizado (Windows)
```batch
# Primera vez
instalar.bat

# Luego para iniciar
iniciar.bat
```

### Opción 2: Manual

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/satipo-fire-prediction.git
cd satipo-fire-prediction
```

2. **Configurar variables de entorno:**
```bash
cp backend/.env.example backend/.env
# Edita backend/.env con tus credenciales PostgreSQL
```

3. **Instalar dependencias (Backend):**
```bash
python -m venv venv
# Windows
venv\Scripts\activate.bat
# Linux/Mac
source venv/bin/activate

pip install -r backend/requirements.txt
```

4. **Instalar dependencias (Frontend):**
```bash
cd frontend
npm install
```

5. **Ejecutar verificación:**
```bash
# Windows
verificar.bat

# Linux/Mac
chmod +x verificar.sh
./verificar.sh
```

6. **Iniciar servidor Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

7. **Iniciar servidor Frontend (en otra terminal):**
```bash
cd frontend
npm run dev
```

## 📂 Arquitectura

El proyecto sigue el patrón **Hexagonal (Clean Architecture)**:

```
satipo-fire-prediction/
├── backend/
│   ├── app/
│   │   ├── domain/              # Lógica de negocio pura
│   │   │   ├── entities/        # Modelos de dominio
│   │   │   ├── ports/           # Interfaces/contratos
│   │   │   └── value_objects/   # Objetos de valor
│   │   ├── application/         # Casos de uso
│   │   │   └── useCases/        # Orquestación de lógica
│   │   ├── infrastructure/      # Implementaciones técnicas
│   │   │   ├── adapters/        # Adaptadores entrada/salida
│   │   │   ├── database.py      # Conexión PostgreSQL
│   │   │   ├── ml_service.py    # Servicio de ML
│   │   │   ├── nasa_service.py  # API NASA
│   │   │   └── modelo_rf.joblib # Modelo entrenado
│   │   ├── presentation/        # API REST
│   │   └── main.py              # Punto de entrada
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                     # (Tu configuración local)
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── pages/               # Páginas
│   │   └── services/            # Servicios API
│   └── package.json
├── ia/                          # Scripts ML
│   └── entrenar_modelo.py       # Entrenamiento del modelo
├── docker-compose.yml           # PostgreSQL + PostGIS
├── README.md                    # Este archivo
├── INSTALACION.md               # Guía detallada
├── TROUBLESHOOTING.md           # Solución de problemas
├── verificar.bat/sh             # Scripts de verificación
└── .gitignore
```

## 📊 API Endpoints

| Método | Endpoint | Descripción | 
|--------|----------|-------------|
| `POST` | `/zonas/` | Registrar nueva zona de riesgo |
| `GET` | `/zonas/` | Listar todas las zonas registradas |
| `GET` | `/stats/` | Obtener estadísticas del sistema |
| `GET` | `/nasa-hotspots/` | Obtener puntos de calor NASA en tiempo real |
| `GET` | `/` | Health check del servidor |

### Ejemplo de Solicitud

```bash
curl -X POST "http://localhost:8000/zonas/" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_sector": "Satipo Centro",
    "latitud": -11.28,
    "longitud": -74.60,
    "temperatura": 28.5,
    "humedad": 65.0,
    "ndvi": 0.45,
    "pendiente": 15.0
  }'
```

## 🧪 Testing

### Backend (Python)
```bash
cd backend
pytest tests/
```

### Frontend (JavaScript)
```bash
cd frontend
npm run test
```

## 🐳 Docker

Para levantar PostgreSQL + PostGIS automáticamente:

```bash
docker-compose up -d
```

Credenciales por defecto:
- Usuario: `admin`
- Contraseña: `admin`
- Base de datos: `satipo_fires`

## 📚 Documentación Adicional

- **[INSTALACION.md](INSTALACION.md)** - Guía detallada de instalación en diferentes sistemas
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solución de problemas comunes
- **Backend Docs** - Disponible en `http://localhost:8000/docs` (Swagger)

## 🔑 Variables de Entorno

Copia `backend/.env.example` a `backend/.env`:

```env
# Base de Datos PostgreSQL
DB_USER=admin
DB_PASSWORD=admin
DB_HOST=localhost
DB_PORT=5432
DB_NAME=satipo_fires
```

**Nota:** La contraseña ahora soporta caracteres especiales (ñ, @, %, etc.) gracias al URL encoding automático.

## ✨ Características Principales

- ✅ **Predicción de Riesgo:** Modelo Random Forest entrenado
- ✅ **API REST:** FastAPI con documentación automática
- ✅ **Base de Datos Geoespacial:** PostgreSQL + PostGIS
- ✅ **Frontend Interactivo:** React + Leaflet (mapas)
- ✅ **Datos Satelitales:** Integración con API NASA FIRMS
- ✅ **Arquitectura Limpia:** Separación de responsabilidades
- ✅ **Portabilidad:** Funciona en Windows, Linux, Mac
- ✅ **Logging Completo:** Diagnóstico detallado
- ✅ **Manejo Robusto de Errores:** No falla por errores menores

## 📋 Cambios Recientes (v1.1)

- ✅ Actualización a Pydantic V2 (from_attributes en lugar de orm_mode)
- ✅ Soporte para contraseñas con caracteres especiales
- ✅ Búsqueda inteligente del archivo del modelo
- ✅ Logging en lugar de print() para mejor diagnóstico
- ✅ Manejo robusto de conexiones a BD
- ✅ Scripts de verificación para Windows/Linux/Mac
- ✅ Documentación mejorada

## 🚀 Performance

- Predicción: ~50ms por zona
- Consulta de zonas: ~100ms para 1000 registros
- Carga de puntos NASA: ~3s (con fallback a datos de demo)

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/AmazingFeature`
3. Commit tus cambios: `git commit -m 'Add some AmazingFeature'`
4. Push a la rama: `git push origin feature/AmazingFeature`
5. Abre un Pull Request

## 📞 Contacto y Soporte

Para reportar bugs o sugerir mejoras, abre un [Issue](https://github.com/tu-usuario/satipo-fire-prediction/issues).

## 📄 Licencia

Este proyecto está bajo licencia **MIT** - ver [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **NASA FIRMS** - Datos de puntos de calor satelitales
- **PostGIS** - Análisis geoespacial
- **scikit-learn** - Machine Learning
- **FastAPI** - API Framework
- **React** - Frontend Framework

---

**Última actualización:** 24 de abril de 2026  
**Versión:** 1.1  
**Estado:** ✅ Producción Ready