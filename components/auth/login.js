import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { auth } from "../../lib/initFirebase"
import { GoogleAuthProvider } from "firebase/auth";
import AuthInput from "./authInput";
import { db } from "../../lib/initFirebase";
import { collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
const Login = ({ setSideBar }) => {
    const listCollectionRef = collection(db, "users")
    const provider = new GoogleAuthProvider();
    const { signIn, googleAuth, userCredential } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailvalidation, setEmailvalidation] = useState(true);
    const [passwordvalidation, setPasswordvalidation] = useState(true);
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
        if (any.length > 8) {
            setPassword(any)
            setPasswordvalidation(true);
        }
        else {
            console.log("incorrect")
            setPasswordvalidation(false)
        }
    }
    const handleLogin = async () => {
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
                setEmailvalidation(false)
                
            }
        }
    }
    const handleGoogle = () => {
        googleAuth(auth, provider);
    }
    return (
        <section className="login">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
            <p className="loginText">LOGIN.</p>
            <div className="loginTextBack"></div>
            <p className="loginDetail">Login to Sydney's largest rental platform</p>
            <button className="flex flex-row items-center justify-center w-full text-white rounded-lg" style={{ fontSize: "15px", fontFamily: "poppins-light", border: "solid 1px #ffffff4d", height: "45px" }} onClick={() => { handleGoogle() }}><img src="https://uploads-ssl.webflow.com/5efdc8a4340de947404995b4/638da718ba38ef5f02dcb35a_google.svg" style={{ marginRight: "10px" }} />Login With Google</button>
            <div className="flex flex-row items-center justify-between my-5 mb-5">
                <div style={{ width: "100px", height: "1px", background: "#ffffff4d" }}></div>
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", color: "white" }}>OR</p>
                <div style={{ width: "100px", height: "1px", background: "#ffffff4d" }}></div>
            </div>
            <AuthInput title={"Email Address"} status={emailvalidation} placeholder={"E.g.johndoe@gmail.com"} change={emailValidation} type={"text"} />
            <AuthInput title={"Password"} status={passwordvalidation} placeholder={"Min 8 Characters"} change={passwordValidation} type={"password"} />
            <div className="loginButton">
                <button className="flex items-center justify-center" onClick={() => { handleLogin() }}>LOGIN</button>
            </div>
            <div><p className="text-white cursor-pointer hover:underline" onClick={() => { setSideBar(2) }} style={{ fontFamily: "poppins-light", marginBottom: "3px", fontSize: "15px" }} >Don't have an account? Sign up here.</p></div>
            <div>
                <p className="text-white cursor-pointer hover:underline" onClick={() => { setSideBar(3) }} style={{ fontFamily: "poppins-light", fontSize: "15px" }}>Forgot your password? Reset it here.</p></div>
        </section>

    )
}
export default Login