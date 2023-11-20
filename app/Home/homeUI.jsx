import style from './_home.scss';

export const HomeInterface = () => {
    return (
        <>
            <main className="homePage">
                <div className="container">
                    <div className="block--contents">
                        <h1>Let&apos;s look at someone metrics...</h1>
                        <form>
                            <input
                                type="text"
                                placeholder="Let's look at someone metrics...Type the name here."
                                className="text--input"
                            />
                            <button className="btn">Search</button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};
