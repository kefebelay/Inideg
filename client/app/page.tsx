"use client"
import Axios from "@/utils/axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState<any[]>([])
  useEffect(() => {
    async function getUsers() {
      const user = await Axios.get('http://localhost:5000/api/user/all')
      setUsers(user.data.users)
      console.log(user)
    }
    getUsers()
  }, [])
  return (
    <>
      <p>hello inideg</p>
      <div className="">
        {
          users?.map((user) => {
            return (
              <div key={user._id}>
                <h1>{user.name}</h1>
                <p>{user.age}</p>
                <p>{user.email}</p>
              </div>
            )
          })
        }
      </div>
    </>
  );
}
