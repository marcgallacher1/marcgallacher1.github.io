from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import UserMixin

# Initialise extensions 
db = SQLAlchemy()
bcrypt = Bcrypt()

# User model - represents each user in the system
class User(db.Model, UserMixin): 

    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    year_of_school = db.Column(db.String(20), nullable=True)

    # Relationship to the Progress model
    progress = db.relationship('Progress', backref='user', uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<User {self.username}>'

# Progress model - stores the user's game progress
class Progress(db.Model):

    __tablename__ = 'progress'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), unique=True, nullable=False)
    tutorial = db.Column(db.Boolean, default=False)
    
    # Level fields
    level_1 = db.Column(db.Boolean, default=False)
    level_1_score = db.Column(db.Integer, default=0)  
    level_2 = db.Column(db.Boolean, default=False)
    level_2_score = db.Column(db.Integer, default=0)   
    level_3 = db.Column(db.Boolean, default=False)
    level_3_score = db.Column(db.Integer, default=0)   
    level_4 = db.Column(db.Boolean, default=False)
    level_4_score = db.Column(db.Integer, default=0)
    
    # Quiz fields 
    quiz_1_score = db.Column(db.Integer, default=0)
    quiz_2_score = db.Column(db.Integer, default=0)
    quiz_3_score = db.Column(db.Integer, default=0)
    quiz_4_score = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<Progress for User {self.user_id}>'
