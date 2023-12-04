"use client";

import { useContext } from "react";
import { HomeInterface } from "./Home/HomePage";
import { UserContext } from "@/context/userContext";
import { UserRespositories } from "./user/UserRepository";
import { AccountDetail } from "./user/AccountDetail";
// import { RepositoriesProvider } from "@/context/repositoriesContext";
export default function Home() {
    const { user } = useContext(UserContext);
    const userData = user?.globalData;

    

    return (
        <>
            <HomeInterface>
                {user && <AccountDetail userData={userData} />}
                {/* <RepositoriesProvider> */}
                {user && <UserRespositories userData={userData} />}
                {/* </RepositoriesProvider> */}
                
            </HomeInterface>
        </>
    );
}
