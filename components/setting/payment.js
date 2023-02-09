import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import AuthInput from "../auth/authInput"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/useAuth"
import { updateDoc, deleteField, doc, collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/initFirebase"
import { getFunctions, httpsCallable } from "firebase/functions"
import { useRouter } from "next/router"
const Payment = ({ setSideBar }) => {
    const { userCredential } = useAuth();
    const [fullname, setFullname] = useState('');
    const [credit, setCredit] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [fullnamevalidation, setFullnamevalidation] = useState(true);
    const [creditvalidation, setCreditvalidation] = useState(true);
    const [expirevalidation, setExpirevalidation] = useState(true);
    const [cvvvalidation, setCvvvalidation] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(null);
    const [tempData, setTempdata] = useState([]);
    const router = useRouter();
    console.log(router)
    const fullnameValidation = (any) => {
        let str = /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/;
        setFullnamevalidation(str.test(any))
        if (str.test(any)) {
            setFullname(any)
        }
    }
    const creditValidation = (any) => {
        let str = /[^0-9]+/;
        setCreditvalidation(str.test(any));
        if (str.test(any)) {
            setCredit(any)
        }
    }
    const expireValidation = (any) => {
        let str = /^(0[1-9]|1[0-2])\/\d{2}$/;
        setExpirevalidation(str.test(any));
        if (str.test(any)) {
            setExpireDate(any);
        }
    }
    const cvvValidation = (any) => {
        let str = /^[0-9]{3,4}$/;
        setCvvvalidation(str.test(any));
        if (str.test(any)) {
            setCvv(any);
        }
    }
    const handleComplete = () => {
        setLoading(true)
        if (email && fullnamevalidation && creditvalidation && expirevalidation && cvvvalidation && fullname != "" && credit != "" && expireDate != "" && cvv != "") {
            email && getDetailAndUpdate(email);
        }
        else {
            setCreditvalidation(false);
            setFullnamevalidation(false);
            setExpirevalidation(false);
            setCvvvalidation(false);
            setLoading(false);
        }
    }
    const getDetail = async (email) => {
        let temp = [];
        const listCollectionRef = collection(db, 'users');
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(doc.data());
        });
        setTempdata(temp);
    }
    const getDetailAndUpdate = async (email) => {
        let docID;
        let customerID;
        const listCollectionRef = collection(db, 'users');
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            docID = doc.id;
            customerID = doc.data()["customer_id"];
        });
        const docRef = doc(db, "users", docID);
        const creditPaymentData = {
            customer_id:customerID,
            card_number:credit,
            expiry_month:expireDate.split("/")[0],
            expiry_year:expireDate.split("/")[1],
            cvv:cvv
        }
        console.log(creditPaymentData);
        createPayment(creditPaymentData);
        setLoading(false);
        const newdata = {
            full_name: fullname,
            credit_card_number: credit,
            expire_date: expireDate,
            cvv: cvv,
        };
        updateDoc(docRef, newdata)
            .then(() => {
                setLoading(false);
                setSideBar(0);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        userCredential.email && setEmail(userCredential.email);
        userCredential.email && getDetail(userCredential.email);
    }, [userCredential]);
    const createPayment = async (detail) =>{
        const functions = getFunctions();
        const createPaymentMethod = httpsCallable(functions, 'createPaymentMethod');
        await createPaymentMethod({ data: detail }).then((result)=>{
            console.log(result)
            
        });

    }
    return (
        <section className="overflow-auto addProfileInfo">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
            <p className="loginText">PAYMENT METHOD</p>
            <p className="loginDetail">Add all the customer's information</p>
            <AuthInput title={"Full Name"} status={fullnamevalidation} placeholder={"E.g.John Doe"} change={fullnameValidation} type={"text"} value={tempData && tempData.length > 0 ? tempData[0].full_name : ''} />
            <AuthInput title={"Credit Card Number"} status={creditvalidation} placeholder={"Min. 16 characters long"} change={creditValidation} type={"text"} value={tempData && tempData.length > 0 ? tempData[0].credit_card_number : ''} />
            <AuthInput title={"Expire Date"} status={expirevalidation} placeholder={"Min. MM/YY"} change={expireValidation} type={"text"} value={tempData && tempData.length > 0 ? tempData[0].expire_date : ''} />
            <AuthInput title={"CVV"} status={cvvvalidation} placeholder={"Back of the card"} change={cvvValidation} type={"text"} value={tempData && tempData.length > 0 ? tempData[0].cvv : ''} />
            <div className="loginButton">
                {
                    loading ? <button className="flex items-center justify-center cursor-wait">Update</button> : <button className="flex items-center justify-center" onClick={() => handleComplete()}>Update</button>
                }
            </div>
        </section>
    )

}
export default Payment