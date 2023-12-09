"use client";

import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { UserRespositories } from "@/components/user/UserRepository";
import { AccountDetail } from "@/components/user/AccountDetail";
import { Calendar } from "@/components/user/calendar";
import HeaderIntereface from "./demo/HeaderIntereface";

export default function Home() {
    const { user } = useContext(UserContext);
    const userData = user?.globalData;
    const globalError = user?.globalError;
    const requestState = user?.requestState;
    let notFoundError = undefined;
    let authorizationError = undefined;
    let nameError = undefined;
    if (globalError) {
        for (let [key, value] of Object.entries(globalError)) {
            if (key === "404") {
                notFoundError = globalError?.value;
            }
            if (key === "401") {
                authorizationError = globalError?.value;
            }
            if (key === "error") {
                nameError = value;
            }
        }
    }

    return (
        <>
            <HeaderIntereface user={ user} />
            <div className="container">
                {requestState === "success" ? (
                    <>
                        <AccountDetail userData={userData} />
                        <Calendar userData={user.globalData} />
                        <UserRespositories userData={userData} />
                    </>
                ) : notFoundError || nameError ? (
                    <p>404 User not found</p>
                ) : authorizationError ? (
                    <p>{authorizationError}</p>
                ) : null}
            </div>
        </>
    );
}
