"use client";

import { ActiveShapePieChart } from "./activeShapePieChart";
import { customisedStyle } from "./customStyle";

const colors = customisedStyle.colors;

export const ContributionsChartForYear = ({ user }) => {
    const _data = user.contributionsPerYear;
    const data = [];
    for (const [key, value] of Object.entries(_data)) {
        data.push({ name: key, value: value });
    }

    return (
        <>
            <ActiveShapePieChart data={data} />
        </>
    );
};
