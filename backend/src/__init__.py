from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://jamiltorres@localhost:5432/prueba' 
db = SQLAlchemy(app)
CORS(app)

migrate = Migrate(app, db)

from src import routes