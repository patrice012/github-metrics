import style from "./_home.scss";
import { baseUrl } from "../api-endpoint";

export const HomeInterface =  async () => {

    return (
        <>
            <main className="homePage">
                <div className="container">
                    <div className="block--contents">
                        <h1>Let&apos;s look at someone metrics...</h1>
                        <form className="search--container">
                            <input
                                type="text"
                                placeholder="Let's look at someone metrics...Type the name here."
                                className="text--input"
                            />
                            <button className="btn submit-btn">Search</button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

async function getUsers() {
    const url = `${baseUrl}/users/patrice012`;
    const res = await fetch(url);
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }
    return res.json();
}
