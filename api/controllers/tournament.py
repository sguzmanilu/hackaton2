from db import db
from models import Tournament, Competitor, User
from flask_restful import Resource, request, fields, marshal
from flask_jwt_extended import jwt_required, get_jwt_identity

user_model_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'username': fields.String,
}

model_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'owner': fields.Nested(user_model_fields),
    'total_competitors': fields.Integer,
}



class TournamentController(Resource):
    
    @jwt_required()
    def get(self, id=None):
        if id:
            resource = Tournament.query.filter_by(id=id).first()
            resource.total_competitors = Competitor.query.filter_by(tournament=id).count()
            resource.owner = User.query.filter_by(id=resource.owner).first()
            return marshal(resource, model_fields), 200
        else:
            query = Tournament.query.filter_by(is_active=True).all()
            response = [marshal(u, model_fields) for u in query]
            for i, item in enumerate(query):
                response[i]['owner'] = marshal(User.query.filter_by(id=item.owner).first(), user_model_fields)
                response[i]['total_competitors'] = Competitor.query.filter_by(tournament=item.id).count()
                
            return response, 200
    
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
    