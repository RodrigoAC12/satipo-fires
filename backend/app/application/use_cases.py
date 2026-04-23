from sqlalchemy.orm import Session
from app.domain.entities import ZonaRiesgo
from app.infrastructure.models import ZonaRiesgoDB
from app.infrastructure.ml_service import predecir_riesgo_incendio
from sqlalchemy import func

def registrar_zona_riesgo(db: Session, zona: ZonaRiesgo):
    """
    Caso de Uso: Registrar una nueva zona y evaluar su riesgo.
    Coordina la lógica entre el dominio, la IA y la infraestructura (DB).
    """
    
    # 1. Ejecución de la lógica de negocio (IA)
    # Nota: Pasamos los parámetros necesarios al servicio de Machine Learning.
    # Si tu modelo .joblib fue entrenado con la pendiente, asegúrate de pasarla aquí.
    riesgo_calculado = predecir_riesgo_incendio(
        temperatura=zona.temperatura, 
        humedad=zona.humedad, 
        ndvi=zona.ndvi
    )
    
    # 2. Mapeo de Entidad de Dominio a Modelo de Persistencia (Infrastructure)
    # Aquí nos aseguramos de que todos los campos del frontend se guarden.
    db_zona = ZonaRiesgoDB(
        nombre_sector=zona.nombre_sector,
        latitud=zona.latitud,
        longitud=zona.longitud,
        temperatura=zona.temperatura,
        humedad=zona.humedad,
        ndvi=zona.ndvi,
        pendiente=zona.pendiente,  # <--- CORRECCIÓN: Ahora persiste en la DB
        nivel_riesgo=riesgo_calculado 
    )
    
    # 3. Persistencia de datos en PostgreSQL
    try:
        db.add(db_zona)
        db.commit()
        db.refresh(db_zona)
        return db_zona
    except Exception as e:
        db.rollback()
        print(f"Error al persistir en base de datos: {e}")
        raise e

def obtener_zonas_riesgo(db: Session):
    """
    Caso de Uso: Recuperar el historial completo de zonas monitoreadas.
    """
    return db.query(ZonaRiesgoDB).all()

def obtener_estadisticas(db: Session):
    """
    Caso de Uso: Calcular métricas para el Dashboard principal.
    """
    total = db.query(ZonaRiesgoDB).count()
    
    # Contamos cuántas alertas críticas tenemos (Nivel Alto)
    alto_riesgo = db.query(ZonaRiesgoDB).filter(ZonaRiesgoDB.nivel_riesgo == "Alto").count()
    
    return {
        "total_zonas": total,
        "alto_riesgo": alto_riesgo,
        "precision_modelo": 92.5  # Valor obtenido de la fase de validación del modelo RF
    }