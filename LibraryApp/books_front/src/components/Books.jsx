import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { useAppContext } from './context/appContext';
import {useNavigate, Link} from 'react-router-dom'
import { API_URL } from '../API';
import SideNav from './SideNav';

const Books = () => {
    const [books, setBooks] = useState([]);
    const { favorites, addToLibrary, removeFromLibrary  } = useAppContext()
    const navigate = useNavigate();
    // console.log("Favorites:", favorites)

    const bookchecker = (id) => {
        const boolean = favorites.some((book) => book.id === id);
        return boolean
    }
    useEffect(() => {
        axios
            .get(API_URL)
            .then(response => {
                console.log(response.data)
                setBooks(response.data)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div className="books">
            <SideNav/>
            <div className="books">
                {books.map((book) => (
                    <div key={book.id} className="book-box">
                        <div>
                            <h6>{book.title}</h6>
                        </div>
                        <div>
                            <img src={book.image_url} alt="book image" onClick={() => navigate(`/books/${book.id}`)}></img></div>
                        <div>
                            { bookchecker(book.id) ? (
                                <button onClick={() => removeFromLibrary(book.id) }>Remove From Library</button> ) :
                                ( <button onClick={() => addToLibrary(book) }>Add to Library</button>
                            )
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Books;
