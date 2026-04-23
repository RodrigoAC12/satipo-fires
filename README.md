# 🛰️ Satipo-IA: Predicción de Incendios Forestales

Sistema basado en **Arquitectura Hexagonal** que utiliza Machine Learning para predecir riesgos de incendio en la provincia de Satipo.

## 🛠️ Requisitos
- Python 3.10+
- Node.js 18+
- PostgreSQL

## 🚀 Instalación Rápida
1. **Clonar:** `git clone https://github.com/tu-usuario/tu-repo.git`
2. **Base de Datos:** Crea una base de datos en PostgreSQL llamada `satipo_fires`.
3. **Ejecutar Automatización:**
   - Haz doble clic en `instalar.bat` (solo la primera vez).
   - Haz doble clic en `iniciar.bat` para abrir el sistema.

## 📂 Arquitectura
El proyecto sigue el patrón **Hexagonal (Clean Architecture)**:
- `domain`: Reglas de negocio.
- `application`: Casos de uso e IA.
- `infrastructure`: PostgreSQL, APIs externas (NASA/OpenWeather).
- `presentation`: API con FastAPI.