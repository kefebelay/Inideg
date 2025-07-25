import axios from "axios";

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URLP || "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default Axios;
