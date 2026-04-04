from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager

DB_NAME = "database.db"
db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'sdhfshd sdhs'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    from .routes.views import views
    from .routes.auth import auth
    from .routes.api import api

    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/auth/")
    app.register_blueprint(api, url_prefix="/api/")

    from .models.models import User, Progress

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    if not path.exists('website/' + DB_NAME):
         with app.app_context():
              db.create_all()
              print('Created Database')

    return app


