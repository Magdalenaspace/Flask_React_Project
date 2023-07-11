import '../App.css';
import { Link } from 'react-router-dom';

const Nav = () => {
    return (
        <div className="nav">
            <div>
                <Link to="/#" className="navlink"><h1>Books App</h1></Link>
            </div>
        </div>
    );
}

export default Nav;