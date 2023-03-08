import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import AuthInput from "../auth/authInput"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/useAuth"
import { updateDoc, deleteField, doc, collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/initFirebase"
import { getFunctions, httpsCallable } from "firebase/functions"
import { useRouter } from "next/router"
import Link from "next/link"
import getAndAddPmId from "../../utils/getId"
import { createSource } from "../../utils/getId"
import { getAddress } from "../../utils/getCorrectAddress"
import { ToggleSlider } from "react-toggle-slider"
import { getCity } from "../../utils/getCorrectAddress"
import { getLine1 } from "../../utils/getCorrectAddress"
import { getPostalCode } from "../../utils/getCorrectAddress"
import { getState } from "../../utils/getCorrectAddress"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { storage } from "../../lib/initFirebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Loading from "../auth/loading"
const Bank = () => {
    const { userCredential } = useAuth();
    const [accountname, setAccountname] = useState(null);
    const [bsb, setBsb] = useState(null);
    const [accountnumber, setAccountNumber] = useState(null);
    const [accountnamevalidation, setAccountnamevalidation] = useState(true);
    const [bsbvalidation, setBsbvalidation] = useState(true);
    const [accountnumbervalidation, setAccountnumbervalidation] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(null);
    const [tempData, setTempdata] = useState([]);
    const [userId, setUserId] = useState(null);
    const [stripePolicy, setStripePolicy] = useState(true);
    const [stripePolicyAgree, setStripePolicyAgree] = useState(null)
    const router = useRouter();
    const [previewFrontImage, setPreviewFrontImage] = useState(null);
    const [frontFile, setFrontFile] = useState(null);
    const [previewBackImage, setPreviewBackImage] = useState(null);
    const [backFile, setBackFile] = useState(null);
    const [frontFileUrl, setFrontFileUrl] = useState(null);
    const [backFileUrl, setBackFileUrl] = useState(null);
    const [frontToken, setFrontToken] = useState(null);
    const [backToken, setBackToken] = useState(null);
    const [frontDownloadUrl, setFrontDownloadUrl] = useState(null)
    const [backDownloadUrl, setBackDownloadUrl] = useState(null);
    const accountnameValidation = (any) => {
        let str = /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/;
        if (str.test(any) || any == "") {
            setAccountname(any)
            setAccountnamevalidation(true)
        }
        else {
            setAccountnamevalidation(false)
        }
    }
    const bsbValidation = (any) => {
        let str = /\d{3}(-?|\s?)\d{3}/;
        if (str.test(any) || any == "" || any === undefined) {
            setBsb(any)
            setBsbvalidation(true)
        }
        else {
            setBsbvalidation(false)
        }
    }
    const accountnumberValidation = (any) => {
        let str = /^[0-9]{8}/;
        if (str.test(any) || any == "" || any === undefined) {
            setAccountNumber(any);
            setAccountnumbervalidation(true)
        }
        else {
            setAccountnumbervalidation(false)
        }
    }
    const handleComplete = () => {
        setLoading(true)
        if (email && accountnamevalidation && bsbvalidation && accountnumbervalidation && accountname != "" && bsb != "" && accountnumber != "" && frontFile && backFile) {
            let frontpath = 'driverLicense/' + Math.floor(Math.random() * 100000000000000) + ".jpg";
            const storageFrontRef = ref(storage, frontpath);
            uploadBytes(storageFrontRef, frontFile).then((snapshot) => {
                getDownloadURL(storageFrontRef).then((downloadUrl) => {
                    setFrontFileUrl(frontpath);
                    setFrontDownloadUrl(downloadUrl);
                });
            });

            let backpath = 'driverLicense/' + Math.floor(Math.random() * 100000000000000) + ".jpg";
            const storageBackRef = ref(storage, backpath);
            uploadBytes(storageBackRef, backFile).then((snapshot) => {
                getDownloadURL(storageBackRef).then((downloadUrl) => {
                    setBackFileUrl(backpath);
                    setBackDownloadUrl(downloadUrl);
                });
            })
        }
        else {
            setAccountnamevalidation(false);
            setAccountnumbervalidation(false);
            setBsbvalidation(false)
        }
    }
    const getDetail = async (email) => {
        setLoading(true);
        let temp = [];
        const listCollectionRef = collection(db, 'users');
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(doc.data());
        });
        if (temp[0]["account_id"]) {
            const functions = getFunctions();
            const download = httpsCallable(functions, 'retriveAccount');
            const retriveAccount = await download({ data: temp[0]["account_id"] });
            console.log(retriveAccount)

        }
        if (temp[0]["stripePolicy"] === true) {
            let tempGeo = []
            tempGeo.push(<ToggleSlider onToggle={state => setStripePolicy(state)} handleBackgroundColor="#ffffff" handleBackgroundColorActive="#005ce7" barBackgroundColor="#0e0e0e" barBackgroundColorActive="#0e0e0e" barStyles={{ border: "solid 1px #ffffff4d" }} active={true} key={"1"} />)
            setStripePolicyAgree(tempGeo);
            setStripePolicy(true)
        }
        if (temp[0]["stripePolicy"] === false) {
            let tempGeo = []
            tempGeo.push(<ToggleSlider onToggle={state => setStripePolicy(state)} handleBackgroundColor="#ffffff" handleBackgroundColorActive="#005ce7" barBackgroundColor="#0e0e0e" barBackgroundColorActive="#0e0e0e" barStyles={{ border: "solid 1px #ffffff4d" }} active={false} key={"2"} />)
            setStripePolicyAgree(tempGeo);
            setStripePolicy(false);
        }
        if (temp[0]["stripePolicy"] === undefined) {
            let tempGeo = []
            tempGeo.push(<ToggleSlider onToggle={state => setStripePolicy(state)} handleBackgroundColor="#ffffff" handleBackgroundColorActive="#005ce7" barBackgroundColor="#0e0e0e" barBackgroundColorActive="#0e0e0e" barStyles={{ border: "solid 1px #ffffff4d" }} active={true} key={"3"} />)
            setStripePolicyAgree(tempGeo);
            setStripePolicy(true);
        }
        if (temp[0]["stripe_customer_data"] && temp[0]["stripe_customer_data"]["backDownloadUrl"]) {
            setPreviewBackImage(temp[0]["stripe_customer_data"]["backDownloadUrl"]);
        }
        if (temp[0]["stripe_customer_data"] && temp[0]["stripe_customer_data"]["frontDownloadUrl"]) {
            setPreviewFrontImage(temp[0]["stripe_customer_data"]["frontDownloadUrl"]);
        }
        setTempdata(temp);
        setLoading(false)
    }
    const getDetailAndUpdate = async (email) => {
        let docID;
        let customerID;
        let userLocation;
        let city;
        let line1;
        let postal_code;
        let state;
        const listCollectionRef = collection(db, 'users');
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            docID = doc.id;
            customerID = doc.data()["customer_id"];
            userLocation = doc.data()["user_address"];
        });
        console.log(userLocation)
        if (typeof (userLocation) == "string") {
            console.log("string")
            userLocation = userLocation
        }
        if (typeof (userLocation) == "object") {
            console.log("array")
            userLocation = userLocation[0]
        }
        const addressComponent = await getAddress(userLocation);
        city = await getCity(addressComponent);
        line1 = await getLine1(addressComponent);
        postal_code = await getPostalCode(addressComponent);
        state = await getState(addressComponent);
        console.log(accountname)
        const dataForValid = {
            url: "https://version2-3284e.web.app/rentalOwner/?id=" + tempData[0].nick_name.replace(" ", "%20"),
            mcc: "5399",
            city: city,
            line1: line1,
            postal_code: postal_code,
            state: state,
            dob_day: tempData[0].birth.split("/")[0],
            dob_month: tempData[0].birth.split("/")[1],
            dob_year: tempData[0].birth.split("/")[2],
            email: userCredential.email,
            phone: tempData[0].user_phone,
            accountname: accountname,
            bsb: bsb,
            accountnumber: accountnumber,
            frontImage: frontToken,
            backImage: backToken,
            frontDownloadUrl: frontDownloadUrl,
            backDownloadUrl: backDownloadUrl
        }
        console.log(dataForValid);
        createSource(dataForValid);
    }
    useEffect(() => {
        userCredential.email && setEmail(userCredential.email);
        userCredential.email && getDetail(userCredential.email);
    }, [userCredential]);
    const handleFrontFile = async (e) => {
        var src = URL.createObjectURL(e.target.files[0]);
        setPreviewFrontImage(src)
        setFrontFile(e.target.files[0]);
    }
    const handleBackFile = async (e) => {
        var src = URL.createObjectURL(e.target.files[0]);
        setPreviewBackImage(src)
        setBackFile(e.target.files[0]);
    }
    const getFrontFileToken = async (url) => {
        const functions = getFunctions();
        const download = httpsCallable(functions, 'download');
        const result = await download({ data: url });
        setFrontToken(result.data.id);
    }
    useEffect(() => {
        frontFileUrl && getFrontFileToken(frontFileUrl);
    }, [frontFileUrl])
    const getBackFileToken = async (url) => {
        const functions = getFunctions();
        const download = httpsCallable(functions, 'download');
        const result = await download({ data: url });
        setBackToken(result.data.id);
    }
    useEffect(() => {
        frontFileUrl && backFileUrl && getBackFileToken(frontFileUrl);
    }, [backFileUrl]);
    useEffect(() => {
        backToken && frontToken && getDetailAndUpdate(userCredential.email)
    }, [backToken && frontToken])
    return (
        <>{
            loading ? <Loading /> : <></>
        }
            <section className="overflow-auto addProfileInfo">
                <Link href='/setting'>
                    <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" /></div>
                </Link>
                <p className="loginText">BANK ACCOUNT</p>
                <p className="loginDetail">Add bank account details</p>
                <form autoComplete="off">
                    <AuthInput title={"Account Name"} status={accountnamevalidation} placeholder={"E.g.John Doe"} change={accountnameValidation} type={"text"} value={tempData && tempData.length > 0 && tempData[0]["stripe_customer_data"] && tempData[0]["stripe_customer_data"]["accountname"] ? tempData[0]["stripe_customer_data"]["accountname"] : ''} />
                    <AuthInput title={"BSB"} status={bsbvalidation} placeholder={"Requeires 6 digits"} change={bsbValidation} type={"text"} value={tempData && tempData.length > 0 && tempData[0]["stripe_customer_data"] && tempData[0]["stripe_customer_data"]["bsb"] ? tempData[0]["stripe_customer_data"]["bsb"] : ''} />
                    <AuthInput title={"Account Number"} status={accountnumbervalidation} placeholder={"Requeires 8 digits"} change={accountnumberValidation} type={"text"} value={tempData && tempData.length > 0 && tempData[0]["stripe_customer_data"] && tempData[0]["stripe_customer_data"]["accountnumber"] ? tempData[0]["stripe_customer_data"]["accountnumber"] : ''} name={"date"} />
                </form>
                <div>
                    <p className="text-white font-15 mb-2.5">
                        Driver's License - Front
                    </p>
                    <div className="relative flex flex-col items-center justify-center w-full" style={{ height: "180px", border: "1px solid #ffffff4a", borderRadius: "8px" }}>
                        <div className="relative flex flex-col items-center justify-center">
                            <FontAwesomeIcon icon={faPlus} style={{ fontSize: "30px", color: "white" }} />
                            <p className="text-white">Add Photos here</p>
                        </div>
                        <input type="file" className="absolute flex w-full h-full opacity-0" onChange={(e) => { handleFrontFile(e) }}></input>
                    </div>
                </div>
                {
                    previewFrontImage ? <div className="relative">
                        <img src={previewFrontImage} style={{ width: "100%", height: "180px", borderRadius: "8px", marginTop: "30px", objectFit: "cover" }} />
                    </div> : <></>
                }
                <div className="mt-8">
                    <p className="text-white font-15 mb-2.5">
                        Driver's License - Back
                    </p>
                    <div className="relative flex flex-col items-center justify-center w-full" style={{ height: "180px", border: "1px solid #ffffff4a", borderRadius: "8px" }}>
                        <div className="relative flex flex-col items-center justify-center">
                            <FontAwesomeIcon icon={faPlus} style={{ fontSize: "30px", color: "white" }} />
                            <p className="text-white">Add Photos here</p>
                        </div>
                        <input type="file" className="absolute flex w-full h-full opacity-0" onChange={(e) => { handleBackFile(e) }}></input>
                    </div>
                </div>
                {
                    previewBackImage ? <div className="relative">
                        <img src={previewBackImage} style={{ width: "100%", height: "180px", borderRadius: "8px", marginTop: "30px", objectFit: "cover" }} />
                    </div> : <></>
                }
                <div style={{ marginTop: "30px" }} className="flex flex-row items-center justify-between">
                    <p className="text-white font-15">Do you accept Stripe's Term of Service?</p>
                    {
                        stripePolicyAgree
                    }
                </div>
                <div className="loginButton">
                    <button className="flex items-center justify-center" onClick={() => handleComplete()}>Update</button>
                </div>
            </section>
        </>
    )

}
export default Bank