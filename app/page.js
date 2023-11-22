'use client'

import { useContext } from "react"
import { HomeInterface } from "./Home/HomePage"
import { UserContext } from "@/context/userContext"
import { CommitsMetrics } from "./user/CommitsMetrics"


export default function Home() {
  const { user } = useContext(UserContext)
  return (
    <>
      <HomeInterface>
        {user &&
          <CommitsMetrics userData={user} />
        }
      </HomeInterface>
    </>
  )
}
