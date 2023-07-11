import React, { useState } from 'react';
import '../App.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Register = () => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState('');


    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const [errors, setErrors] = useState({});

    const changeHandler = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:5000/register', user, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log(res);
                const { access_token } = res.data;
                setAccessToken(access_token);
                // console.log(access_token)
                localStorage.setItem('access_token', access_token);
                navigate('/books');
            })
            .catch((err) => {
                console.log(err);
                if (err.response && err.response.data && err.response.data.errors) {
                    setErrors(err.response.data.errors); // Set the errors state with the received errors object
                } else {
                    setErrors({ general: 'An error occurred. Please try again later.' }); // Set a general error message
                }
            });
    };
    return (
        <div>
            <div className="registration-container">
                <form onSubmit={submitHandler} className="registration-form">
                    <div>
                        <input
                            className="registration-input"
                            type="text"
                            onChange={changeHandler}
                            value={user.first_name}
                            name="first_name"
                            placeholder="First Name"
                        />
                        {errors.first_name && <div className="error-reg-message">{errors.first_name}</div>}
                    </div>
                    <div>
                        <input
                            className="registration-input"
                            type="text"
                            onChange={changeHandler}
                            value={user.last_name}
                            name="last_name"
                            placeholder="Last Name"
                        />
                        {errors.last_name && <div className="error-reg-message">{errors.last_name}</div>}
                    </div>
                    <div>
                        <input
                            className="registration-input"
                            type="text"
                            onChange={changeHandler}
                            value={user.email}
                            name="email"
                            placeholder="Email"
                        />
                        {errors.email && <div className="error-reg-message">{errors.email}</div>}
                    </div>
                    <div>
                        <input
                            className="registration-input"
                            type="password"
                            onChange={changeHandler}
                            value={user.password}
                            name="password"
                            placeholder="Password"
                        />
                        {errors.password && <div className="error-reg-message">{errors.password}</div>}
                    </div>
                    <div>
                        <input
                            className="registration-input"
                            type="password"
                            onChange={changeHandler}
                            value={user.confirm_password}
                            name="confirm_password"
                            placeholder="Confirm Password"
                        />
                        {errors.confirm_password && <div className="error-reg-message">{errors.confirm_password}</div>}
                    </div>
                    {errors.general && <div className="error-reg-message">{errors.general}</div>}
                    <button className="registration-button">Register</button>
                </form>
            </div>
        </div>
    // </div>
    );
}

export default Register;
