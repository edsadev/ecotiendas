from flask import Flask, request, abort, jsonify
import json
import sys
from src import app
from src.models.db import *
from src.prueba import enviar_email
import email.message
import smtplib

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    return response

@app.route('/')
def index():
    return jsonify({
        "hola":"Edmundo"
    })
@app.route('/materiales')
def get_materiales():
    materiales = Material.query.all()
    response = {}
    for material in materiales:
        response[material.id] = material.format()
    error = False
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'materiales': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "Materiales no disponibles"
                            })
@app.route('/sectores')
def get_sectores():
    sectores = Sector.query.all()
    response = {}
    for sector in sectores:
        response[sector.id] = sector.format()
    error = False
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'sectores': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "Sectores no disponibles"
                            })
@app.route('/eco-amigos')
def get_ecoAmigos():
    ecoamigos = EcoAmigo.query.all()
    response = [ecoAmigo.format() for ecoAmigo in ecoamigos]
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'ecoamigos': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "ecoamigos no disponibles"
                            })
@app.route('/eco-admin')
def get_ecoAdmin():
    ecoadmins = EcoAdmin.query.all()
    response = [ecoadmin.format() for ecoadmin in ecoadmins]
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'ecoadmins': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "ecoadmins no disponibles"
                            })
@app.route('/validacion-cedula', methods = ['POST'])
def get_cedulas():
    ecoamigos = EcoAmigo.query.all()
    data = request.data
    data_dictionary = json.loads(data)
    ecoamigo = EcoAmigo.query.filter(EcoAmigo.cedula == data_dictionary["cedula"]).first()

    if ecoamigo:
        return jsonify({
                            'success': True,
                            'mensaje': "Cedula existe",
                            'id_usuario': ecoamigo.id
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "Cedula no existe"
                            })
@app.route('/login', methods=['POST'])
def login():
    error = 'd'
    response = {}
    data = request.data
    data_dictionary = json.loads(data)
    print(data_dictionary)
    try:
        usuario = Usuario.query.filter(Usuario.usuario == data_dictionary["user"]).first()
        contraseña = data_dictionary['pass']
        if usuario.contraseña == contraseña:
            error = False
            if usuario.tipo == "ecoadmin":
                ecoadmin = EcoAdmin.query.filter(EcoAdmin.usuario_id == usuario.id).first()
                ecotienda = EcoTienda.query.filter(EcoTienda.ecoadmin_id == ecoadmin.id).first()
                response = {
                        'succes': True,
                        'rango': usuario.tipo,
                        'id': ecotienda.id 
                        }
            elif usuario.tipo == "ecoamigo":
                ecoamigo = EcoAmigo.query.filter(EcoAmigo.usuario_id == usuario.id).first()
                response = {
                        'succes': True,
                        'rango': usuario.tipo,
                        'id': ecoamigo.id
                        }
            else:
                ecotiendas = EcoTiendas.query.all()
                
                response = {
                    'succes': True,
                    'ecotiendas': [ecotienda.format() for ecotienda in ecotiendas]
                }
    except:        
        error = True
        print(sys.exc_info())
    
    if error:
        abort(404)
    else:
        return jsonify(response)

@app.route('/eco-amigos', methods = ['POST'])
def crear_ecoAmigo():
    error = False
    data = request.data
    print(data)
    data_dictionary = json.loads(data)
    cedula = data_dictionary["cedula"]
    nombre = data_dictionary["nombre"]
    apellido = data_dictionary["apellido"]
    direccion = data_dictionary["direccion"]
    genero = data_dictionary["genero"]
    correo = data_dictionary["correo"]
    telefono = data_dictionary["celular"]
    fecha_nacimiento = data_dictionary["fecha_nacimiento"]
    usuario = data_dictionary["usuario"]
    contraseña = data_dictionary["contraseña"]
    sector_id = data_dictionary["sector"]
    tipo = "ecoamigo"
    if Usuario.query.filter(Usuario.usuario == usuario).first():
        return jsonify({
                        'success': False,
                        'mensaje': "Este nombre de usuario ya está en uso"
                        })
    elif EcoAmigo.query.filter(EcoAmigo.cedula == cedula).first():
        return jsonify({
                        'success': False,
                        'mensaje': "Esta cedula ya existe"
                        })
    elif EcoAmigo.query.filter(EcoAmigo.correo == correo).first():
        return jsonify({
                        'success': False,
                        'mensaje': "Este correo ya está registrado"
                        })
    else:
        try: 
            usuario = Usuario(usuario = usuario, contraseña = contraseña, tipo = tipo)
            usuario.insert()
        except:
            error = True
            Usuario.rollback()
            print(sys.exc_info())
        try:
            
            ecoAmigo = EcoAmigo(cedula = cedula, fecha_nacimiento = fecha_nacimiento, nombre = nombre, apellido = apellido, direccion = direccion, genero = genero, correo = correo,
                                telefono = telefono, sector_id = sector_id, usuario_id = usuario.id)
            ecoAmigo.insert()
        except:
            error = True
            EcoAmigo.rollback()
            print(sys.exc_info())

    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'ecoAmigo': ecoAmigo.format()
                        })
@app.route('/eco-admin', methods = ['POST'])
def crear_ecoAdmin():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    cedula = data_dictionary["cedula"]
    nombre = data_dictionary["nombre"]
    apellido = data_dictionary["apellido"]
    direccion = data_dictionary["direccion"]
    genero = data_dictionary["genero"]
    correo = data_dictionary["correo"]
    telefono = data_dictionary["celular"]
    fecha_nacimiento = data_dictionary["fecha_nacimiento"]
    usuario = data_dictionary["usuario"]
    contraseña = data_dictionary["contraseña"]
    sector_id = data_dictionary["sector"]
    tipo = "ecoadmin"
    if Usuario.query.filter(Usuario.usuario == usuario).first():
        return jsonify({
                        'success': False,
                        'mensaje': "Usuario ya existe"
                        })
    elif EcoAmigo.query.filter(EcoAmigo.cedula == cedula).first():
        return jsonify({
                        'success': False,
                        'mensaje': "Cedula ya existe"
                        })
    else:
        try: 
            usuario = Usuario(usuario = usuario, contraseña = contraseña, tipo = tipo)
            usuario.insert()
        except:
            error = True
            Usuario.rollback()
            print(sys.exc_info())
        try:
            
            ecoAdmin = EcoAdmin(cedula = cedula, fecha_nacimiento = fecha_nacimiento, nombre = nombre, apellido = apellido, direccion = direccion, genero = genero, correo = correo,
                                telefono = telefono, sector_id = sector_id, usuario_id = usuario.id)
            ecoAdmin.insert()
        except:
            error = True
            EcoAmigo.rollback()
            print(sys.exc_info())

    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'ecoAdmin': ecoAdmin.format()
                        })

@app.route('/eco-tienda', methods = ['POST'])
def crear_ecoTienda():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    latitud = data_dictionary["latitud"]
    longitud = data_dictionary["longitud"]
    capacidad_maxima_m3 = data_dictionary["capacidad_maxima_m3"]
    capacidad_maxima_kg = data_dictionary["capacidad_maxima_kg"]
    cantidad_actual_m3 = data_dictionary["cantidad_actual_m3"]
    cantidad_actual_kg = data_dictionary["cantidad_actual_kg"]
    ecoadmin_id = data_dictionary["ecoadmin"]
    sectores_id = data_dictionary["sector"]

    try: 
        ecotienda = EcoTienda(latitud = latitud, longitud = longitud, 
                              capacidad_maxima_m3 = capacidad_maxima_m3, 
                              capacidad_maxima_kg = capacidad_maxima_kg, 
                              cantidad_actual_m3 = cantidad_actual_m3,
                              cantidad_actual_kg = cantidad_actual_kg,
                              ecoadmin_id = ecoadmin_id,
                              sectores_id = sectores_id
                              )
        ecotienda.insert()
    except:
        error = True
        EcoTienda.rollback()
        print(sys.exc_info())
    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'ecoTienda': ecotienda.format()
                        })
@app.route('/crear-ticket', methods = ['POST'])
def crear_ticket():
    error = False
    data = request.data
    print(data)
    data_dictionary = json.loads(data)
    ecoamigo_id = data_dictionary['ecoamigo']
    ecotienda_id = data_dictionary['ecotienda']
    entrada = data_dictionary['entrada']
    total_kg = data_dictionary['total_kg']
    total_m3 = data_dictionary['total_m3']
    total_ecopuntos = data_dictionary['total_ecopuntos']
    materiales = data_dictionary['materiales']
    cliente = EcoAmigo.query.filter(EcoAmigo.id == ecoamigo_id).first()
    try: 
        ticket = Tickets(entrada = entrada, total_kg = total_kg, total_m3 = total_m3, total_ecopuntos = total_ecopuntos,
                            ecoamigo_id = ecoamigo_id, ecotienda_id = ecotienda_id, cliente = f"{cliente.nombre} {cliente.apellido}"  )
        ticket.insert()
    except:
        error = True
        Tickets.rollback()
        print(sys.exc_info())

    try:
        for material in materiales:
            ticket_id = ticket.id
            material_id = material['id']
            cantidad_kg = material['cantidad_kg']
            ecopuntos = material['ecopuntos']
            cantidad_m3  = material['cantidad_m3']
            detalle = DetalleTickets(ticket_id = ticket_id, material_id = material_id, cantidad_kg = cantidad_kg, 
                                    ecopuntos = ecopuntos, cantidad_m3 = cantidad_m3)
            detalle.insert()
    except:
        error = True
        DetalleTickets.rollback()
        print(sys.exc_info())
    if error:
        abort(422)
    else:
        enviar_email(cliente.correo)
        return jsonify({
                        'success': True,
                        'ticket': ticket.format()
                        })

    
@app.route('/historial', methods = ['POST'])
def historial():
    error = False
    data = request.data
    print(data)
    data_dictionary = json.loads(data)
    ecotienda_id = data_dictionary['ecotienda']
    tickets = Tickets.query.filter(Tickets.ecotienda_id == ecotienda_id)
    response = [ticket.format() for ticket in tickets]
    if len(response) > 0:
        return jsonify({
                        'success': True,
                        'historial': response
                        })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "Historial no disponibles"
                            })
    