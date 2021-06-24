import os
from sqlalchemy import Column, String, Integer, create_engine
from flask_sqlalchemy import SQLAlchemy
import json
from src import db
from datetime import datetime
# db = SQLAlchemy()
# database_name = os.getenv('DB_NAME',"ecotiendas")
# user = os.getenv('DB_USER','jamiltorres')
# password = os.getenv('DB_PASSWORD', '')
# ip_server = os.getenv('DB_IP_SERVER', 'localhost')
# port = os.getenv('DB_PORT','5432')
# database_path = f"postgres+psycopg2://{user}:{password}@{ip_server}:{port}/{database_name}"

# def setup_db(app, database_path=database_path):
#     app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URL', database_path)
#     app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
#     db.app = app
#     db.init_app(app)
#     #db.drop_all()
#     db.create_all()
#     return db

class EcoAmigo(db.Model):
    __tablename__ = "ecoAmigos"
    id = db.Column(db.Integer, primary_key = True)
    cedula = db.Column(db.Integer, nullable = False)
    nombre = db.Column(db.String)
    apellido = db.Column(db.String)
    direccion = db.Column(db.String)
    genero = db.Column(db.String, nullable = False)
    correo = db.Column(db.String, nullable = False)
    telefono = db.Column(db.String)
    ecopuntos = db.Column(db.Integer, default = 0)
    sector_id = db.Column(db.Integer, db.ForeignKey('sectores.id'), nullable = False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable = False)
    tickets = db.relationship("Tickets", backref="ecoamigo")
    usuario = db.relationship("Usuario", backref=db.backref("ecoamigo", uselist=False))
    def format(self):
        return {
                'id': self.id,
                'nombre': self.nombre,
                'genero': self.genero,
                'correo': self.correo
        }
    
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self):
        db.session.commit()
    
    def rollback():
        db.session.rollback()
    
    def __repre__(self):
        return json.dumps(self.format())


class EcoAdmin(db.Model):
    __tablename__ = "ecoAdmins"
    id = db.Column(db.Integer, primary_key = True)
    cedula = db.Column(db.Integer, nullable = False)
    nombre = db.Column(db.String)
    apellido = db.Column(db.String)
    direccion = db.Column(db.String)
    genero = db.Column(db.String, nullable = False)
    correo = db.Column(db.String, nullable = False)
    telefono = db.Column(db.Integer)
    sector_id = db.Column(db.Integer, db.ForeignKey('sectores.id'), nullable = False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable = False)
    ecotiendas = db.relationship("EcoTienda", backref="ecoadmin")
    usuario = db.relationship("Usuario", backref=db.backref("ecoadmin", uselist=False))
    def format(self):
        return {
                'id': self.id,
                'nombre': self.nombre,
                'cedula': self.cedula
        }
    
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self):
        db.session.commit()
    
    def rollback():
        db.session.rollback()
    
    def __repre__(self):
        return json.dumps(self.format())

class EcoTienda(db.Model):
    __tablename__ = 'ecoTiendas'
    id = db.Column(db.Integer, primary_key = True)
    latitud = db.Column(String, nullable = False)
    longitud = db.Column(db.String, nullable = False)
    capacidad_maxima_m3 = db.Column(db.Integer, nullable = False)
    capacidad_maxima_kg = db.Column(db.Integer, nullable = False)
    cantidad_acutal_m3 = db.Column(db.Integer, nullable = False)
    cantidad_actual_kg = db.Column(db.Integer, nullable = False)
    ecoadmin_id = db.Column(db.Integer, db.ForeignKey('ecoAdmins.id'), nullable = False)
    sectores_id = db.Column(db.Integer, db.ForeignKey('sectores.id'), nullable = False)
    tickets = db.relationship("Tickets", backref="ecotienda")

    def format(self):
        return {
                'id': self.id,
                'capacidad_maxima_m3': self.capacidad_maxima_m3,
                'capacidad_maxima_kg': self.capacidad_maxima_kg,
                'cantidad_actual_m3': self.cantidad_actual_m3,
                'cantidad_actual_kg': self.cantidad_actual_kg
        }
    
    def posicion(self):
        return {self.id:
                        {
                            'latitud': self.latitud,
                            'longitud': self.longitud
                        }
        }
    
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self):
        db.session.commit()
    
    def rollback():
        db.session.rollback()
    
    def __repre__(self):
        return json.dumps(self.format())

class Sector(db.Model):
    __tablename__ = "sectores"
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String)
    zipCode = db.Column(db.String)
    ecotiendas = db.relationship("EcoTienda", backref="sector")
    ecoamigos = db.relationship("EcoAmigo", backref="sector")
    ecoadmin = db.relationship("EcoAdmin", backref="sector")
    def format(self):
        return {
                'id': self.id,
                'nombre': self.nombre,
                'zip_code': self.zipCode,
        }
    
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self):
        db.session.commit()
    
    def rollback():
        db.session.rollback()
    
    def __repre__(self):
        return json.dumps(self.format())

class Usuario(db.Model):
    __tablename__ = "usuarios"
    id = db.Column(db.Integer, primary_key = True)
    usuario = db.Column(db.String, nullable = False)
    contraseña = db.Column(db.String, nullable = False)
    tipo = db.Column(db.String, nullable = False)

    def format(self):
        return {
                'id': self.id,
                'name': self.name,
                'gender': self.gender,
                'age': self.age
        }
    
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self):
        db.session.commit()
    
    def rollback():
        db.session.rollback()
    
    def __repre__(self):
        return json.dumps(self.format())

class Almacen(db.Model):
    __tablename__ = 'almacenes'
    id = db.Column(db.Integer, primary_key = True)
    cantidad_kg = db.Column(db.Integer, default = 0)
    cantidad_m3 = db.Column(db.Integer, default = 0)
    ecotienda_id = db.Column(db.Integer, db.ForeignKey('ecoTiendas.id'), nullable = False)
    material_id = db.Column(db.Integer, db.ForeignKey('materiales.id'), nullable = False)
    ecotienda = db.relationship("EcoTienda", backref=db.backref("almacen", uselist=False))
    material = db.relationship("Material", backref=db.backref("almacen", uselist=False))
    def format(self):
        return {
                'id': self.id,
                'name': self.name,
                'gender': self.gender,
                'age': self.age
        }
    
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self):
        db.session.commit()
    
    def rollback():
        db.session.rollback()
    
    def __repre__(self):
        return json.dumps(self.format())
detalle_ticket = db.Table('detalle_ticket',
    db.Column('ticket_id', db.Integer, db.ForeignKey('tickets.id'), primary_key=True),
    db.Column('material_id', db.Integer, db.ForeignKey('materiales.id'), primary_key=True),
    db.Column('cantidad_kg', db.Integer, nullable = False),
    db.Column('ecopuntos', db.Integer, nullable = False),
    db.Column('cantidad_m3', db.Integer, nullable = False)
)
class Tickets(db.Model):
    __tablename__ = 'tickets'
    id = db.Column(db.Integer, primary_key = True)
    fecha = db.Column(db.DateTime, nullable = False, default = datetime.strftime(datetime.today(), "%b %d %Y"))
    numero_semana = db.Column(db.String, nullable = False, default =datetime.now().strftime("%W"))
    entrada = db.Column(db.Boolean, nullable = False)
    total_kg = db.Column(db.Integer, nullable = False)
    total_m3 = db.Column(db.Integer, nullable = False)
    total_ecopuntos = db.Column(db.Integer, nullable = False)
    ecoamigo_id = db.Column(db.Integer, db.ForeignKey('ecoAmigos.id'), nullable = False)
    ecotienda_id = db.Column(db.Integer, db.ForeignKey('ecoTiendas.id'), nullable = False)
    materiales = db.relationship('Material', secondary = detalle_ticket, backref=db.backref('tickets', lazy=True))

    def format(self):
        return {
                'id': self.id,
                'name': self.name,
                'gender': self.gender,
                'age': self.age
        }
    
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self):
        db.session.commit()
    
    def rollback():
        db.session.rollback()
    
    def __repre__(self):
        return json.dumps(self.format())


class Material(db.Model):
    __tablename__ = 'materiales'
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String, nullable = False)
    detalle = db.Column(db.String, nullable = False)
    codigo = db.Column(db.String, nullable = False)
    ecopuntos = db.Column(db.Integer, nullable = False)
    valor_max = db.Column(db.Integer, nullable = False)
    valor_min = db.Column(db.Integer, nullable = False)
    tipo_material_id = db.Column(db.Integer, db.ForeignKey('tipoMateriales.id'), nullable = False)

    def format(self):
        return {
                'id': self.id,
                'nombre': self.nombre,
                'ecopuntos': self.ecopuntos,
                'tipo_material_id': self.tipo_material_id
        }
    
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self):
        db.session.commit()
    
    def rollback():
        db.session.rollback()
    
    def __repre__(self):
        return json.dumps(self.format())

class TipoMaterial(db.Model):
    __tablename__ = 'tipoMateriales'
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String, nullable = False)
    detalle = db.Column(db.String, nullable = False)
    codigo = db.Column(db.String, nullable = False)
    ecopuntos = db.Column(db.Integer, nullable = False)
    materiales = db.relationship("Material", backref="tipoMaterial")

    def format(self):
        return {
                'id': self.id,
                'name': self.name,
                'gender': self.gender,
                'age': self.age
        }
    
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self):
        db.session.commit()
    
    def rollback():
        db.session.rollback()
    
    def __repre__(self):
        return json.dumps(self.format())