import Booking from "../../components/booking"
import Header from "../../components/navbar"
import { useAuth } from "../../context/useAuth";
import { useRouter } from "next/router"
import { useEffect } from "react";
export default function BookingPage () {
   const router =  useRouter();
   const { authenticated } = useAuth();
   useEffect(()=>{
       if(authenticated === false ){
           router.push("/")
       }
   },[authenticated]);
   useEffect(()=>{
            console.log(authenticated)
   },[authenticated])
     return(
        <>
        <Header search={true}/>
        <Booking/>
        </>
     )
}