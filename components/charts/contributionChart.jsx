"use client";

import { ActiveShapePieChart } from "./activeShapePieChart";


export function ContributionsChart({ user }) {
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
        <>
            <ActiveShapePieChart data={data} />
        </>
    );
}
