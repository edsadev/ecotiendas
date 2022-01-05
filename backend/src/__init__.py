from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import os
app = Flask(__name__)
DB_USER = os.environ.get('DB_USER', 'postgres')
DB_PASS = os.environ.get('DB_PASS', '9e28a81c8901d1fc')
DB_HOST = os.environ.get('DB_HOST', '200.93.217.234')
DB_PORT = os.environ.get('DB_PORT', '5432')
DB_NAME = os.environ.get('DB_NAME', 'ecotiendas')
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}'  #'postgresql+psycopg2://postgres:123456789@localhost:5432/prueba2' 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
root_path = os.path.dirname(os.path.abspath(__file__))
app.config['UPLOAD_FOLDER'] = os.path.join(root_path, 'reportes')

db = SQLAlchemy(app)
CORS(app)

migrate = Migrate(app, db)

from src import routes
