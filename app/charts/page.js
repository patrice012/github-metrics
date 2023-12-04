import { BarChartPlot } from "./barChart";
import { AreaChartPlot } from "./areaChart";
import { LineChartPlot } from "./lineChart";
import { PieChartPlot } from "./pieChart";


export default function Chard() {
    return (
        <>
            <section className="flex my-4 px-4 gap-3">
                <div className="w-1/2 h-[300px]  rounded">
                    <BarChartPlot />
                </div>
                <div className="w-1/2 h-[300px]  rounded">
                    <LineChartPlot />
                </div>
            </section>
            <section className="flex my-4 px-4 gap-3">
                <div className=" w-1/2 h-[250px]  rounded">
                    <AreaChartPlot />
                </div>
                <div className=" w-1/2 h-[250px]  rounded">
                    <PieChartPlot />
                </div>
            </section>
        </>
    );
}
