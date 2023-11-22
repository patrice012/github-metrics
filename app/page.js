"use client";

import { useContext } from "react";
import { HomeInterface } from "./Home/HomePage";
import { UserContext } from "@/context/userContext";
import { CommitsMetrics } from "./user/CommitsMetrics";
import { UserRespositories } from "./user/UserRepository";
import { AccountDetail } from "./user/AccountDetail";

export default function Home() {
  const { user } = useContext(UserContext);
  return (
    <>
      <HomeInterface>
        <AccountDetail />
        <UserRespositories userData={user} />
        <CommitsMetrics userData={user} />
      </HomeInterface>
    </>
  );
}
