from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.domain.entities.entities import ZonaRiesgo
import logging

logger = logging.getLogger(__name__)

# Importamos AMBOS casos de uso (guardar y leer)
from app.application.useCases.use_cases import registrar_zona_riesgo, obtener_zonas_riesgo, obtener_estadisticas

router = APIRouter()

# Puerta 1: Para GUARDAR datos (POST)
@router.post("/zonas/")
def crear_zona(zona: ZonaRiesgo, db: Session = Depends(get_db)):
    """Endpoint para crear una nueva zona de riesgo con análisis de ML"""
    try:
        logger.info(f"📥 POST /zonas/ - Creando zona: {zona.nombre_sector}")
        nueva_zona = registrar_zona_riesgo(db=db, zona=zona)
        logger.info(f"✅ Zona creada exitosamente: {nueva_zona.id}")
        return nueva_zona
    except ValueError as e:
        logger.error(f"❌ Error de validación: {e}")
        raise HTTPException(status_code=422, detail=f"Datos inválidos: {str(e)}")
    except Exception as e:
        logger.error(f"❌ Error inesperado al crear zona: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Error al guardar la zona: {str(e)}"
        )

# Puerta 2: Para ENTREGAR datos a React (GET)
@router.get("/zonas/")
def listar_zonas(db: Session = Depends(get_db)):
    """Endpoint para obtener todas las zonas registradas"""
    try:
        logger.info("📥 GET /zonas/ - Obteniendo zonas")
        zonas = obtener_zonas_riesgo(db=db)
        logger.info(f"✅ Se retornaron {len(zonas)} zonas")
        return zonas
    except Exception as e:
        logger.error(f"❌ Error al obtener zonas: {e}")
        raise HTTPException(status_code=500, detail=f"Error al obtener zonas: {str(e)}")

@router.get("/stats/")
def listar_estadisticas(db: Session = Depends(get_db)):
    """Endpoint para obtener estadísticas del dashboard"""
    try:
        logger.info("📥 GET /stats/ - Obteniendo estadísticas")
        stats = obtener_estadisticas(db=db)
        logger.info(f"✅ Estadísticas obtenidas")
        return stats
    except Exception as e:
        logger.error(f"❌ Error al obtener estadísticas: {e}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

from app.infrastructure.adapters.output.nasa_service import obtener_puntos_calor_nasa

@router.get("/nasa-hotspots/")
def listar_puntos_nasa():
    """Endpoint para obtener puntos de calor de NASA"""
    try:
        logger.info("📥 GET /nasa-hotspots/ - Obteniendo puntos NASA")
        puntos = obtener_puntos_calor_nasa()
        logger.info(f"✅ Se retornaron {len(puntos)} puntos NASA")
        return puntos
    except Exception as e:
        logger.error(f"❌ Error al obtener puntos NASA: {e}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
