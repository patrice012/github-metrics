"use client";

import {
    BarChart,
    Bar,
    Rectangle,
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

export function CommitsInRepository({ user }) {

    const maxNumber = 8;
    // get repository with most commits
    const data = [...user.allCommits]
        ?.sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
        .slice(0, maxNumber)
        ?.map((value, _) => {
            return {
                name: Object.keys(value)[0],
                value: Object.values(value)[0],
                fill: colors[
                    Math.floor(Math.random() * (colors.length - 0 + 1)) + 0
                ],
            };
        });

    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
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
                    <Bar
                        dataKey="value"
                        fill="#8884d8"
                        activeBar={<Rectangle />}
                    />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
