import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import AuthInput from "../auth/authInput"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/useAuth"
import { updateDoc,deleteField,doc,collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/initFirebase"
const Payment = ({setSideBar}) =>{
    const { userCredential} = useAuth();
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
    const fullnameValidation = (any) =>{
        console.log(any)
        let str = /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/;
        setFullnamevalidation(str.test(any))
        if(str.test(any)){
            setFullname(any)
        }
    }
    const creditValidation = (any) =>{
        console.log(any)
        let str =/[^0-9]+/;
        setCreditvalidation(str.test(any));
        if(str.test(any)){
            setCredit(any)
        }
    }
    const expireValidation = (any) =>{
        let str = /^(0[1-9]|1[0-2])\/\d{2}$/;
        setExpirevalidation(str.test(any));
        if(str.test(any)){
            setExpireDate(any);
        }
    }
    const cvvValidation = (any) =>{ 
        let str = /^[0-9]{3,4}$/;
        setCvvvalidation(str.test(any));
        if(str.test(any)){
            setCvv(any);
        }
    }
    const handleComplete = () =>{
        setLoading(true)
        if(email && fullnamevalidation && creditvalidation && expirevalidation && cvvvalidation && fullname != "" && credit != "" && expireDate !="" && cvv != "" ){
            email && getDetailAndUpdate(email);
        }
        else{
            setCreditvalidation(false);
            setFullnamevalidation(false);
            setExpirevalidation(false);
            setCvvvalidation(false);
            setLoading(false);
        }
    }
    const getDetail = async (email) =>{
        let temp = [];
        const listCollectionRef = collection(db, 'users');
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(doc.data());
        });
        console.log(temp)
        setTempdata(temp);
    }
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
            full_name: deleteField(),
            credit_card_number: deleteField(),
            expire_date: deleteField(),
            cvv: deleteField()
        };
        const newdata = {
            full_name: fullname,
            credit_card_number: credit,
            expire_date: expireDate,
            cvv: cvv,
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
                setSideBar(0);
            })
            .catch((error) => {
                console.log(error);
            });
     }
    useEffect(()=>{
       setEmail(userCredential.email);
       getDetail(userCredential.email);
    },[userCredential])
    return(
        <section className="overflow-auto addProfileInfo">
        <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
        <p className="loginText">PAYMENT METHOD</p>
        <p className="loginDetail">Add all the customer's information</p>
        <AuthInput title={"Full Name"} status={fullnamevalidation} placeholder={"E.g.John Doe"} change={fullnameValidation} type={"text"} value={ tempData && tempData.length > 0 ?tempData[0].full_name:''}/>
        <AuthInput title={"Credit Card Number"} status={creditvalidation} placeholder={"Min. 16 characters long"} change={creditValidation} type={"text"}  value={ tempData && tempData.length > 0 ? tempData[0].credit_card_number:''}/>
        <AuthInput title={"Expire Date"} status={expirevalidation} placeholder={"Min. MM/YY"} change={expireValidation} type={"text"} value={ tempData && tempData.length>0 ? tempData[0].expire_date:''}/>
        <AuthInput title={"CVV"} status={cvvvalidation} placeholder={"Back of the card"} change={cvvValidation} type={"text"} value={ tempData && tempData.length > 0 ? tempData[0].cvv:''}/>
        <div className="registerButton">
        {
            loading ? <button className="flex items-center justify-center cursor-wait">COMPLETE</button> : <button className="flex items-center justify-center" onClick={() => handleComplete()}>COMPLETE</button>
        }
        </div>
    </section>
    )

}
export default Payment