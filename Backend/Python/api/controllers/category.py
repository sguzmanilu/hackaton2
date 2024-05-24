from db import db
from models import Category, Challenge
from flask_restful import Resource, request, fields, marshal
from flask_jwt_extended import jwt_required, get_jwt_identity

model_fields = {
    'id': fields.Integer,
    'name': fields.String,
}

challenge_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'weight': fields.Float,
}

class CategoryController(Resource):
    
    @jwt_required()
    def get(self, id=None):
        if id:
            resource = Category.query.filter_by(id=id, is_active=True).first()
            return marshal(resource, model_fields), 200
        else:
            query = Category.query.filter_by(is_active=True).all()
            return [marshal(u, model_fields) for u in query], 200
    
    @jwt_required()
    def post(self):
        args = request.json
        category = Category(**args)
        db.session.add(category)
        db.session.commit()
        
        return marshal(category, model_fields), 201
    
    @jwt_required()
    def put(self, id=None):
        category = Category.query.get(id)
        
        category.name = request.json['name']
        db.session.commit()
        return marshal(category, model_fields), 200
    
    @jwt_required()
    def delete(self, id=None):
        category = Category.query.get(id)
        category.is_active = False
        db.session.commit()
        return None, 204
    
class CategoryWithChallengesController(Resource):
    @jwt_required()
    def get(self):
        query = Category.query.filter_by(is_active=True).all()
        
        response = [marshal(u, model_fields) for u in query]
        for i, item in enumerate(query):
            challenges = Challenge.query.filter_by(is_active=True, category=item.id).all()
            response[i]['challenges'] = [marshal(u, challenge_fields) for u in challenges]
            
        return response, 200

    