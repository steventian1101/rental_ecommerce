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
import Link from "next/link";
const Login = () => {
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
        if ((any.indexOf("@") > -1) && (any.indexOf(".") > -1) || any == '') {
            setEmail(any)
            setEmailvalidation(true);
        }
        else {
            setEmailvalidation(false)
        }
    }
    const passwordValidation = (any) => {
        if (any.length > 7 || any == "") {
            setPassword(any)
            setPasswordvalidation(true);
        }
        else {
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
            if(temp.length != 0){
                signIn(auth, email, password)
                
            }
            else{
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
            <Link href="/"><div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" /></div></Link>
            <p className="loginText">LOGIN.</p>
            <div className="loginTextBack"></div>
            <p className="loginDetail">Login to Sydney's largest rental platform</p>
            {
                warning  ?<div className="flex flex-row items-center justify-between my-0 mb-2.5 w-full height-45 background-alert rounded-lg p-2.5">
                <p className="text-white" style={{ fontSize:"12px"}}>{warning}</p>
                <p className="text-white cursor-pointer font-20" onClick={()=>{setWarning(null)}}>&times;</p>
            </div>:<></>
            }
            <button className="flex flex-row items-center justify-center w-full text-white rounded-lg font-15 bottomborder height-45" onClick={() => { handleGoogle() }}><img src="https://uploads-ssl.webflow.com/5efdc8a4340de947404995b4/638da718ba38ef5f02dcb35a_google.svg" className="mr-2.5"/>Login With Google</button>
            <div className="flex flex-row items-center justify-between my-5 mb-5">
                <div className="width-100 bottomborder"></div>
                <p className="font-15">OR</p>
                <div className="width-100 bottomborder"></div>
            </div>
            <AuthInput title={"Email Address"} status={emailvalidation} placeholder={"E.g.johndoe@gmail.com"} change={emailValidation} type={"text"} value={""}/>
            <AuthInput title={"Password"} status={passwordvalidation} placeholder={"Min 8 Characters"} change={passwordValidation} type={"password"} value={""}/>
            <div className=" loginButton">
                {
                    loading?<button className="flex items-center justify-center cursor-wait">LOGIN</button>:<button className="flex items-center justify-center" onClick={() => { handleLogin() }}>LOGIN</button>
                }
            </div>
           <Link href='/register'> <div><p className="text-white cursor-pointer hover:underline font-15 margin-bottom-3"  >Don't have an account? Sign up here.</p></div></Link>
            <Link href='/resetPassword'><div>
                <p className="text-white cursor-pointer hover:underline font-15">Forgot your password? Reset it here.</p></div></Link>
        </section>

    )
}
export default Login