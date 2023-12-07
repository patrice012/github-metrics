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
import style from './_style.scss'

import { customisedStyle } from "./customStyle";
const tooltipStyle = customisedStyle.tooltip;

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

export function RepositoryContributions({ user }) {
    let data = [...user.repositoriesContributions]
        ?.slice(0, 8)
        .map((contr, _) => ({
            name: contr.repository.name,
            value: contr.contributions.totalCount,
        }));
    if (!data) {
        data = [];
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
