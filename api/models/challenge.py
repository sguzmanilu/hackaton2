from db import db
from sqlalchemy.orm import relationship

class Challenge(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    category = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    weight = db.Column(db.Float, nullable=False, default=100)
    
    # Auditoria
    is_active = db.Column(db.Boolean(), default=True)
    created_at = db.Column(db.DateTime(), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(), server_default=db.func.now(), server_onupdate=db.func.now())