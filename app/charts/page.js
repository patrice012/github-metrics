import { BarChartPlot } from "./barChart";
import { AreaChartPlot } from "./areaChart";
import { LineChartPlot } from "./lineChart";
import { PieChartPlot } from "./pieChart";
import { ShapeBarChart } from "./shapeBarChart";
import { ActiveShapePieChart } from "./activeShapePieChart";

export default function Chard() {
    return (
        <>
            <section className="flex my-4 px-4 gap-3">
                <div className="w-1/2 h-[300px]  rounded">
                    <h3 className="title">
                        User commits vs contributor commits in repository
                    </h3>

                    <BarChartPlot />
                </div>
                <div className="w-1/2 h-[300px]  rounded">
                    <h3 className="title">User activities</h3>

                    <LineChartPlot />
                </div>
            </section>
            <section className="flex my-4 px-4 gap-3">
                <div className=" w-1/2 h-[250px]  rounded">
                    <h3 className="title">User activities</h3>

                    <AreaChartPlot />
                </div>
                <div className=" w-1/2 h-[250px]  rounded">
                    <h3 className="title">Users programing languages</h3>

                    <PieChartPlot />
                </div>
            </section>
            <section className="flex my-4 px-4 gap-3">
                <div className=" w-1/2 h-[250px]  rounded">
                    <h3 className="title">Commits per repository</h3>
                    <ShapeBarChart />
                </div>
                <div className=" w-1/2 h-[250px]  rounded">
                    <h3 className="title">Longest Streack</h3>
                    <ActiveShapePieChart />
                </div>
            </section>
        </>
    );
}
