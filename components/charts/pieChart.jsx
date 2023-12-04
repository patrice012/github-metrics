"use client";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const colors = [
    "#8884d8",
    "#FA8072",
    "#AF69EE",
    "#3DED97",
    "#3AC7EB",
    "#F9A603",
];

const PieChartPlot = ({ user }) => {
    const langData = user.programmingLanguages;
    let total = 0;
    const data = langData
        ? Object.keys(langData).map((lang, _) => {
              total += langData[lang];
              return {
                  name: lang,
                  value: langData[lang],
              };
          })
        : {};

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{label}</p>
                    <p className="label-second">
                        {`used: ${(payload[0].value * 100) / total} %`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={730} height={250}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        fill="#8884d8"
                        label={data}
                        // labelLine={false}
                        // label={renderCustomizedLabel}
                    >
                        {data?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index]} />
                        ))}
                    </Pie>
                    <Tooltip content={CustomTooltip} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </>
    );
};
export { PieChartPlot };
