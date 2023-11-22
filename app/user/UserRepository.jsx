import { baseUrl } from "../api-endpoint";
import { Respository } from "./Respository";
import style from './_partials/_respositories.scss';

export const UserRespositories = ({ userData }) => {
    // const username = userData["login"];
    // getRepositories(username)
    //     .then((res) => console.log(res))
    //     .catch((error) => console.log(error));

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
