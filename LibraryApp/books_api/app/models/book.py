from app.config.mysqlconnection import connectToMySQL
from .base_model import BaseModel
from app import app
from flask import jsonify
DB = "library_app_db"


class Book(BaseModel):
    json_fields = ['id', 'title',
                    'description', 'author',
                    'genre', 'created_at', 'updated_at', 'user_id']

    def __init__(self, book):
        self.id = book["id"]
        self.title = book["title"]
        self.description = book["description"]
        self.author = book["author"]
        self.genre = book["genre"]
        self.created = book["created_at"]
        self.updated = book["updated_at"]
        self.user_id = book["user_id"]

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'author': self.author,
            'genre': self.genre,
            'user_id': self.user_id,
            'created_at': str(self.created),
            'updated_at': str(self.updated),
        }

    @classmethod
    def create_valid_book(cls, book_dict):
        errors = cls.is_valid(book_dict)
        if errors:
            return  False, errors
        
        query = """
                INSERT INTO books
                (title, description, 
                author, genre, user_id) 
                VALUES (%(title)s, %(description)s,
                %(author)s, %(genre)s, %(user_id)s);
            """

        book_id = connectToMySQL(DB).query_db(query, book_dict)
        if not book_id:
            errors["failed"] = "Failed to create art"
            return {'success': False, 'errors': errors}

        # Make sure you have defined and imported this method correctly
        created_book = cls.get_by_id(book_id)
        return {'success': True, 'book': created_book}

    @staticmethod
    def is_valid(book_dict):
        errors = {}
        flash_string = " field is required and must be at least 3 characters."
        if not book_dict.get("title"):
            errors["title"] = "Title" + flash_string
        elif len(book_dict["title"]) < 3:
            errors["title"] = "Title" + flash_string

        if not book_dict.get("description"):
            errors["description"] = "Description" + flash_string
        elif len(book_dict["description"]) < 3:
            errors["description"] = "Description" + flash_string

        if not book_dict.get("author"):
            errors["author"] = "Author" + flash_string
        elif len(book_dict["author"]) < 3:
            errors["author"] = "Author" + flash_string

        if not book_dict.get("genre"):
            errors["genre"] = "Genre" + flash_string
        elif len(book_dict["genre"]) < 3:
            errors["genre"] = "Genre" + flash_string
        return errors

    @classmethod
    def get_all(cls):
        from app.models.user import User
        # Adjust the import statement based on your project structure 
        query = """SELECT books.id, books.title, books.description, books.author, books.genre, books.created_at, books.updated_at,
            users.id AS user_id, users.first_name, users.last_name, users.email, users.password, users.created_at AS user_created_at,
            users.updated_at AS user_updated_at
            FROM books
            JOIN users ON users.id = books.user_id"""

        book_data = connectToMySQL(DB).query_db(query)
        books = []

        for book in book_data:
            book_obj = cls(book)
            book_obj.user = User(
                {
                    "id": book["user_id"],
                    "first_name": book["first_name"],
                    "last_name": book["last_name"],
                    "email": book["email"],
                    "password": book["password"],
                    "created_at": book["user_created_at"],
                    "updated_at": book["user_updated_at"],
                }
            )
            books.append(book_obj)

        return books

    @classmethod
    def get_by_id(cls, book_id):
        from app.models.user import User
        query = """ 
        SELECT books.id, books.title, books.description, books.author, books.genre, books.created_at, books.updated_at,
            users.id AS user_id, users.first_name, users.last_name, users.email, users.password, users.created_at AS user_created_at,
            users.updated_at AS user_updated_at
        FROM books
        JOIN users ON users.id = books.user_id
        WHERE books.id = %(id)s
        """

        data = {"id": book_id}
        result = connectToMySQL(DB).query_db(query, data)

        if result:
            result = result[0]
            book = cls(result)
            book.user = User (
                {
                    "id": result["user_id"],
                    "first_name": result["first_name"],
                    "last_name": result["last_name"],
                    "email": result["email"],
                    "password": result["password"],
                    "created_at": result["user_created_at"],
                    "updated_at": result["user_updated_at"],
                }
            )
            return book

        return None

    @classmethod
    def delete_book_by_id(cls, book_id, current_user_id):
        query = "DELETE FROM books WHERE id = %(id)s AND user_id = %(user_id)s;"
        data = {"id": book_id, "user_id": current_user_id}
        connectToMySQL(DB).query_db(query, data)
        return book_id
    
    @classmethod
    def update_book(cls, book_dict, current_user_id):
        book_id = book_dict["id"]
        book = cls.get_by_id(book_id)

        if not book:
            return False, "Book not found"

        errors = cls.is_valid(book_dict)
        if errors:
            return False, errors

        query = """
        UPDATE books
            SET title = %(title)s,
                description = %(description)s,
                author = %(author)s,
                genre = %(genre)s,
                updated_at = NOW()
            WHERE id = %(id)s"""

        data = {
            "id": book_id,
            "title": book_dict["title"],
            "description": book_dict["description"],
            "author": book_dict["author"],
            "genre": book_dict["genre"]
        }

        connectToMySQL(DB).query_db(query, data)

        updated_book = cls.get_by_id(book_id)
        return updated_book

    @classmethod
    def get_user_books(cls, user_id):
        query = """
        SELECT * FROM books
        WHERE user_id = %(user_id)s
        """
        data = {"user_id": user_id}
        book_data = connectToMySQL(DB).query_db(query, data)
        books = []

        for book in book_data:
            book_obj = cls(book)
            books.append(book_obj)

        return books
