"use client"
import Axios from "@/utils/axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState<any[]>([])
  useEffect(() => {
    async function getUsers() {
      try {
        const user = await Axios.get(`/user/all`)
        setUsers(user.data.users)
      }
      catch (err: any) {
        console.log(err);
      }
    }
    getUsers()

  }, [])
  return (
    <>
      <p className="text-center text-3xl capitalize text-blue-900">hello inideg</p>
      <div className="text-center">
        {
          users?.map((user) => {
            return (
              <div key={user._id}>
                <h1>{user.name}</h1>
                <p>{user.age}</p>
                <p>{user._id}</p>
                <p>{user.email}</p>
              </div>
            )
          })
        }
      </div>
    </>
  );
}
