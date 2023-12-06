"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";


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
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={
                            colors[
                                Math.floor(
                                    Math.random() * (colors.length - 0 + 1)
                                ) + 0
                            ]
                        }
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};
