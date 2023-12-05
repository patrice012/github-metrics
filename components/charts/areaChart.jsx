"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// use this to show a number of commits per year and a number of repos create in the same year

const AreaChartPlot = () => {
    const data = [
        {
            year: "2016",
            Iphone: 4000,
            Samsung: 2400,
            pixel: 7000,
        },
        {
            year: "2017",
            Iphone: 3000,
            Samsung: 1398,
            pixel: 128,
        },
        {
            year: "2018",
            Iphone: 2000,
            Samsung: 9800,
            pixel: 3334,
        },
        {
            year: "2019",
            Iphone: 2780,
            Samsung: 3908,
            pixel: 5555,

        },
        {
            year: "2020",
            Iphone: 1890,
            Samsung: 4800,
            pixel: 8512,

        },
        {
            year: "2021",
            Iphone: 2390,
            Samsung: 3800,
            pixel: 1240,

        },
        {
            year: "2022",
            Iphone: 3490,
            Samsung: 4300,
            pixel: 6540,

        },
    ];

    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    width={730}
                    height={250}
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id="colorUv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#8884d8"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#8884d8"
                                stopOpacity={0}
                            />
                        </linearGradient>
                        <linearGradient
                            id="colorPv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#82ca9d"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#82ca9d"
                                stopOpacity={0}
                            />
                        </linearGradient>
                        <linearGradient
                            id="colorPx"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#19d"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#19d"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="Iphone"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                    />
                    <Area
                        type="monotone"
                        dataKey="Samsung"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                    />
                    <Area
                        type="monotone"
                        dataKey="pixel"
                        stroke="#19d"
                        fillOpacity={1}
                        fill="url(#colorPx)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </>
    );
};
export { AreaChartPlot };
