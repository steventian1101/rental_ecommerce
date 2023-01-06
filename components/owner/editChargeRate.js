import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import AuthInput from "../auth/authInput";
import { useState, useEffect } from "react";
const EditChargeRate = ({ setSideBar, setChargeRate, price, chargetype, insurance}) => {
    const [charge, setCharge] = useState(0);
    const [chargevalidation, setChargevalidation] = useState(true);
    const [hour, setHour] = useState(true);
    const [day, setDay] = useState(false);
    const [week, setWeek] = useState(false);
    const [month, setMonth] = useState(false);
    const [own, setOwn] = useState(false);
    const [cover, setCover] = useState(false);

    useEffect(()=>{
        chargetype && handleClick(chargetype);
        insurance && handleInsurance(insurance);
    },[])
    const chargeValidation = (any) => {
        if (any != 0) {
            setCharge(any);
            setChargevalidation(true);
        }
        else {
            setChargevalidation(false);
        }
    }
    const handleClick = (type) => {
        if (type == "hour") {
            setHour(true);
            setDay(false);
            setWeek(false);
            setMonth(false);
        }
        if (type == "day") {
            setHour(false);
            setDay(true);
            setWeek(false);
            setMonth(false);
        }
        if (type == "week") {
            setHour(false);
            setDay(false);
            setWeek(true);
            setMonth(false);
        }
        if (type == "month") {
            setHour(false);
            setDay(false);
            setWeek(false);
            setMonth(true);
        }
    }
    const handleInsurance = (type) => {
        if (type == "own") {
            setOwn(true);
            setCover(false);
        }
        if (type == "cover") {
            setOwn(false);
            setCover(true);
        }

    }
    const handleComplete = () =>{
        if(chargevalidation){
            let temp;
            let charge_rate_type;
            let insurance;
            if(hour){
                charge_rate_type = "hour";
            }
            if(day){
                charge_rate_type = "day";
            }
            if(week){
                charge_rate_type = "week";
            }
            if(month){
                charge_rate_type = "month";
            }
            if(own){
                insurance = "own";
            }
            if(cover){
                insurance = "cover";
            }
            if(!own && !cover){
                insurance = "none";
            }
            temp = {
                "charge_rate_type":charge_rate_type,
                "insurance":insurance,
                "price":charge
            }
            setChargeRate(temp);
            setSideBar(0);
        }
       
    }

    return (
        <section className="overflow-auto addItemImg">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
            <p className="loginText">EDIT THE CHARGE RATE</p>
            <p className="loginDetail">Time to make some money and make sure you're item is covered!</p>
            <AuthInput title={"Item's Charge Rate"} status={chargevalidation} placeholder={"E.g.5 AUD"} change={chargeValidation} type={"number"} value={price} />
            <div>
                <div className="flex flex-row justify-between chargeraterecordbutton">
                    <p className="text-white">Per Hour</p>
                    {
                        hour ? <img src="/logo/checked-circle.svg" style={{ width: "18px" }} /> : <div className="cursor-pointer empty" onClick={() => { handleClick("hour") }}></div>
                    }
                </div>
                <div className="flex flex-row justify-between chargeraterecordbutton">
                    <p className="text-white">Per Day</p>
                    {
                        day ? <img src="/logo/checked-circle.svg" style={{ width: "18px" }} /> : <div className="cursor-pointer empty" onClick={() => { handleClick("day") }}></div>
                    }
                </div>
                <div className="flex flex-row justify-between chargeraterecordbutton">
                    <p className="text-white">Per Week</p>
                    {
                        week ? <img src="/logo/checked-circle.svg" style={{ width: "18px" }} /> : <div className="cursor-pointer empty" onClick={() => { handleClick("week") }}></div>
                    }
                </div>
                <div className="flex flex-row justify-between chargeraterecordbutton">
                    <p className="text-white">Per Month</p>
                    {
                        month ? <img src="/logo/checked-circle.svg" style={{ width: "18px" }} /> : <div className="cursor-pointer empty" onClick={() => { handleClick("month") }}></div>
                    }
                </div>
            </div>
            <div>
                <p className="my-5 text-white">Insurance*</p>
                <div className="flex flex-row justify-between chargeraterecordbutton">
                    <p className="text-white">I have own my insurance</p>
                    {
                        own ? <img src="/logo/checked-circle.svg" style={{ width: "18px" }} /> : <div className="cursor-pointer empty" onClick={() => { handleInsurance("own") }}></div>
                    }
                </div>
                <div className="flex flex-row justify-between chargeraterecordbutton">
                    <p className="text-white">Cover Genius</p>
                    {
                        cover ? <img src="/logo/checked-circle.svg" style={{ width: "18px" }} /> : <div className="cursor-pointer empty" onClick={() => { handleInsurance("cover") }}></div>
                    }
                </div>
                <div className="loginButton">
                    <button className="flex items-center justify-center" onClick={() => handleComplete()}>Complete</button>
                </div>
            </div>
        </section>
    )
}
export default EditChargeRate