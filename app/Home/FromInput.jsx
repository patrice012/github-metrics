"use client";

import { useContext, useState } from "react";
import { baseUrl } from "../../utils/api-endpoint";
import { UserContext } from "@/context/userContext";
import { fetchData } from "@/utils/fetch";

export const FormInput = () => {
    const { addUser } = useContext(UserContext);

    // fetch user information
    const handleSubmit = async (e) => {
        e.preventDefault();
        // setLoading(true);
        const formData = new FormData(e.target);

        // profile information
        const info = await getProfileInformation(formData.get("username"));
        addUser(info);

        //reset input state
        if (info) {
            e.target.reset();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search--container">
            <input
                type="text"
                placeholder="Let's look at someone metrics...Type the name here."
                className="text--input"
                name="username"
            />
            <button className="btn submit-btn">Submit</button>
        </form>
    );
};

// fetc user information
async function getProfileInformation(user) {
    const url = `${baseUrl}/users/${user}`;
    try {
        const res = await fetchData(url);
        return res;
    } catch (error) {
        return console.log(error);
    }
}
