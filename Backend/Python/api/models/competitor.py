from db import db

class Competitor(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer, db.ForeignKey('user.id'))
    tournament = db.Column(db.Integer, db.ForeignKey('tournament.id'))
    ki_level = db.Column(db.Float(), nullable=True)
    character = db.Column(db.Integer, nullable=True)

    # Auditoria
    is_active = db.Column(db.Boolean(), default=True)
    created_at = db.Column(db.DateTime(), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(), server_default=db.func.now(), server_onupdate=db.func.now())
