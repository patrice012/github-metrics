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

import { customisedStyle } from "./customStyle";

const colors = customisedStyle.colors;

const daysName = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

function nextDate(date, gap) {
    // Input date string
    const inputDateStr = date;

    // Convert the input string to a Date object
    const inputDate = new Date(inputDateStr);

    // Get the next date
    const nextDate = new Date(inputDate);
    nextDate.setDate(inputDate.getDate() + gap);
    const formatDate = `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}-${
        nextDate.getDay() + 1
    }`;
    return formatDate;
}

export function ContributionsChartForDay({ user }) {
    const contributions = user.contributionsPerWeek;
    const data = [];
    let gap = 0;
    let next = 0;
    for (const [key, value] of Object.entries(contributions)) {
        const day = new Date(key).getDay();
        if (next >= daysName.length) {
            next = 0;
        }
        const _data = {
            name: `${daysName[day + next]}, ${nextDate(key, gap)}`,
            value: value,
        };
        data.push(_data);
        next++;
        gap++;
    }

    return (
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
                <XAxis dataKey="name" hide={true} />
                <YAxis hide={true} />
                <Tooltip />
                {/* <Legend /> */}
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={colors[0]}
                    activeDot={{ r: 8 }}
                />
                {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
            </LineChart>
        </ResponsiveContainer>
    );
}
