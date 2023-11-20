"use client";

export const FormInput = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target)
        console.log(data)
    };

    return (
        <form onSubmit={handleSubmit} className="search--container">
            <input
                type="text"
                placeholder="Let's look at someone metrics...Type the name here."
                className="text--input"
            />
            <button className="btn submit-btn">Search</button>
        </form>
    );
};
