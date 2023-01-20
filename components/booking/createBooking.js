import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import AuthInput from "../auth/authInput"
import { useState, useEffect } from "react"
import InstantItemNameSearch from "./instantitemnamesearch"
import Calendar from "react-calendar"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"
import { faClock } from "@fortawesome/free-solid-svg-icons"
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons"
import { getdisabledates } from "../../utils/getdisabledates"
const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
const time = [
    "12:00 AM",
    "01:00 AM",
    "02:00 AM",
    "03:00 AM",
    "04:00 AM",
    "05:00 AM",
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
    "11:00 PM",
];
const duration = [1, 2, 3];
const CreateBooking = ({ setScreenNumber, setNewBooking}) => {
    const [calendarDisplay, setCalendarDisplay] = useState(false);
    const [value, setValue] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [disabledDates, setDisabledates] = useState(null); 
    const [displayTimetable, setDisplayTimetable] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [content, setContent] = useState(null);
    const [number, setNumber] = useState(0);
    const [Id, setId] = useState(null);
    const [durationIndex, setDurationIndex] = useState(0);
    const [result, setResult] = useState(null);
    const [displayDuration, setDisplayDuration] = useState(false);
    const [email, setEmail] = useState(null);
    const [emailvalidation, setEmailvalidation] = useState(true);
    const [phone, setPhone] = useState('');
    const [phonevalidation, setPhonevalidation] = useState(true);
    const [drivingvalidation, setDrivingvalidadtion] = useState(true);
    const [driving, setDriving] = useState(null);
    const phoneValidation = (any) => {
        let str = /^\+?([61]{2})\)?[ ]?([0-9]{3})[ ]?([0-9]{3})[ ]?([0-9]{3})$/;
        if (str.test(any)) {
            setPhone(any)
            setPhonevalidation(true);
        } else {
            setPhonevalidation(false);
        }

    }
    const drivingValidation = (any) => {
        if (any != "") {
            setDrivingvalidadtion(true);
            setDriving(any)
        }
        else {
            setDrivingvalidadtion(false)
        }

    }
    useEffect(() => {
        setDate(value);
        setCalendarDisplay(false);
    }, [value]);
    const handleTime = (index) => {
        setStartTime(index);
        setDisplayTimetable(false)
    }
    useEffect(() => {
        Id && setContent(Id)
    }, [Id]);
    useEffect(() => {
        content && content.item_charge_rate != "person" && getTotal(Number(durationIndex));
    }, [durationIndex, content?.item_charge]);
    useEffect(() => {
        content && content.item_charge_rate == "person" && getTotal(Number(number));

    }, [number, content?.item_charge]);
    const getTotal = (index) => {
        console.log("here is calculator............................................................")
        setResult(content.item_charge * 1.35 * index);
    };
    const handleDuration = (index) => {
        setDurationIndex(index)
    }
    useEffect(() => {
    }, [result]);
    const emailValidation = (any) => {
        if ((any.indexOf("@") > -1) && (any.indexOf(".") > -1)) {
            setEmail(any)
            setEmailvalidation(true);
        }
        else {
            setEmailvalidation(false)
        }
    }
    const handleComplete = () =>{
        
       if(result && emailvalidation && phoneValidation && drivingvalidation){
        const Info ={ 
            "item_id":Id.objectID,
            "start_date":month[Number(date.getMonth())]+","+date.getDate()+","+date.getFullYear(),
            "start_time":startTime,
            "email":email,
            "phone_number":phone,
            "driving_license":driving ,
            "result":result,    
        }
        setNewBooking(Info)
        setScreenNumber(2);
       }
    }
    useEffect(()=>{
       let tempId = Id && Id.objectID
        tempId && getdisabledates(tempId, content)
            .then((data) => {
                setDisabledates(data)
            })
    },[Id && content]);


    return (
        <section className="overflow-auto createbooking">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer mb-2.5"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={()=>{ setScreenNumber(0)}}/></div>
            <p className="loginText">NEW BOOKING</p>
            <p className="loginDetail">Add all the customer's information.</p>
            <div className="py-3">
                <p className="mb-5 text-white font-18 bold">Booking Info</p>
            </div>
            <InstantItemNameSearch setId={setId} />
            <div className="my-2.5">
                <p className="font-15">Start Date</p>
                <div className="relative flex flex-row items-center justify-between py-2" style={{ borderBottom: "solid 1px #ffffff1a" }} onClick={() => { setCalendarDisplay(true) }}>
                    <p className="text-white font-15">{date && date.getDate() + " " + month[`${date.getMonth()}`] + ", " + date.getFullYear()}</p>
                    <FontAwesomeIcon icon={faCalendar} className="text-lg text-white" />
                </div>
                {
                    calendarDisplay && <div className="w-full top-8 ">
                        <Calendar onChange={setValue} value={value} tileDisabled={({ date, view }) =>
                            (view === 'month') && // Block day tiles only
                            disabledDates.some(disabledDate =>
                                (date.getFullYear() === disabledDate.getFullYear() &&
                                    date.getMonth() === disabledDate.getMonth() &&
                                    date.getDate() === disabledDate.getDate()) || date < new Date()
                            )} defaultActiveStartDate={new Date()} />
                    </div>
                }
            </div>
            <div className="my-2.5">
                <p className="font-15 ">Start Time</p>
                <div className="relative flex flex-row items-center justify-between py-2" style={{ borderBottom: "solid 1px #ffffff1a" }} onClick={() => { setDisplayTimetable(true) }}>
                    <p className="text-white font-15">{time[startTime]}</p>
                    <FontAwesomeIcon icon={faClock} className="text-lg text-white" />
                </div>
                {
                    displayTimetable && <div className="flex flex-col bg-white" style={{ background: "#ffffff1a" }}>
                        {
                            time.map((time, index) => (
                                <p className="w-full px-2 py-1 text-white time" onClick={() => { handleTime(index) }}>{time}</p>
                            ))
                        }

                    </div>
                }
            </div>
            {
                content && content.item_charge_rate == "person" ? <div className="my-2.5">
                    <p className="font-15 ">Members</p>
                    <div className="relative flex flex-row items-center justify-between py-2" style={{ borderBottom: "solid 1px #ffffff1a" }} onClick={() => { setDisplayDuration(true) }}>
                        <input type="text" className="text-white bg-transparent outline-none" style={{ border: "solid 0px black" }} defaultValue="0" onChange={(e) => { setNumber(e.target.value) }} />
                        <FontAwesomeIcon icon={faPeopleGroup} className="text-lg text-white" />
                    </div>
                </div> :<div className="my-2.5">
                    <p className="font-15 ">Duration</p>
                    <div className="relative flex flex-row items-center justify-between py-2" style={{ borderBottom: "solid 1px #ffffff1a" }} onClick={() => { setDisplayDuration(true) }}>
                        <input type="text" className="text-white bg-transparent outline-none" style={{ border: "solid 0px black" }} defaultValue="0" onChange={(e) => { handleDuration(e.target.value) }} />
                    </div>
                </div>
            }
            <div className="line"></div>
            <div>
                <p className="mb-5 text-white font-18 bold">General Info</p>
                <AuthInput title={"Email Address"} status={emailvalidation} placeholder={"E.g.johndoe@gmail.com"} change={emailValidation} type={"text"} value={""} />
                <AuthInput title={"Phone Number"} status={phonevalidation} placeholder={"E.g.+61 488 789 765"} change={phoneValidation} type={"text"} value={""} />
                <AuthInput title={"Driver's License Number"} status={drivingvalidation} placeholder={"E.g. LC82392389"} change={drivingValidation} type={"text"} value={""} />
            </div>
            <div className="line"></div>
            <div>
                <p className="mb-5 font-18 white bold">Booking Summary</p>
                <div className="bookingsummary">
                    <p className="text-white font-15">Total Price</p>
                    {
                        result ? <p className="mb-4 text-xl text-white bold">AUD $ {result.toFixed(2)}</p> : <div className="w-full h-8 my-1 mb-4 rounded-lg detail-loading"></div>
                    }
                    {
                        content ? <p className="mb-1 text-white ellipsis font-15">{Id && Id.item_name}</p> : <div className="h-5 mb-1 detail-loading"></div>
                    }
                    <p className="mb-1 font-15 ellipsis">Start: {date && date.getDate() + " " + month[`${date.getMonth()}`] + ", " + date.getFullYear()} {time[startTime]}</p>
                    {
                        content ? <>{
                            content.item_charge_rate != "person"?<p className="mb-1 text-white font-15">Duration: {durationIndex} {content.item_charge_rate}</p> : <p className="mb-1 text-white font-15">Members: {number} {content.item_charge_rate}</p>
                        }</> : <div className="h-5 detail-loading"></div>
                    }
                </div>
            </div>
            <div className="loginButton">
                <button className="flex items-center justify-center" onClick={handleComplete}>COMPLETE</button>
            </div>
        </section>
    )

}
export default CreateBooking