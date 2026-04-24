from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.database import engine, Base
from app.infrastructure.adapters.output import models
from app.infrastructure.adapters.input.api import router as api_router
import logging

logger = logging.getLogger(__name__)

# Intentamos crear las tablas, pero no fallaremos si la BD no está disponible
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Tablas de base de datos creadas/verificadas exitosamente.")
except Exception as e:
    logger.warning(f"Advertencia al crear tablas de BD: {e}. La BD puede no estar disponible.")

app = FastAPI(
    title="API de Predicción de Incendios - Satipo",
    version="1.0.0"
)

# --- CONFIGURACIÓN CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción se pone la URL de React, aquí permitimos todo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------

app.include_router(api_router)

@app.get("/")
def ruta_raiz():
    return {"mensaje": "API y Base de Datos listas."}