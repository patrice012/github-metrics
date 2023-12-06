import { BarChartPlot } from "../charts/barChart";
import { CommitsInRepository } from "../charts/commitsInRepository";
import { ContributionsChart } from "../charts/contributionChart";
import { ProgrammingLanguageChart } from "../charts/languageChart";
import { RepositoryContributions } from "../charts/repositoryContributions";
import { ContributionsChartForMonth } from "../charts/contributionsPerMonth";
import { ContributionsChartForDay } from "../charts/contributionsPerDay";
import { ContributionsChartForYear } from "../charts/contributionsPerYear";

import style from "./_partials/_metrics.scss";

export function MetricsChart({ user }) {
    return (
        <>
            <div className="container">
                <section className="metrics">
                    <div className="wrapper">
                        <section className=" metrics--container">
                            <div className="w-1/2 h-[300px]  rounded">
                                <h3 className="title">
                                    {user.name} commits vs contributor commits
                                    in repository
                                </h3>
                                <BarChartPlot user={user} />
                            </div>
                            <div className=" w-1/2 h-[250px]  rounded">
                                <h3 className="title">Contribuions</h3>
                                <ContributionsChart user={user} />
                            </div>
                        </section>
                    </div>
                </section>

                <section className=" metrics">
                    <div className="wrapper">
                        <section className=" metrics--container">
                            <div className=" w-screen h-[250px]  rounded">
                                <h3 className="title">Programing languages</h3>
                                <ProgrammingLanguageChart user={user} />
                            </div>
                        </section>
                        <section className="metrics--container">
                            <div className=" w-screen h-[300px]  rounded">
                                <h3 className="title">Month contributions</h3>
                                <ContributionsChartForMonth user={user} />
                            </div>
                        </section>
                    </div>
                </section>

                <section className="metrics">
                    <div className="wrapper">
                        <section className=" metrics--container">
                            <div className="w-1/2 h-[250px]  rounded">
                                <h3 className="title">
                                    Commits per repository
                                </h3>
                                <CommitsInRepository user={user} />
                            </div>
                            <div className="w-1/2 h-[250px]  rounded">
                                <h3 className="title">Year contribution</h3>
                                <ContributionsChartForYear user={user} />
                            </div>
                        </section>
                        <section className=" metrics--container">
                            <div className="w-screen h-[300px]  rounded">
                                <h3 className="title">
                                    All times contributions
                                </h3>
                                <ContributionsChartForDay user={user} />
                            </div>
                        </section>
                    </div>
                </section>

                <section className="metrics">
                    <section className=" metrics--container">
                        <div className="w-screen h-[250px]  rounded">
                            <h3 className="title">Repository contributions</h3>
                            <RepositoryContributions user={user} />
                        </div>
                    </section>
                </section>
            </div>
        </>
    );
}
