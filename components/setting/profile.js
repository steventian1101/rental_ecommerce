import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import AuthInput from "../auth/authInput"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/useAuth";
import { db } from "../../lib/initFirebase"
import { storage } from "../../lib/initFirebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Loading from "../auth/loading"
import Link from "next/link"
import { useRouter } from "next/router"
import { updateDoc,deleteField,doc,collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
const Profile = () => {
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
    const [websitevalidation, setWebsitevalidation] = useState(true);
    const [website, setWebsite] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [beforeImage, setBeforeImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [imgurl, setImgurl] = useState('');
    const [tempData, setTempdata] = useState([]);
    const { userCredential } = useAuth();
    const router=  useRouter();
    const firstnameValidation = (any) => {
        let str = /([A-Z]{1})\)?([a-z]{1,})$/;
        if (str.test(any) || any == "") {
            setFirstname(any)
            setFirstnamevalidation(true);
        }
        else { 
            setFirstnamevalidation(false)
        }
    }
    const lastnameValidation = (any) => {
        let str = /([A-Z]{1})\)?([a-z]{1,})$/;
        if (str.test(any) || any == "") {
            setLastname(any)
            setLastnamevalidation(true);
        }
        else {
            setLastnamevalidation(false)
        }
    }
    const nicknameValidation = (any) => {
        if (any.length > 2 || any == "") {
            setNickname(any)
            setNicknamevalidation(true);
        }
        else {
            setNicknamevalidation(false)
        }
    }
    const phoneValidation = (any) => {
        let str = /^\+?([61]{2})\)?[ ]?([0-9]{3})[ ]?([0-9]{3})[ ]?([0-9]{3})$/;
        if (str.test(any) || any == "") {
            setPhone(any)
            setPhonevalidation(true);
        } else {
            setPhonevalidation(false);
        }

    }
    const addressValidation = (any) => {
        let str = /([0-9A-Za-z])[,]?([0-9])[,]?[| ]?\bAustralia\b$/;
        if (str.test(any) || any == "") {
            setAddress(any)
            setAddressvalidation(true);
        } else {
            setAddressvalidation(false);
        }
    }
    const websiteValidation = (any) =>{
        
        if(any.indexOf(".") > 0 || any == ""){
            setWebsitevalidation(true);
            setWebsite(any);
        }
        else{
            setWebsitevalidation(false)
        }
    }
    const handlefile = (e) => {
        var src = URL.createObjectURL(e.target.files[0]);
        setPreviewImage(src)
        setFile(e.target.files[0]);
        setBeforeImage(null);
    }

    const handleComplete = () => {
        setLoading(true);
        if (!previewImage  && firstnamevalidation && lastnamevalidation && nicknameValidation && phonevalidation && websitevalidation && email!= ""){
            setImgurl(beforeImage)
        }
        if (file  && firstnamevalidation && lastnamevalidation && nicknameValidation && phonevalidation && websitevalidation && email!= "") {
           
            const storageRef = ref(storage, `images/${email + ".jpg"}`);
            uploadBytes(storageRef, file).then((snapshot) => {
                getDownloadURL(storageRef).then((downloadUrl) => {
                    setImgurl(downloadUrl);
                });
            })
        }
        else {
            setLoading(false)
        }

    }
    useEffect(()=>{
       userCredential.email && setEmail(userCredential.email)
       userCredential.email && getDetail(userCredential.email)
    },[userCredential])
    useEffect(() => {
        email != "" && getDetailAndUpdate(email);
        // addDoc(listCollectionRef, { user_email: email, first_name: firstname, profile_img:imgurl, last_name:lastname, nick_name:nickname, user_phone:phone, user_address:address }).then(response => {
        //   createUser(auth, email, password);
        //   setFile(null);
        // }).catch(error => {
        //      console.log(error.message)
        //    });
     }, [imgurl])
     const getDetail = async (email) =>{
        let temp = [];
        const listCollectionRef = collection(db, 'users');
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(doc.data());
        });
        setBeforeImage(temp[0]["profile_img"])
        setTempdata(temp);
    }
     const getDetailAndUpdate = async (email) =>{
        if(!previewImage){
            setLoading(true)
        }
        let docID;
        const listCollectionRef = collection(db, 'users');
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            docID = doc.id;
        });
        const docRef = doc(db, "users", docID);
        const newdata = {
            first_name: firstname,
            last_name: lastname,
            nick_name: nickname,
            profile_img: imgurl,
            user_phone: phone,
            website:website
        };
        updateDoc(docRef, newdata)
            .then(() => {
                setLoading(false);
                setFile(null);
                router.push('/setting')
            })
            .catch((error) => {
                console.log(error);
            });
     }
     useEffect(()=>{
          console.log(beforeImage)
     },[beforeImage])
    return (
        <section className="overflow-auto addProfileInfo">
           <Link href = '/setting'><div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white"/></div></Link>
            <p className="loginText">Add Your Profile Info.</p>
            <p className="loginDetail">Explore Sydney's largest rental platform</p>
            <div className="relative flex flex-col items-center justify-center w-full" style={{ height: "180px", border: "1px solid #ffffff4a", borderRadius: "8px" }}>
                <div className="relative flex flex-col items-center justify-center">
                    <FontAwesomeIcon icon={faPlus} style={{ fontSize: "30px", color: "white" }} />
                    <p className="text-white">Add Profile Photo</p>
                </div>
                <input type="file" className="absolute flex w-full h-full opacity-0" onChange={(e) => handlefile(e)}></input>
            </div>
            {
                previewImage ? <div className="relative">
                    <img src={previewImage} style={{ width: "100%", height: "180px", borderRadius: "8px", marginTop: "30px", objectFit: "cover" }} />
                </div> : <></>
            }
            {
                beforeImage ? <div className="relative">
                    <img src={beforeImage} style={{ width: "100%", height: "180px", borderRadius: "8px", marginTop: "30px", objectFit: "cover" }} />
                </div> : <></>
            }
            <div style={{ marginTop: "30px", marginBottom: "30px", width: "100%", height: "1px", background: "#ffffff4a" }}></div>
            <AuthInput title={"First Name"} status={firstnamevalidation} placeholder={"E.g.John"} change={firstnameValidation} type={"text"} value={tempData && tempData.length > 0?tempData[0].first_name:''}/>
            <AuthInput title={"Last Name"} status={lastnamevalidation} placeholder={"E.g.Doe"} change={lastnameValidation} type={"text"} value={tempData && tempData.length > 0?tempData[0].last_name:''}/>
            <AuthInput title={"SDrop Nickname"} status={nicknamevalidation} placeholder={"E.g.John Doe Rentals"} change={nicknameValidation} type={"text"} value={tempData && tempData.length > 0?tempData[0].nick_name:''}/>
            <AuthInput title={"Phone Number"} status={phonevalidation} placeholder={"E.g.+61 488 789"} change={phoneValidation} type={"text"} value={tempData && tempData.length > 0?tempData[0].user_phone:''}/>
            <AuthInput title={"Website"} status={websitevalidation} placeholder={"E.g.johnrental.com"} change={websiteValidation} type={"text"} value={tempData && tempData.length > 0 && tempData[0].website ?tempData[0].website:''}/>
            <div className="loginButton">
            {
                loading ? <button className="flex items-center justify-center cursor-wait">Update</button> : <button className="flex items-center justify-center" onClick={() => handleComplete()}>Update</button>
            }
            </div>
        </section>
    )

}
export default Profile