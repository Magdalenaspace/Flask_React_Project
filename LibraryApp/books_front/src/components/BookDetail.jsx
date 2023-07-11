import React from 'react';
import '../App.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BOOK_DETAIL_URL } from '../API';
import axios from 'axios';

const BookDetail = () => {
    const [book, setBook] = useState({});
    const { id } = useParams();
    

    useEffect(() => {
        axios.get(`${BOOK_DETAIL_URL}/${id}`)
        .then(response => {
            setBook(response.data)
        })
        .catch((error) => console.log(error))
    }, [id])
    return (
        <div className="book-detail">
            <div className="book-image">
                <h3>{book?.title}</h3>
                <hr/>
                <img src={book?.image_url} alt="Book Image" />
            </div>
            <div className="book-desc">
                <h3>Description</h3>
                <p>{book?.description}</p>
                <hr/>
                <h3>Author</h3>
                <p>{book?.authors}</p>
                <hr/>
                <h3>Genre</h3>
                <p>{book?.genres}</p>
            </div>
        </div>
    );
}

export default BookDetail;
