import Header from "../components/navbar"
import CreateItem from "../components/owner/createItem"
import { useAuth } from "../context/useAuth"
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function CreatePage () {
   const { authenticated } = useAuth();
   const router = useRouter();
   useEffect(()=>{
    if(authenticated === false ){
        router.push("/")
    }
},[authenticated]);
     return(
        <>
        <Header search={true}/>
        <CreateItem/>
        </>
     )
}