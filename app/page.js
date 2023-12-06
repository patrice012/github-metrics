"use client";

import { useContext, useState } from "react";
// import { HomeInterface } from "./Home/HomePage";
import { UserContext } from "@/context/userContext";
import { UserRespositories } from "@/components/user/UserRepository";
import { AccountDetail } from "@/components/user/AccountDetail";
import { Calendar } from "@/components/user/calendar";
import { InputComponent } from "./Home/InputComponent";

export default function Home() {
    const { user } = useContext(UserContext);
    const [isSuccess, setIsSuccess] = useState(false)
    const userData = user?.globalData;

    return (
        <>
            {!isSuccess && <InputComponent setIsSuccess={setIsSuccess} />}
            {isSuccess && <AccountDetail userData={userData} />}
            {isSuccess && <Calendar userData={user.globalData} />}
            {isSuccess && <UserRespositories userData={userData} />}
        </>
    );
}
