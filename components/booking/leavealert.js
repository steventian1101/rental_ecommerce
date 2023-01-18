import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../../context/useAuth"
import { useState, useEffect } from "react"
import Review from "./review"
const LeaveAlert = ({booking, setReviewborder, ownerdata, customerdata}) =>{
    const { userCredential} =useAuth();
    const [desc, setDesc] = useState(null);
    useEffect(()=>{
        if(userCredential.email == booking.owner_email){
            setDesc(<p className="text-center text-white font-15 mb-2.5">You'll be able to see the review your customer left you once they've reviewed you.</p>)
        }
        if(userCredential.email == booking.customer_email){
            setDesc(<p className="text-center text-white font-15 mb-2.5">You'll be able to see the review your owner left you once they've reviewed you.</p>)
        }
    },[]);
    const handlesweet = () =>{
        window.location.reload();
    }

    return(
        <div className="flex flex-col items-center justify-center">
            <FontAwesomeIcon icon ={ faCircleCheck} style={{ fontSize:"70px"}} className="mb-5 complete"/>
            <p className="text-white font-18 bold mb-2.5">THANK YOU!</p>
            {
               desc
            }
            <button className="flex items-center justify-center w-full rounded-lg" style={{ height:"45px", background:"#802df5"}} onClick={()=>{handlesweet()}}><p className="text-white font-15 bold">SWEET!</p></button>
            <div className="line"></div>   
        </div>
    )

}
export default LeaveAlert