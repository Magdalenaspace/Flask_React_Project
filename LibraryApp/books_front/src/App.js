import './App.css';
import {Routes, Route } from 'react-router-dom'
import Favorites from './components/Favorites';
import BookDetail from './components/BookDetail';
import Books from './components/Books';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import PostBook from './components/PostBook';
import Logout from './components/Logout';
import UpdatePost from './components/UpdatePost';
import Owned from './components/Owned';


function App() {
  return (
    <div className="App">
        <Nav/>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route path="/register" element={< Register />} />
          <Route path="/books" element={<Books/>}></Route>
          <Route path="/owned" element={<Owned/>}></Route>
          <Route path="/books/:id" element={<BookDetail/>}></Route>
          <Route path="/library" element={<Favorites/>}></Route>
          <Route path="/post" element={<PostBook/>}></Route>
          <Route path="/update/:id" element={< UpdatePost />} />
          <Route path="/logout" element={<Logout/>}></Route>
        </Routes>
      <Footer/>
    </div>
  );
}

export default App;
