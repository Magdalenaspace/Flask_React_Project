from app import app
from flask import Flask
from flask_cors import CORS
from app.controllers import users
from app.controllers import books
from flask_jwt_extended import JWTManager

CORS(app, supports_credentials=True)
# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "keep this in secret file"  # Change this!
jwt = JWTManager(app)

if __name__ =='__main__':
    app.run(debug=True)