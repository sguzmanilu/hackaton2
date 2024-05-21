from db import db
from models import Competitor, Tournament, User
from flask_restful import Resource, request, fields, marshal, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity

competitor_fields = {
    'id': fields.Integer,
    'user': fields.Integer,
    'ki_level': fields.Float,
    'character': fields.Integer,
}

user_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'username': fields.String,
}

parser = reqparse.RequestParser()
parser.add_argument('tournament', type=int, required=True, help='Tournament is required')
parser.add_argument('users', type=dict, action='append', required=True, help='Users are required')

class CompetitorController(Resource):
    
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
        
        # Creamos los competidores por cada usuario
        competitors = []
        for item in args['users']:
            # Validamos que el usuario exista
            user = User.query.get(item.get('user'))
            if not user:
                return {'message': 'User not found'}, 404
            
            # Validamos que el usuario no esté ya inscrito
            competitor = Competitor.query.filter_by(is_active=True, user=item.get('user'), tournament=tournament.id).first()
            if competitor:
                return {'message': 'User already registered'}, 400
            
            competitors.append({
                'user': item.get('user'),
                'tournament': tournament.id,
            })
        
        # Insertamos los competidores
        db.session.bulk_insert_mappings(Competitor, competitors)
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
        
        # Creamos los competidores por cada usuario
        new_competitors = []
        old_competitors = []
        for item in args['users']:
            # Validamos que el usuario exista
            user = User.query.get(item.get('user'))
            if not user:
                return {'message': 'User not found'}, 404
            
            # Validamos que el usuario no esté ya inscrito, si ya está inscrito lo omitimos
            competitor = Competitor.query.filter_by(is_active=True, user=item.get('user'), tournament=tournament.id).first()
            if competitor:
                old_competitors.append(competitor.id)
            else:
                new_competitors.append({
                    'user': item.get('user'),
                    'tournament': tournament.id,
                })
            
        # Editamos la bandera is_active de los competidores del torneo que no se encuentren en la lista old_competitors
        Competitor.query.filter(Competitor.tournament==tournament.id, ~Competitor.id.in_(old_competitors)).update({ 'is_active': False })
        
        # Insertamos los competidores nuevos
        db.session.bulk_insert_mappings(Competitor, new_competitors)
        db.session.commit()
        
        return { 'message': 'Success' }, 200
    
    @jwt_required()
    def get(self, tournament_id):
        
        # Validamos que el torneo exista
        tournament = Tournament.query.get(tournament_id)
        if not tournament:
            return {'message': 'Tournament not found'}, 404
        
        query = Competitor.query.filter_by(is_active=True, tournament=tournament_id).all()
        response = [marshal(u, competitor_fields) for u in query]
        for i, item in enumerate(query):
            response[i]['user'] = marshal(User.query.filter_by(id=item.user).first(), user_fields)
        
        return response, 200
        