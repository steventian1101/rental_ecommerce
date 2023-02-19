import Header from "../../components/navbar"
import Setting from "../../components/setting/setting"
import { useAuth } from "../../context/useAuth";
import { useRouter } from "next/router"
import { useEffect } from "react";
export default function SettingsPage() {
  const router =  useRouter();
   const { authenticated } = useAuth();
   useEffect(()=>{
    if(authenticated === false ){
        router.push("/")
    }
},[authenticated]);
    return (
      <>
      <Header search={true}/>
      <Setting/>
      </> 
  )
}