from db import db
from sqlalchemy import and_
from models import Tournament, Competitor, User, ChallengeAssign, Challenge, Category
from flask_restful import Resource, request, fields, marshal
from flask_jwt_extended import jwt_required, get_jwt_identity

competitor_fields = {
    'id': fields.Integer,
    'user': fields.Integer,
    'ki_level': fields.Float,
    'character': fields.Integer,
    'total_challenges': fields.Integer,
}

user_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'username': fields.String,
}

challenge_assign_fields = {
    'id': fields.Integer,
    'challenge': fields.Integer,
    'score': fields.Float,
    'evidence': fields.String,
}

challenge_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'category': fields.Integer,
    'weight': fields.Float,
}

category_fields = {
    'id': fields.Integer,
    'name': fields.String,
}

class TournamentResume(Resource):
    
    @jwt_required()
    def get(self, tournament_id):
        tournament = Tournament.query.filter_by(is_active=True, id=tournament_id).first()
        
        if not tournament:
            return {'message': 'Tournament not found'}, 404
        
        query = Competitor.query.filter_by(is_active=True, tournament=tournament_id).all()
        response = [marshal(u, competitor_fields) for u in query]
        for i, item in enumerate(query):
            response[i]['user'] = marshal(User.query.filter_by(id=item.user).first(), user_fields)
            response[i]['total_challenges'] = ChallengeAssign.query.filter(and_(ChallengeAssign.is_active==True, ChallengeAssign.competitor==item.id, ChallengeAssign.score>=71)).count()
        
        return response, 200
    
class TournamentDetail(Resource):
    
    @jwt_required()
    def get(self, competitor_id):
        competitor = Competitor.query.filter_by(is_active=True, id=competitor_id).first()
        
        if not competitor:
            return {'message': 'Competitor not found'}, 404
        
        response = marshal(competitor, competitor_fields)
        response['user'] = marshal(User.query.filter_by(id=competitor.user).first(), user_fields)
        response['total_challenges'] = ChallengeAssign.query.filter(and_(ChallengeAssign.is_active==True, ChallengeAssign.competitor==competitor_id, ChallengeAssign.score>=71)).count()
        
        query = ChallengeAssign.query.filter_by(is_active=True, competitor=competitor_id).all()
        response_challenge = [marshal(u, challenge_assign_fields) for u in query]
        for i, item in enumerate(query):
            response_challenge[i]['challenge'] = marshal(Challenge.query.filter_by(id=item.challenge).first(), challenge_fields)
            response_challenge[i]['completed'] = item.score >= 71
            response_challenge[i]['challenge']['category'] = marshal(Category.query.filter_by(id=response_challenge[i]['challenge']['category']).first(), category_fields)
            
        response['challenges'] = response_challenge
            
        return response, 200