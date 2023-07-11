import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePost = (props) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [updatedBook, setUpdatedBook] = useState({
        title: '',
        description: '',
        author: '',
        genre: ''
    });
    const [userId, setUserId] = useState(null);
    const [errors, setErrors] = useState({});
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        axios
            .get('http://127.0.0.1:5000/user/id', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setUserId(response.data.user_id);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [userId]);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setUpdatedBook({ ...updatedBook, [name]: value });
    };

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:5000/books/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log(res);
                setUpdatedBook({ ...updatedBook, ...res.data.book });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios
            .put(`http://127.0.0.1:5000/books/update/${id}`, updatedBook, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log(res);
                navigate('/owned');
            })
            .catch((err) => {
                console.log(err);
                if (err.response && err.response.data && err.response.data.errors) {
                    console.log(err.response.data );
                    console.log(err.response.data.errors);

                    setErrors(err.response.data.errors);
                } else {
                    console.log(err);
                }
            });
    };


    return (
        <div className="create-container">
            <form onSubmit={handleSubmit} className="create-form">
                <div>
                    <input
                        className="create-input" type="text"
                        name="title" value={updatedBook.title} onChange={changeHandler} />
                    {errors.title && <p className="error-book-message">{errors.title}</p>}
                </div>
                <div>
                    <textarea name="description"
                        className="create-description"
                        value={updatedBook.description} onChange={changeHandler}></textarea>
                    {errors.description && <p className="error-book-message">{errors.description}</p>}
                </div>
                <div>
                    <input type="text"
                        className="create-input" name="author"
                        value={updatedBook.author} onChange={changeHandler} />
                    {errors.author && <p className="error-book-message">{errors.author}</p>}
                </div>
                <div>
                    <input type="text"
                        className="create-input"
                        name="genre" value={updatedBook.genre} onChange={changeHandler} />
                    {errors.genre && <p className="error-book-message">{errors.genre}</p>}
                </div>
                <button type="submit" className="create-button">Update</button>
            </form>
        </div>
    );
}
export default UpdatePost;
