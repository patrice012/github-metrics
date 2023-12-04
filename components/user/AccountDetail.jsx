import Link from "next/link";

export const AccountDetail = ({ userData }) => {
    return (
        <>
            {userData ? (
                <section className="account-detail">
                    <div className="container">
                        <div className="main-information">
                            <img
                                src={userData.avatar_url}
                                alt="profil picture"
                            />
                            <h1 className="name">Username: {userData.name}</h1>
                            <h3 className="name">
                                Login Name: {userData.login}
                            </h3>
                            <h4 className="location">
                                Login Name: {userData.location}
                            </h4>
                            <Link href={`mailto:${userData.email}`}>
                                {userData.email}
                            </Link>
                        </div>
                        <div className="profile">
                            <h4 className="followers">
                                <span>Followings:</span>{" "}
                                <span>{userData.following}</span>
                                <Link href={userData.following_url}>
                                    View Followings
                                </Link>
                            </h4>
                            <h4 className="following">
                                <span>Followers:</span>{" "}
                                <span>{userData.followers}</span>
                                <Link href={userData.followers_url}>
                                    View Followers
                                </Link>
                            </h4>
                            <h4 className="join-at">
                                <span>Join at:</span>{" "}
                                <span>{userData.created_at}</span>
                            </h4>
                            <h4 className="repos">
                                <span>Public repository:</span>{" "}
                                <span>{userData.public_repos}</span>
                            </h4>
                            <h4 className="gists">
                                <span>Public gists:</span>{" "}
                                <span>{userData.public_gists}</span>
                            </h4>
                        </div>
                        <div className="bio">{userData.bio}</div>
                    </div>
                </section>
            ) : null}
        </>
    );
};
