"use client";

import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { UserRespositories } from "@/components/user/UserRepository";
import { AccountDetail } from "@/components/user/AccountDetail";
import { Calendar } from "@/components/user/calendar";
import { InputComponent } from "./Home/InputComponent";

export default function Home() {
    const { user } = useContext(UserContext);
    const userData = user?.globalData;
    console.log(user, 'user')
    console.log(user?.globalError, "user globalError");
    console.log(user?.requestState, "user requestState");

    return (
        <>
            <InputComponent user={user} /> 
            {user?.requestState === "success" && (
                <AccountDetail userData={userData} />
            )}
            {user?.requestState === "success" && (
                <Calendar userData={user.globalData} />
            )}
            {user?.requestState === "success" && (
                <UserRespositories userData={userData} />
            )}
        </>
    );
}
