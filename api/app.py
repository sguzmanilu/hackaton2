# import os
import serverless_wsgi
from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from bycript_app import bcrypt
from flask_jwt_extended import JWTManager

import controllers as c
from db import db

# load_dotenv()
# env = os.getenv('ENV')

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'HACKATONII'
app.config["JWT_SECRET_KEY"] = 'HACKATON_DRAGON_BALL'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_TYPE'] = 'Bearer'
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://admin:SGuzman27$@hackatondb.c5s4uycugvc4.us-east-1.rds.amazonaws.com:3306/dbHackaton"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['BUNDLE_ERRORS'] = True
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config["DEBUG"] = True

# Database Initialization
db.init_app(app)

# JWT Initialization
jwt = JWTManager(app)
bcrypt.init_app(app)

api = Api(app)
api.prefix = '/api'

api.add_resource(c.AuthController, '/auth')
api.add_resource(c.RegisterController, '/register')
api.add_resource(c.TournamentController, '/tournament', '/tournament/<int:id>')
# api.add_resource(c.TodoController, '/todos', '/todos/<int:todo_id>')

if __name__ == '__main__':
    app.run(debug=True)

def handler(event, context):
    return serverless_wsgi.handle_request(app, event, context)