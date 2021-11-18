from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import os
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:tbwIr0Bj4eb1Jzov@localhost:5432/ecotiendas2'  #'postgresql+psycopg2://postgres:123456789@localhost:5432/prueba2' 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
root_path = os.path.dirname(os.path.abspath(__file__))
app.config['UPLOAD_FOLDER'] = os.path.join(root_path, 'reportes')

db = SQLAlchemy(app)
CORS(app)

migrate = Migrate(app, db)

from src import routes