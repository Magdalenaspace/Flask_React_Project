import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

        axios.post('http://127.0.0.1:5000/logout')
            .then((res) => {
                // Clear the access token cookie
                localStorage.removeItem('access_token');
                // Redirect to the login page
                navigate('/');
            })
            .catch((err) => {
                console.log(err);
                // Handle error if necessary
            });
    };


export default Logout;
