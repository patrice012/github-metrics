"use client";

import { useContext } from "react";
import { HomeInterface } from "./Home/HomePage";
import { UserContext } from "@/context/userContext";
import { UserRespositories } from "@/components/user/UserRepository";
import { AccountDetail } from "@/components/user/AccountDetail";
import { Calendar } from "@/components/user/calendar";
import { MetricsChart } from "@/components/user/metrics";

export default function Home() {
    const { user } = useContext(UserContext);
    const userData = user?.globalData;

    return (
        <>
            <HomeInterface>
                {user && <AccountDetail userData={userData} />}
                {user && <Calendar userData={user.globalData} />}
                {user && <UserRespositories userData={userData} />}
            </HomeInterface>
        </>
    );
}
