from db import db

class Tournament(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(200), nullable=True)
    owner = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Auditoria
    is_active = db.Column(db.Boolean(), default=True)
    created_at = db.Column(db.DateTime(), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(), server_default=db.func.now(), server_onupdate=db.func.now())
