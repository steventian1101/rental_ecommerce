import Header from "../components/navbar"
import EditItem from "../components/owner/editItem"
import { useRouter } from "next/router"
import { useAuth } from "../context/useAuth";
import { useEffect } from "react";
export default function EditPage () {
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
        <EditItem query={router.query}/>
        </>
     )
}