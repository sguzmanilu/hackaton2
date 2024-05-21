from db import db
from models import Tournament
from flask_restful import Resource, request, fields, marshal
from flask_jwt_extended import jwt_required, get_jwt_identity

model_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'owner': fields.Integer
}

class TournamentController(Resource):
    
    @jwt_required()
    def get(self, id=None):
        if id:
            resource = Tournament.query.filter_by(id=id).first()
            return marshal(resource, model_fields), 200
        else:
            query = Tournament.query.all()
            return [marshal(u, model_fields) for u in query], 200
    
    @jwt_required()
    def post(self):
        args = request.json
        args['owner'] = get_jwt_identity()
        tournament = Tournament(**args)
        db.session.add(tournament)
        db.session.commit()
        
        return marshal(tournament, model_fields), 201
    
    @jwt_required()
    def put(self, id=None):
        tournament = Tournament.query.get(id)
        
        user_id = get_jwt_identity()
        if tournament.owner != user_id:
            return {'message': 'You are not the owner of this tournament'}, 401
        
        tournament.name = request.json['name']
        tournament.description = request.json['description']
        db.session.commit()
        return marshal(tournament, model_fields), 200
    
    @jwt_required()
    def delete(self, id=None):
        tournament = Tournament.query.get(id)
        tournament.is_active = False
        db.session.commit()
        return None, 204
    