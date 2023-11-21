"use client";
import { createContext, useState } from "react";

const UserContext = createContext({});

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const addUser = (userData) => {
        setUser(userData);
    };

    return (
        <UserContext.Provider value={{ user, addUser }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };
