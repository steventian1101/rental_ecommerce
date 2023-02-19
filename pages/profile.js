import Header from "../components/navbar"
import Owner from "../components/owner/owner"
import { useRouter } from "next/router"
import { useEffect } from "react";
import { useAuth } from "../context/useAuth";

export default function ProfilePage () {
    const router =  useRouter();
    const { authenticated } = useAuth();
    useEffect(()=>{
        if(authenticated === false ){
            router.push("/")
        }
    },[authenticated]);
    return(
        <>
        <Header search={true}/>
         <Owner/>
        </>
    )
}