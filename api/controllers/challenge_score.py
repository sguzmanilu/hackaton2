from db import db
from models import Tournament, Competitor, ChallengeAssign, Challenge
from flask_restful import Resource, request, fields, marshal, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity

parser = reqparse.RequestParser()
parser.add_argument('tournament', type=int, required=True, help='Tournament is required')
parser.add_argument('competitor', type=int, required=True, help='Competitor is required')
parser.add_argument('challenge', type=int, required=True, help='Challenge is required')
parser.add_argument('score', type=float, required=True, help='Score is required')

class ChallengeScoreController(Resource):
    
    @jwt_required()
    def post(self):
        args = parser.parse_args()
        
        # Validamos que el torneo exista
        tournament = Tournament.query.filter_by(is_active=True, id=args['tournament']).first()
        if not tournament:
            return {'message': 'Tournament not found'}, 404
        
        # Validamos que el usuario sea el dueño del torneo
        user_id = get_jwt_identity()
        if tournament.owner != user_id:
            return {'message': 'You are not the owner of this tournament'}, 401
        
        # Validamos que el competidor exista
        competitor = Competitor.query.filter_by(is_active=True, id=args['competitor']).first()
        if not competitor:
            return {'message': 'Competitor not found'}, 404
        
        # Validamos que el reto exista
        challenge_assign = ChallengeAssign.query.filter_by(is_active=True, id=args['challenge']).first()
        if not challenge_assign:
            return {'message': 'Challenge not found'}, 404
        
        challenge = Challenge.query.filter_by(is_active=True, id=challenge_assign.challenge).first()
        
        # Validamos que el score sea mayor a 0 y menor al peso del reto
        if args['score'] <= 0 or args['score'] > challenge.weight:
            return {'message': 'Score must be greater than 0 and less than the weight of the challenge'}, 400
        
        # Preparamos el ki_level del competidor para la nueva actualizacion
        if competitor.ki_level is None:
            competitor.ki_level = 0
        elif challenge_assign.score is not None:
            competitor.ki_level -= challenge_assign.score
        
        # Actualizamos el score del reto
        challenge_assign.score = args['score']
        
        # Actualizamos el ki_level del competidor
        competitor.ki_level = competitor.ki_level + args['score']
        
        db.session.commit()
        
        return {'message': 'Score assigned successfully'}, 201