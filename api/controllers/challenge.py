from db import db
from models import Challenge, Category
from flask_restful import Resource, request, fields, marshal
from flask_jwt_extended import jwt_required, get_jwt_identity

model_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'weight': fields.Float,
    'category': fields.Nested({
        'id': fields.Integer,
        'name': fields.String,
    }),
}

category_fields = {
    'id': fields.Integer,
    'name': fields.String,
}

class ChallengeController(Resource):
    
    @jwt_required()
    def get(self, id=None):
        if id:
            resource = Challenge.query.filter_by(id=id).first()
            resource.category = Category.query.filter_by(id=resource.category).first()
            return marshal(resource, model_fields), 200
        else:
            
            query = Challenge.query.filter_by(is_active=True).all()
            response = [marshal(u, model_fields) for u in query]
            for i, item in enumerate(query):
                response[i]['category'] = marshal(Category.query.filter_by(id=item.category).first(), category_fields)
            
            return response, 200
    
    @jwt_required()
    def post(self):
        args = request.json
        challenge = Challenge(**args)
        db.session.add(challenge)
        db.session.commit()
        
        return marshal(challenge, model_fields), 201
    
    @jwt_required()
    def put(self, id=None):
        challenge = Challenge.query.get(id)
        
        challenge.name = request.json['name']
        challenge.category = request.json['category']
        challenge.weight = request.json['weight']
        db.session.commit()
        return marshal(challenge, model_fields), 200
    
    @jwt_required()
    def delete(self, id=None):
        challenge = Challenge.query.get(id)
        challenge.is_active = False
        db.session.commit()
        return None, 204
    