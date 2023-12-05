import { BarChartPlot } from "../charts/barChart";
import { AreaChartPlot } from "../charts/areaChart";
import { LineChartPlot } from "../charts/lineChart";
import { PieChartPlot } from "../charts/pieChart";
import { ShapeBarChart } from "../charts/shapeBarChart";
import { ActiveShapePieChart } from "../charts/activeShapePieChart";
import { RadialChart } from "../charts/radialChart";

export function MetricsChart({ user }) {
    // console.log(user.repositoryMetrics, "repositoryMetrics");
    // console.log(user.allCommits, "allCommits");
    // console.log(user.totalNumberOfCommits, "totalNumberOfCommits");

    // console.log(user.allRepositories, "allRepositories");

    return (
        <>
            <section className="flex my-4 px-4 gap-3">
                <div className=" w-1/2 h-[250px]  rounded">
                    <h3 className="title">Longest Streack</h3>
                    <ActiveShapePieChart user={user} />
                </div>
                <div className=" w-1/2 h-[250px]  rounded">
                    <h3 className="title">{user.name} programing languages</h3>

                    <PieChartPlot user={user} />
                </div>
            </section>
            <section className="flex my-4 px-4 gap-3">
                <div className=" w-1/2 h-[250px]  rounded">
                    <h3 className="title">User contribuions ==</h3>
                    <RadialChart user={user} />
                </div>
                {/* <div className=" w-1/2 h-[250px]  rounded">
                    <h3 className="title">{user.name} programing languages</h3>

                </div> */}
            </section>
            <section className="flex my-4 px-4 gap-3">
                <div className="w-1/2 h-[300px]  rounded">
                    <h3 className="title">
                        {user.name} commits vs contributor commits in repository
                    </h3>

                    <BarChartPlot user={user} />
                </div>
                <div className="w-1/2 h-[300px]  rounded">
                    <h3 className="title">{user.name} activities</h3>

                    <LineChartPlot user={user} />
                </div>
            </section>
            <section className="flex my-4 px-4 gap-3">
                <div className=" w-screen h-[250px]  rounded">
                    <h3 className="title">{user.name} activities</h3>

                    <AreaChartPlot user={user} />
                </div>
            </section>
            <section className="flex my-4 px-4 gap-3">
                <div className="w-screen h-[250px]  rounded">
                    <h3 className="title">Commits per repository</h3>
                    <ShapeBarChart user={user} />
                </div>
            </section>
        </>
    );
}
