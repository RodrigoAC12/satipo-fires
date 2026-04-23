from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # <-- Nueva importación
from app.infrastructure.database import engine, Base
from app.infrastructure import models
from app.presentation.api import router as api_router

Base.metadata.create_all(bind=engine)

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