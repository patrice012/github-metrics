import { BarChartPlot } from "../charts/barChart";
import { AreaChartPlot } from "../charts/areaChart";
import { LineChartPlot } from "../charts/lineChart";
import { CommitsInRepository } from "../charts/commitsInRepository";
import { ContributionsChart } from "../charts/contributionChart";
import { ProgrammingLanguageChart } from "../charts/languageChart";
import { RepositoryContributions } from "../charts/repositoryContributions";

export function MetricsChart({ user }) {
    // console.log(user.repositoryMetrics, "repositoryMetrics");
    // console.log(user.allCommits, "allCommits");
    // console.log(user.totalNumberOfCommits, "totalNumberOfCommits");

    console.log(user.contributionsPerWeek, "contributionsPerWeek");
    console.log(user.contributionsPerMonths, "contributionsPerMonths");
    console.log(user.contributionsPerYear, "contributionsPerYear");

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
                    <h3 className="title">{user.name}all times activities</h3>
                    <AreaChartPlot user={user} />
                </div>
            </section>
            <section className="flex my-4 px-4 gap-3">
                <div className="w-screen h-[250px]  rounded">
                    <h3 className="title">Commits per repository</h3>
                    <CommitsInRepository user={user} />
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
