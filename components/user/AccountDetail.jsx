import Link from "next/link";

import style from "./_partials/_profile.scss";

export const AccountDetail = ({ userData }) => {
    return (
        <>
            <div className="container">
                {userData ? (
                    <section className="account-detail">
                        <div className="main-information">
                            <img
                                src={userData.avatar_url}
                                alt="profil picture"
                            />
                            <h1 className="name">Username: {userData.name}</h1>
                            <h3 className="name">
                                Login Name: {userData.login}
                            </h3>
                            {userData.location && (
                                <h4 className="location">
                                    Location: {userData.location}
                                </h4>
                            )}
                            {userData.email && (
                                <Link href={`mailto:${userData.email}`}>
                                    Email: {userData.email}
                                </Link>
                            )}
                        </div>
                        <div className="profile">
                            <h4 className="followers">
                                <span>Followings:</span>{" "}
                                <span>{userData.following}</span>
                            </h4>
                            <h4 className="following">
                                <span>Followers:</span>{" "}
                                <span>{userData.followers}</span>
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
                        {/* <div className="bio">{userData.bio}</div> */}
                    </section>
                ) : null}
            </div>
        </>
    );
};
