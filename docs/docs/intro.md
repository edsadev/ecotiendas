---
sidebar_position: 1
slug: /
---

# Inicio 

Inicio rapido **Deploy Ecotiendas en menos de 15 minutos**.

## Inicio

Podemos ejecutar el proyecto de manera local **[clonando el repositorio](https://github.com/jatobrun/ecotiendas)**. 

Or **probar la version en produccion** en **[ecotiendas.ec](http://ecotiendas.ec)**.

> **_NOTA:_**  El repositorio es privado por ende para clonarlo necesitas tener permisos.

## Clonar el repositorio

Para clonar el repositorio utiliza el siguiente comando:

```shell
git clone https://github.com/jatobrun/ecotiendas.git
```

## Inicializar el Backend

### Instala las dependencias
1. Crearemos un entorno virtual para eso nos ayudaremos de una libreria de python llamada virtualenv
```shell
pip3 install virtualenv

cd ecotiendas/backend

virtualenv venv

source venv/bin/activate

```
>**_NOTA:_** Para mas informacion acerca de entornos virtuales puedes revisar el siguiente **[post](https://m-monroyc22.medium.com/configurar-entorno-virtual-python-a860e820aace)**.

2. Instalaremos las dependencias usando pip y un archivo llamado `requirements.txt` el cual lista todas las dependencias del proyecto 

``` bash

pip3 install -r requirements.txt

```
### Ejecuta el Backend
```shell

python3 run.py

```
El backend se desplegara en `http://localhost:5000`.

> **_CUIDADO:_**  El repositorio esta apuntando directamente a la base de datos de produccion cualquier cambio que se haga se vera reflejado en el ambiente de produccion.

## OPCIONAL: Configurar DB


En caso se desee utilizar una base de datos de prueba o implementar un ambiente de desarrollo puedes realizar dos cosas:
- Quemar las credenciales de la DB (Metodo Manual)
- Utilizar variables de entorno (Variables de Entorno)

### Metodo Manual
Las credenciales de la DB se encuentran en el archivo de inicializacion, deberas quemar las variables en dicho archivo, por el momento estan quemadas las variables de la base de datos de produccion esto es asi debido a que estamos usando un repositorio privado y servidores privados de no ser el caso no tendriamos quemado por default las credenciales de produccion y solo utilizariamos variables de entorno
``` python title="src/__init__.py"

DB_USER = os.environ.get('DB_USER', 'Lo que desees')
DB_PASS = os.environ.get('DB_PASS', 'Lo que desees')
DB_HOST = os.environ.get('DB_HOST', 'Lo que desees')
DB_PORT = os.environ.get('DB-PORT', 'Lo que desees') #5432 es el puerto default de postgress
DB_NAME = os.environ.get('DB-NAME', 'Lo que desees')

```

### Metodo Variables de Entorno

>**_NOTA:_** Si ya hiciste el anterior metodo puedes saltarte este metodo

Para este metodo haremos uso de las buenas practicas y usaremos variables de entorno para esto necesitaremos crear 5 variables de entorno las cuales detallos a continuacion:
- DB_USER: Usuario de la base de datos 
- DB_PASS: Contraseña del usuario DB_USER
- DB_HOST: Direccion ip de donde se encuentra la base de datos
- DB_PORT: El puerto en el cual esta la base de datos escuchando 
- DB_NAME: Nombre de la base de datos

Para nuestro ejemplo utilizaremos los siguientes credenciales respectivamente:
- root
- 123456789
- 192.168.100.10
- 5432
- ecotiendas

``` bash

export DB_USER=root
export DB_PASS=123456789
export DB_HOST=192.168.100.10
export DB_PORT=5432
export DB_NAME=ecotiendas

```
### Utilizar Migrations

Este proyecto tiene una dependencia interesante que es Flask_Migrations la cual nos ayuda a recrear todo el schema de las tablas y no tener que hacerlo de forma manual los scripts de schemas los podemos encontrar dentro de la carpeta migrations en backend

Ejecutamos el siguiente comando para vincular nuestra base de datos con el schema del backend

``` bash 
cd ecotiendas

export FLASK_APP=run.py

flask db migrate 

flask db upgrade

```

Lo que hara esa serie de comandos es detectar nuestra carpeta migrations y actualizar el schema de la base de datos que configuramos en el archivo __init__.py por los scripts que se realizaron 

Para mas informacion podemos leer la documentacion de **[Flask_Migrate](https://flask-migrate.readthedocs.io/en/latest/)**

## Inicializar el Frontend 

>**_NOTA_:** Al igual que el backend el frontend por default apunta al backend que esta en produccion
Podemos inicializar el frontend de forma local utilizando variables de entorno sino queremos utilizar nuestro ambiente de desarrollo si solo queremos hechar un vistazo realizamos lo siguiente 

### Dependencias 

``` bash 
cd ecotiendas/frontend
npm i
npm start
```
El servidor se inicializara en `http://localhost:3000`.

### Configucion del Backend

Podemos cambiar la url del backend modificando el archivo `api.js`

``` js title='./src/utils/api.js'

import axios from 'axios'

export const ipUrl = process.env.HOST || 'http://ip_del_backend'
export const puerto = process.env.PORT || ':puerto_del_backend/'

```
Luego de cambiar el archivo procedemos a ejecutar el siguiente comando 

``` bash 

npm start

```

## Aplicaciones 

Existen dos aplicaciones dentro del proyecto Ecotiendas las cuales son:
- EcoAmigo app (disponible en Android y iOS)
- EcoPicker app (disponible en Android y iOS)

