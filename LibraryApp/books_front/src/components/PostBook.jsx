import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function PostBook() {
    const navigate = useNavigate();
    const [book, setBook] = useState({
        title: '',
        description: '',
        author: '',
        genre: ''
    });
    // const [errors, setErrors] = useState({});
    const [userId, setUserId] = useState(null);
    const token = localStorage.getItem('access_token')
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/user/id', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setBook(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }, [userId]);

    const handleChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post('http://127.0.0.1:5000/create', book, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log(res.data);
                setBook({
                    title: '',
                    description: '',
                    author: '',
                    genre: ''
                });
                navigate('/owned');
            })
            .catch((err) => {
                console.log(err);
                console.log(err);
                if (err.response && err.response.data && err.response.data.errors) {
                    setErrors(err.response.data.errors);
                } else {
                    console.log(err);
                }
            });
    };
    

    return (
        <div>
            <div className="create-container">
                <form onSubmit={handleSubmit} className="create-form">
                    <div>
                        <input
                            className="create-input"
                            type="text"
                            value={book.title}
                            onChange={handleChange}
                            name="title"
                            placeholder="Title"
                        />
                        {errors.title && <p className="error-book-message">{errors.title}</p>}
                    </div>
                    <div>
                        <textarea
                            className="create-description"
                            value={book.description}
                            onChange={handleChange}
                            name="description"
                            placeholder="Description"
                        />
                        {errors.description && <p className="error-book-message">{errors.description}</p>}
                    </div>
                    <div>
                        <input
                            className="create-input"
                            type="text"
                            value={book.author}
                            onChange={handleChange}
                            name="author"
                            placeholder="Author"
                        />
                        {errors.author && <p className="error-book-message">{errors.author}</p>}
                    </div>
                    <div>
                        <input
                            className="create-input"
                            type="text"
                            value={book.genre}
                            onChange={handleChange}
                            name="genre"
                            placeholder="Genre"
                        />
                        {errors.genre && <p className="error-book-message">{errors.genre}</p>}                    </div>
                    <button className="create-button" type="submit">Create</button>            
                </form>
            </div>
        </div>
    );
}

export default PostBook;