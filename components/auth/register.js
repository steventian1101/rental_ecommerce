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
const Register = ({ sideBar, setSideBar }) => {
    const { createUser } = useAuth();
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
    const listCollectionRef = collection(db, "users")
    useEffect(() => {
        console.log(email)
    }, [email])
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
    const firstnameValidation = (any) => {
        let str = /([A-Z]{1})\)?([a-z]{1,})$/;
        if (str.test(any)) {
            setFirstname(any)
            setFirstnamevalidation(true);
        }
        else {
            console.log("incorrect")
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
            console.log("incorrect")
            setLastnamevalidation(false)
        }
    }
    const nicknameValidation = (any) => {
        if (any.indexOf("Rental") != -1) {
            setNickname(any)
            setNicknamevalidation(true);
        }
        else {
            console.log("incorrect")
            setNicknamevalidation(false)
        }
    }
    const phoneValidation = (any) => {
        let str = /^\+?([61]{2})\)?[ ]?([0-9]{3})[ ]?([0-9]{3})[ ]?([0-9]{4})$/;
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
        console.log(emailvalidation, passwordvalidation);
        if (emailvalidation && passwordvalidation) {
            let temp = [];
            let q = query(listCollectionRef, where("user_email", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                temp.push(doc.data());
            });
            if(temp.length != 0){
                setEmailvalidation(false)
                return ;
            }
            else{
                setComplete(true)
            }
        }
        if (!emailvalidation || !passwordvalidation) {
            setComplete(false);
        }
    }
    const handlefile = (e) => {
        var src = URL.createObjectURL(e.target.files[0]);
        setPreviewImage(src)
        setFile(e.target.files[0]);
    }
    const handleRegister = () => {
        if (file && emailvalidation && passwordvalidation && firstnamevalidation && lastnamevalidation && nicknameValidation && phonevalidation && addressvalidation) {
            console.log(file)
            const storageRef = ref(storage, `images/${email + ".jpg"}`);
            const metadata = {
                contentType: 'image/jpeg'
            };
            setLoading(true);
            uploadBytes(storageRef, file).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                getDownloadURL(storageRef).then((downloadUrl) => {
                    setImgurl(downloadUrl);
                    setFile(null);
                    setPreviewImage('');
                    console.log(downloadUrl);
                });
            })
        }

    }
    useEffect(() => {
        console.log(imgurl);
       if(imgurl != "" && emailvalidation && passwordvalidation && firstnamevalidation && lastnamevalidation && nicknameValidation && phonevalidation && addressvalidation){
       addDoc(listCollectionRef, { user_email: email, user_password: password, first_name: firstname, profile_img:imgurl, last_name:lastname, nick_name:nickname, user_phone:phone, user_address:address }).then(response => {
         createUser(auth, email, password);
         setLoading(false);
       }).catch(error => {
            console.log(error.message)
          });
       }
    }, [imgurl])
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
                <div style={{ marginTop: "30px", marginBottom: "30px", width: "100%", height: "1px", background: "#ffffff4a" }}></div>
                <AuthInput title={"First Name"} status={firstnamevalidation} placeholder={"E.g.John"} change={firstnameValidation} type={"text"} />
                <AuthInput title={"Last Name"} status={lastnamevalidation} placeholder={"E.g.Doe"} change={lastnameValidation} type={"text"} />
                <AuthInput title={"SDrop Nickname"} status={nicknamevalidation} placeholder={"E.g.John Doe Rentals"} change={nicknameValidation} type={"text"} />
                <AuthInput title={"Phone Number"} status={phonevalidation} placeholder={"E.g.+61 488 789"} change={phoneValidation} type={"text"} />
                <AuthInput title={"Address"} status={addressvalidation} placeholder={"E.g.20 Echidna Ave, 2035, Australia"} change={addressValidation} type={"text"} />
                <div className="registerButton">
                    <button className="flex items-center justify-center" onClick={() => { handleRegister() }}>COMPLETE</button>
                </div>
            </section> : <section className="register">
                <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
                <p className="loginText">SIGN UP.</p>
                <div className="registerTextBack"></div>
                <p className="loginDetail">Login to Sydney's largest rental platform</p>
                <button className="flex flex-row items-center justify-center w-full text-white rounded-lg" style={{ fontSize: "15px", fontFamily: "poppins-light", border: "solid 1px #ffffff4d", height: "45px" }} ><img src="https://uploads-ssl.webflow.com/5efdc8a4340de947404995b4/638da718ba38ef5f02dcb35a_google.svg" style={{ marginRight: "10px" }} />Sign Up With Google</button>
                <div className="flex flex-row items-center justify-between my-5 mb-5">
                    <div style={{ width: "100px", height: "1px", background: "#ffffff4d" }}></div>
                    <p style={{ fontSize: "15px", fontFamily: "poppins-light", color: "white" }}>OR</p>
                    <div style={{ width: "100px", height: "1px", background: "#ffffff4d" }}></div>
                </div>
                <AuthInput title={"Email Address"} status={emailvalidation} placeholder={"E.g.johndoe@gmail.com"} change={emailValidation} type={"text"} />
                <AuthInput title={"Password"} status={passwordvalidation} placeholder={"Min 8 Characters"} change={passwordValidation} type={"password"} />
                {/* <div className="flex flex-col loginForm">
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px" }} className="text-white">Email Address</p>
                <input type="email" className="w-full emailInput focus:bg-transparent" placeholder="E.g.johndoe@gmail.com" onChange={(e)=>setEmail(e.target.value)}/>
            </div> */}
                <div className="registerButton">
                    <button className="flex items-center justify-center" onClick={() => handleComplete()}>COMPLETE</button>
                </div>
                <div><p className="text-white cursor-pointer hover:underline" onClick={() => setSideBar(1)} style={{ fontFamily: "poppins-light", marginBottom: "3px", fontSize: "15px" }} >Remembered your account? Login here.</p></div>
            </section>}
        </>
    )
}
export default Register