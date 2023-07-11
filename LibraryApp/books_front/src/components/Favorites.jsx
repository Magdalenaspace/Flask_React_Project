import React from 'react';
import { useAppContext } from './context/appContext';
import '../App.css';

const Favorites = () => {

    const { favorites, addToLibrary, removeFromLibrary } = useAppContext()

    console.log("Favorites:", favorites)

    const bookchecker = (id) => {
        const boolean = favorites.some((book) => book.id === id);
        return boolean
    }

    return (
        <div className="library">
            {favorites.length > 0 ? (
                <div className="books">
                    {favorites.map((book) => (
                        <div key={book.id} className="book-box">
                            <div>
                                <h4>{book.title}</h4>
                            </div>
                            <div>
                                <img src={book.image_url} alt="book image" />
                            </div>
                            <div>
                                {bookchecker(book.id) ? (
                                    <button onClick={() => removeFromLibrary(book.id)}>
                                        Remove From Library
                                    </button>
                                ) : (
                                    <button onClick={() => addToLibrary(book)}>Add to Library</button>
                                )}
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
            ) : (
            <div>
                <p className="text-library "> You don't have any books in your Library yet!</p>
            </div>
            )}
        </div>
    );
};
export default Favorites;
