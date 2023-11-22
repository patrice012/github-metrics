"use client";

import { useContext } from "react";
import { HomeInterface } from "./Home/HomePage";
import { UserContext } from "@/context/userContext";
import { CommitsMetrics } from "./user/CommitsMetrics";
import { UserRespositories } from "./user/UserRepository";

export default function Home() {
    const { user } = useContext(UserContext);
    return (
        <>
            <HomeInterface>
                {/* {user && <UserRespositories userData={user} />}
                {user && <CommitsMetrics userData={user} />} */}
          <UserRespositories userData={user} />
          {/* <CommitsMetrics userData={user} /> */}
            </HomeInterface>
        </>
    );
}
