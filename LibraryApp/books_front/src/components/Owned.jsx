import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate, Link } from 'react-router-dom';
import SideNav from './SideNav';

const Owned = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [userId, setUserId] = useState(null);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/user/id', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setBooks(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }, [userId]);

    useEffect(() => {
        if (token) {
            axios
                .get('http://127.0.0.1:5000/books/all', {
                    headers: {
                        'Content-Type': 'application/json', 
                        Authorization: `Bearer ${token}` // Pass the token in the Authorization header
                    }
                })
                .then(response => {
                    console.log(response.data);
                    setBooks(response.data.Books);
                })
                .catch(err => console.log(err));
        }
    }, []);

    const handleDeleteBook = (bookId) => {
        axios.delete(`http://127.0.0.1:5000/books/delete/${bookId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data);
            setBooks(books.filter(book => book.id !== bookId));
        })
        .catch(error => {
            console.log(error);
        });
    };

    return (
        <div className="books">
            <SideNav />
            {books.length > 0 ? (
                <div className="books">
                    {books.map((book) => (
                        <div key={book.id} className="book-box">
                            <div>
                                <h6>{book.title}</h6>
                            </div>
                            <div>
                                <h6>{book.author}</h6>
                            </div>
                            <div>
                                <h6>{book.genre}</h6>
                            </div>
                            <div>
                                <button onClick={() => handleDeleteBook(book.id)}>Remove</button>
                                <Link to={`/update/${book.id}`}>
                                    <button>Edit</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <p className="text-library">You don't own any books yet!</p>
                </div>
            )}
        </div>
    );
};

export default Owned;
