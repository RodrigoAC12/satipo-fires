from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.domain.entities.entities import ZonaRiesgo

# Importamos AMBOS casos de uso (guardar y leer)
from app.application.useCases.use_cases import registrar_zona_riesgo, obtener_zonas_riesgo, obtener_estadisticas

router = APIRouter()

# Puerta 1: Para GUARDAR datos (POST)
@router.post("/zonas/")
def crear_zona(zona: ZonaRiesgo, db: Session = Depends(get_db)):
    nueva_zona = registrar_zona_riesgo(db=db, zona=zona)
    return nueva_zona

# Puerta 2: Para ENTREGAR datos a React (GET)
@router.get("/zonas/")
def listar_zonas(db: Session = Depends(get_db)):
    zonas = obtener_zonas_riesgo(db=db)
    return zonas

@router.get("/stats/")
def listar_estadisticas(db: Session = Depends(get_db)):
    return obtener_estadisticas(db=db)

from app.infrastructure.nasa_service import obtener_puntos_calor_nasa

@router.get("/nasa-hotspots/")
def listar_puntos_nasa():
    return obtener_puntos_calor_nasa()