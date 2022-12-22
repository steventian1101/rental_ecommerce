import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import AuthInput from "./authInput"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/useAuth";
import { db } from "../../lib/initFirebase"
import { storage } from "../../lib/initFirebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Loading from "./loading";
import { updateDoc,deleteField,doc,collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
const InputProfileInfo = ({ setSideBar }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [file, setFile] = useState(null);
    const [firstnamevalidation, setFirstnamevalidation] = useState(true);
    const [lastnamevalidation, setLastnamevalidation] = useState(true);
    const [nicknamevalidation, setNicknamevalidation] = useState(true);
    const [phonevalidation, setPhonevalidation] = useState(true);
    const [addressvalidation, setAddressvalidation] = useState(true);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [imgurl, setImgurl] = useState('');
    const { userCredential } = useAuth();
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
        if (any.length > 2) {
            setNickname(any)
            setNicknamevalidation(true);
        }
        else {
            console.log("incorrect")
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
    const handlefile = (e) => {
        var src = URL.createObjectURL(e.target.files[0]);
        setPreviewImage(src)
        setFile(e.target.files[0]);
    }

    const handleComplete = () => {
        if (file  && firstnamevalidation && lastnamevalidation && nicknameValidation && phonevalidation && addressvalidation && email!= "") {
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
                    console.log(downloadUrl);
                });
            })
        }
        else {
        }

    }
    useEffect(()=>{
       setEmail(userCredential.email)
    },[userCredential])
    useEffect(() => {
        console.log(imgurl);
        email != "" && getDetailAndUpdate(email);
        // addDoc(listCollectionRef, { user_email: email, first_name: firstname, profile_img:imgurl, last_name:lastname, nick_name:nickname, user_phone:phone, user_address:address }).then(response => {
        //   createUser(auth, email, password);
        //   setFile(null);
        // }).catch(error => {
        //      console.log(error.message)
        //    });
     }, [imgurl])
     const getDetailAndUpdate = async (email) =>{
        console.log(email)
        let docID;
        const listCollectionRef = collection(db, 'users');
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            docID = doc.id;
        });
        const docRef = doc(db, "users", docID);
        const data = {
            first_name: deleteField(),
            last_name: deleteField(),
            nick_name: deleteField(),
            profile_img: deleteField(),
            user_address: deleteField(),
            user_phone: deleteField(),
        };
        const newdata = {
            first_name: firstname,
            last_name: lastname,
            nick_name: nickname,
            profile_img: imgurl,
            user_address: address,
            user_phone: phone,
        };
        updateDoc(docRef, data)
            .then(() => {
            })
            .catch((error) => {
                console.log(error);
            });
        updateDoc(docRef, newdata)
            .then(() => {
                setLoading(false);
                setFile(null);
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
     }
    return (
        <section className="overflow-auto addProfileInfo">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
            <p className="loginText">Add Your Profile Info.</p>
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
            {
                loading ? <button className="flex items-center justify-center cursor-wait">COMPLETE</button> : <button className="flex items-center justify-center" onClick={() => handleComplete()}>COMPLETE</button>
            }
            </div>
        </section>
    )

}
export default InputProfileInfo