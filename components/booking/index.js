import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import CreateBooking from "./createBooking"
const Booking = () =>{
    const [inbounded, setInbounded] = useState(true)
    return(
        <>
        <CreateBooking/>
        <section className="booking">
            <div className="flex flex-row items-center justify-between" style={{ marginBottom:"30px"}}>
                <div className="flex flex-col mb-2.5">
                    <p className="loginText settingTitle">YOUR BOOKINGS</p>
                    <p className="loginDetail" style={{marginBottom:"0px"}}>Keep smashing at it.</p>
                </div>
                <button className="flex flex-row bookingbutton" >
                    <FontAwesomeIcon icon={faPlus} className="text-lg text-white mr-2.5 icon"/>
                    <p className="text-white font-15">Create Booking</p>
                </button>
            </div>
            <div className="flex flex-row bookingtab">
                <p className="text-white font-15" style={{ borderBottom:inbounded? "solid 1px white":"solid 1px transparent", color:inbounded?"white":"#ffffff4d"}} onClick={()=>{setInbounded(true)}}>Inbounded Bookings</p>
                <p className="text-white font-15" style={{ borderBottom:inbounded? "solid 1px transparent":"solid 1px white", color:inbounded?"#ffffff4d":"white"}} onClick={()=>{setInbounded(false)}}>Your Bookings</p>
            </div> 
        </section>
        </>
    )
     
}
export default Booking