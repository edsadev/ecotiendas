import os
from sqlalchemy import Column, String, Integer, create_engine
from flask_sqlalchemy import SQLAlchemy
import json
from src import db
from datetime import datetime
from sqlalchemy.sql import func
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
    cedula = db.Column(db.String, nullable = False)
    fecha_nacimiento = db.Column(db.String)
    nombre = db.Column(db.String)
    fecha_registro = db.Column(db.DateTime(timezone=True), server_default=func.now())
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
                'correo': self.correo,
                'fecha': self.fecha_registro.strftime("%m/%d/%Y, %H:%M:%S")
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

class Regional(db.Model):
    __tablename__ = "regionales"
    id = db.Column(db.Integer, primary_key = True)
    cedula = db.Column(db.String, nullable = False)
    fecha_nacimiento = db.Column(db.String)
    nombre = db.Column(db.String)
    fecha_registro = db.Column(db.DateTime(timezone=True), server_default=func.now())
    apellido = db.Column(db.String)
    direccion = db.Column(db.String)
    genero = db.Column(db.String, nullable = False)
    correo = db.Column(db.String, nullable = False)
    telefono = db.Column(db.String)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable = False)
    usuario = db.relationship("Usuario", backref=db.backref("regional", uselist=False))
    def format(self):
        return {
                'id': self.id,
                'nombre': self.nombre,
                'genero': self.genero,
                'correo': self.correo,
                'fecha': self.fecha_registro.strftime("%m/%d/%Y, %H:%M:%S")
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

class Bodeguero(db.Model):
    __tablename__ = "bodegueros"
    id = db.Column(db.Integer, primary_key = True)
    cedula = db.Column(db.String, nullable = False)
    fecha_nacimiento = db.Column(db.String)
    nombre = db.Column(db.String)
    fecha_registro = db.Column(db.DateTime(timezone=True), server_default=func.now())
    apellido = db.Column(db.String)
    direccion = db.Column(db.String)
    genero = db.Column(db.String, nullable = False)
    correo = db.Column(db.String, nullable = False)
    telefono = db.Column(db.String)
    regional_id = db.Column(db.Integer, db.ForeignKey('regionales.id'))
    sector_id = db.Column(db.Integer, db.ForeignKey('sectores.id'), nullable = False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable = False)
    usuario = db.relationship("Usuario", backref=db.backref("bodeguero", uselist=False))
    def format(self):
        return {
                'id': self.id,
                'nombre': self.nombre,
                'genero': self.genero,
                'correo': self.correo,
                'fecha': self.fecha_registro.strftime("%m/%d/%Y, %H:%M:%S")
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
    cedula = db.Column(db.String, nullable = False)
    fecha_nacimiento = db.Column(db.String)
    nombre = db.Column(db.String)
    apellido = db.Column(db.String)
    direccion = db.Column(db.String)
    fecha_registro = db.Column(db.DateTime(timezone=True), server_default=func.now())
    genero = db.Column(db.String, nullable = False)
    correo = db.Column(db.String, nullable = False)
    telefono = db.Column(db.String)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable = False)
    regional_id = db.Column(db.Integer, db.ForeignKey('regionales.id'))
    ecotiendas = db.relationship("EcoTienda", backref="ecoadmin")
    usuario = db.relationship("Usuario", backref=db.backref("ecoadmin", uselist=False))
    def format(self):
        print(self.fecha_registro, type(self.fecha_registro))
        return {
                'id': self.id,
                'nombre': self.nombre,
                'cedula': self.cedula,
                'apellido': self.apellido,
                'fecha_registro': self.fecha_registro.strftime("%m/%d/%Y, %H:%M:%S")
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
    latitud = db.Column(db.String, nullable = False)
    longitud = db.Column(db.String, nullable = False)
    fecha_registro = db.Column(db.DateTime(timezone=True), server_default=func.now())
    capacidad_maxima_m3 = db.Column(db.Integer, nullable = False)
    capacidad_maxima_kg = db.Column(db.Integer, nullable = False)
    cantidad_actual_m3 = db.Column(db.Integer, nullable = False)
    cantidad_actual_kg = db.Column(db.Integer, nullable = False)
    meta_semanal = db.Column(db.Integer)
    regional_id = db.Column(db.Integer, db.ForeignKey('regionales.id'))
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
    cantidad_actual_kg = db.Column(db.Integer, default = 0)
    cantidad_actual_m3 = db.Column(db.Integer, default = 0)
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

class Records(db.Model):
    __tablename__ = 'records'
    id = db.Column(db.Integer, primary_key = True)
    ecotienda_id = db.Column(db.Integer, db.ForeignKey('ecoTiendas.id'), nullable = False)
    peso = db.Column(db.Integer, nullable = False)


    def format(self):
        return {
                'id': self.id,
                'peso': self.peso
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

class DetalleTickets(db.Model):
    __tablename__ = "detalle_ticket"
    id = db.Column(db.Integer, primary_key = True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id'))
    material_id = db.Column(db.Integer, db.ForeignKey('materiales.id'))
    numero_semana = db.Column(db.String, nullable = False, default =datetime.now().strftime("%W"))
    mes = db.Column(db.String, nullable = False, default =datetime.now().strftime("%m"))
    año = db.Column(db.String, nullable = False, default =datetime.now().strftime("%Y"))
    cantidad_kg = db.Column(db.Integer, nullable = False)
    ecopuntos = db.Column( db.Integer)
    cantidad_m3 = db.Column(db.Integer, nullable = False)
    detalle = db.relationship('Material')

    def format(self):
        return {
                'id': self.id,
                'ecopuntos': self.ecopuntos,
                'cantidad_m3': self.cantidad_m3
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


class Tickets(db.Model):
    __tablename__ = 'tickets'
    id = db.Column(db.Integer, primary_key = True)
    numero_semana = db.Column(db.String, nullable = False, default =datetime.now().strftime("%W"))
    mes = db.Column(db.String, nullable = False, default =datetime.now().strftime("%m"))
    año = db.Column(db.String, nullable = False, default =datetime.now().strftime("%Y"))
    cliente = db.Column(db.String)
    entrada = db.Column(db.Boolean, nullable = False)
    total_kg = db.Column(db.Integer, nullable = False)
    total_m3 = db.Column(db.Integer, nullable = False)
    total_ecopuntos = db.Column(db.Integer)
    ecoamigo_id = db.Column(db.Integer, db.ForeignKey('ecoAmigos.id'))
    ecotienda_id = db.Column(db.Integer, db.ForeignKey('ecoTiendas.id'), nullable = False)
    materiales = db.relationship('DetalleTickets')
    fecha_registro = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def format(self):
        return {
                'id': self.id,
                'fecha': self.fecha_registro.isoformat(),
                'entrada': self.entrada,
                'total_kg': self.total_kg,
                'total_ecopuntos': self.total_ecopuntos,
                'cliente': self.cliente
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
    cantidad_m3 = db.Column(db.Integer, nullable = True)
    valor_max = db.Column(db.Integer, nullable = False)
    valor_min = db.Column(db.Integer, nullable = False)
    tipo_material_id = db.Column(db.Integer, db.ForeignKey('tipoMateriales.id'), nullable = False)

    def format(self):
        return {
                'id': self.id,
                'nombre': self.nombre,
                'ecopuntos': self.ecopuntos,
                'tipo_material_id': self.tipo_material_id,
                'cantidad_m3': self.cantidad_m3
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

class DetalleCanje(db.Model):
    __tablename__ = "detalle_canje"
    id = db.Column(db.Integer, primary_key = True)
    canje_id = db.Column(db.Integer, db.ForeignKey('canjes.id'))
    producto_id = db.Column(db.Integer, db.ForeignKey('productos.id'))
    numero_semana = db.Column(db.String, nullable = False, default =datetime.now().strftime("%W"))
    mes = db.Column(db.String, nullable = False, default =datetime.now().strftime("%m"))
    año = db.Column(db.String, nullable = False, default =datetime.now().strftime("%Y"))
    ecopuntos = db.Column( db.Integer)
    detalle = db.relationship('Producto')

    def format(self):
        return {
                'id': self.id,
                'ecopuntos': self.ecopuntos,
            
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


class Caje(db.Model):
    __tablename__ = 'canjes'
    id = db.Column(db.Integer, primary_key = True)
    numero_semana = db.Column(db.String, nullable = False, default =datetime.now().strftime("%W"))
    mes = db.Column(db.String, nullable = False, default =datetime.now().strftime("%m"))
    año = db.Column(db.String, nullable = False, default =datetime.now().strftime("%Y"))
    cliente = db.Column(db.String)
    entrada = db.Column(db.Boolean, nullable = False)
    total_ecopuntos = db.Column(db.Integer)
    ecoamigo_id = db.Column(db.Integer, db.ForeignKey('ecoAmigos.id'))
    bodeguero_id = db.Column(db.Integer, db.ForeignKey('bodegueros.id'), nullable = False)
    productos = db.relationship('DetalleCanje')
    fecha_registro = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def format(self):
        return {
                'id': self.id,
                'fecha': self.fecha_registro.isoformat(),
                'entrada': self.entrada,
                'total_ecopuntos': self.total_ecopuntos,
                
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

class Producto(db.Model):
    __tablename__ = 'productos'
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String, nullable = False)
    detalle = db.Column(db.String, nullable = False)
    codigo = db.Column(db.String, nullable = False)
    ecopuntos = db.Column(db.Integer, nullable = False)
    valor_max = db.Column(db.Integer, nullable = False)
    valor_min = db.Column(db.Integer, nullable = False)
    tipo_producto_id = db.Column(db.Integer, db.ForeignKey('tipoProductos.id'), nullable = False)

    def format(self):
        return {
                'id': self.id,
                'nombre': self.nombre,
                'ecopuntos': self.ecopuntos,
                'tipo_material_id': self.tipo_producto_id,
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

class TipoProductos(db.Model):
    __tablename__ = 'tipoProductos'
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String, nullable = False)
    detalle = db.Column(db.String, nullable = False)
    codigo = db.Column(db.String, nullable = False)
    ecopuntos = db.Column(db.Integer, nullable = False)
    materiales = db.relationship("Producto", backref="tipoProductos")

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