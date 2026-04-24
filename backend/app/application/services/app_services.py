# Servicios de aplicación
# Aquí puedes colocar servicios transversales, conversión de datos, orquestación, etc.

class ConvertidorZonas:
    """Servicio para convertir entre Entidades de Dominio y DTOs"""
    
    @staticmethod
    def zona_db_a_zona_dominio(zona_db):
        """Convierte un modelo de DB a una Entidad de Dominio"""
        pass
    
    @staticmethod
    def zona_dominio_a_json(zona):
        """Convierte una Entidad de Dominio a JSON para respuesta HTTP"""
        pass
