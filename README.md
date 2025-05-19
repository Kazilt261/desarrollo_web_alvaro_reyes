# Tarea 2 – Gestión de Actividades Recreativas

## 1. Descripción  
Aplicación web en Flask para la gestión de actividades recreativas.  
- **Rutas principales**:  
  - `/` → Portada  
  - `/informar` → Formulario de nueva actividad  
  - `/listado` → Listado paginado de actividades (5 por página)  
  - `/actividades/<id>` → Detalle de una actividad

## 2. Estructura del repositorio  
Tarea2/
├── app.py
├── config.py # Configuración de conexión (cc5002/programacionweb)
├── models.py # Modelos SQLAlchemy
├── requirements.txt
├── tarea2.sql # DDL: CREATE TABLE, CONSTRAINTS
├── region-comuna.sql # INSERTs de regiones y comunas
├── tarea2.png # Diagrama ER en PNG
├── README.md # Este archivo
├── static/
│ ├── css/
│ └── js/
└── templates/
    ├──── portada.html
    ├──── informar.html
    ├──── listado.html
    ├──── listado_detalle.html
    └──── estadisticas.html


## 3. Requisitos  
- Python 3.8+  
- MySQL  
- pip

## 4. Instalación y puesta en marcha  
```bash
git clone https://github.com/Kazilt261/desarrollo_web_alvaro_reyes.git
cd desarrollo_web_alvaro_reyes
git checkout Tarea-2

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

## 5. Configurar base de datos

# Crear tablas y constraints
type .\tarea2.sql | mysql -u cc5002 -p tarea2

# Poblar regiones y comunas
type .\region-comuna.sql | mysql -u cc5002 -p tarea2

## 6. Ejecutar la aplicación

# Definir variable de entorno
flask run
