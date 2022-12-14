from flask import Flask, request, abort, jsonify, send_file
import json
import sys
from src import app
from src.models.db import *
from src.prueba import enviar_email
import email.message
import smtplib
from sqlalchemy import and_, func, desc
from datetime import datetime
import pandas as pd
import base64
import math
import operator
import secrets

@app.after_request
def after_request(response):
    
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    return response

@app.route('/')
def index():
    print("Hola")
    return jsonify({
        "hola":"Edmundo"
    })

@app.route('/hola')
def hola():
    return jsonify({
        "hola":"Edmundo Salamanca"
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
    response = [sector.format() for sector in sectores]
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
@app.route('/ecopuntos', methods = ['POST'])
def get_ecopuntos():
    data = request.data
    data_dictionary = json.loads(data)
    ecoamigo = EcoAmigo.query.filter(EcoAmigo.id == data_dictionary['id']).first()
    if ecoamigo:
        return jsonify({
                            'success': True,
                            'nombre': ecoamigo.nombre + ' ' + ecoamigo.apellido,
                            'ecopuntos': ecoamigo.ecopuntos
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "Error"
                            })

@app.route('/eco-admin')
def get_ecoAdmins():
    ecoadmins = EcoAdmin.query.all()
    response = []
    for ecoadmin in ecoadmins:
        if ecoadmin.ecotiendas:
            pass
        else:
            response.append(ecoadmin.nombres())
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
@app.route('/eco-admin', methods = ['POST'])
def get_ecoadmin():
    data = request.data
    data_dictionary = json.loads(data)
    ecotienda_id = data_dictionary["ecotienda_id"]
    ecotienda = EcoTienda.query.filter(EcoTienda.id == ecotienda_id).first()
    if ecotienda:
        ecoadmin = ecotienda.ecoadmin
        if ecoadmin == None:
            return jsonify({
                            'success': False,
                            'mensaje': "Ecoadmin no asignado"
                            })
        return jsonify({
                            'success': True,
                            'ecotienda': ecotienda.nombre,
                            'ecoadmin': ecotienda.ecoadmin.format()
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "Ecotienda no existe"
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
    print("hola")
    error = 'd'
    response = {}
    data = request.data
    data_dictionary = json.loads(data)
    print(data_dictionary)
    if data_dictionary["user"]=="keyUser" and data_dictionary["pass"] == "qtD-y7a_kAC-Tg":
        return jsonify({
                        "id": 1,
                        "rango": "keyUser",
                        "nombre": "Gabriela Baque",
                        "succes": True
                        })
    elif data_dictionary["user"]=="Administrativo" and data_dictionary["pass"] == "g2sm-DH92ZUlkQ":
        return jsonify({
                        "id": 1,
                        "rango": "administrativo",
                        "nombre": "",
                        "succes": True
                        })
    
    try:
        usuario = Usuario.query.filter(Usuario.usuario == data_dictionary["user"]).first()
        contrase??a = data_dictionary['pass']
        if usuario.contrase??a == contrase??a:
            error = False
            if usuario.tipo == "ecoadmin":
                ecoadmin = EcoAdmin.query.filter(EcoAdmin.usuario_id == usuario.id).first()
                ecotienda = EcoTienda.query.filter(EcoTienda.ecoadmin_id == ecoadmin.id).first()
                rango = usuario.tipo
                foto = ''
                if ecoadmin.foto:
                    foto = ecoadmin.foto.decode("utf-8")
                else:
                    pass
                if ecotienda.is_movil:
                    rango = "ecotienda_movil"
                response = {
                        'succes': True,
                        'rango': rango,
                        'id': ecotienda.id,
                        'nombre': ecoadmin.nombre + " " + ecoadmin.apellido,
                        'foto': foto
                        }
            elif usuario.tipo == "ecoamigo":
                ecoamigo = EcoAmigo.query.filter(EcoAmigo.usuario_id == usuario.id).first()
                foto = ''
                if ecoamigo.foto:
                    foto = ecoamigo.foto.decode("utf-8")  
                else:
                    pass
                response = {
                        'succes': True,
                        'cedula': ecoamigo.cedula,
                        'direccion': ecoamigo.direccion,
                        'genero': ecoamigo.genero,
                        'correo': ecoamigo.correo,
                        'telefono': ecoamigo.telefono,
                        'fecha_nacimiento': ecoamigo.fecha_nacimiento,
                        'rango': usuario.tipo,
                        'id': ecoamigo.id,
                        'apellido': ecoamigo.apellido,
                        'ecopuntos': ecoamigo.ecopuntos,
                        'foto': foto,
                        'nombre': ecoamigo.nombre,

                        }
            elif usuario.tipo == "ecopicker":
                ecopicker = EcoPicker.query.filter(EcoPicker.usuario_id == usuario.id).first()
                ecotienda = EcoTienda.query.filter(EcoTienda.ecopicker_id == ecopicker.id).first()
                rango = usuario.tipo
                foto = ''
                if ecopicker.foto:
                    foto = ecopicker.foto.decode("utf-8")
                else:
                    pass
                response = {
                        'succes': True,
                        'rango': rango,
                        'ecotienda_id': ecotienda.id,
                        'nombre': ecopicker.nombre,
                        'apellido': ecopicker.apellido,
                        'foto': foto,
                        'id': ecopicker.id,
                        'fecha_registro': ecopicker.fecha_registro.strftime("%m/%d/%Y, %H:%M:%S"),
                        'fecha_nacimiento': ecopicker.fecha_nacimiento,
                        'correo': ecopicker.correo,
                        'telefono': str(ecopicker.telefono),
                        'zonal_id': ecopicker.zonal_id,

                        }
            elif usuario.tipo == "ecozonal":
                zonal = Zonal.query.filter(Zonal.usuario_id == usuario.id).first()
                foto = ''
                if zonal.foto:
                    foto = zonal.foto.decode("utf-8")
                else:
                    pass
                response = {
                        'succes': True,
                        'rango': usuario.tipo,
                        'id': zonal.id,
                        'foto': foto
                        }
            else:
                ecotiendas = EcoTienda.query.all()
                
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
@app.route('/eco-amigos-update', methods=['POST'])
def actualizar_ecoAmigo():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    ecoamigo_id = data_dictionary["id"]
    nombre = data_dictionary["nombre"]
    apellido = data_dictionary["apellido"]
    direccion = data_dictionary["direccion"]
    genero = data_dictionary["genero"]
    telefono = data_dictionary["celular"]
    fecha_nacimiento = data_dictionary["fecha_nacimiento"]
    foto = data_dictionary["foto"].encode('utf-8')
    ecoamigo = EcoAmigo.query.filter(EcoAmigo.id == ecoamigo_id).first()

    ecoamigo.nombre = nombre
    ecoamigo.apellido = apellido
    ecoamigo.direccion = direccion
    ecoamigo.genero = genero
    ecoamigo.telefono = telefono
    ecoamigo.fecha_nacimiento = fecha_nacimiento
    ecoamigo.foto = foto

    try:
        ecoamigo.update()
    except:
        error = True
        EcoAmigo.rollback()
        print(sys.exc_info())

    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'mensaje': "Se actualizaron tus datos"
                        })


@app.route('/contrasena-update', methods=['POST'])
def actualizar_contrase??a():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    nueva_contrasena = data_dictionary["nueva_contrasena"]
    vieja_contrasena = data_dictionary["vieja_contrasena"]
    ecoamigo_id = data_dictionary["id"]
    ecoamigo = EcoAmigo.query.filter(EcoAmigo.id == ecoamigo_id).first()
    usuario = Usuario.query.filter(Usuario.id == ecoamigo.usuario_id).first()

    if usuario.contrase??a == vieja_contrasena:

        usuario.contrase??a = nueva_contrasena
        try:
            usuario.update()
        except:
            error = True
            Usuario.rollback()
            print(sys.exc_info())

        if error:
            abort(422)
        else:
            return jsonify({
                            'success': True,
                            'mensaje': "Se actualizo tu contrase??a"
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "Ingresa tu contrase??a actual v??lida y vuelva a intentarlo"
                            })
    

@app.route('/correo-update', methods=['POST'])
def actualizar_correo():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    correo = data_dictionary["correo"]
    ecoamigo_id = data_dictionary["id"]
    ecoamigo = EcoAmigo.query.filter(EcoAmigo.id == ecoamigo_id).first()
    usuario = Usuario.query.filter(Usuario.id == ecoamigo.usuario_id).first()

    if Usuario.query.filter(Usuario.usuario == correo).first():
        return jsonify({
                        'success': False,
                        'mensaje': "El correo no esta disponible",
                        'correo': ecoamigo.correo
                        })
    else:
        ecoamigo.correo = correo
        usuario.usuario = correo
        try:
            usuario.update()
            ecoamigo.update()
        except:
            error = True
            Usuario.rollback()
            EcoAmigo.rollback()
            print(sys.exc_info())

    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'mensaje': "Se actualizo tu correo",
                        'correo': ecoamigo.correo
                        })

@app.route('/eco-amigos', methods = ['POST'])
def crear_ecoAmigo():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    print(data_dictionary)
    cedula = data_dictionary["cedula"]
    nombre = data_dictionary["nombre"]
    apellido = data_dictionary["apellido"]
    direccion = data_dictionary["direccion"]
    genero = data_dictionary["genero"]
    correo = data_dictionary["correo"]
    telefono = data_dictionary["celular"]
    fecha_nacimiento = data_dictionary["fecha_nacimiento"]
    usuario = data_dictionary["usuario"]
    contrase??a = data_dictionary["contrase??a"]
    sector_id = data_dictionary["sector"]
    foto = data_dictionary["foto"].encode('utf-8')
    tipo = "ecoamigo"
    if Usuario.query.filter(Usuario.usuario == usuario).first():
        return jsonify({
                        'success': False,
                        'mensaje': "Este nombre de usuario ya est?? en uso"
                        })
    elif EcoAmigo.query.filter(EcoAmigo.cedula == cedula).first():
        return jsonify({
                        'success': False,
                        'mensaje': "Esta cedula ya existe"
                        })
    elif EcoAmigo.query.filter(EcoAmigo.correo == correo).first():
        return jsonify({
                        'success': False,
                        'mensaje': "Este correo ya est?? registrado"
                        })
    else:
        try: 
            usuario = Usuario(usuario = usuario, contrase??a = contrase??a, tipo = tipo)
            usuario.insert()
        except:
            error = True
            Usuario.rollback()
            print(sys.exc_info())
        try:
            
            ecoAmigo = EcoAmigo(cedula = cedula, fecha_nacimiento = fecha_nacimiento, nombre = nombre, apellido = apellido, direccion = direccion, genero = genero, correo = correo,
                                telefono = telefono, sector_id = sector_id, usuario_id = usuario.id, foto = foto)
            ecoAmigo.insert()
        except:
            error = True
            EcoAmigo.rollback()
            usuario.delete()
            print(sys.exc_info())

    if error:
        abort(422)
    else:
        enviar_email(correo = ecoAmigo.correo)
        return jsonify({
                        'success': True,
                        'mensaje': "Usuario creado satisfactoriamente"
                        })

@app.route('/tipos-productos')
def get_tipos_productos():
    tipo_materiales = TipoMaterial.query.all()
    response = [tipo_material.format() for tipo_material in tipo_materiales]
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'tipos_productos': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "No Hay ninguno tipo de productos ingresado"
                            })
@app.route('/tipos-premios')
def get_tipos_premios():
    tipo_productos = TipoProductos.query.all()
    response = [tipo_producto.format() for tipo_producto in tipo_productos]
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'tipos_premios': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "No Hay ninguno tipo de premios ingresado"
                            })
@app.route('/actualizar-producto', methods = ['POST'])
def actualizar_producto():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    nombre = data_dictionary['nombre']
    tipo_material_id = data_dictionary['tipo_producto']
    ecopuntos = data_dictionary['ecopuntos']
    cantidad_m3 = data_dictionary['cantidad']
    producto_id = data_dictionary['id']
    try:
        material = Material.query.filter(Material.id == producto_id).first()
        material.nombre = nombre
        material.tipo_material_id = tipo_material_id
        material.ecopuntos = ecopuntos
        material.cantidad_m3 = cantidad_m3
        material.update()
    except:
        error = True
        Material.rollback()
        print(sys.exc_info())
    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'mensaje': "Cambios realizados exitosamente"
                        })

@app.route('/producto', methods = ['POST'])
def crear_producto():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    nombre = data_dictionary['nombre']
    foto = data_dictionary['photo'].encode('utf-8')
    tipo_material_id = data_dictionary['tipo_producto']
    ecopuntos = data_dictionary['ecopuntos']
    cantidad_m3 = data_dictionary['cantidad']
    try: 
        producto = Material(nombre = nombre, foto = foto, tipo_material_id =tipo_material_id, 
                            ecopuntos = ecopuntos, cantidad_m3 = cantidad_m3)
        producto.insert()
    except:
        error = True
        Material.rollback()
        print(sys.exc_info())
    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'producto': producto.response_create()
                        })

@app.route('/actualizar-premio', methods = ['POST'])
def actualizar_premio():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    premio_id = data_dictionary['id']
    nombre = data_dictionary['nombre']
    tipo_premio_id = data_dictionary['tipo_premio']
    ecopuntos = data_dictionary['ecopuntos']
    stock_sin_despachar = data_dictionary['stock']
    stock_real = data_dictionary['stock']
    premio = Producto.query.filter(Producto.id == premio_id).first()
    premio.nombre = nombre
    premio.tipo_premio = tipo_premio_id
    premio.ecopuntos = ecopuntos
    suma = stock_real - premio.stock_real
    premio.stock_sin_despachar += suma
    premio.stock_real = stock_real
    try:
        premio.update()
    except:
        error = True
        Producto.rollback()
        print(sys.exc_info())
    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'mensaje': "Cambios realizados satisfactoriamente"
                        })

@app.route('/premio', methods = ['POST'])
def crear_premio():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    nombre = data_dictionary['nombre']
    foto = data_dictionary['photo'].encode('utf-8')
    tipo_premio_id = data_dictionary['tipo_premio']
    ecopuntos = data_dictionary['ecopuntos']
    stock_sin_despachar = data_dictionary['stock']
    stock_real = data_dictionary['stock']
    try: 
        premio = Producto(nombre = nombre, foto = foto, tipo_producto_id =tipo_premio_id, 
                            ecopuntos = ecopuntos, stock_sin_despachar = stock_sin_despachar, stock_real = stock_real)
        premio.insert()
    except:
        error = True
        Producto.rollback()
        print(sys.exc_info())
    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'premio': premio.response_create()
                        })

@app.route('/premios')
def get_premios():
    error = False
    premios = Producto.query.all()
    response = [premio.format() for premio in premios if premio.stock_sin_despachar > 0]
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'premios': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "No Hay premios"
                            })

def calcular_distancia(lat1, lon1, lat2, lon2):
    lat1 = float(lat1)
    lon1 = float(lon1)

    lat2 = float(lat2)
    lon2 = float(lon2)

    rad = math.pi/180
    dlat = lat2-lat1
    dlon = lon2-lon1
    R=6372.795477598
    a=(math.sin(rad*dlat/2))**2 + math.cos(rad*lat1)*math.cos(rad*lat2)*(math.sin(rad*dlon/2))**2
    distancia=2*R*math.asin(math.sqrt(a))
    return distancia

@app.route('/solicitar-ecopicker', methods=['POST'])
def solicitar_ecopicker():
    error = False 
    data = request.data
    data_dictionary = json.loads(data)
    latitud = data_dictionary["latitud"]
    longitud = data_dictionary["longitud"]
    ecoamigo_id = data_dictionary["id"]
    ecotiendas = EcoTienda.query.all()
    ecoamigo = EcoAmigo.query.filter(EcoAmigo.id == ecoamigo_id).first()
    ecotiendas_id = []
    distancias = []
    pedido = Pedidos.query.filter(and_(Pedidos.ecoamigo_id == ecoamigo_id, Pedidos.completado == False)).first()
    print(pedido)
    if pedido:
        return jsonify({
                        'success': False,
                        'mensaje': f"Ya cuentas con un pedido en transito, pronto te contactaremos"
                        })
    for ecotienda in ecotiendas:
        if ecotienda.latitud == 'null' or not(ecotienda.ecopicker_id):
            pass
        else:
            distancia = calcular_distancia(latitud, longitud, ecotienda.latitud, ecotienda.longitud)
            distancias.append(distancia)
            ecotiendas_id.append(ecotienda.id)
    if len(distancias) == 0:
        return jsonify({
                        'success': False,
                        'mensaje': f"Por el momento no contamos con servicio adomicilio, acercate a una ecotienda fisica"
                        })
    minimo = min(distancias)
    i_min = distancias.index(minimo)
    ecotienda_cercana = EcoTienda.query.filter(EcoTienda.id == ecotiendas_id[i_min]).first()
    print(ecotienda_cercana.id)
    print(distancias)
    try:
        pedido = Pedidos(ecoamigo_id = ecoamigo_id, ecopicker_id = ecotienda_cercana.ecopicker_id,\
                         latitud = latitud, longitud = longitud)
        pedido.insert()
    except:
        error = True
        print(sys.exc_info())
        Pedidos.rollback()
    
    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'mensaje': f"Gracias {ecoamigo.nombre } {ecoamigo.apellido}.\nEnviamos su pedido a la ecotienda { ecotienda_cercana.nombre}, pronto se pondran en contacto con usted, muchas gracias."
                        })
@app.route('/obtener-pedidos', methods=['POST'])
def obtener_pedidos():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    ecopicker_id = data_dictionary["id"]
    pedidos = Pedidos.query.filter(and_(Pedidos.ecopicker_id == ecopicker_id, Pedidos.completado == False))
    response = [pedido.format() for pedido in pedidos]
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'pedidos': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "No hay pedidos disponibles"
                            })
    
@app.route('/actualizar-ubicacion', methods=['POST'])
def actualizar_ubicacion():
    data = request.data
    data_dictionary = json.loads(data)
    latitud = data_dictionary["latitud"]
    longitud = data_dictionary["longitud"]
    ecotienda_id = data_dictionary["id"]
    ecotienda = EcoTienda.query.filter(EcoTienda.id == ecotienda_id).first()
    try:
        ecotienda.latitud = latitud
        ecotienda.longitud = longitud
        ecotienda.update()
    except:
        EcoTienda.rollback()
    return jsonify({
                    'success': True,
                    'mensaje': "Se actualizo correctamente tu ubicacion"
                    })

@app.route('/ecotiendas-cercanas', methods=['POST'])
def get_ecotiendas_cercanas():
    data = request.data
    data_dictionary = json.loads(data)
    latitud = data_dictionary["latitud"]
    longitud = data_dictionary["longitud"]
    ecotiendas = EcoTienda.query.all()
    ubicaciones = {}
    ecotiendas_dicc = {}
    response = {}
    for ecotienda in ecotiendas:
        if ecotienda.latitud == 'null' or ecotienda.ecoadmin == None:
            pass
        else:
            print(ecotienda.nombre)
            
            distancia = calcular_distancia(latitud, longitud, ecotienda.latitud, ecotienda.longitud)
            print(distancia)
            ubicaciones[ecotienda.id] = distancia
            ecotiendas_dicc[ecotienda.id] = {'lat': ecotienda.latitud, 'lon': ecotienda.longitud, 'nombre': ecotienda.nombre, 'id': ecotienda.id}
    ecotiendas_sort = sorted(ubicaciones.items(), key=operator.itemgetter(1), reverse=False)
    for index, ecotienda_id in enumerate(ecotiendas_sort[:4]):
        response[index ] = ecotiendas_dicc[ecotienda_id[0]]
    print(ubicaciones)
    print(ecotiendas_sort)
    print(response)
    return jsonify({
                    'success': True,
                    'data': response
                    })

@app.route('/ecotiendas', methods=['POST'])
def posiciones():
    data = request.data
    data_dictionary = json.loads(data)
    
    if data_dictionary["isZonal"]:
        ecotiendas = EcoTienda.query.filter(EcoTienda.zonal_id == data_dictionary["zonal"])
    else:
        ecotiendas = EcoTienda.query.all()
    response = []
    for ecotienda in ecotiendas:
        if ecotienda.latitud == 'null':
            pass
        else:
            response.append(ecotienda.posicion())
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'pines': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "Ecotiendas no disponibles"
                            })
@app.route('/zonal', methods = ['POST'])
def crear_zonal():
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
    contrase??a = data_dictionary["contrase??a"]
    foto = data_dictionary["photo"].encode('utf-8')
    tipo = "ecozonal"
    if Usuario.query.filter(Usuario.usuario == usuario).first():
        return jsonify({
                        'success': False,
                        'mensaje': "Usuario ya existe"
                        })
    elif Zonal.query.filter(Zonal.cedula == cedula).first():
        return jsonify({
                        'success': False,
                        'mensaje': "Cedula ya existe"
                        })
    else:
        try: 
            usuario = Usuario(usuario = usuario, contrase??a = contrase??a, tipo = tipo)
            usuario.insert()
        except:
            error = True
            Usuario.rollback()
            print(sys.exc_info())
        try:
            
            zonal = Zonal(cedula = cedula, fecha_nacimiento = fecha_nacimiento, nombre = nombre, apellido = apellido, direccion = direccion, genero = genero, correo = correo,
                                telefono = telefono, usuario_id = usuario.id, foto = foto)
            zonal.insert()
        except:
            error = True
            Zonal.rollback()
            usuario.delete()
            print(sys.exc_info())

    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'zonal': zonal.response_create()
                        })
@app.route('/new-ecopicker', methods = ['POST'])
def crear_ecopicker():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    cedula = data_dictionary["cedula"]
    nombre = data_dictionary["nombre"]
    apellido = data_dictionary["apellido"]
    direccion = data_dictionary["direccion"]
    genero = data_dictionary["genero"]
    correo = data_dictionary["correo"]
    foto = data_dictionary["photo"].encode('utf-8')
    telefono = data_dictionary["celular"]
    fecha_nacimiento = data_dictionary["fecha_nacimiento"]
    usuario = data_dictionary["usuario"]
    contrase??a = data_dictionary["contrase??a"]
    zonal_id = data_dictionary["zonal_id"]
    ecotienda_id = data_dictionary["ecotienda_id"]
    tipo = "ecopicker"
    if Usuario.query.filter(Usuario.usuario == usuario).first():
        return jsonify({
                        'success': False,
                        'mensaje': "Usuario ya existe"
                        })
    elif EcoPicker.query.filter(EcoPicker.cedula == cedula).first():
        return jsonify({
                        'success': False,
                        'mensaje': "Cedula ya existe"
                        })
    else:
        try: 
            usuario = Usuario(usuario = usuario, contrase??a = contrase??a, tipo = tipo)
            usuario.insert()
        except:
            error = True
            Usuario.rollback()
            print(sys.exc_info())
        try:
            
            ecopicker = EcoPicker(cedula = cedula, fecha_nacimiento = fecha_nacimiento, nombre = nombre, apellido = apellido, direccion = direccion, genero = genero, correo = correo,
                                telefono = telefono, usuario_id = usuario.id, foto = foto, zonal_id = zonal_id)
            ecopicker.insert()
        except:
            error = True
            EcoPicker.rollback()
            usuario.delete()
            print(sys.exc_info())
        try:
            ecotienda = EcoTienda.query.filter(EcoTienda.id == ecotienda_id).first()
            ecotienda.ecopicker_id = ecopicker.id
            ecotienda.update()
        except:
            error = True
            EcoTienda.rollback()
            ecopicker.delete()
            usuario.delete()
            print(sys.exc_info())

    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'ecopicker': ecopicker.response_create()
                        })

@app.route('/new-ecoadmin', methods = ['POST'])
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
    foto = data_dictionary["photo"].encode('utf-8')
    telefono = data_dictionary["celular"]
    fecha_nacimiento = data_dictionary["fecha_nacimiento"]
    usuario = data_dictionary["usuario"]
    contrase??a = data_dictionary["contrase??a"]
    zonal_id = data_dictionary["zonal_id"]
    ecotienda_id = data_dictionary["ecotienda_id"]
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
            usuario = Usuario(usuario = usuario, contrase??a = contrase??a, tipo = tipo)
            usuario.insert()
        except:
            error = True
            Usuario.rollback()
            print(sys.exc_info())
        try:
            
            ecoAdmin = EcoAdmin(cedula = cedula, fecha_nacimiento = fecha_nacimiento, nombre = nombre, apellido = apellido, direccion = direccion, genero = genero, correo = correo,
                                telefono = telefono, usuario_id = usuario.id, zonal_id = zonal_id, foto = foto)
            ecoAdmin.insert()
        except:
            error = True
            EcoAdmin.rollback()
            usuario.delete()
            print(sys.exc_info())
        try:
            ecotienda = EcoTienda.query.filter(EcoTienda.id == ecotienda_id).first()
            ecotienda.ecoadmin_id = ecoAdmin.id
            ecotienda.update()
        except:
            error = True
            EcoTienda.rollback()
            ecoAdmin.delete()
            usuario.delete()
            print(sys.exc_info())

    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'ecoAdmin': ecoAdmin.response_create()
                        })

@app.route('/ecotienda')
def get_ecotiendas_disponibles():
    ecotiendas = EcoTienda.query.filter(EcoTienda.ecoadmin == None)
    response = [ecotienda.response_create() for ecotienda in ecotiendas]
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'ecotiendas': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "No hay ecotiendas disponibles"
                            })

@app.route('/ecotienda-sin-ecopicker')
def get_ecotiendas_disponibles_sin_ecopicker():
    ecotiendas = EcoTienda.query.filter(and_(EcoTienda.ecopicker == None, EcoTienda.is_movil == False))
    response = [ecotienda.response_create() for ecotienda in ecotiendas]
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'ecotiendas': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "No hay ecotiendas disponibles"
                            })

@app.route('/eco-tienda', methods = ['POST'])
def crear_ecoTienda():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    print(data_dictionary)
    latitud = data_dictionary["latitud"]
    longitud = data_dictionary["longitud"]
    zonal_id = data_dictionary["zonal_id"]
    capacidad_maxima_m3 = data_dictionary["capacidad_maxima_m3"]
    capacidad_maxima_kg = data_dictionary["capacidad_maxima_kg"]
    cantidad_actual_m3 = 0
    cantidad_actual_kg = 0
    nombre = data_dictionary["nombre"]
    provincia = data_dictionary["provincia"]
    ciudad = data_dictionary["ciudad"]
    fecha_apertura = data_dictionary["fecha_apertura"]
    sectores_id = data_dictionary["sector"]
    is_movil = data_dictionary["isMovil"]
    
    try: 
        ecotienda = EcoTienda(latitud = latitud, longitud = longitud, 
                              capacidad_maxima_m3 = capacidad_maxima_m3, 
                              capacidad_maxima_kg = capacidad_maxima_kg, 
                              cantidad_actual_m3 = cantidad_actual_m3,
                              cantidad_actual_kg = cantidad_actual_kg,
                              provincia = provincia, ciudad = ciudad, fecha_apertura = fecha_apertura,
                              sectores_id = sectores_id, zonal_id = zonal_id,
                              nombre = nombre, is_movil = is_movil
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
                        'ecoTienda': ecotienda.response_create()
                        })
@app.route('/verificar-canje', methods = ['POST'])
def verificar_canje():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    token = data_dictionary['token']
    cedula = data_dictionary['cedula']
    ecoamigo = EcoAmigo.query.filter(EcoAmigo.cedula == cedula).first()
    codigo = Codigos.query.filter(Codigos.token == token).first()
    if ecoamigo.id == codigo.ecoamigo_id and not(codigo.canjeado):
        premios = DetalleCanje.query.filter(DetalleCanje.codigo_id == codigo.id)
        data_premios = [premio.format() for premio in premios]
        return jsonify({
                        'success': True,
                        'premios': data_premios
                        })
        
@app.route('/crear-canje', methods = ['POST'])
def crear_canje():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    print(data_dictionary)
    ecoamigo_id = data_dictionary['ecoamigo']
    total_ecopuntos = data_dictionary['total_ecopuntos']
    cantidad_total = data_dictionary['cantidad_total']
    premios = data_dictionary['premios']    
    ecoamigo = EcoAmigo.query.filter(EcoAmigo.id == ecoamigo_id).first()
    detalles = []
    if total_ecopuntos > ecoamigo.ecopuntos:
            return jsonify({
                            'success': False,
                            'mensaje': "Insuficiencia de ecopuntos"
                            })
    try: 
        canje = Canje(total_ecopuntos = total_ecopuntos, cantidad_total = cantidad_total, ecoamigo_id = ecoamigo_id, nombre_cliente = f"{ecoamigo.nombre} {ecoamigo.apellido}")
        canje.insert()
    except:
        error = True
        Canje.rollback()
        print(sys.exc_info())
    try:
        token = secrets.token_hex(4)
        codigo = Codigos(token = token, ecoamigo_id = ecoamigo_id)
        codigo.insert()
    except:
        error = True
        Codigos.rollback()
        canje.delete()
        print(sys.exc_info())
    try:
        for e in premios:
            canje_id = canje.id
            premio_id = e['id']
            cantidad = e['cantidad']
            ecopuntos = e['ecopuntos']
            premio = Producto.query.filter(Producto.id == premio_id).first()
            premio.stock_sin_despachar -= cantidad
            detalle = DetalleCanje( canje_id = canje_id, producto_id = premio_id, cantidad = cantidad, 
                                    ecopuntos = ecopuntos, codigo_id = codigo.id)
            detalle.insert()
            premio.update()
        ecoamigo.ecopuntos -= total_ecopuntos
        ecoamigo.update()
    except:
        error = True
        Producto.rollback()
        EcoAmigo.rollback()
        DetalleCanje.rollback()
        codigo.delete()
        canje.delete()
        

    if error:
        abort(422)
    else:
        enviar_email(correo = ecoamigo.correo, token = codigo.token)
        return jsonify({
                        'success': True,
                        'token': codigo.token
                        })
@app.route('/tickets-transito', methods=['POST'])
def get_tickets_transito():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    print(data_dictionary)
    ecotienda_id = data_dictionary["id"]
    tickets = Tickets.query.filter(and_(Tickets.ecotienda_id == ecotienda_id, Tickets.transito == True))
    response = [ticket.format_ticket_transito() for ticket in tickets]
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'tickets': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "No hay tickets en transito"
                            })

@app.route('/completar-ticket', methods = ['POST'])
def completar_ticket():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    print(data_dictionary)
    ticket_id = data_dictionary["id"]
    ticket = Tickets.query.filter(Tickets.id == ticket_id).first()
    try:
        ticket.transito = False
        ticket.completado = True
        ticket.update()
    except:
        error = True
        Tickets.rollback()
        print(sys.exc_info())
    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'mensaje': "ticket completado"
                        })

@app.route('/crear-ticket-ecopicker', methods = ['POST'])
def crear_ticket_ecopicker():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    print(data_dictionary)
    pedido_id = data_dictionary['pedido']
    ecopicker_id = data_dictionary['ecopicker']
    ecoamigo_id = data_dictionary['ecoamigo']
    total_ecopuntos = 0
    total_kg = 0
    total_m3 = 0
    materiales = data_dictionary['materiales']
    ecotienda = EcoTienda.query.filter(EcoTienda.ecopicker_id == ecopicker_id).first()
    ecoamigo = EcoAmigo.query.filter(EcoAmigo.id == ecoamigo_id).first()
    pedido = Pedidos.query.filter(Pedidos.id == pedido_id).first()
    zonal_id = ecotienda.zonal_id
    if pedido.completado:
        return jsonify({
                        'success': False,
                        'mensaje': "Lo sentimos este pedido ya fue realizado"
                        })
    if not(pedido.ecoamigo_id == ecoamigo_id) or not(pedido.ecopicker_id == ecopicker_id):
        return jsonify({
                        'success': False,
                        'mensaje': "Lo sentimos tenemos inconvenientes"
                        })
    try: 
        ticket = Tickets(zonal_id = zonal_id, entrada = True, ecopicker_id = ecopicker_id,
                            ecoamigo_id = ecoamigo_id, ecotienda_id = ecotienda.id, cliente = f"{ecoamigo.nombre} {ecoamigo.apellido}", completado = False, transito = True  )
        ticket.insert()
    except:
        error = True
        Tickets.rollback()
        print(sys.exc_info())

    try:
        for material in materiales:
            ticket_id = ticket.id
            material_id = material['id']
            cantidad_kg = material['peso']
            material_db = Material.query.filter(Material.id == material_id).first()
            ecopuntos = material_db.ecopuntos * cantidad_kg
            cantidad_m3  = material_db.cantidad_m3 * cantidad_kg
            total_kg += cantidad_kg
            total_ecopuntos += ecopuntos
            total_m3 += cantidad_m3
            detalle = DetalleTickets(entrada = True, ticket_id = ticket_id, material_id = material_id, cantidad_kg = cantidad_kg, 
                                    ecopuntos = ecopuntos, cantidad_m3 = cantidad_m3)
            detalle.insert()
        
        ticket.total_kg = total_kg
        ticket.total_ecopuntos = total_ecopuntos
        ticket.total_m3 = total_m3
        ecotienda.cantidad_actual_kg += total_kg
        ecotienda.cantidad_actual_m3 += total_m3
        ecoamigo.ecopuntos += total_ecopuntos
        pedido.completado = True
        ecotienda.update()
        ecoamigo.update()
        ticket.update()
        pedido.update()
    
    except:
        error = True
        DetalleTickets.rollback()
        EcoTienda.rollback()
        EcoAmigo.rollback()
        Tickets.rollback()
        Pedidos.rollback()
        ticket.delete()
        print(sys.exc_info())
    #enviar_email(cliente.correo, total_ecopuntos, cliente.ecopuntos)
    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'ticket': ticket.format()
                        })

@app.route('/crear-ticket', methods = ['POST'])
def crear_ticket():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    print(data_dictionary)
    ecotienda_id = data_dictionary['ecotienda']
    entrada = data_dictionary['entrada']
    total_kg = data_dictionary['total_kg']
    total_m3 = data_dictionary['total_m3']
    materiales = data_dictionary['materiales']
    ecotienda = EcoTienda.query.filter(EcoTienda.id == ecotienda_id).first()
    cantidad_neta_m3 = ecotienda.capacidad_maxima_m3 - ecotienda.cantidad_actual_m3 
    cantidad_neta_kg = ecotienda.capacidad_maxima_kg - ecotienda.cantidad_actual_kg
    zonal_id = ecotienda.zonal_id
 
    if entrada:
        if total_kg > cantidad_neta_kg:
            return jsonify({
                            'success': False,
                            'mensaje': "Sobrepasamos la cantidad en KG"
                            })
        elif total_m3 > cantidad_neta_m3:
            return jsonify({
                            'success': False,
                            'mensaje': "Sobrepasamos la cantidad en M3"
                            })

        total_ecopuntos = data_dictionary['total_ecopuntos']
        cliente_id = data_dictionary['ecoamigo']
        cliente = EcoAmigo.query.filter(EcoAmigo.id == cliente_id).first()
        try: 
            ticket = Tickets(zonal_id = zonal_id, entrada = entrada, total_kg = total_kg, total_m3 = total_m3, total_ecopuntos = total_ecopuntos,
                                ecoamigo_id = cliente_id, ecotienda_id = ecotienda_id, cliente = f"{cliente.nombre} {cliente.apellido}", completado = True  )
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
                detalle = DetalleTickets(entrada = entrada, ticket_id = ticket_id, material_id = material_id, cantidad_kg = cantidad_kg, 
                                        ecopuntos = ecopuntos, cantidad_m3 = cantidad_m3)
                detalle.insert()
            
            ecotienda.cantidad_actual_kg += total_kg
            ecotienda.cantidad_actual_m3 += total_m3
            cliente.ecopuntos += total_ecopuntos
            ecotienda.update()
            cliente.update()
        
        except:
            error = True
            DetalleTickets.rollback()
            EcoTienda.rollback()
            EcoAmigo.rollback()
            ticket.delete()
            print(sys.exc_info())
        enviar_email(cliente.correo, total_ecopuntos, cliente.ecopuntos)
    else:
        if total_kg > ecotienda.cantidad_actual_kg:
            return jsonify({
                            'success': False,
                            'mensaje': "No tienes tanto material Kg"
                            })
        elif total_m3 > ecotienda.cantidad_actual_m3:
            return jsonify({
                            'success': False,
                            'mensaje': "No tienes tanto material M3"
                            })
        try: 
            ticket = Tickets(zonal_id = zonal_id, entrada = entrada, total_kg = total_kg, total_m3 = total_m3, 
                                ecotienda_id = ecotienda_id, completado = True)
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
                detalle = DetalleTickets(entrada = entrada, ticket_id = ticket_id, material_id = material_id, cantidad_kg = cantidad_kg, 
                                        ecopuntos = ecopuntos, cantidad_m3 = cantidad_m3)
                detalle.insert()

            ecotienda.cantidad_actual_kg -= total_kg
            ecotienda.cantidad_actual_m3 -= total_m3
            ecotienda.update()
        except:
            error = True
            DetalleTickets.rollback()
            print(sys.exc_info())
            ticket.delete()
            EcoTienda.rollback()
                
    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'ticket': ticket.format()
                        })

@app.route('/cantidad-tickets', methods=['POST'])
def cantidad_tickets():
    data = request.data
    data_dictionary = json.loads(data)
    ecotienda_id = data_dictionary['ecotienda']
    tickets = Tickets.query.filter(Tickets.ecotienda_id == ecotienda_id)\
                .paginate(error_out=False)
    cantidad = tickets.total
    if cantidad > 0:
        return jsonify({
                        'success': True,
                        'cantidad': cantidad
                        })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "No tienes tickets ingresados aun"
                            })
@app.route('/historial-pagination', methods = ['POST'])
def historial_pagination():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    ecotienda_id = data_dictionary['ecotienda']
    pagina = data_dictionary['pagina']
    cantidad = data_dictionary['cantidad']
    tickets = Tickets.query.filter(Tickets.ecotienda_id == ecotienda_id)\
                .order_by(desc(Tickets.id))\
                .paginate(page=pagina, per_page=cantidad, error_out=False)
                
    response = [ticket.format() for ticket in tickets.items]
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
@app.route('/historial', methods = ['POST'])
def historial():
    error = False
    data = request.data
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
@app.route('/historial-ecoamigo', methods = ['POST'])
def historial_ecoamigo():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    ecoamigo_id = data_dictionary['ecoamigo']
    tickets = Tickets.query.filter(Tickets.ecoamigo_id == ecoamigo_id)
    response = [ticket.format() for ticket in tickets[-9:]]
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

@app.route('/historial-diario', methods = ['POST'])
def historial_diario():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    ecotienda_id = data_dictionary['ecotienda']
    tickets = Tickets.query.filter(and_(Tickets.ecotienda_id == ecotienda_id, Tickets.fecha_registro >= func.current_date() ))
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

@app.route('/record', methods = ['POST'])
def ingresar_peso():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    ecotienda_id = data_dictionary['ecotienda']
    peso = float(data_dictionary['peso'])
    try:
        record = Records(ecotienda_id = ecotienda_id, peso = peso)
        record.insert()
    except:
        error = True
        Records.rollback()
        print(sys.exc_info())
    if error:
        abort(422)
    else:
        return jsonify({
                        'success': True,
                        'record': record.format()
                        })

@app.route('/balanza', methods = ['POST'])
def obtener_peso():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    ecotienda_id = data_dictionary["ecotienda"]
    record = Records.query.filter(Records.ecotienda_id == ecotienda_id).order_by(Records.id.desc()).first()
    if record:
        return jsonify({
                        'success': True,
                        'peso': record.peso
                        })
    else: 
        return jsonify({
                        'success': False,
                        'record': "Tenemos un problema al cargar el peso de la balanza"
                        })


@app.route('/velocimetro', methods = ['POST'])
def velocimetro():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    ecotienda_id = data_dictionary['ecotienda']
    ecotienda = EcoTienda.query.filter(EcoTienda.id == ecotienda_id).first()
    if ecotienda:
        return jsonify({
                        'success': True,
                        'ecoadmin': ecotienda.ecoadmin.format(),
                        'ecotienda': ecotienda.format()
                        })
    else: 
        return jsonify({
                        'success': False,
                        'ecotienda': "Data no disponible"
                        })

@app.route('/meta', methods = ['POST'])
def meta():
    error = False
    data = request.data
    data_dictionary = json.loads(data)
    ecotienda_id = data_dictionary["ecotienda_id"]
    ecotienda = Ecotienda.query.filter(Ecotienda.id == ecotienda_id).first()
    tickets = Tickets.query.filter(and_(Tickets.ecotienda_id == ecotienda_id, Tickets.fecha))
    suma = 0
    for ticket in tickets:
        suma += ticket

@app.route('/grafico-ecotienda', methods = ['POST'])
def grafico_ecotienda():
    error = False
    data = request.data 
    data_dictionary = json.loads(data)
    ecotienda_id = data_dictionary["ecotienda"]
    mes = datetime.now().strftime("%m")
    a??o = datetime.now().strftime("%Y")
    response = {}
    valores = Tickets.query.join(DetalleTickets, Tickets.id==DetalleTickets.ticket_id)\
                .filter(and_(Tickets.ecotienda_id == ecotienda_id))\
                .order_by(DetalleTickets.material_id)
    for e in Material.query.all():
        response[e.id] = {"nombre": e.nombre, "peso": 0, "tipo_producto": e.tipoMaterial.id} 
    for e in valores:
        for material in e.materiales:
            if material.entrada:
                response[material.material_id]["peso"] += material.cantidad_kg
            else:
                response[material.material_id]["peso"] -= material.cantidad_kg
    print(response)
    return jsonify({
                        'success': True,
                        'data': response
                        })


@app.route('/grafico-zonal', methods = ['POST'])
def grafico_zonal():
    error = False
    data = request.data 
    data_dictionary = json.loads(data)
    mes = datetime.now().strftime("%m")
    a??o = datetime.now().strftime("%Y")
    zonal_id = data_dictionary["zonal"]
    response = {}
    valores = Tickets.query.join(DetalleTickets, Tickets.id==DetalleTickets.ticket_id)\
                .filter(and_(Tickets.zonal_id == zonal_id))\
                .order_by(DetalleTickets.material_id)
    for e in Material.query.all():
        response[e.id] = {"nombre": e.nombre, "peso": 0, "tipo_producto": e.tipo_material_id} 
    for e in valores:
        for material in e.materiales:
            if material.entrada:
                response[material.material_id]["peso"] += material.cantidad_kg
            else:
                response[material.material_id]["peso"] -= material.cantidad_kg   
        
    return jsonify({
                        'success': True,
                        'data': response
                        })

@app.route('/detalle-zonal', methods = ['POST'])
def detalle_zonal():
    error = False
    data = request.data 
    data_dictionary = json.loads(data)
    mes = datetime.now().strftime("%m")
    a??o = datetime.now().strftime("%Y")
    zonal_id = data_dictionary["zonal"]
    material_id = data_dictionary["material"]
    response = {}
    detalles = DetalleTickets.query.join(Tickets, Tickets.id==DetalleTickets.ticket_id)\
                .filter(and_(Tickets.zonal_id == zonal_id, DetalleTickets.material_id == material_id))\
                .order_by(Tickets.ecotienda_id)

    for e in EcoTienda.query.filter(EcoTienda.zonal_id == zonal_id):
        response[e.id] = {"nombre": e.nombre, "peso": 0} 
    for detalle in detalles:
        if detalle.entrada:
            response[detalle.ticket.ecotienda_id]["peso"] += detalle.cantidad_kg
        else: 
            response[detalle.ticket.ecotienda_id]["peso"] -= detalle.cantidad_kg
    
        
    return jsonify({
                        'success': True,
                        'data': response
                        })
@app.route('/proyecciones', methods = ['POST'])
def proyecciones():
    error = False
    data = request.data 
    data_dictionary = json.loads(data)
    cantidad = data_dictionary['cantidad']
    mes = datetime.now().strftime("%m")
    a??o = datetime.now().strftime("%Y")
    if cantidad == 12:
        a??o = str(int(a??o) - 1)
    else:
        resta = (int(mes) - cantidad)
        if resta < 0:
            a??o = str(int(a??o) - 1)
            mes = '0' + str(12 + resta)
        elif resta == 0:
            a??o = str(int(a??o) - 1)
            mes = '12'
        else:
            mes = '0'+str(resta)
    print(mes, a??o)
    response = {}
    valores = Tickets.query.join(DetalleTickets, Tickets.id==DetalleTickets.ticket_id)\
                .filter(and_(Tickets.mes >= mes, Tickets.a??o >= a??o))\
                .order_by(DetalleTickets.material_id)
    for e in Material.query.all():
        response[e.id] = {"nombre": e.nombre, "peso": 0} 
    for e in valores:
        for material in e.materiales:
            if material.entrada:
                response[material.material_id]["peso"] += material.cantidad_kg
            
        
    return jsonify({
                        'success': True,
                        'data': response
                        })
@app.route('/grafico-general')
def grafico_general():
    error = False


    response = {}
    valores = Tickets.query.join(DetalleTickets, Tickets.id==DetalleTickets.ticket_id)\
                .order_by(DetalleTickets.material_id)
    for e in Material.query.all():
        response[e.id] = {"nombre": e.nombre, "peso": 0, "tipo_producto": e.tipo_material_id} 
      
    for e in valores:
        for material in e.materiales:
            if material.entrada:
                response[material.material_id]["peso"] += material.cantidad_kg
            else:
                response[material.material_id]["peso"] -= material.cantidad_kg   
    print(response)

    return jsonify({
                        'success': True,
                        'data': response
                        })

@app.route('/detalle-general', methods = ['POST'])
def detalle_general():
    error = False
    data = request.data 
    data_dictionary = json.loads(data)

    material_id = data_dictionary["material"]
    response = {}
    detalles = DetalleTickets.query.join(Tickets, Tickets.id==DetalleTickets.ticket_id)\
                .filter(and_(DetalleTickets.material_id == material_id))\
                .order_by(Tickets.ecotienda_id)

    for e in EcoTienda.query.all():
        response[e.id] = {"nombre": e.nombre, "peso": 0} 
    for detalle in detalles:
        if detalle.entrada:
            response[detalle.ticket.ecotienda_id]["peso"] += detalle.cantidad_kg
        else: 
            response[detalle.ticket.ecotienda_id]["peso"] -= detalle.cantidad_kg
        
    return jsonify({
                        'success': True,
                        'data': response
                        })

@app.route('/detalle-ticket', methods = ['POST'])
def detalle_ticket():
    error = False
    data = request.data 
    data_dictionary = json.loads(data)
    ticket_id = data_dictionary["ticket"]
    detalles = DetalleTickets.query.filter(DetalleTickets.ticket_id == ticket_id)
    response = [detalle.format() for detalle in detalles]
    return jsonify({
                        'success': True,
                        'materiales': response
                        })
@app.route('/reportes/<tipo>')
def descarga(tipo):
    if tipo == 'tickets':
        return send_file(app.config['UPLOAD_FOLDER']+"/tickets.xlsx", as_attachment=True)
    else:
        return send_file(app.config['UPLOAD_FOLDER']+"/ecoamigo.xlsx", as_attachment=True)
@app.route('/reportes', methods = ['POST'])
def generar_reporte():
    data = request.data 
    data_dictionary = json.loads(data)
    opcion = data_dictionary['opcion']
    filename = ''
    data = ''
    if opcion == 'tickets':
        tickets = Tickets.query.all()
        data_list = [to_dict(item) for item in tickets]
        df = pd.DataFrame(data_list)
        df['fecha_registro'] = df['fecha_registro'].apply(lambda a: pd.to_datetime(a).date()) 
        filename = app.config['UPLOAD_FOLDER']+"/tickets.xlsx"
        print("Filename: "+filename)
        writer = pd.ExcelWriter(filename, engine='xlsxwriter')
        df.to_excel(writer, sheet_name='Registrados', index = False)
        writer.save()
    else:
        tickets = EcoAmigo.query.all()
        data_list = [to_dict(item) for item in tickets]
        df = pd.DataFrame(data_list)
        df['fecha_registro'] = df['fecha_registro'].apply(lambda a: pd.to_datetime(a).date()) 
        filename = app.config['UPLOAD_FOLDER']+"/ecoamigo.xlsx"
        print("Filename: "+filename)
        writer = pd.ExcelWriter(filename, engine='xlsxwriter')
        df.to_excel(writer, sheet_name='Registrados', index = False)
        writer.save()
    with open(filename,"rb") as excel_file:
        data = base64.b64encode(excel_file.read())
    return jsonify({
                            'success': True,
                            'data': data.decode('utf-8')
                            })

def to_dict(row):
    if row is None:
        return None

    rtn_dict = dict()
    keys = row.__table__.columns.keys()
    for key in keys:
        rtn_dict[key] = getattr(row, key)
    return rtn_dict

@app.route('/ecozonal')
def get_ecozonal():
    zonales = Zonal.query.all()
    response = [zonal.format() for zonal in zonales]
    if len(response) > 0:
        return jsonify({
                            'success': True,
                            'ecozonales': response
                            })
    else:
        return jsonify({
                            'success': False,
                            'mensaje': "zonales no disponibles"
                            })

@app.route('/reporte', methods = ['POST'])
def crear_reporte():
    data = request.data 
    data_dictionary = json.loads(data)
    pais = data_dictionary["pais"]
    zonal = data_dictionary["zonal"]
    provincia = data_dictionary["provincia"]
    producto = data_dictionary["producto"]
    mes = datetime.now().strftime("%m")
    a??o = datetime.now().strftime("%Y")
    response = {}
    print(data_dictionary)
                
    if zonal and provincia and producto:
        ecotiendas = EcoTienda.query.filter(and_(EcoTienda.zonal_id == zonal, EcoTienda.provincia == provincia))
        for e in ecotiendas:
            response[e.id] = {"nombre": e.nombre, "peso": 0, "ecoadmin": f'{e.ecoadmin.nombre} {e.ecoadmin.apellido}', 'provincia': e.provincia, 'semaforo': e.cantidad_actual_m3/ e.capacidad_maxima_m3} 
    
        detalles = DetalleTickets.query.join(Tickets, Tickets.id==DetalleTickets.ticket_id)\
                .filter(and_(DetalleTickets.material_id == producto))
        for detalle in detalles:
            print(detalle.entrada, detalle.ticket.ecotienda_id)
            if detalle.entrada and (detalle.ticket.ecotienda_id in response):
                response[detalle.ticket.ecotienda_id]["peso"] += detalle.cantidad_kg
            elif not(detalle.entrada) and (detalle.ticket.ecotienda_id in response):
                response[detalle.ticket.ecotienda_id]["peso"] -= detalle.cantidad_kg
        print(response)
        return jsonify({
                            'success': True,
                            'ecotiendas': response
                            })
    elif zonal and provincia:
        print("dos opciones")
        ecotiendas = EcoTienda.query.filter(and_(EcoTienda.zonal_id == zonal, EcoTienda.provincia == provincia))
    elif zonal:
        ecotiendas = EcoTienda.query.filter(EcoTienda.zonal_id == zonal)
    else: 
        if pais:
            ecotiendas = EcoTienda.query.all()
        else:
            return jsonify({
                            'success': False,
                            'mensaje': "No hay informacion"
                            })
                
    for e in ecotiendas:
        response[e.id] = {"nombre": e.nombre, "peso": e.cantidad_actual_kg, "ecoadmin": f'{e.ecoadmin.nombre} {e.ecoadmin.apellido}', 'provincia': e.provincia, 'semaforo': e.cantidad_actual_m3/ e.capacidad_maxima_m3} 
    print(response)
    return jsonify({
                            'success': not(response == {}),
                            'ecotiendas': response
                            })
@app.route('/reporte-historico', methods = ['POST'])
def crear_reporte_historico():
    data = request.data 
    data_dictionary = json.loads(data)
    pais = data_dictionary["pais"]
    zonal = data_dictionary["zonal"]
    provincia = data_dictionary["provincia"]
    producto = data_dictionary["producto"]
    fecha_desde = data_dictionary["fecha_desde"]
    fecha_hasta = data_dictionary["fecha_hasta"]
    response = {}
    print(data_dictionary)
    if not(fecha_desde) or not(fecha_hasta):

        return jsonify({
                        'success': False,
                        'mensaje': "Ingrese fechas para la busqueda"
                        })
    if zonal and provincia and producto:
        ecotiendas = EcoTienda.query.filter(and_(EcoTienda.zonal_id == zonal, EcoTienda.provincia == provincia))
        for e in ecotiendas:
            response[e.id] = {"nombre": e.nombre, "peso": 0, "ecoadmin": f'{e.ecoadmin.nombre} {e.ecoadmin.apellido}', 'provincia': e.provincia, 'semaforo': e.cantidad_actual_m3/ e.capacidad_maxima_m3} 
    
        detalles = DetalleTickets.query.join(Tickets, Tickets.id==DetalleTickets.ticket_id)\
                .filter(and_(Tickets.fecha_registro >= fecha_desde, Tickets.fecha_registro <= fecha_hasta, DetalleTickets.material_id == producto))\
                .order_by(Tickets.ecotienda_id)

        for detalle in detalles:
            if detalle.entrada and (detalle.ticket.ecotienda_id in response):
                response[detalle.ticket.ecotienda_id]["peso"] += detalle.cantidad_kg
        return jsonify({
                            'success': True,
                            'ecotiendas': response
                            })   
    elif zonal and provincia:
        ecotiendas = EcoTienda.query.filter(and_(EcoTienda.zonal_id == zonal, EcoTienda.provincia == provincia))
        tickets = Tickets.query.join(EcoTienda, Tickets.ecotienda_id==EcoTienda.id)\
                    .filter(and_(Tickets.fecha_registro >= fecha_desde, Tickets.fecha_registro <= fecha_hasta, Tickets.zonal_id == zonal,  EcoTienda.provincia == provincia))     
    elif zonal:
        ecotiendas = EcoTienda.query.filter(and_(EcoTienda.zonal_id == zonal))
        tickets = Tickets.query.filter(and_(Tickets.fecha_registro >= fecha_desde, Tickets.fecha_registro <= fecha_hasta, Tickets.zonal_id == zonal))
    
    else: 
        if pais:
            ecotiendas = EcoTienda.query.all()
            tickets = Tickets.query.filter(and_(Tickets.fecha_registro >= fecha_desde, Tickets.fecha_registro <= fecha_hasta))
    
    for e in ecotiendas:
        response[e.id] = {"nombre": e.nombre, "peso": 0, "ecoadmin": f'{e.ecoadmin.nombre} {e.ecoadmin.apellido}', 'provincia': e.provincia, 'semaforo': e.cantidad_actual_m3/ e.capacidad_maxima_m3} 

    for e in tickets:
        if e.entrada:
            response[e.ecotienda_id]["peso"] += e.total_kg
    print(response)
    return jsonify({
                        'success': not(response == {}),
                        'ecotiendas': response
                        })

@app.route('/total')
def total_kg():
    a??o = datetime.now().strftime("%Y")
    total = 0
    for e in Tickets.query.filter(Tickets.a??o == a??o):
        if e.entrada:
            total += e.total_kg
    return jsonify({
                        'success': True,
                        'total': total
                        })

@app.route('/reportar-problema', methods=['POST'])
def reportar_problema():
    error = False
    data = request.data 
    data_dictionary = json.loads(data)
    problema = data_dictionary['problema']
    ecoamigo_id = data_dictionary['id']
    try: 
        problema = Problemas(problema=problema, ecoamigo_id=ecoamigo_id)
        problema.insert()
    except:
        error = True
        Problemas.rollback()
        print(sys.exc_info())
    
    if error:
        abort(422)
        return jsonify({
                        'success': False,
                        'mensaje': "Tenemos inconvenientes en este momento, prueba mas tarde"
                        })
    else:
        return jsonify({
                        'success': True,
                        'mensaje': "Problema reportado exitosamente"
                        })

@app.route('/eliminar-producto', methods=['POST'])
def eliminar_producto():
    error = False
    data = request.data 
    data_dictionary = json.loads(data)
    material_id = data_dictionary["id"]
    material = Material.query.filter(Material.id == material_id).first()

    try:
        material.delete()
    except:
        error = True
        Material.rollback()
        print(sys.exc_info())
    if error:
        abort(422)
        return jsonify({
                        'success': False,
                        'mensaje': "Tenemos inconvenientes en este momento, prueba mas tarde"
                        })
    else:
        return jsonify({
                        'success': True,
                        'mensaje': "Producto eliminado correctamente"
                        })

@app.route('/eliminar-premio', methods=['POST'])
def eliminar_premio():
    error = False
    data = request.data 
    data_dictionary = json.loads(data)
    premio_id = data_dictionary["id"]
    premio = Producto.query.filter(Producto.id == premio_id).first()

    try:
        premio.delete()
    except:
        error = True
        Producto.rollback()
        print(sys.exc_info())
    if error:
        abort(422)
        return jsonify({
                        'success': False,
                        'mensaje': "Tenemos inconvenientes en este momento, prueba mas tarde"
                        })
    else:
        return jsonify({
                        'success': True,
                        'mensaje': "Premio eliminado correctamente"
                        })