from app import app
from flask import request, jsonify, make_response
from app.config.mysqlconnection import connectToMySQL
from app.models.user import User
from app.models.book import Book
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from bcrypt import checkpw, gensalt, hashpw
from flask_jwt_extended import unset_jwt_cookies
from datetime import datetime, timedelta

bcrypt = Bcrypt(app)

# Registration route


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    errors = User.is_valid(data)
    if errors:
        return jsonify({'errors': errors}), 422

    pw_hash = bcrypt.generate_password_hash(data['password'])
    data["password"] = pw_hash
    user_id = User.save(data)

    access_token = create_access_token(identity=user_id)

    # Set the access token as a cookie
    # Set the expiration date of the cookie
    expiry_date = datetime.now() + timedelta(days=7)
    resp = make_response(jsonify({"access_token": access_token}))
    resp.set_cookie("access_token", access_token, httponly=True,
                    secure=True, expires=expiry_date)

    return resp, 200

# Login route


@app.route("/login", methods=["POST"])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    errors = {}

    if not email:
        errors["email"] = "Email field is missing."
    if not password:
        errors["password"] = "Password field is missing"

    user = User.get_by_email({'email': email})
    if not user:
        errors["email"] = "Invalid email"
    elif not checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        errors["password"] = "Invalid password"

    if errors:
        return jsonify({"errors": errors}), 401

    access_token = create_access_token(identity=user.id)

    # Set the access token as a cookie
    # Set the expiration date of the cookie
    expiry_date = datetime.now() + timedelta(days=7)
    resp = make_response(jsonify({"access_token": access_token}), 200)
    resp.set_cookie("access_token", access_token, httponly=True,
                    secure=True, expires=expiry_date)

    return resp

# Logout route


@app.route("/logout", methods=['GET', 'POST'])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

# Get all books route

