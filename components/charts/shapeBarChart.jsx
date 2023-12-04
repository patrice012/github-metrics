"use client";

import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

// const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];
const colors = ["#8884d8", "#82ca9d", "#19d"];

const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
        x + width / 2
    },${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
        x + width
    }, ${y + height}
  Z`;
};

const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{label}</p>
                <p className="label-second">
                    {payload[0].value > 1? 'commits: ': 'commit: '}
                    {payload[0].value}
                </p>
            </div>
        );
    }

    return null;
};

export function ShapeBarChart({ user }) {
    const maxNumber = 8;
    // get repository with most commits
    const commits = [...user.allCommits]
        ?.sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
        .slice(0, maxNumber)
        ?.map((value, _) => {
            return {
                name: Object.keys(value)[0],
                value: Object.values(value)[0],
            };
        });

    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={commits}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />

                    <Bar
                        dataKey="value"
                        fill="#8884d8"
                        // shape={<TriangleBar />}
                        label={{ position: "top" }}
                    >
                        {commits.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                                // fill={
                                //     colors[
                                //         Math.floor(
                                //             Math.random() *
                                //                 (colors.length - 0 + 1)
                                //         ) + 0
                                //     ]
                                // }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
