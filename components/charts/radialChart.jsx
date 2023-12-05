"use client";
import {
    RadialBarChart,
    RadialBar,
    Legend,
    ResponsiveContainer,
} from "recharts";

const style = {
    top: "50%",
    right: 0,
    transform: "translate(0, -50%)",
    lineHeight: "24px",
};

export function RadialChart({ user }) {
  console.log(user.numberOfPullRequest, "user");
    const data = [
        {
            name: "Issues",
            value: user.numberOfIssues,
            fill: "#8884d8",
        },
        {
            name: "Pull request",
            value: user.numberOfPullRequest,
            fill: "#83a6ed",
        },
        {
            name: "Reviews",
            value: user.numberOfReviews,
            fill: "#8dd1e1",
        },
        {
            name: "Commits",
            value: user.totalNumberOfCommits,
            fill: "#82ca9d",
        },
    ];
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="10%"
                outerRadius="80%"
                barSize={50}
                data={data}
            >
                <RadialBar
                    minAngle={15}
                    label={{ fill: "#000" }} // position: "insideStart",
                    background
                    // clockWise
                    dataKey="value"
                />
                <Legend
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    wrapperStyle={style}
                />
            </RadialBarChart>
        </ResponsiveContainer>
    );
}
