import Link from "next/link";
import styel from "./_partials/_repository.scss";
import { useEffect } from "react";
import { fetchData } from "@/utils/fetch";
import { baseUrl } from "../../utils/api-endpoint";

//commits_url
//https://api.github.com/repos/{lenon==> user-login}/{vimfiles==> name}/commits ==> repos all commits

export const Respository = ({ repos }) => {
    // console.log(repos)
    useEffect(() => {
        const commitsUrl = `${baseUrl}/repos/${repos.login}/${repos.name}/commits/`;
        const res = fetchData(commitsUrl);
        
        console.log(d, "commits");
    }, [repos]);

    return (
        <div className="repository--container">
            <div className="fields--container">
                <h2 className="owner--username">{repos.owner.login}</h2>
            </div>
            <div className="fields--container">
                <h2 className="repository--name">Name:{repos.name}</h2>
                <h2 className="repository--create-at">
                    Create at:{repos.created_at}
                </h2>
                <h2 className="repository--create-at">
                    Last Update: {repos.updated_at}
                </h2>
                <h4 className="repository--fork-count">
                    Fork count:{repos.forks_count}
                </h4>
                <h4 className="repository--fork-count">
                    Star count:{repos.stargazers_count}
                </h4>
                <h4 className="repository--watcher-count">
                    Watcher count:{repos.watchers_count}
                </h4>
                <h4 className="repository--language">
                    Language:{repos.language}
                </h4>
            </div>
            <div>
                {repos?.topics?.map((topic, index) => (
                    <span key={index}>{topic + " "} </span>
                ))}
            </div>
            <Link href={repos.html_url} className="more-information">
                View in Github
            </Link>
        </div>
    );
};
