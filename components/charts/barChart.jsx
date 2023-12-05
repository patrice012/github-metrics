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

export function BarChartPlot({ user }) {
    const commistInRepos = user.repositoryMetrics;
    const filterData = [];
    commistInRepos?.map((stats, _) => {
        let userCommits = 0;
        let othersCommits = 0;
        Object.values(stats)[0].map((contr, _) => {
            if (contr.login === user.name) {
                userCommits = contr.contributions;
            } else {
                othersCommits += contr.contributions;
            }
        });
        if (userCommits != 0 && othersCommits != 0) {
            const x = { name: Object.keys(stats)[0] };
            x["user"] = userCommits;
            x["others"] = othersCommits;
            x["total"] = userCommits + othersCommits;
            filterData.push(x);
        }
    });

    const data = [...filterData];

    return (
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
                <Bar dataKey="user" fill="#8884d8" activeBar={<Rectangle />} />
                <Bar
                    dataKey="others"
                    fill="#82ca9d"
                    activeBar={<Rectangle />}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
