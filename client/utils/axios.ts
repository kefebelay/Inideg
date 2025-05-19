import axios from 'axios'

const Axios = axios.create({
    baseURL: process.env.NODE_ENV || 'http://localhost:5000/api',
    withCredentials:true,
    headers:{
        'Content-Type': 'application/json'
    }
})

export default Axios