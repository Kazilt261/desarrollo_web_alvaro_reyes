import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

USER = "cc5002"
PASSWORD = "programacionweb"
HOST = "localhost"
PORT = "3306"
DB   = "tarea2"

SQLALCHEMY_DATABASE_URI = (
    f"mysql+pymysql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB}"
    "?charset=utf8mb4"
)


SQLALCHEMY_TRACK_MODIFICATIONS = False

SECRET_KEY = os.environ.get('SECRET_KEY', 'clave_de_prueba_muy_segura')

UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')

JSON_AS_ASCII = False

SQLALCHEMY_ENGINE_OPTIONS = {
    'connect_args': {
        'charset': 'utf8mb4',
        'use_unicode': True
    }
}
