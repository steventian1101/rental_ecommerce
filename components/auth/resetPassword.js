import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
const ResetPassword = ({ setSideBar, sidebar}) =>{
 return(
    <section className="passwordReset">
            <div style={{ height: "50px", marginBottom:"10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white"  onClick={ () =>setSideBar(0)}/></div>
            <p className="loginText">FORGOT PASSWORD.</p>
            <div className="passwordResetTextBack"></div>
            <p className="loginDetail">Don't worry, we'll send a password resetlink to the email address that was with us.</p>
            <div className="flex flex-col loginForm">
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px" }} className="text-white">Email Address</p>
                <input type="email" className="w-full emailInput focus:bg-transparent" placeholder="E.g.johndoe@gmail.com"/>
            </div>
            <div className="passwordResetButton">
                <button className="flex items-center justify-center" style={{background:"#572bb0"}}>COMPLETE</button>
            </div>
        </section> 
 )
}
export default ResetPassword