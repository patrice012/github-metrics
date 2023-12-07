"use client";

import { ActiveShapePieChart } from "./activeShapePieChart";
import { customisedStyle } from "./customStyle";

const colors = customisedStyle.colors;

export function ContributionsChart({ user }) {
    const data = [
        {
            name: "Issues",
            value: user.numberOfIssues,
            fill: colors[0],
        },
        {
            name: "Pull request",
            value: user.numberOfPullRequest,
            fill: colors[1],
        },
        {
            name: "Reviews",
            value: user.numberOfReviews,
            fill: colors[6],
        },
        {
            name: "Commits",
            value: user.totalNumberOfCommits,
            fill: colors[7],
        },
    ];
    return (
        <>
            <ActiveShapePieChart data={data} />
        </>
    );
}
