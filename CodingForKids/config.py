import os

SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://rnb21132:joa1yahCaim6@devweb2024.cis.strath.ac.uk:5432/rnb21132'
SQLALCHEMY_TRACK_MODIFICATIONS = False
DEBUG = True

# Store sessions in the server’s file system
SESSION_TYPE = 'filesystem'
SESSION_PERMANENT = False
SESSION_USE_SIGNER = True
SESSION_KEY_PREFIX = 'game_session:'  

# Secret key used to secure sessions and cookies
SECRET_KEY = os.getenv('SECRET_KEY', 'super_secret_key')