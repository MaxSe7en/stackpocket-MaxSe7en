import { user_url } from './../utils/Endpoints';
import { balance_url } from "@/utils/Endpoints";
import axios from "axios";

export const getBalance = async (setBallance: (arg0: any) => void) => {
    const tkn = localStorage.getItem("userToken");

    const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tkn,
    };

    const response = await axios.get(`${balance_url}`, { headers });

    const data = await response.data;
    setBallance(data.data);

    console.log("balancexx ::", data.data);
};

export const getAllUserDetails = async (userToken: string, setUserData: (arg0: any) => void) => {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + userToken
    }
    const response = await axios.get(`${user_url}`, { headers })

    const data = await response.data
    setUserData(data.data)
    // console.log('vvvvvvvvv|| ::',data.data)
}

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    // setTimeout(()=>{
    // navigation.push('/')
    window.location.replace('/')
    // },1000)
}

export const checkTockenExpiry = async (userToken: string) => {
    const tkn = localStorage.getItem('userToken')

    let headersList = {
        "Authorization": "Bearer " + userToken
    }
    let response = await fetch(user_url, {
        method: "GET",
        headers: headersList
    });
    let data = await response.json();
    if (data.message === 'Token expired') {
        localStorage.setItem('tokenExpireMessage', 'true')
        setTimeout(() => {
            logout()
        }, 1000)
    }
    console.log('Token cheking ...', data);
}