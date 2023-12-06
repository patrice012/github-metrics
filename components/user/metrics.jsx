import { BarChartPlot } from "../charts/barChart";
import { AreaChartPlot } from "../charts/areaChart";
import { LineChartPlot } from "../charts/lineChart";
import { CommitsInRepository } from "../charts/commitsInRepository";
import { ContributionsChart } from "../charts/contributionChart";
import { ProgrammingLanguageChart } from "../charts/languageChart";
import { RepositoryContributions } from "../charts/repositoryContributions";
import { ContributionsChartForMonth } from "../charts/contributionsPerMonth";
import { ContributionsChartForDay } from "../charts/contributionsPerDay";
import { ContributionsChartForYear } from "../charts/contributionsPerYear";

export function MetricsChart({ user }) {

    return (
        <>
            <section className="flex my-4 px-4 gap-3">
                <div className=" w-1/2 h-[250px]  rounded">
                    <h3 className="title">User contribuions</h3>
                    <ContributionsChart user={user} />
                </div>
                <div className=" w-1/2 h-[250px]  rounded">
                    <h3 className="title">{user.name} programing languages</h3>

                    <ProgrammingLanguageChart user={user} />
                </div>
            </section>
            <section className="flex my-4 px-4 gap-3">
                <div className=" w-screen h-[250px]  rounded">
                    <h3 className="title">Month contributions</h3>

                    <ContributionsChartForMonth user={user} />
                </div>
            </section>
            <section className="flex my-4 px-4 gap-3">
                <div className="w-1/2 h-[300px]  rounded">
                    <h3 className="title">
                        {user.name} commits vs contributor commits in repository
                    </h3>
                    <BarChartPlot user={user} />
                </div>
                <div className="w-1/2 h-[300px]  rounded">
                    <h3 className="title">All times contributions</h3>
                    {/* <LineChartPlot user={user} /> */}
                    <ContributionsChartForDay user={user} />
                </div>
            </section>
            {/* <section className="flex my-4 px-4 gap-3">
                <div className=" w-screen h-[250px]  rounded">
                    <h3 className="title">{user.name}all times activities</h3>
                    <AreaChartPlot user={user} />
                </div>
            </section> */}
            <section className="flex my-4 px-4 gap-3">
                <div className="w-1/2 h-[250px]  rounded">
                    <h3 className="title">Commits per repository</h3>
                    <CommitsInRepository user={user} />
                </div>
                <div className="w-1/2 h-[250px]  rounded">
                    <h3 className="title">Year contribution</h3>
                    <ContributionsChartForYear user={user} />
                </div>
            </section>

            <section className="flex my-4 px-4 gap-3">
                <div className="w-screen h-[250px]  rounded">
                    <h3 className="title">Repository contributions</h3>
                    <RepositoryContributions user={user} />
                </div>
            </section>
        </>
    );
}
