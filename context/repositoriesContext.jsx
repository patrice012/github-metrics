"use client";
import { createContext, useState } from "react";

const RepositoriesContext = createContext([]);

const RepositoriesProvider = ({ children }) => {
    const [repositories, setRepositories] = useState([]);

    const setUserRepositories = (repos) => {
        setRepositories(repos);
    };

    return (
        <RepositoriesContext.Provider
            value={{ repositories, setUserRepositories }}
        >
            {children}
        </RepositoriesContext.Provider>
    );
};

export { RepositoriesProvider, RepositoriesContext };
