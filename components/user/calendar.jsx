import GitHubCalendar from "react-github-calendar";
import style from "./_partials/_calendar.scss";

export const Calendar = ({ userData }) => {
    return (
        <>
            <div className="calendar">
                {userData.login && (
                    <div className="container">
                        <h2 className="title">Contribution Calendar</h2>
                        <GitHubCalendar
                            username={userData.login}
                            blockSize={15}
                            blockRadius={10}
                            blockMargin={2.5}
                            colorScheme="light"
                        />
                    </div>
                )}
            </div>
        </>
    );
};
