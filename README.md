Satipo FireGuard AI 🛰️🔥  
Sistema Inteligente de Predicción de Riesgos de Incendios Forestales  

Satipo FireGuard AI es una plataforma web geoespacial diseñada para el monitoreo y predicción de riesgos de incendios forestales en la provincia de Satipo, Perú. Utiliza Inteligencia Artificial y datos satelitales simulados para evaluar factores ambientales críticos y visualizar zonas de peligro en tiempo real.

📂 Estructura del Proyecto  
El proyecto está dividido en una arquitectura de microservicios desacoplados:

risk_app/  
├── backend/                # Lógica de IA y API (Python + FastAPI)  
│   ├── main.py             # Entry point del servidor  
│   ├── database.py         # Configuración de SQLAlchemy y PostGIS  
│   ├── models.py           # Modelos de base de datos  
│   ├── schemas.py          # Validaciones de Pydantic  
│   ├── ml_logic/           # Modelos de Machine Learning (Scikit-learn)  
│   └── requirements.txt    # Dependencias de Python  
├── frontend/               # Interfaz de Usuario (React + Vite)  
│   ├── src/  
│   │   ├── components/     # Componentes (Mapa, Formulario, Tablas)  
│   │   ├── services/       # Lógica de conexión con API (apiService.js)  
│   │   ├── App.jsx         # Componente principal  
│   │   └── index.css       # Estilos globales del Dashboard  
│   ├── package.json        # Dependencias de Node.js  
│   └── vite.config.js      # Configuración de compilación  
└── docker-compose.yml      # Orquestación de Base de Datos (PostgreSQL/PostGIS)

🛠️ Tecnologías Utilizadas  

Frontend: React 18, Vite, Leaflet (Mapas), CSS Grid/Flexbox.  

Backend: Python 3.x, FastAPI, SQLAlchemy.  

Base de Datos: PostgreSQL 15 + Extensión PostGIS.  

Machine Learning: Scikit-learn (Random Forest / Logistic Regression).  

🚀 Instalación y Configuración  

1. Clonar el repositorio e ingresar  

git clone https://github.com/tu-usuario/risk_app.git  
cd risk_app  

2. Levantar la Base de Datos (Docker)  

Asegúrate de tener Docker instalado y ejecuta:  

docker-compose up -d  

3. Configurar el Backend (Python)  

cd backend  
python -m venv venv  

# Activar venv:  
# Windows: venv\Scripts\activate | Linux/Mac: source venv/bin/activate  

pip install -r requirements.txt  
uvicorn main:app --reload --port 8000  

4. Configurar el Frontend (Node.js)  

cd ../frontend  
npm install  
npm run dev  

🖥️ Funcionalidades Clave  

Monitoreo Geoespacial: Mapa interactivo basado en OpenStreetMap centrado en Satipo.  

Captura de Datos Automática: Al hacer clic en cualquier punto del mapa, el sistema simula la captura de variables ambientales (Temp, Humedad, NDVI, Pendiente).  

Evaluación de Riesgo: Motor de IA que clasifica el nivel de riesgo en: Bajo (Verde), Medio (Naranja) y Alto (Rojo).  

Historial y Mapas de Calor: Visualización de registros previos mediante Marcadores Circulares coloreados según el nivel de riesgo reportado.  

Arquitectura Escalable: Preparado para integración real con APIs de OpenWeather o Google Earth Engine.  

🧑‍💻 Autor  

Desarrollado para Tesis de Ingeniería - Satipo, Perú.  

Enfoque: Prevención de desastres naturales y conservación forestal mediante IA.  

🧠 Nota para el Desarrollador (MVP)  

El sistema se encuentra en fase de MVP (Minimum Viable Product). La lógica de IA utiliza actualmente un modelo entrenado con datos históricos locales. Para producción, se recomienda la conexión directa a servicios satelitales de la zona.