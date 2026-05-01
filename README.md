# Satipo FireGuard AI 🛰️🔥

Sistema Inteligente de Predicción de Riesgos de Incendios Forestales en la provincia de Satipo, Perú. Utiliza Inteligencia Artificial (Random Forest) y datos geoespaciales para evaluar factores ambientales críticos y visualizar zonas de peligro en tiempo real.

---

## 📂 Estructura de Carpetas y Archivos

```
risk_app/
├── README.md                         # Documentación del proyecto
├── docker-compose.yml                # Configuración Docker (PostgreSQL + PostGIS)
├── .env                              # Variables de entorno
├── .gitignore                        # Archivos ignorados por Git
├── install.bat                       # Script de instalación (Windows)
├── iniciar.bat                       # Script para iniciar la aplicación
├── ejecutar_todo.bat                 # Script para ejecutar todo
│
├── backend/                          # API REST (Python/FastAPI)
│   ├── main.py                       # Punto de entrada FastAPI
│   ├── database.py                   # Configuración SQLAlchemy + PostGIS
│   ├── models.py                     # Modelos ORM
│   ├── schemas.py                    # Validaciones Pydantic
│   ├── ml_model.py                   # Lógica de modelos ML
│   ├── requirements.txt               # Dependencias Python
│   ├── rf_satipo_model.pkl           # Modelo Random Forest
│   ├── risk_model.pkl                # Modelo de predicción
│   │
│   ├── application/
│   │   └── use_cases.py              # Casos de uso del negocio
│   │
│   ├── domain/
│   │   ├── entities.py               # Entidades del dominio
│   │   └── ports/
│   │       └── ml_service.py         # Puerto/Interfaz ML
│   │
│   └── infrastructure/
│       └── adapters/
│           └── rf_adapter.py         # Adaptador Random Forest
│
├── frontend/                         # Interfaz Web (React + Vite)
│   ├── package.json                  # Dependencias npm
│   ├── vite.config.js                # Config Vite
│   ├── eslint.config.js              # Config ESLint
│   ├── index.html                    # HTML principal
│   ├── vercel.json                   # Config Vercel
│   │
│   └── src/
│       ├── main.jsx                  # Entry point React
│       ├── App.jsx                   # Componente principal
│       ├── App.css                   # Estilos
│       ├── index.css                 # Estilos globales
│       │
│       ├── components/               # Componentes React
│       │   ├── RiskForm.jsx          # Formulario de datos
│       │   ├── MapPanel.jsx          # Mapa interactivo
│       │   ├── ResultCard.jsx        # Tarjeta de resultados
│       │   └── HistoryTable.jsx      # Tabla de historial
│       │
│       ├── services/
│       │   └── apiService.js         # Cliente HTTP para API
│       │
│       ├── utils/
│       │   └── pdfGenerator.js       # Generador de reportes PDF
│       │
│       ├── assets/                   # Imágenes e iconos
│       └── public/                   # Recursos estáticos
│
└── ml/                               # Carpeta para experimentos ML (vacía)
```

---

## 🛠️ Tecnologías Utilizadas

**Frontend:**
- React 18+
- Vite 5+
- Leaflet 1.9+ (mapas interactivos)

**Backend:**
- Python 3.8+
- FastAPI 0.100+
- SQLAlchemy 2.0+
- Pydantic 2.0+

**Base de Datos:**
- PostgreSQL 15+
- PostGIS 3.0+ (geoespacial)

**Machine Learning:**
- Scikit-learn 1.0+ (Random Forest)
- NumPy 1.20+
- Pandas 1.3+

**DevOps:**
- Docker 20.10+
- Docker Compose 2.0+

---

## 🏗️ Arquitectura Hexagonal (Clean Architecture)

```
┌────────────────────────────────────────────────────────┐
│          EXTERNAL INTERFACE (React UI)                 │
└────────────────────┬─────────────────────────────────┘
                     │ REST API
┌────────────────────────────────────────────────────────┐
│            ADAPTERS & CONTROLLERS (FastAPI)            │
│  (Convierten HTTP requests a casos de uso)             │
└────────────────┬───────────────────────────┬──────────┘
                 │                           │
        ┌────────▼─────────┐      ┌──────────▼───────┐
        │ APPLICATION      │      │ INFRASTRUCTURE   │
        │ LAYER            │      │ LAYER            │
        │                  │      │                  │
        │ use_cases.py     │      │ adapters/        │
        │ (Lógica negocio) │      │ database.py      │
        └────────┬─────────┘      │ rf_adapter.py    │
                 │                │                  │
        ┌────────────────────┐    └──────────┬───────┘
        │  DOMAIN LAYER      │               │
        │  (Núcleo)          │               │
        │                    │               │
        │ entities.py        │               │
        │ ports/ml_service   │               │
        └────────┬───────────┘               │
                 │                           │
                 └───────────┬───────────────┘
                             │
                    ┌────────▼────────┐
                    │ DATABASES       │
                    │ PostgreSQL+     │
                    │ PostGIS         │
                    │ (ML Models)     │
                    └─────────────────┘
```

**Capas:**
1. **Domain**: Entidades y puertos (independientes de frameworks)
2. **Application**: Casos de uso del negocio
3. **Infrastructure**: Adaptadores, BD, servicios externos
4. **Presentation**: UI (React) y API (FastAPI)

---

## ⚙️ Requisitos Previos

- **Python 3.8+** - [Descargar](https://www.python.org/downloads/)
- **Node.js 16+** - [Descargar](https://nodejs.org/)
- **Git** - [Descargar](https://git-scm.com/)
- **Docker Desktop** - [Descargar](https://www.docker.com/products/docker-desktop)

**Verificar instalación:**
```bash
python --version
node --version
npm --version
git --version
docker --version
docker-compose --version
```

---

## 🚀 Instalación Local

### 1. Clonar repositorio
```bash
git clone https://github.com/tu-usuario/risk_app.git
cd risk_app
```

### 2. Levantar base de datos
```bash
docker-compose up -d
```

### 3. Configurar backend
```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar (Windows):
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn main:app --reload --port 8000
```

API en: `http://localhost:8000`
Docs: `http://localhost:8000/docs`

### 4. Configurar frontend
```bash
cd ../frontend

# Instalar dependencias
npm install

# Iniciar servidor
npm run dev
```

Aplicación en: `http://localhost:5173`

### 5. Verificar que funciona
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/docs`
- Base de datos: `localhost:5432`

---

## 📝 Variables de Entorno (.env)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/risk_db
API_PORT=8000
DEBUG=True
VITE_API_URL=http://localhost:8000
```

---

**Última actualización:** Abril 2026 | **Versión:** 1.0.0 (MVP)
