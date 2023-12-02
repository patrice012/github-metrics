import { baseUrl } from "../api-endpoint";
import { Respository } from "./Respository";
import { fetchData } from "@/utils/fetch";
import style from "./_partials/_respositories.scss";
import { useEffect, useState } from "react";
// import { RepositoriesContext } from "@/context/repositoriesContext";
// import { useContext } from "react";

// fetch user repositories
async function getUserRespositories(user) {
    const repositoriesUrl = `${baseUrl}/users/${user}/repos`;
    console.log(repositoriesUrl, "url");
    try {
        const res = await fetchData(repositoriesUrl);
        return res;
    } catch (error) {
        return console.log(error);
    }
}

export const UserRespositories = (userData) => {
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {
        console.log("inside effect");
        if (
            !userData ||
            userData.login === undefined ||
            userData.login === null
        ) {
            return;
        }
        (async () => {
            const repos = await getUserRespositories(userData.login);
            setRepositories(repos);
        })();
    }, [userData]);

    console.log(repositories, "user repositories");

    return (
        <>
            <section className="listOfRespositories">
                <div className="container">
                    <Respository />
                    <Respository />
                    <Respository />
                    <Respository />
                    <Respository />
                    <Respository />
                </div>
            </section>
        </>
    );
};

async function getRepositories(username) {
    const url = `${baseUrl}/users/${username}/repos`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${username} repositories.`);
    }
    return res.json();
}
