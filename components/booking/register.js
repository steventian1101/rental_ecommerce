import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import AuthInput from "./authInput";
import { storage } from "../../lib/initFirebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Loading from "./loading";
import { db } from "../../lib/initFirebase";
import { collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/useAuth";
import { auth } from "../../lib/initFirebase";
import { GoogleAuthProvider } from "firebase/auth";
const Register = ({ sideBar, setSideBar }) => {
    const provider =  new GoogleAuthProvider();
    const { createUser, googleAuth } = useAuth();
    const [complete, setComplete] = useState(false);
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [imgurl, setImgurl] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailvalidation, setEmailvalidation] = useState(true);
    const [passwordvalidation, setPasswordvalidation] = useState(true);
    const [firstnamevalidation, setFirstnamevalidation] = useState(true);
    const [lastnamevalidation, setLastnamevalidation] = useState(true);
    const [nicknamevalidation, setNicknamevalidation] = useState(true);
    const [phonevalidation, setPhonevalidation] = useState(true);
    const [addressvalidation, setAddressvalidation] = useState(true);
    const [previewImage, setPreviewImage] = useState('');
    const [completeLoading, setCompleteLoading] = useState(false);
    const listCollectionRef = collection(db, "users")
    const emailValidation = (any) => {
        if ((any.indexOf("@") > -1) && (any.indexOf(".") > -1)) {
            setEmail(any)
            setEmailvalidation(true);
        }
        else {
            setEmailvalidation(false)
        }
    }
    const passwordValidation = (any) => {
        if (any.length > 7) {
            setPassword(any)
            setPasswordvalidation(true);
        }
        else {
            setPasswordvalidation(false)
        }
    }
    const firstnameValidation = (any) => {
        let str = /([A-Z]{1})\)?([a-z]{1,})$/;
        if (str.test(any)) {
            setFirstname(any)
            setFirstnamevalidation(true);
        }
        else {
            setFirstnamevalidation(false)
        }
    }
    const lastnameValidation = (any) => {
        let str = /([A-Z]{1})\)?([a-z]{1,})$/;
        if (str.test(any)) {
            setLastname(any)
            setLastnamevalidation(true);
        }
        else {
            setLastnamevalidation(false)
        }
    }
    const nicknameValidation = (any) => {
        if (any.length> 2) {
            setNickname(any)
            setNicknamevalidation(true);
        }
        else {
            setNicknamevalidation(false)
        }
    }
    const phoneValidation = (any) => {
        let str = /^\+?([61]{2})\)?[ ]?([0-9]{3})[ ]?([0-9]{3})[ ]?([0-9]{3})$/;
        if (str.test(any)) {
            setPhone(any)
            setPhonevalidation(true);
        } else {
            setPhonevalidation(false);
        }

    }
    const addressValidation = (any) => {
        let str = /([0-9A-Za-z])[,]?([0-9])[,]?[| ]?\bAustralia\b$/;
        if (str.test(any)) {
            setAddress(any)
            setAddressvalidation(true);
        } else {
            setAddressvalidation(false);
        }
    }
    const handleComplete = async () => {
        setCompleteLoading(true)
        if (emailvalidation && passwordvalidation) {
            let temp = [];
            let q = query(listCollectionRef, where("user_email", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                temp.push(doc.data());
            });
            if(temp.length != 0){
                setEmailvalidation(false)
                setCompleteLoading(false)
                return ;
            }
            else{
                setComplete(true)
                setCompleteLoading(false)
            }
        }
        else{
            setCompleteLoading(false)
        }
        if (!emailvalidation || !passwordvalidation) {
            setComplete(false);
            setCompleteLoading(false)
        }
    }
    const handlefile = (e) => {
        var src = URL.createObjectURL(e.target.files[0]);
        setPreviewImage(src)
        setFile(e.target.files[0]);
    }
    const handleRegister = () => {
        if (file && emailvalidation && passwordvalidation && firstnamevalidation && lastnamevalidation && nicknameValidation && phonevalidation && addressvalidation) {
            const storageRef = ref(storage, `images/${email + ".jpg"}`);
            const metadata = {
                contentType: 'image/jpeg'
            };
            setLoading(true);
            uploadBytes(storageRef, file).then((snapshot) => {
                getDownloadURL(storageRef).then((downloadUrl) => {
                    setImgurl(downloadUrl);
                    setPreviewImage('');
                });
            });
        }
        else{
        }

    }
    useEffect(() => {
       if(imgurl != "" && emailvalidation && passwordvalidation && firstnamevalidation && lastnamevalidation && nicknameValidation && phonevalidation && addressvalidation){
       addDoc(listCollectionRef, { user_email: email, first_name: firstname, profile_img:imgurl, last_name:lastname, nick_name:nickname, user_phone:phone, user_address:address }).then(response => {
         createUser(auth, email, password);
         setFile(null);
       }).catch(error => {
            console.log(error.message)
          });
       }
    }, [imgurl])
    const handleGoogle = () =>{
        googleAuth(auth, provider)
    }
    return (
        <>{
            loading?<Loading/>:<></>
        }
            {complete ? <section className="overflow-auto addProfileInfo">
                <p className="loginText" style={{ marginTop: "60px" }}>Add Your Profile Info.</p>
                <p className="loginDetail">Explore Sydney's largest rental platform</p>
                <div className="flex flex-col items-center justify-center w-full" style={{ height: "180px", border: "1px solid #ffffff4a", borderRadius: "8px" }}>
                    <div className="relative flex flex-col items-center justify-center">
                        <FontAwesomeIcon icon={faPlus} style={{ fontSize: "30px", color: "white" }} />
                        <p className="text-white">Add Profile Photo</p>
                        <input type="file" className="absolute flex w-full opacity-0 left-4" onChange={(e) => handlefile(e)}></input>
                    </div>
                </div>
                {
                    previewImage ? <div className="relative">
                        <img src={previewImage} style={{ width: "100%", height: "180px", borderRadius: "8px", marginTop: "30px", objectFit: "cover" }} />
                    </div> : <></>
                }
                <div style={{ marginTop: "30px", marginBottom: "30px", width: "100%", height: "1px", background: "#ffffff4a" }} value={""}></div>
                <AuthInput title={"First Name"} status={firstnamevalidation} placeholder={"E.g.John"} change={firstnameValidation} type={"text"} value={""}/>
                <AuthInput title={"Last Name"} status={lastnamevalidation} placeholder={"E.g.Doe"} change={lastnameValidation} type={"text"} value={""}/>
                <AuthInput title={"SDrop Nickname"} status={nicknamevalidation} placeholder={"E.g.John Doe Rentals"} change={nicknameValidation} type={"text"} value={""}/>
                <AuthInput title={"Phone Number"} status={phonevalidation} placeholder={"E.g.+61 488 789"} change={phoneValidation} type={"text"} value={""}/>
                <AuthInput title={"Address"} status={addressvalidation} placeholder={"E.g.20 Echidna Ave, 2035, Australia"} change={addressValidation} type={"text"} value={""}/>
                <div className="registerButton">
                    <button className="flex items-center justify-center" onClick={() => { handleRegister() }}>COMPLETE</button>
                </div>
            </section> : <section className="register">
                <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
                <p className="loginText">SIGN UP.</p>
                <div className="registerTextBack"></div>
                <p className="loginDetail">Login to Sydney's largest rental platform</p>
                <button className="flex flex-row items-center justify-center w-full text-white rounded-lg" style={{ fontSize: "15px", fontFamily: "poppins-light", border: "solid 1px #ffffff4d", height: "45px" }} onClick={()=>{ handleGoogle()}} ><img src="https://uploads-ssl.webflow.com/5efdc8a4340de947404995b4/638da718ba38ef5f02dcb35a_google.svg" style={{ marginRight: "10px" }}  />Sign Up With Google</button>
                <div className="flex flex-row items-center justify-between my-5 mb-5">
                    <div style={{ width: "100px", height: "1px", background: "#ffffff4d" }}></div>
                    <p style={{ fontSize: "15px", fontFamily: "poppins-light", color: "white" }}>OR</p>
                    <div style={{ width: "100px", height: "1px", background: "#ffffff4d" }}></div>
                </div>
                <AuthInput title={"Email Address"} status={emailvalidation} placeholder={"E.g.johndoe@gmail.com"} change={emailValidation} type={"text"} value={""}/>
                <AuthInput title={"Password"} status={passwordvalidation} placeholder={"Min 8 Characters"} change={passwordValidation} type={"password"} value={""}/>
                {/* <div className="flex flex-col loginForm">
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px" }} className="text-white">Email Address</p>
                <input type="email" className="w-full emailInput focus:bg-transparent" placeholder="E.g.johndoe@gmail.com" onChange={(e)=>setEmail(e.target.value)}/>
            </div> */}
                <div className="registerButton">
                  {
                    completeLoading?  <button className="flex items-center justify-center cursor-wait">COMPLETE</button>:  <button className="flex items-center justify-center" onClick={() => handleComplete()}>COMPLETE</button>
                  }
                </div>
                <div><p className="text-white cursor-pointer hover:underline" onClick={() => setSideBar(1)} style={{ fontFamily: "poppins-light", marginBottom: "3px", fontSize: "15px" }} >Remembered your account? Login here.</p></div>
            </section>}
        </>
    )
}
export default Register