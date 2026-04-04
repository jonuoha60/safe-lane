from .. import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class Progress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    percentage = db.Column(db.String(255))
    score = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    username = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    created = db.Column(db.DateTime(timezone=True), default=func.now())
    progress = db.relationship('Progress', backref='user', lazy=True)
