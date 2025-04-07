import os
from flask import Flask, redirect, url_for, flash
from flask_session import Session
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_migrate import Migrate
from flask_login import LoginManager
from models import db, bcrypt, User

# Initialize Flask extensions 
login_manager = LoginManager()
migrate = Migrate()
admin = Admin(template_mode="bootstrap3")

def create_app():
    app = Flask(__name__)
    app.config.from_object("config")

    # Initialize Flask extensions with the app
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    login_manager.login_view = "main.lobby"
    login_manager.login_message = "Please log in to access this page."
    login_manager.login_message_category = "warning"

    # Enable session handling
    Session(app)

    # Register Flask-Admin
    admin.init_app(app)
    admin.add_view(ModelView(User, db.session))

    # Register routes from routes.py
    from routes import main
    app.register_blueprint(main)

    return app

# If a user tries to access a restricted page without logging in
@login_manager.unauthorized_handler
def unauthorized():
    return redirect(url_for("main.lobby") + "?error=unauthorized")

# How Flask-Login loads a user from the database
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
