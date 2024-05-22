from db import db
from bycript_app import bcrypt
from models import User
from flask_restful import reqparse, abort, Resource, fields, marshal
from flask_jwt_extended import create_access_token, jwt_required

model_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'username': fields.String,
    'type': fields.Integer,
}

class AuthController(Resource):
    
    @jwt_required()
    def get(self):
        # Listar usuarios activos
        query = User.query.filter_by(is_active=True).all()
        return [marshal(u, model_fields) for u in query], 200
    
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help='Username is required')
        parser.add_argument('password', required=True, help='Password is required')
        args = parser.parse_args()
        username = args['username']
        password = args['password']
        user = User.query.filter_by(username=username).first()
        
        if user is None:
            abort(404, message="User {} doesn't exist".format(username))
        if bcrypt.check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.id)
            response = marshal(user, model_fields)
            response['token'] = access_token
            return response, 200
        else:
            return {'message': 'Invalid credentials'}, 401
        
class RegisterController(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True, help='Name is required')
        parser.add_argument('username', required=True, help='Username is required')
        parser.add_argument('password', required=True, help='Password is required')
        parser.add_argument('type', required=True, help='Type is required')
        args = parser.parse_args()

        # Comprueba si el usuario ya existe
        user = User.query.filter_by(username=args['username']).first()
        if user:
            return {'message': 'User already exists'}, 400

        # Encripta la contraseña
        args['password'] = bcrypt.generate_password_hash(args['password'])

        # Crea un nuevo usuario y lo guarda en la base de datos
        new_user = User(**args)
        db.session.add(new_user)
        db.session.commit()

        return {'message': 'User created successfully'}, 201
        
