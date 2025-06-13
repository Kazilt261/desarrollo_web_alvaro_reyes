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

Primero, cambia la consola de Windows a codificación UTF-8 para evitar problemas con caracteres especiales:

```bash
chcp 65001
```
Luego, asegúrate de que la base de datos tarea2 exista. Puedes crearla así:
```bash
mysql -u cc5002 -p
"Password"
CREATE DATABASE tarea2 CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
EXIT;
```
# Cargar estructura de tablas y datos
Usa los siguientes comandos para poblar la base de datos con las tablas y datos necesarios:
```bash
mysql -u cc5002 -p --default-character-set=utf8mb4 tarea2 < tarea2.sql
mysql -u cc5002 -p --default-character-set=utf8mb4 tarea2 < region-comuna.sql
mysql -u cc5002 -p --default-character-set=utf8mb4 tarea2 < tabla-comentario.sql
```
## 6. Ejecutar la aplicación

# Definir variable de entorno
flask run
