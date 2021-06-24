from flask import Flask, request, abort, jsonify
import json
import sys
from src import app
from src.models.db import EcoAmigo

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
@app.route('/ecoAmigos')
def get_ecoAmigos():
    ecoAmigos = EcoAmigo.query.all()
    response = [ecoAmigo.format for ecoAmigo in ecoAmigos]
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'actors': actors_formatted
                            })
    else:
        return jsonify({
                            'success': False,
                            'actors': "ecoAmigos no disponibles"
                            })

@app.route('/login', methods=['POST'])
def obtener_ecoAmigo():
    error = 'd'
    data = request.data
    data_dictionary = json.loads(data)
    print(data_dictionary)
    try:
        ecoAmigo = EcoAmigo.query.filter(EcoAmigo.usuario == data_dictionary["user"]).first()
        contraseña = data_dictionary['pass']
        if ecoAmigo.contraseña == contraseña:
            error = False
    except:        
        error = True
        print(sys.exc_info())
    
    if error:
        abort(404)
    else:
        return jsonify({
                        'succes': True,
                        'id_usuario': ecoAmigo.id
                        })

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=500, debug=True)