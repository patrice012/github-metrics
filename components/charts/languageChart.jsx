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

export const ProgrammingLanguageChart = ({ user }) => {
    const langData = user.programmingLanguages;
    let total = 0;
    const data = langData
        ? Object.keys(langData).map((lang, _) => {
              total += langData[lang];
              return {
                  name: lang,
                  value: langData[lang],
                  fill: colors[
                      Math.floor(Math.random() * (colors.length - 0 + 1)) + 0
                  ],
              };
          })
        : {};

    return (
        <>
            <ActiveShapePieChart data={data} />
        </>
    );
};
