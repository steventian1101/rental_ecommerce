import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect} from "react"
import { auth } from "../../lib/initFirebase"
import { sendPasswordResetEmail } from "firebase/auth"
import AuthInput from "./authInput"
const ResetPassword = ({ setSideBar, sidebar}) =>{
    const [emailvalidation, setEmailvalidation] = useState(true);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState(null);
    const handlepaswordreset = () =>{
        setLoading(true)
        sendPasswordResetEmail(auth,email).then(
            (result)=>{
                setWarning("Password reset email sent");
                setLoading(false)
            }
        ).catch((error) =>{
            setWarning(error.message)
            setLoading(false)
        });

    }
    const emailValidation = (any) => {
        if ((any.indexOf("@") > -1) && (any.indexOf(".") > -1)) {
            setEmail(any)
            setEmailvalidation(true);
        }
        else {
            setEmailvalidation(false)
        }
    }
 return(
    <section className="passwordReset">
            <div style={{ height: "50px", marginBottom:"10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white"  onClick={ () =>setSideBar(0)}/></div>
            <p className="loginText">FORGOT PASSWORD.</p>
            <div className="passwordResetTextBack"></div>
            <p className="loginDetail">Don't worry, we'll send a password resetlink to the email address that was with us.</p>
            {
                warning  ?<div style={{ marginTop:"0px", marginBottom:"10px", width:"100%", height:"45px", background:"#572bb0", borderRadius:"8px", padding:"10px"}} className="flex flex-row items-center justify-between">
                <p className="text-white" style={{ fontSize:"12px"}}>{warning}</p>
                <p className="text-white cursor-pointer" style={{ fontSize:"20px"}} onClick={()=>{setWarning(null)}}>&times;</p>
            </div>:<></>
            }
            <AuthInput title={"Email Address"} status={emailvalidation} placeholder={"E.g.johndoe@gmail.com"} change={emailValidation} type={"text"} value={""}/>
            <div className="passwordResetButton">
                {
                    loading?<button className="flex items-center justify-center cursor-wait" style={{background:"#572bb0"}}>COMPLETE</button>:<button className="flex items-center justify-center" style={{background:"#572bb0"}} onClick={()=>{ handlepaswordreset()}}>COMPLETE</button>
                }
            </div>
        </section> 
 )
}
export default ResetPassword