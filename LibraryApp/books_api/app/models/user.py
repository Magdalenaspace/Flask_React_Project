from app.config.mysqlconnection import connectToMySQL
from .base_model import BaseModel
from app import app
from app.models.book import Book
import re
EMAIL_REGEX = re.compile(r'^[\w\.-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
PASSWORD_REGEX = re.compile(r'^(?=.*[A-Z]).+$')

# !database 
DB = "library_app_db"

class User(BaseModel): 

    json_fields = ['first_name', 'last_name', 'email', 'password',
                    'confirm_password', 'created_at', 'updated_at']

    def __init__(self, data):
        self.id = data['id']
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.email = data['email']
        self.password = data['password']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @classmethod
    def get_by_email(cls, data):
        query = "SELECT * FROM users WHERE email = %(email)s;"
        result = connectToMySQL(DB).query_db(query, data)
        # print(f"result: {result}")
        if isinstance(result, list) and len(result) >= 1:
            # print(f"result is: {result}")
            return cls(result[0])
        else:
            return None
        
    @classmethod
    def get_by_id(cls, user_id):
        data = {"id": user_id}
        query = "SELECT * FROM users WHERE id = %(id)s;"
        result = connectToMySQL(DB).query_db(query, data)
        if isinstance(result, list) and len(result) >= 1:
            return cls(result[0])
        else:
            return False
        
    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO users (first_name, last_name, email, password) 
        VALUES (%(first_name)s, %(last_name)s, %(email)s, %(password)s)
        """
        return connectToMySQL(DB).query_db(query, data)
    
    @staticmethod
    def is_valid(user):
        errors = {}

        if len(user['first_name']) < 2:
            errors["first_name"] = "First name must be at least 2 characters."
        if len(user["last_name"]) < 2:
            errors["last_name"] = "Last name must be at least 2 characters."
        if user["password"] != user["confirm_password"]:
            errors["password"] = "Passwords must match."
        elif not re.search(PASSWORD_REGEX, user["password"]):
            errors["password"] = "Password must contain at least one uppercase character."
        if not re.search(EMAIL_REGEX, user['email']):
            errors["email"] = "Invalid email address!"
        elif User.get_by_email(user) != None:
            errors["email"] = "An account with that email already exists, please log in."

        return errors
    


