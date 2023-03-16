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
    const [websitevalidation, setWebsitevalidation] = useState(true);
    const [website, setWebsite] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [imgurl, setImgurl] = useState('');
    const [tempData, setTempdata] = useState([]);
    const { userCredential } = useAuth();
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
        if (any.length > 2) {
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
    const websiteValidation = (any) =>{
        
        if(any.indexOf(".") > 0){
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
    }

    const handleComplete = () => {
        setLoading(true);
        if (file  && firstnamevalidation && lastnamevalidation && nicknameValidation && phonevalidation && addressvalidation && websitevalidation && email!= "") {
           
            const storageRef = ref(storage, `images/${email + ".jpg"}`);
            const metadata = {
                contentType: 'image/jpeg'
            };
            
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
       setEmail(userCredential.email)
       getDetail(userCredential.email)
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
        setTempdata(temp);
    }
     const getDetailAndUpdate = async (email) =>{
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
            website:deleteField(),
        };
        const newdata = {
            first_name: firstname,
            last_name: lastname,
            nick_name: nickname,
            profile_img: imgurl,
            user_address: address,
            user_phone: phone,
            website:website
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
                setSideBar(0)
            })
            .catch((error) => {
                console.log(error);
            });
     }
    return (
        <section className="overflow-auto addProfileInfo">
           <Link href = '/setting'><div className="flex flex-row items-center cursor-pointer height-50 mb-2.5"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white"/></div></Link>
            <p className="loginText">Add Your Profile Info.</p>
            <p className="loginDetail">Explore Sydney's largest rental platform</p>
            <div className="flex flex-col items-center justify-center w-full rounded-lg bottomborder" >
                <div className="relative flex flex-col items-center justify-center">
                    <FontAwesomeIcon icon={faPlus} style={{ fontSize: "30px", color: "white" }} />
                    <p className="text-white">Add Profile Photo</p>
                    <input type="file" className="absolute flex w-full opacity-0 left-4" onChange={(e) => handlefile(e)}></input>
                </div>
            </div>
            {
                previewImage ? <div className="relative">
                    <img src={previewImage} style={{ width: "100%", heighst: "180px", borderRadius: "8px", marginTop: "30px", objectFit: "cover" }} />
                </div> : <></>
            }
            <div className="w-full bottomborder margin-top-30 margin-bottom-30"></div>
            <AuthInput title={"First Name"} status={firstnamevalidation} placeholder={"E.g.John"} change={firstnameValidation} type={"text"} value={tempData && tempData.length > 0?tempData[0].first_name:''}/>
            <AuthInput title={"Last Name"} status={lastnamevalidation} placeholder={"E.g.Doe"} change={lastnameValidation} type={"text"} value={tempData && tempData.length > 0?tempData[0].last_name:''}/>
            <AuthInput title={"SDrop Nickname"} status={nicknamevalidation} placeholder={"E.g.John Doe Rentals"} change={nicknameValidation} type={"text"} value={tempData && tempData.length > 0?tempData[0].nick_name:''}/>
            <AuthInput title={"Phone Number"} status={phonevalidation} placeholder={"E.g.+61 488 789"} change={phoneValidation} type={"text"} value={tempData && tempData.length > 0?tempData[0].user_phone:''}/>
            <AuthInput title={"Website"} status={websitevalidation} placeholder={"E.g.johnrental.com"} change={websiteValidation} type={"text"} value={tempData && tempData.length > 0 && tempData[0].website ?tempData[0].website:''}/>
            <AuthInput title={"Address"} status={addressvalidation} placeholder={"E.g.20 Echidna Ave, 2035, Australia"} change={addressValidation} type={"text"} value={tempData && tempData.length > 0?tempData[0].user_address:''}/>
            <div className="loginButton">
            {
                loading ? <button className="flex items-center justify-center cursor-wait">Update</button> : <button className="flex items-center justify-center" onClick={() => handleComplete()}>Update</button>
            }
            </div>
        </section>
    )

}
export default InputProfileInfo