"use client";

import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { submitHelper } from "@/utils/submitHelper";

export const FormInput = () => {
    const { addUser } = useContext(UserContext);

    const handler = submitHelper(addUser);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handler(e);
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
