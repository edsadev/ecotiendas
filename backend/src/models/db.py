import os
from sqlalchemy import Column, String, Integer, create_engine
from flask_sqlalchemy import SQLAlchemy
import json
from src import db

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
    telefono = db.Column(db.Integer)
    usuario = db.Column(db.String, nullable = False)
    contraseña = db.Column(db.String, nullable = False)

    def format(self):
        return {
                'id': self.id,
                'nombre': self.nombre,
                'genero': self.genero,
                'usuario': self.usuario
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
    usuario = db.Column(db.String, nullable = False)
    contraseña = db.Column(db.String, nullable = False)
    #id_sector

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

class EcoTienda(db.Model):
    __tablename__ = 'ecoTiendas'
    id = db.Column(db.Integer, primary_key = True)
    latitud = db.Column(String, nullable = False)
    longitud = db.Column(db.String, nullable = False)
    capacidad_m3 = db.Column(db.Integer)
    capacidad_kg = db.Column(db.Integer)
    # id_ecotienda = 
    # id_sector = 

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

class Sector(db.Model):
    __tablename__ = "sectores"
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String)
    zipCode = db.Column(db.String)
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