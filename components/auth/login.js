import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { auth } from "../../lib/initFirebase"
import AuthInput from "./authInput";
import { db } from "../../lib/initFirebase";
import { collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import Loading from "./loading";
import { GoogleAuthProvider } from "firebase/auth";
const Login = ({ setSideBar }) => {
    const listCollectionRef = collection(db, "users")
    const provider = new GoogleAuthProvider();
    const { signIn, googleAuth, userCredential, error, errorRemove} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailvalidation, setEmailvalidation] = useState(true);
    const [passwordvalidation, setPasswordvalidation] = useState(true);
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState(null);
    const [drawwarning, setDrawwarning] = useState(false);
    const emailValidation = (any) => {
        if ((any.indexOf("@") > -1) && (any.indexOf(".") > -1)) {
            setEmail(any)
            setEmailvalidation(true);
        }
        else {
            console.log("incorrect")
            setEmailvalidation(false)
        }
    }
    const passwordValidation = (any) => {
        if (any.length > 7) {
            setPassword(any)
            setPasswordvalidation(true);
        }
        else {
            console.log("incorrect")
            setPasswordvalidation(false)
        }
    }
    const handleLogin = async () => {
        setLoading(true)
        if (emailvalidation && passwordvalidation) {
            let temp = [];
            let q = query(listCollectionRef, where("user_email", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                temp.push(doc.data());
            });
            console.log(temp)
            if(temp.length != 0){
                signIn(auth, email, password)
                
            }
            else{
                console.log("okay")
                setEmailvalidation(false);
                setLoading(false)  
            }
        }
        else{
            setEmailvalidation(false)
            setLoading(false)
        }
    }
    const handleGoogle = () => {
        googleAuth(auth, provider);
    }
    useEffect(() => {
      setWarning(error);
      setLoading(false)
    }, [error])
    useEffect(()=>{
        if(warning == null){
            errorRemove(null);
        }
    },[warning])
    return (
        <section className="login">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
            <p className="loginText">LOGIN.</p>
            <div className="loginTextBack"></div>
            <p className="loginDetail">Login to Sydney's largest rental platform</p>
            {
                warning  ?<div style={{ marginTop:"0px", marginBottom:"10px", width:"100%", height:"45px", background:"#791500", borderRadius:"8px", padding:"10px"}} className="flex flex-row items-center justify-between">
                <p className="text-white" style={{ fontSize:"12px"}}>{warning}</p>
                <p className="text-white cursor-pointer" style={{ fontSize:"20px"}} onClick={()=>{setWarning(null)}}>&times;</p>
            </div>:<></>
            }
            <button className="flex flex-row items-center justify-center w-full text-white rounded-lg" style={{ fontSize: "15px", fontFamily: "poppins-light", border: "solid 1px #ffffff4d", height: "45px" }} onClick={() => { handleGoogle() }}><img src="https://uploads-ssl.webflow.com/5efdc8a4340de947404995b4/638da718ba38ef5f02dcb35a_google.svg" style={{ marginRight: "10px" }} />Login With Google</button>
            <div className="flex flex-row items-center justify-between my-5 mb-5">
                <div style={{ width: "100px", height: "1px", background: "#ffffff4d" }}></div>
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", color: "white" }}>OR</p>
                <div style={{ width: "100px", height: "1px", background: "#ffffff4d" }}></div>
            </div>
            <AuthInput title={"Email Address"} status={emailvalidation} placeholder={"E.g.johndoe@gmail.com"} change={emailValidation} type={"text"} />
            <AuthInput title={"Password"} status={passwordvalidation} placeholder={"Min 8 Characters"} change={passwordValidation} type={"password"} />
            <div className=" loginButton">
                {
                    loading?<button className="flex items-center justify-center cursor-wait">LOGIN</button>:<button className="flex items-center justify-center" onClick={() => { handleLogin() }}>LOGIN</button>
                }
            </div>
            <div><p className="text-white cursor-pointer hover:underline" onClick={() => { setSideBar(2) }} style={{ fontFamily: "poppins-light", marginBottom: "3px", fontSize: "15px" }} >Don't have an account? Sign up here.</p></div>
            <div>
                <p className="text-white cursor-pointer hover:underline" onClick={() => { setSideBar(3) }} style={{ fontFamily: "poppins-light", fontSize: "15px" }}>Forgot your password? Reset it here.</p></div>
        </section>

    )
}
export default Login