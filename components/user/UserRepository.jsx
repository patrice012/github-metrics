import { baseUrl } from "../../utils/api-endpoint";
import { Respository } from "./Respository";
import { fetchData } from "@/utils/fetch";
import style from "./_partials/_respositories.scss";
import { useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import { MetricsChart } from "./metrics";


export const UserRespositories = ({ userData }) => {
    const [repositories, setRepositories] = useState([]);
    const [contributions, setContributions] = useState({});
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!userData) {
            return;
        }
        (async () => {
            const repos = await getUserRespositories(userData.login);
            setRepositories(repos);
            setContributions({})
        })();
    }, [userData]);

    if (contributions) {
        user.saveAllContributions(contributions);
    }

    if (repositories) {
        user.setAllRespositories(repositories);
    }
   user.allCommits;

    return (
        <>
            <section className="listOfRespositories">
                {/* <div className="container">
                    {repositories?.map((repos, index) => (
                        <Respository
                            key={index}
                            repos={repos}
                            setContributions={setContributions}
                        />
                    ))}
                </div> */}
            </section>
            {/* {user.totalNumberOfCommits && <MetricsChart user={user} />} */}

            <MetricsChart user={user} />
        </>
    );
};

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