'use client'

import { useContext } from "react"
import { HomeInterface } from "./Home/HomePage"
import { UserContext } from "@/context/userContext"


export default function Home() {
  const { user } = useContext(UserContext)
  return (
    <>
      <HomeInterface>
        <h1>hello</h1>
      </HomeInterface>
    </>
  )
}
