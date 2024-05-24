from flask_restful import reqparse, abort, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.characters import get_characters

class CharacterController(Resource):
    
    def get(self, character_id=None):
        
        return get_characters(), 200
