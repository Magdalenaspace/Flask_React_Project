import React from 'react';
import {useNavigate, Link} from 'react-router-dom'

const SideNav = () => {
    return (
        <div>
            <div className="book-header"> 
                <Link to={"/library"} className="navlink"><h3>Your Library</h3></Link>
                <br/>
                <Link to={"/owned"} className="navlink"><h3>Owned</h3></Link>
                <br/>
                <Link to={"/post"} className="navlink"><h3>Post Book</h3></Link>
                <br/>
                <br/>
                <Link to={"/books"} className="navlink"><h3>Home</h3></Link>
                <br/>
                <Link to={"/logout"} className="navlink"><h3>Logout</h3></Link>
            </div>
        </div>
    );
}

export default SideNav;
