"use client";

import { ActiveShapePieChart } from "./activeShapePieChart";

const colors = [
    "#8884d8",
    "#83a6ed",
    "#3DED97",
    "#3AC7EB",
    "#0088FE",
    "#00C49F",
    "#8dd1e1",
    "#82ca9d",
];

export const ContributionsChartForYear = ({ user }) => {
  const _data = user.contributionsPerYear;
  const data = []
  for (const [key, value] of Object.entries(_data)) {
    data.push({name:key, value:value})
  }
   

    return (
        <>
            <ActiveShapePieChart data={data} />
        </>
    );
};
