from db import db
from models import Tournament, Competitor, ChallengeAssign, Challenge, Category
from flask_restful import Resource, request, fields, marshal, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity

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

parser = reqparse.RequestParser()
parser.add_argument('tournament', type=int, required=True, help='Tournament is required')
parser.add_argument('competitor', type=int, required=True, help='Competitor is required')
parser.add_argument('challenges', type=dict, action='append', required=True, help='Challenges are required')

class ChallengeAssignController(Resource):
    
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
        
        # Creamos los retos por cada competidor
        challenges = []
        for item in args['challenges']:
            # Validamos que el reto exista
            challenge = Challenge.query.filter_by(is_active=True, id=item.get('challenge')).first()
            if not challenge:
                return {'message': 'Challenge not found'}, 404
            
            # Validamos que el reto no esté ya asignado
            challenge = ChallengeAssign.query.filter_by(is_active=True, competitor=args['competitor'], challenge=item.get('challenge')).first()
            if challenge:
                return {'message': 'Challenge already assigned'}, 400
            
            challenges.append({
                'competitor': args['competitor'],
                'challenge': item.get('challenge'),
            })
            
        # Insertamos los competidores
        db.session.bulk_insert_mappings(ChallengeAssign, challenges)
        db.session.commit()
        
        return { 'message': 'Success' }, 201
    
    @jwt_required()
    def put(self):
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
        
        # Creamos los retos por cada usuario
        new_challenges = []
        old_challenges = []
        
        for item in args['challenges']:
            # Validamos que el reto exista
            challenge = Challenge.query.filter_by(is_active=True, id=item.get('challenge')).first()
            if not challenge:
                return {'message': 'Challenge not found'}, 404
            
            # Validamos que el reto no esté ya asignado, si ya está asignado lo omitimos
            challenge = ChallengeAssign.query.filter_by(is_active=True, competitor=args['competitor'], challenge=item.get('challenge')).first()
            if challenge:
                old_challenges.append(challenge.id)
            else:
                new_challenges.append({
                    'competitor': args['competitor'],
                    'challenge': item.get('challenge'),
                })
            
        # Editamos la bandera is_active de los competidores del torneo que no se encuentren en la lista old_competitors
        ChallengeAssign.query.filter(ChallengeAssign.competitor==competitor.id, ~ChallengeAssign.id.in_(old_challenges)).update({ 'is_active': False })
        
        # Insertamos los competidores nuevos
        db.session.bulk_insert_mappings(ChallengeAssign, new_challenges)
        db.session.commit()
        
        return { 'message': 'Success' }, 200
    
    @jwt_required()
    def get(self, competitor_id):
        
        # Validamos que el torneo exista
        competitor = Competitor.query.get(competitor_id)
        if not competitor:
            return {'message': 'Competitor not found'}, 404
        
        query = ChallengeAssign.query.filter_by(is_active=True, competitor=competitor_id).all()
        response = [marshal(u, challenge_assign_fields) for u in query]
        for i, item in enumerate(query):
            response[i]['challenge'] = marshal(Challenge.query.filter_by(id=item.challenge).first(), challenge_fields)
            response[i]['challenge']['category'] = marshal(Category.query.filter_by(id=response[i]['challenge']['category']).first(), category_fields)
        
        return response, 200
