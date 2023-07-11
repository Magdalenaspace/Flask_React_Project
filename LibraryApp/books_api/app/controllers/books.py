from app import app
from flask import request, jsonify, make_response
from app.config.mysqlconnection import connectToMySQL
from app.models.user import User
from app.models.base_model import BaseModel
from app.models.book import Book
from flask_jwt_extended import jwt_required, get_jwt_identity


@app.route("/books/all", methods=['GET'])
@jwt_required()  # Requires authentication using JWT
def get_all():
    current_user_id = get_jwt_identity()
    books = Book.get_user_books(current_user_id)
    if books:
        books_converted_to_json = [book.to_json() for book in books]
        response = {
            'success': True,
            'message': 'User books retrieved successfully',
            'Books': books_converted_to_json
        }
        return jsonify(response), 200  # OK
    else:
        response = {
            'success': False,
            'message': 'No books found for the user'
        }
        return jsonify(response), 404  # Not Found
    
# create book
@app.route('/create', methods=["POST"])
@jwt_required()  # Requires authentication using JWT
def create_book():
    current_user_id = get_jwt_identity()
    if not current_user_id:
        response = {
            'success': False,
            'message': 'You must be logged in to access the page.'
        }
        return jsonify(response), 401  # Unauthorized

    data = request.json
    data["user_id"] = current_user_id

    errors = Book.is_valid(data)
    print(errors)
    if errors:
        return jsonify({'errors': errors}), 422

    result = Book.create_valid_book(data)
    if result['success']:
        return jsonify(result['book'].to_json()), 201  # Created
    else:
        response = {
            'success': False,
            'message': 'Failed to update book'
        }
        return jsonify(response), 400  # Bad Request

# Get user ID route
@app.route("/user/id", methods=['GET'])
@jwt_required()  # Requires authentication using JWT
def get_user_id():
    user_id = get_jwt_identity()
    response = {
        'success': True,
        'message': 'User ID retrieved successfully',
        'user_id': user_id
    }
    return jsonify(response), 200  # OK

# Update book route
@app.route("/books/update/<int:book_id>", methods=['PUT'])
@jwt_required()  # Requires authentication using JWT
def update_book(book_id):
    current_user_id = get_jwt_identity()
    if not current_user_id:
        response = {
            'success': False,
            'message': 'You must be logged in to access the page.'
        }
        return jsonify(response), 401  # Unauthorized

    data = request.json
    data["user_id"] = current_user_id
    data["id"] = book_id 

    errors = Book.is_valid(data)
    if errors:
        return jsonify({'errors': errors}), 400

    updated_book = Book.update_book(data, current_user_id)
    if updated_book:
        return jsonify(updated_book.to_json()), 200  # OK
    else:
        response = {
            'success': False,
            'message': 'Failed to update book'
        }
        return jsonify(response), 400  # Bad Request

# Get book by ID route
@app.route("/books/<int:id>", methods=['GET'])
@jwt_required()  # Requires authentication using JWT
def get_book(id):
    book = Book.get_by_id(id)
    if book:
        response = {
            'success': True,
            'message': 'Book retrieved successfully',
            'book': book.to_json()
        }
        return jsonify(response), 200  # OK
    else:
        response = {
            'success': False,
            'message': 'Book not found'
        }
        return jsonify(response), 404  # Not Found


# Delete book route
@app.route("/books/delete/<int:book_id>", methods=['DELETE'])
@jwt_required()  # Requires authentication using JWT
def delete_book(book_id):
    current_user_id = get_jwt_identity()
    if not current_user_id:
        response = {
            'success': False,
            'message': 'You must be logged in to access the page.'
        }
        return jsonify(response), 401  # Unauthorized

    deleted_book_id = Book.delete_book_by_id(book_id, current_user_id)

    if deleted_book_id:
        response = {
            'success': True,
            'message': 'Book deleted successfully',
            'deleted_book_id': deleted_book_id
        }
        return jsonify(response), 200  # OK
    else:
        response = {
            'success': False,
            'message': 'Failed to delete book'
        }
        return jsonify(response), 400  # Bad Request
