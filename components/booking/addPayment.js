import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import AuthInput from "../auth/authInput"
const AddPayment = ({setScreenNumber, setNewPayment}) => {
    const [fullname, setFullname] = useState('');
    const [credit, setCredit] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [fullnamevalidation, setFullnamevalidation] = useState(true);
    const [creditvalidation, setCreditvalidation] = useState(true);
    const [expirevalidation, setExpirevalidation] = useState(true);
    const [cvvvalidation, setCvvvalidation] = useState(true);
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
    const handleComplete = () =>{
        if( fullnamevalidation && creditvalidation && expirevalidation && cvvvalidation){
            const newpayment ={
                "full_name":fullname,
                "credit":credit,
                "expireDate":expireDate,
                "cvv":cvv
            }
            setNewPayment(newpayment);
            setScreenNumber(0);
        }
    } 
    return (
        <section className="addpayment">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer mb-2.5"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={()=>{ setScreenNumber(0)}}/></div>
            <p className="loginText">PAYMENT METHOD</p>
            <p className="loginDetail">Add all the customer's information.</p>
            <AuthInput title={"Full Name"} status={fullnamevalidation} placeholder={"E.g.John Doe"} change={fullnameValidation} type={"text"} value={''} />
            <AuthInput title={"Credit Card Number"} status={creditvalidation} placeholder={"Min. 16 characters long"} change={creditValidation} type={"text"} value={''} />
            <AuthInput title={"Expire Date"} status={expirevalidation} placeholder={"Min. MM/YY"} change={expireValidation} type={"text"} value={''} />
            <AuthInput title={"CVV"} status={cvvvalidation} placeholder={"Back of the card"} change={cvvValidation} type={"text"} value={''} />
            <div className="loginButton">
                <button className="flex items-center justify-center" onClick={()=>{ handleComplete()}}>COMPLETE</button>
            </div>
        </section>
    )

}
export default AddPayment