import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [userLogin, setUserLogin] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState([]);
    const [accessToken, setAccessToken] = useState('');


    const changeHandler = (e) => {
        setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
    };

    const loginHandler = (e) => {
        e.preventDefault();
        axios
            .post('http://127.0.0.1:5000/login', userLogin, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                const { access_token } = res.data;
                setAccessToken(access_token);
                console.log(access_token)
                // Set the access token as a cookie
                localStorage.setItem('access_token', access_token);

                navigate('/books');
            })
            .catch((err) => {
                console.log(err);
                if (err.response && err.response.data && err.response.data.errors) {
                    setErrors(err.response.data.errors);
                } else {
                    setErrors({
                        general: 'An error occurred. Please try again later.',
                    });
                }
            });
    };


    return (
        <div className="login">
            <div className="login-form-container">
                <form onSubmit={loginHandler} className="login-form">
                    <input type="email" id="email" placeholder="Email" name="email" value={userLogin.email}
                        onChange={changeHandler} />
                    {errors.email && <div className="error-log-message">
                        {errors.email}</div>}
                    <input type="password" placeholder="Password" name="password" value={userLogin.password}
                        onChange={changeHandler} />
                    {errors.password && <div className="error-log-message">{errors.password}</div>}

                    <button type="submit">Login</button>
                    <br />
                    <Link className="login-link" to="/register">
                        <h5>Don't have an account?</h5>
                    </Link>
                    {errors.general && <div className="error-reg-message">{errors.general}</div>}
                </form>
            </div>
        </div>
    );
}

export default Login;
