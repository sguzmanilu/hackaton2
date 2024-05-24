from db import db

class ChallengeAssign(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    competitor = db.Column(db.Integer, db.ForeignKey('competitor.id'), nullable=False)
    challenge = db.Column(db.Integer, db.ForeignKey('challenge.id'), nullable=False)
    score = db.Column(db.Float(), nullable=True)
    evidence = db.Column(db.String(300), nullable=True)
    
    # Auditoria
    is_active = db.Column(db.Boolean(), default=True)
    created_at = db.Column(db.DateTime(), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(), server_default=db.func.now(), server_onupdate=db.func.now())
