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
import style from "./_style.scss";

import { customisedStyle } from "./customStyle";

const colors = customisedStyle.colors;

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{label}</p>
                <p className="label-second">
                    {payload[0].value > 1
                        ? "contributions: "
                        : "contribution: "}
                    {payload[0].value}
                </p>
            </div>
        );
    }

    return null;
};

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const tooltipStyle = customisedStyle.tooltip;

export function ContributionsChartForMonth({ user }) {
    const contributions = user.contributionsPerMonths;
    const data = [];
    for (const [key, value] of Object.entries(contributions)) {
        const month = new Date(key + "-5").getMonth();
        const _data = {
            name: monthNames[month],
            value: value,
        };
        data.push(_data);
    }

    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
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
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={tooltipStyle}
                    />
                    {/* <Legend /> */}

                    <Bar
                        dataKey="value"
                        fill={colors[0]}
                        // shape={<TriangleBar />}
                        label={{ position: "top" }}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={
                                    colors[
                                        Math.floor(
                                            Math.random() *
                                                (colors.length - 0 + 1)
                                        ) + 0
                                    ]
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
