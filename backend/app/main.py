from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.database import engine, Base
from app.infrastructure.adapters.output import models
from app.infrastructure.adapters.input.api import router as api_router
import logging
import os

logger = logging.getLogger(__name__)

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Intentamos crear las tablas, pero no fallaremos si la BD no está disponible
try:
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Tablas de base de datos creadas/verificadas exitosamente.")
except Exception as e:
    logger.error(f"❌ Error al crear tablas de BD: {e}")
    logger.warning("⚠️  La base de datos puede no estar disponible. Verifica tu .env")

app = FastAPI(
    title="API de Predicción de Incendios - Satipo",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# --- CONFIGURACIÓN CORS ---
# Detectar ambiente (desarrollo vs producción)
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')

if ENVIRONMENT == 'production':
    # En producción, solo permitir origen específico
    allowed_origins = [
        os.getenv('FRONTEND_URL', 'https://tudominio.com'),
    ]
else:
    # En desarrollo, permitir localhost con diferentes puertos
    allowed_origins = [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

logger.info(f"🔐 CORS configurado para: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
# --------------------------

app.include_router(api_router)

@app.get("/")
def ruta_raiz():
    return {
        "mensaje": "✅ API Satipo Fire Prediction - Listo",
        "docs": "http://localhost:8000/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}