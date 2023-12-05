import GitHubCalendar from "react-github-calendar";

export const Calendar = ({ userData }) => {
    return (
        <>
            <div>
                {userData.login && (
                    <div>
                        <h2>GitHub Contributions Calendar</h2>
                        <GitHubCalendar
                            username={userData.login}
                            blockSize={15}
                            blockRadius={10}
                            blockMargin={2}
                            colorScheme="light"
                            // renderBlock={(block, activity) => (

                            //     <div
                            //         className="tooltip"
                            //         data-tip={`${activity.count} activities on ${activity.date}`}
                            //     >
                            //         {block}
                            //     </div>
                            // )}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
