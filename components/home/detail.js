import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { db } from "../../lib/initFirebase"
import { updateDoc, doc, getDoc, collection, getDocs, where, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import DetailCarousel from "./detailCarousel";
import DetailReview from "./detailReview";
import Calendar from 'react-calendar';
import { useAuth } from "../../context/useAuth";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const Detail = ({ id, setSideBar, setDetail, setItemID, setLogin }) => {


    const [content, setContent] = useState(null);
    const [viewnumber, setViewnumber] = useState(null);
    const [owner, setOwner] = useState(null);
    const [ownerData, setOwnerData] = useState(null);
    const [value, setValue] = useState(new Date());
    const disabledDates = [new Date(2023, 0, 14), new Date(2023, 0, 23)];
    const [date, setDate] = useState(new Date());
    const [calendarDisplay, setCalendarDisplay] = useState(true);
    const [startTime, setStartTime] = useState(0);
    const [displayTimetable, setDisplayTimetable] = useState(false);
    const [displayDuration, setDisplayDuration] = useState(false);
    const [durationIndex, setDurationIndex] = useState(2);
    const [result, setResult] = useState(0);
    const { userCredential } = useAuth();
    const [number, setNumber] = useState(0);
    const [reserve, setReserve] = useState(true);
    const month = {
        "0": "January",
        "1": "February",
        "2": "March",
        "3": "April",
        "4": "May",
        "5": "June",
        "6": "July",
        "7": "August",
        "8": "September",
        "9": "October",
        "10": "November",
        "11": "December"
    }
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
    ]
    const duration = [1, 2, 3];
    const handleTime = (index) => {
        console.log(index);
        setStartTime(index);
        setDisplayTimetable(false)
    }
    const handleDuration = (index) => {
        setDisplayDuration(false);
        setDurationIndex(index)
    }
    console.log(id)
    const handleback = () => {
        setSideBar(<></>)
        setDetail(<></>)
        setItemID(null);
    }
    const getDetail = async (id) => {
        const docRef = doc(db, "rental_items", id);
        let querySnapshot = await getDoc(docRef);
        let tempdata = querySnapshot.data();
        setContent(tempdata);
        setOwner(tempdata.rental_owner);
    }
    const ownerDetail = async (owner) => {
        const temp = [];
        const listCollectionRef = collection(db, "users");
        let q = query(listCollectionRef, where("user_email", "==", owner));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(doc.data());
        });
        console.log(temp)
        setOwnerData(temp);
    }
    const handleReserve = () =>{
        setReserve(false);
    }
    const handlefinish = () =>{
        setReserve(true)
    }
    useEffect(() => {
        id && getDetail(id);
    }, [])
    useEffect(() => {
        content && setViewnumber(Number(content["item_views"]) + 1);
    }, [content]);
    useEffect(() => {
        if (viewnumber) {
            const docRef = doc(db, "rental_items", id);
            const newdata = {
                item_views: viewnumber,
            };
            updateDoc(docRef, newdata)
                .then(() => {
                })
                .catch((error) => {
                    console.log(error);
                });

        }
    }, [viewnumber]);
    useEffect(() => {
        console.log(owner)
        owner && ownerDetail(owner);
    }, [owner]);
    const handleLogin = () => {
        handleback();
        setLogin(true);
    }
    useEffect(() => {
        console.log("durationIndex..........", durationIndex)
        content && content.item_charge_rate != "person" && getTotal(Number(durationIndex) + 1);
    }, [durationIndex, content?.item_charge])
    useEffect(() => {
        console.log(value);
        setDate(value);
        setCalendarDisplay(false);
    }, [value]);
    const getTotal = (index) => {
        console.log("gettotal", content.item_charge * 1.35 * index)
        setResult(content.item_charge * 1.35 * index);
    }
    useEffect(() => {
        console.log("durationIndex..........", durationIndex)
        content && content.item_charge_rate == "person" && getTotal(Number(number));

    }, [number, content?.item_charge])
    return (
        <section className="fixed top-0 right-0 z-50 bg-white detail">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer" onClick={handleback}><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" /></div>
            {
                content && <DetailCarousel imgArray={content["item_photos"]} />
            }
            <div className="flex flex-row flex-wrap justify-between pb-12" style={{ borderBottom: "solid 1px #ffffff1a" }}>
                <div className="flex flex-col flex-wrap detailpart">
                    <p className="text-white detailTitle">{content && content["item_name"]}</p>
                    <div className="flex flex-row flex-wrap">
                        <p className="text-white font-15 mb-2.5 flex flex-row justify-center items-center" style={{ borderRight: "solid 1px #ffffff4d", padding: "0px 10px 0px 0px", marginRight: "10px" }}><FontAwesomeIcon icon={faStar} className="mr-2.5 text-sm text-white" />{content && content["item_rating"] + ' - ' + content["item_reviews"].length + " Reviews"}</p>
                        <p className="text-white font-15 mb-2.5" style={{ borderRight: "solid 1px #ffffff4d", padding: "0px 10px 0px 0px", marginRight: "10px" }}>20 mins away</p>
                        <p className="text-white font-15 mb-2.5 flex flex-row justify-center items-center" style={{ borderRight: "solid 0px #ffffff4d", padding: "0px 10px 0px 0px", marginRight: "10px" }}><FontAwesomeIcon icon={faEye} className="mr-2.5 text-sm text-white" />{content && (Number(content["item_views"]) + 1) + " views "}</p>
                    </div>
                    <div className="line"></div>
                    <div className="flex flex-col mb-2.5">
                        <p className="w-full text-white font-15 bold" style={{ marginBottom: "15px" }}>Description</p>
                        {content && content["item_desc"].split("<br>").map((i, index) => {
                            return i.trim() == "" ? <br /> : <p className="text-white font-15" key={index}>{i}</p>
                        })}
                    </div>
                    <div className="line"></div>
                    <div className="flex flex-col mb-2.5">
                        <p className="w-full text-white font-15 bold" style={{ marginBottom: "15px" }}>Reviews {content && "(" + content.item_rating + " | " + content.item_reviews.length + " Reviews)"}</p>
                        <div className="my-5">
                            <DetailReview src={"https://uploads-ssl.webflow.com/5efdc8a4340de947404995b4/638de93ece20b775d2dc039f_6%20Haircut%20Trends%20for%20Late%202021.jpg"} username={"Hannah Loss"} date={"March 2023"} content={"Popped in for a coffee and cake. Coffee and banana bread was great, service was good and the ambience is a lot nicer than many of the other open air cafe's"} />
                            <div className="h-8"></div>
                            <DetailReview src={"https://uploads-ssl.webflow.com/5efdc8a4340de947404995b4/638de93ece20b775d2dc039f_6%20Haircut%20Trends%20for%20Late%202021.jpg"} username={"Hannah Loss"} date={"March 2023"} content={"Popped in for a coffee and cake. Coffee and banana bread was great, service was good and the ambience is a lot nicer than many of the other open air cafe's"} />

                        </div>
                    </div>
                    <div className="line"></div>
                    <div className="flex flex-col mb-2.5">
                        <p className="w-full text-white font-15 bold" style={{ marginBottom: "15px" }}>Item Location</p>
                        <p className="flex flex-row items-center justify-start text-white font-15"><FontAwesomeIcon icon={faLocationDot} className="mr-2.5 text-sm text-white" /> {content && content["item_location"]}</p>
                    </div>
                </div>
                <div className="relative">
                    {
                        reserve? <div className="stickyReserve">
                        <p className="text-lg text-white overflow-ellipsis bold itemname">{content && content["item_name"]}</p>
                        <p className="text-white font-15 mb-2.5">{ownerData && ownerData.length > 0 && ownerData[0]["nick_name"]}</p>
                        {
                            userCredential.email ? <div>
                                <div style={{ marginTop: "10px", marginBottom: "20px", height: "1px", background: "#ffffff1a" }}></div>
                                <div>
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
                                    </div> : <div className="my-2.5">
                                        <p className="font-15 ">Duration</p>
                                        <div className="relative flex flex-row items-center justify-between py-2" style={{ borderBottom: "solid 1px #ffffff1a" }} onClick={() => { setDisplayDuration(true) }}>
                                            <p className="text-white font-15">{content && duration[durationIndex] + " " + content.item_charge_rate}</p>

                                        </div>
                                        {
                                            displayDuration && <div className="flex flex-col bg-white" style={{ background: "#ffffff1a" }}>
                                                {
                                                    duration.map((duration, index) => (
                                                        <p className="w-full px-2 py-1 text-white time" onClick={() => { handleDuration(index) }}>{duration}</p>
                                                    ))
                                                }

                                            </div>
                                        }
                                    </div>
                                }
                                <button className="flex justify-center w-full text-white rounded-lg font-15 bold" style={{ marginTop: "30px", marginBottom: "35px", padding: "15px 10px", background: "#0052cc" }} onClick={()=>{handleReserve()}}>RESERVE</button>
                                <p className="text-white font-15">Total Price</p>
                                <p className="text-white font-18 bold"> $ {result ? result.toFixed(2) : "0.00"} AUD</p>
                                <div className="line" style={{ marginTop: "15px", marginBottom: "24px" }}></div>
                                {
                                    content && content.item_charge_rate != "person" ? <div>
                                        <div className="flex flex-row justify-between my-1">
                                            <p className="text-white font-15">${content && content.item_charge ? Number(content.item_charge).toFixed(2) : 0.00} &times; {duration[durationIndex]} {content && content.item_charge_rate}s</p>
                                            <p className="text-white font-15">${Number(content && Number(content.item_charge) * Number(duration[durationIndex])).toFixed(2)}</p>
                                        </div>
                                        <div className="flex flex-row justify-between my-1">
                                            <p className="text-white font-15">Service Fee</p>
                                            <p className="text-white font-15">${Number(content && Number(content.item_charge) * Number(duration[durationIndex]) * 0.2).toFixed(2)}</p>
                                        </div>
                                        <div className="flex flex-row justify-between my-1">
                                            <p className="text-white font-15">GST</p>
                                            <p className="text-white font-15">${Number(content && Number(content.item_charge) * Number(duration[durationIndex]) * 0.15).toFixed(2)}</p>
                                        </div>
                                    </div> : <div>
                                        <div className="flex flex-row justify-between my-1">
                                            <p className="text-white font-15">${content && content.item_charge ? Number(content.item_charge).toFixed(2) : 0.00} &times; {number} {content && content.item_charge_rate}s</p>
                                            <p className="text-white font-15">${Number(content && Number(content.item_charge) * Number(number)).toFixed(2)}</p>
                                        </div>
                                        <div className="flex flex-row justify-between my-1">
                                            <p className="text-white font-15">Service Fee</p>
                                            <p className="text-white font-15">${Number(content && Number(content.item_charge) * Number(number) * 0.2).toFixed(2)}</p>
                                        </div>
                                        <div className="flex flex-row justify-between my-1">
                                            <p className="text-white font-15">GST</p>
                                            <p className="text-white font-15">${Number(content && Number(content.item_charge) * Number(number) * 0.15).toFixed(2)}</p>
                                        </div>
                                    </div>
                                }
                            </div> : <div>
                                <button className="flex justify-center w-full text-white rounded-lg font-15 bold" style={{ marginBottom: "20px", padding: "15px 10px", background: "#0052cc" }} onClick={handleLogin}>LOGIN TO RESERVE</button>
                                <p className="text-white">Charge Rate</p>
                                <p className="text-white font-18 bold">{content && "$" + Number(content.item_charge).toFixed(2) + "/" + content.item_charge_rate}</p>
                            </div>
                        }


                    </div>:<div className="flex flex-col justify-center w-full stickyReserve">
                            <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: "90px", color: "#47d585" }} className="mx-auto mr-auto text-center" />
                            <p className="text-white font-18 bold my-2.5 text-center">REQUEST SENT</p>
                            <p className="mb-5 text-center text-white font-15">Your request has been submitted, a notification will be sent to you once we get a reply from the owner.</p>
                            <p style={{ padding:"15px 20px", background:"#47d585"}} className="w-full text-center text-black rounded-lg cursor-pointer bold font-15" onClick = {()=>{handlefinish()}}>OK</p>
                    </div>
                    }
                   
                    
                </div>
            </div>

        </section>
    )

}
export default Detail