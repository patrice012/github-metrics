import Plot from "react-plotly.js";
import style from "./_partials/_result.scss";
import { baseUrl } from "../api-endpoint";

export const CommitsMetrics = ({ userData }) => {
    // const userName = userData["login"];
       

    const data = [
        {
            x: [1, 2, 3],
            y: [2, 6, 3],

            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
        },
        { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
    ];
    const config = {
        displayModeBar: true,
        modeBarButtonsToRemove: [
            "zoom2d",
            "pan2d",
            "select2d",
            "lasso2d",
            "resetScale2d",
            "autoScale2d",
            "resetScale2d",
        ],
    };
    return (
        <Plot
            data={data}
            layout={{ width: 520, height: 520, title: "A Fancy Plot" }}
            config={config}
        />
    );
};

async function getCommits(username) {
    const url = `https://api.github.com/users/${username}/commits?since=2022-11-09&until=2023-11-09`;
    // const url = `${baseUrl}/users/${username}/commits`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${username} commits.`);
    }
    return res.json();
}
