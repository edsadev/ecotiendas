from flask import Flask, request, abort, jsonify
import json
import sys
from src import app
from src.models.db import *

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
        response[material.nombre] = material.format()
    error = False
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'materiales': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'materiales': "Materiales no disponibles"
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
                            'ecoamigos': "ecoamigos no disponibles"
                            })

@app.route('/login', methods=['POST'])
def obtener_usuario():
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
                ecotiendas = EcoTienda.query.filter(EcoTienda.ecoadmin_id == ecoadmin.id)
                response = {
                        'succes': True,
                        'tipo': usuario.tipo,
                        'id_ecotiendas': [ecotienda.id for ecotienda in ecotiendas]
                        }
            elif usuario.tipo == "ecoamigo":
                ecoamigo = EcoAmigo.query.filter(EcoAmigo.usuario_id == usuario_id).first()
                response = {
                        'succes': True,
                        'tipo': usuario.tipo,
                        'id_ecotamigo': ecoamigo.id
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
    data_dictionary = json.loads(data)

    try:
        cedula = data_dictionary["cedula"]
        nombre = data_dictionary["nombre"]
        apellido = data_dictionary["apellido"]
        direccion = data_dictionary["direccion"]
        genero = data_dictionary["genero"]
        correo = data_dictionary["correo"]
        telefono = data_dictionary["telefono"]
        usuario = data_dictionary["usuario"]
        contraseña =data_dictionary["contraseña"]
        ecoAmigo = EcoAmigo(cedula = cedula, nombre = nombre, apellido = apellido, direccion = direccion, genero = genero, correo = correo,
                            telefono = telefono, usuario = usuario, contraseña = contraseña)
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

