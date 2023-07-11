import React, { createContext, useState, useContext} from "react";

const AppContext = createContext(null);

export const useAppContext = () => {
    const context = useContext(AppContext);

    // context in React provides a way to share data between components that are part of the same component tree
    if (context === undefined) {
        throw new Error("AppContext must be with AppContextProvider.")
    }

    return context;
}

const AppContextProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    const addToLibrary = (book) => {
        const liked =[...favorites]
        const newLikes = liked.concat(book)
        setFavorites(newLikes);

    };

    const removeFromLibrary = (id) => {
        const liked =[...favorites]
        const newLikes = liked.filter((book) => book.id !== id);
        setFavorites(newLikes);
    };

    return (
        <AppContext.Provider value={{ favorites, addToLibrary, removeFromLibrary }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContextProvider };
