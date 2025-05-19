# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Region(db.Model):
    __tablename__ = 'region'
    id     = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(200), nullable=False)

    comunas = db.relationship('Comuna', back_populates='region')


class Comuna(db.Model):
    __tablename__ = 'comuna'
    id        = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre    = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)

    region      = db.relationship('Region', back_populates='comunas')
    actividades = db.relationship('Actividad', back_populates='comuna')


class Actividad(db.Model):
    __tablename__ = 'actividad'
    id               = db.Column(db.Integer, primary_key=True, autoincrement=True)
    comuna_id        = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)
    sector           = db.Column(db.String(100))
    nombre           = db.Column(db.String(200), nullable=False)
    email            = db.Column(db.String(100), nullable=False)
    celular          = db.Column(db.String(15))
    dia_hora_inicio  = db.Column(db.DateTime, nullable=False)
    dia_hora_termino = db.Column(db.DateTime)
    descripcion      = db.Column(db.String(500))

    comuna     = db.relationship('Comuna', back_populates='actividades')
    temas      = db.relationship('ActividadTema', back_populates='actividad',  cascade='all, delete-orphan')
    contactos  = db.relationship('ContactarPor',   back_populates='actividad',  cascade='all, delete-orphan')
    fotos      = db.relationship('Foto',            back_populates='actividad',  cascade='all, delete-orphan')


class ActividadTema(db.Model):
    __tablename__ = 'actividad_tema'
    id           = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tema         = db.Column(
        db.Enum(
            'música','deporte','ciencias','religión','política',
            'tecnología','juegos','baile','comida','otro'
        ),
        nullable=False
    )
    glosa_otro   = db.Column(db.String(15))
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)

    actividad = db.relationship('Actividad', back_populates='temas')


class ContactarPor(db.Model):
    __tablename__ = 'contactar_por'
    id            = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre        = db.Column(
        db.Enum('whatsapp','telegram','X','instagram','tiktok','otra'),
        nullable=False
    )
    identificador = db.Column(db.String(150), nullable=False)
    actividad_id  = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)

    actividad = db.relationship('Actividad', back_populates='contactos')


class Foto(db.Model):
    __tablename__ = 'foto'
    id             = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ruta_archivo   = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    actividad_id   = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)

    actividad = db.relationship('Actividad', back_populates='fotos')

class Tema(db.Model):
    __tablename__ = 'actividad_tema'
    __table_args__ = {'extend_existing': True} 

    id           = db.Column(db.Integer,
                             primary_key=True,
                             autoincrement=True)
    actividad_id = db.Column(db.Integer,
                             db.ForeignKey('actividad.id'),
                             nullable=False)
    tema         = db.Column(db.String(50),
                             nullable=False)