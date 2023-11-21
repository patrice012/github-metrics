"use client";

import { useContext, useState } from "react";
import { baseUrl } from "../api-endpoint";
import { UserContext } from "@/context/userContext";

export const FormInput = () => {
    const { addUser } = useContext(UserContext);
    const [input, setInput] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        getUser(input)
            .then((res) => {
                addUser(res);
            })
            .catch((error) => console.log(error))
            .finally(() => {
                setInput("");
                setLoading(false);
            });
    };

    const handleChange = (inputValue) => {
        setInput(inputValue);
    };

    return (
        <form onSubmit={handleSubmit} className="search--container">
            <input
                onChange={(e) => handleChange(e.target.value)}
                type="text"
                placeholder="Let's look at someone metrics...Type the name here."
                className="text--input"
            />
            <button className="btn submit-btn">Submit</button>
        </form>
    );
};

function getUser(username) {
    const url = `${baseUrl}/users/${username}`;
    return (
        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch data.");
                }
                return res.json();
            })
            .catch((error) => {
                // handle error
                console.log(error);
            })
    );
}
