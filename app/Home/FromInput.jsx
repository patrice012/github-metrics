"use client";

import { useState } from "react";
import { baseUrl } from "../api-endpoint";

export const FormInput = () => {
    const [user, setUser] = useState(null);
    const [input, setInput] = useState(undefined);
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        (async () => {
            try {
                const res = await getUser(input);
                setUser(res);
            } catch (error) {
                // handle error
                console.error(error);
            } finally {
                setLoading(false)
            }
        })();
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
            <button disabled={loading} className="btn submit-btn">
                Submit
            </button>
        </form>
    );
};

async function getUser(username) {
    const url = `${baseUrl}/users/${username}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch data.");
    }
    return res.json();
}
