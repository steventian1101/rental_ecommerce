import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { db } from "../../lib/initFirebase"
import { updateDoc, doc, getDoc, collection, getDocs, where, query, addDoc, serverTimestamp, limit } from "firebase/firestore";
import { useState, useEffect } from "react";
import DetailCarousel from "./detailCarousel";
import DetailReview from "./detailReview";
import Calendar from 'react-calendar';
import { useAuth } from "../../context/useAuth";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { getdisabledates } from "../../utils/getdisabledates";
import Itemcard from "./itemcard";
import { useRef } from "react";
import MobileReserve from "./mobileReserve";
import InputDurationForDesktop from "./inputDurationForDesktop";
import InputDurationForMobile from "./inputDurationForMobile";
import MobileSuccessNotification from "./mobileSuccessNotification";
import getRatingAndReviewNumbers from "../../utils/getRatingAndReviewsNumber";
import { getRatingAndReviewNumbersForOwner } from "../../utils/getRatingAndReviewsNumber";
import date from "date-and-time"
import { getFunctions, httpsCallable } from "firebase/functions";
import { useRouter } from "next/router";
import addSubtractDate from "add-subtract-date"

const Detail = ({ id }) => {
    const [content, setContent] = useState(null);
    const [viewnumber, setViewnumber] = useState(null);
    const [owner, setOwner] = useState(null);
    const [ownerData, setOwnerData] = useState(null);
    const [value, setValue] = useState(null);
    const [disabledDates, setDisabledates] = useState([new Date()]);
    const [startdate, setStartDate] = useState(null);
    const [enddate, setEnddate] = useState(new Date());
    const [calendarDisplay, setCalendarDisplay] = useState(true);
    const [startTime, setStartTime] = useState(0);
    const [displayTimetable, setDisplayTimetable] = useState(false);
    const [displayDuration, setDisplayDuration] = useState(false);
    const [durationIndex, setDurationIndex] = useState(1);
    const [result, setResult] = useState(0);
    const { userCredential, authenticated } = useAuth();
    const [number, setNumber] = useState(0);
    const [reserve, setReserve] = useState(true);
    const [userDetail, setUserDetail] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [similarData, setSimilarData] = useState(null);
    const [updateMobileSideBar, setUpdateMobileSidebar] = useState(false);
    const [tempDuration, setTempDuration] = useState(null)
    const detailRef = useRef();
    const [reviewNumbers, setReviewNumbers] = useState(null);
    const [ownerReview, setOwnerReview] = useState(null);
    const [firstTime, setFirstTime] = useState(0);
    const [duration, setDuration] = useState(null);
    const router = useRouter();
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
    ]
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
    const handleTime = (index) => {
        setStartTime(index);
        setDisplayTimetable(false)
    }
    const handleDuration = (index) => {
        setDurationIndex(index)
    }
    const getDetail = async (id) => {
        const docRef = doc(db, "rental_items", id);
        let querySnapshot = await getDoc(docRef);
        let tempdata = querySnapshot.data();
        setContent(tempdata);
        setOwner(tempdata.rental_owner);
        getDuration(tempdata.item_location)
    }
    const getDuration = (location) =>{
            let key = JSON.stringify(location);
            let address = localStorage.getItem(key);
            if(address){
                setDuration(address)
            }
    }
    const ownerDetail = async (owner) => {
        const temp = [];
        const listCollectionRef = collection(db, "users");
        let q = query(listCollectionRef, where("user_email", "==", owner));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(doc.data());
        });
        setOwnerData(temp);
    }
    const getReviews = async (id) => {
        const temp = [];
        const listCollectionRef = collection(db, "bookings");
        let q = query(listCollectionRef, where("item_id", "==", id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let tempdata = doc.data();
            if (tempdata["owner_feedback"]) {
                temp.push(tempdata);
            }
        });
        setReviews(temp);
    }
    const getUserDetail = async (email) => {
        const temp = [];
        const listCollectionRef = collection(db, "users");
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(doc.data());
        });
        setUserDetail(temp);

    }
    const handleReserve = async () => {

        if (result != 0) {
            const notificationRef = collection(db, "notifications");
            const listCollectionRef = collection(db, "bookings")
            addDoc(listCollectionRef, { item_id: id, start_date: month[Number(startdate.getMonth())] + "," + startdate.getDate() + "," + startdate.getFullYear(), start_time: startTime, customer_email: userCredential.email, phone_number: userDetail[0].user_phone, result: result, driving_license: "", full_name: userDetail[0].full_name, credit: userDetail[0].credit_card_number, cvv: userDetail[0].cvv, expireDate: userDetail[0].expire_date, owner_email: content.rental_owner, status: 0, createdTime: serverTimestamp() }).then(response => {
                addDoc(notificationRef, {
                    to: ownerData[0].user_email,
                    notificationContent: userDetail[0].first_name + " " + userDetail[0].last_name + " has requested to rent your " + content["item_name"],
                    show: false,
                    time: serverTimestamp(),
                    status: 0,
                    bookingId:response.id,
                    inbounded:true
                }).then(response => {
                }).catch(error => {
                    console.log(error)
                });
                setReserve(false);
            }).catch(error => {
            });
        }
    }
    const handlefinish = () => {
        content && getdisabledates(id, content)
            .then((data) => {
                setDisabledates(data)
            })
        setReserve(true)
    }
    useEffect(()=>{
         setUserDetail(null)
    },[])
    useEffect(() => {
        detailRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        setUserDetail(null);
        setContent(null);
        setOwner(null);
        setStartDate(null);
        setFirstTime(null);
        setEnddate(null);
        setDurationIndex(1);
        id && getDetail(id);
        id && getReviews(id);
        userCredential.email && getUserDetail(userCredential.email);
        id && getRatingAndReviewNumbers(id).then((result) => {
            setReviewNumbers(result)
        });
    }, [id, userCredential.email])
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
        owner && ownerDetail(owner);
    }, [owner]);
    useEffect(() => {
        content && getTotal(Number(durationIndex));
    }, [durationIndex, content?.item_charge])
    useEffect(() => {
        content && getenddate(content.item_charge_rate, durationIndex);
    }, [startdate, durationIndex])
    useEffect(() => {
        setStartDate(value);
        setCalendarDisplay(false);
    }, [value]);
    const getTotal = (index) => {
        setResult(content.item_charge * 1.35 * index);
    }
    useEffect(() => {
        content && getdisabledates(id, content)
            .then((data) => {
                setDisabledates(data)
            })
    }, [content]);
    useEffect(()=>{
             disabledDates && getStart(disabledDates);      
    },[disabledDates]);
    const getStart = (disabledDates) =>{ 
        const datesToday = disabledDates.map((disabledate) => {
            return disabledate.getFullYear() == new Date().getFullYear() && disabledate.getMonth() == new Date().getMonth() && disabledate.getDate() == new Date().getDate() ;
        });
        const sum = datesToday.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        if(!sum){
            setStartDate(new Date());
            setStartTime(new Date().getHours()+1);
            setFirstTime(new Date().getHours()+1);
        }
        if(sum){
            for (let i = 1; i < 300; i++) { // up to 30 days from today
                const candidateDate = date.addDays(new Date(),i);
                if (!disabledDates.some(disabledDate => disabledDate.getFullYear() === candidateDate.getFullYear() && disabledDate.getMonth() === candidateDate.getMonth() && disabledDate.getDate() === candidateDate.getDate())) {
                  setStartDate(candidateDate)
                  break;
                }
        }
            // setStartDate(null)
            // let check = false;
            // let i = 1;
            // while(check){
            //     const newdate = date.addDays(new Date(),i);
            //     i++;
            //     if(i == 10) {
            //         check = true;
            //         console.log(newdate)
            //     }
            // }
            
        }
    }
    const handleDisableDates = ({ date, view }) => {
        if (view === 'month' && disabledDates && disabledDates.length > 0) {
            return disabledDates.some(disabledDate =>
                (date.getFullYear() === disabledDate.getFullYear() &&
                    date.getMonth() === disabledDate.getMonth() &&
                    date.getDate() === disabledDate.getDate()) || date < addSubtractDate.subtract(new Date(), 1, "day")
                    )
                }
        if(view === 'month' && disabledDates.length == 0){
            return  date < addSubtractDate.subtract(new Date(), 1, "day")
        }
    }
    useEffect(() => {
        ownerData && getSimilarItems(ownerData[0]["user_email"]);
        ownerData && getRatingAndReviewNumbersForOwner(ownerData[0]["user_email"]).then((result) => {
            setOwnerReview(result)
        })
    }, [ownerData]);
    const getSimilarItems = async (email) => {
        let temp = [];
        const listCollectionRef = collection(db, 'rental_items');
        let q = query(listCollectionRef, where("rental_owner", "==", email), limit(20));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            var tempobject = Object.assign(doc.data(), { objectID: doc.id })
            temp.push(tempobject);
        });
        setSimilarData(temp);
    }
    const handleUpdateSidebar = () => {
        setTempDuration(null);
        setUpdateMobileSidebar(true)
    }
    const getenddate = (type, duration) => {
        if(!startdate){
            return;
        }
        const start_time = new Date(startdate.getDate() + " " + month[`${startdate.getMonth()}`] + ", " + startdate.getFullYear() + " " + time[startTime]);
        if (type == "hour") {
            let temp = date.addHours(new Date(start_time), Number(duration));
            setEnddate(temp)
        }
        if (type == "day") {
            let temp = date.addDays(new Date(start_time), Number(duration));
            setEnddate(temp)
        }
        if (type == "week") {
            let temp = date.addDays(new Date(start_time), Number(duration) * 7);
            setEnddate(temp)
        }
        if (type == "month") {
            let temp = date.addMonths(new Date(start_time), Number(duration));
            setEnddate(temp)
        }
        if (type == "person") {
            setEnddate(new Date(start_time))
        }
    }
    const handleback = () => {
        if (typeof window !== "undefined" && "localStorage" in window && localStorage.getItem("searchText")) {
            let url = "/?query=" + localStorage.getItem("searchText");
            router.push(url);
        }
        else {
            router.push("/");
        }
    }
    const handleLogin = () => {
        let url = router.asPath
        localStorage.setItem("loginNextUrl", url);
        router.push("/login");
    }
    const handlePayment = () => {
        let url = router.asPath;
        localStorage.setItem("beforeAddPayment", url);
        router.push("/setting/payment");
    }
    return (
        <section className="fixed top-0 right-0 z-50 bg-white detail" ref={detailRef}>
            <div className="relative">
                <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => { handleback() }} /></div>
                {
                    content ? <DetailCarousel imgArray={content["item_photos"]} id={id} />:<div className="w-full rounded-lg h-72 carousel sidebar-loading"></div>
                }
                <div className="flex flex-row flex-wrap justify-between pb-12" style={{ borderBottom: "solid 1px #ffffff1a" }}>
                    <div className="flex flex-col flex-wrap detailpart">
                        {
                            content ? <p className="text-white detailTitle">{content["item_name"]}</p>:<div className="h-8 w-72 sidebar-loading detailTitle" style={{ marginBottom:"15px"}}></div>
                        }
                        <div className="flex flex-row flex-wrap">
                            <p className="text-white font-15 mb-2.5 flex flex-row justify-center items-center" style={{ borderRight: "solid 1px #ffffff4d", padding: "0px 10px 0px 0px", marginRight: "10px" }}><FontAwesomeIcon icon={faStar} className="mr-2.5 text-sm text-white" />{reviewNumbers && reviewNumbers.reviewNumber != "0" ? reviewNumbers["rating"] + ' - ' + reviewNumbers["reviewNumber"] + " Reviews" : "0.0 - 0 Reviews"}</p>
                            <p className="text-white font-15 mb-2.5" style={{ borderRight: "solid 1px #ffffff4d", padding: "0px 10px 0px 0px", marginRight: "10px" }}>{duration ? duration: "Not working"}</p>
                            {
                                content ? <p className="text-white font-15 mb-2.5 flex flex-row justify-center items-center" style={{ borderRight: "solid 0px #ffffff4d", padding: "0px 10px 0px 0px", marginRight: "10px" }}><FontAwesomeIcon icon={faEye} className="mr-2.5 text-sm text-white" />{(Number(content["item_views"]) + 1) + " views "}</p>:<div style={{borderRight: "solid 0px #ffffff4d", padding: "0px 10px 0px 0px", marginRight: "10px"
                                }} className="w-24 h-5 sidebar-loading"></div>
                            }
                            {/* <p className="text-white font-15 mb-2.5 flex flex-row justify-center items-center" style={{ borderRight: "solid 0px #ffffff4d", padding: "0px 10px 0px 0px", marginRight: "10px" }}><FontAwesomeIcon icon={faEye} className="mr-2.5 text-sm text-white" />{(Number(content["item_views"]) + 1) + " views "}</p> */}
                        </div>
                        <div className="line"></div>
                        <div className="flex flex-col mb-2.5">
                            <p className="w-full text-white font-15 bold" style={{ marginBottom: "15px" }}>Description</p>
                            {content ? content["item_desc"].split("<br>").map((i, index) => {
                                return i.trim() == "" ? <br /> : <p className="text-white font-15" key={index}>{i}</p>
                            }): [...Array(6)].map((_, index) => (
                                <div className = "w-full h-5 mb-2 sidebar-loading" key={index} ></div>
                              ))}
                        </div>
                        <div className="line"></div>
                        {
                            reviewNumbers && reviewNumbers.reviewNumber != 0 && <><div className="flex flex-col mb-2.5">
                                <p className="w-full text-white font-15 bold" style={{ marginBottom: "15px" }}>Reviews  <span className="text-white font-15">{
                                    "(" + reviewNumbers.rating + " Star  |  " + reviewNumbers.reviewNumber + " Reviews)"
                                }</span></p>
                                <div className="my-5">
                                    {
                                        reviews && reviews.length > 0 && reviews.map((review, index) => (
                                            review.owner_feedback && <DetailReview useremail={review.customer_email} date={review["createdTime"]} content={review["owner_feedback"]} />
                                        ))
                                    }
                                </div>
                            </div>
                                <div className="line"></div></>
                        }
                        <div className="flex flex-col mb-2.5">
                            <p className="w-full text-white font-15 bold" style={{ marginBottom: "15px" }}>Item Location</p>
                            {
                                content ? <p className="flex flex-row items-center justify-start text-white font-15"><FontAwesomeIcon icon={faLocationDot} className="mr-2.5 text-sm text-white" /> {content["item_location"]}</p>:<div className="w-full h-5 sidebar-loading"></div>
                            }
                        </div>
                    </div>
                    <div className="relative reservepan">
                        {
                            reserve ? <div className="stickyReserve">
                                <p className="text-lg text-white overflow-ellipsis bold itemname">{content && content["item_name"]}</p>
                                <Link href={`/rentalOwner?id=${ownerData && ownerData.length > 0 && ownerData[0]["nick_name"]}`}><p className="text-white font-15 mb-2.5 underline">{ownerData && ownerData.length > 0 && ownerData[0]["nick_name"]}</p></Link>
                                {
                                    userCredential.email ? <div>
                                        <div style={{ marginTop: "10px", marginBottom: "20px", height: "1px", background: "#ffffff1a" }}></div>
                                        <div>
                                            <p className="font-15">Start Date</p>
                                            <div className="relative flex flex-row items-center justify-between py-2" style={{ borderBottom: "solid 1px #ffffff1a" }} onClick={() => { setCalendarDisplay(true) }}>
                                                {/* <p className="text-white font-15">{startdate && startdate.getDate() + " " + month[`${startdate.getMonth()}`] + ", " + startdate.getFullYear()}</p> */}
                                                {
                                                    startdate ? <p className="text-white font-15">{startdate.getDate() + " " + month[`${startdate.getMonth()}`] + ", " + startdate.getFullYear()}</p>:<div className="w-48 h-6 sidebar-loading"></div>
                                                }
                                                <FontAwesomeIcon icon={faCalendar} className="text-lg text-white" />
                                            </div>
                                            {
                                                calendarDisplay && <div className="w-full top-8 ">
                                                    <Calendar onChange={setValue} value={value} tileDisabled={handleDisableDates} defaultActiveStartDate={new Date()} />
                                                </div>
                                            }
                                        </div>
                                        <div className="my-2.5">
                                            <p className="font-15 ">Start Time</p>
                                            <div className="relative flex flex-row items-center justify-between py-2" style={{ borderBottom: "solid 1px #ffffff1a" }} onClick={() => { setDisplayTimetable(true) }}>
                                                {
                                                    startdate ?  <p className="text-white font-15">{time[startTime]}</p>:<div className="w-48 h-6 sidebar-loading"></div>
                                                }
                                                <FontAwesomeIcon icon={faClock} className="text-lg text-white" />
                                            </div>
                                            {
                                                displayTimetable && <div className="flex flex-col bg-white" style={{ background: "#ffffff1a" }}>
                                                    {
                                                        time.map((time, index) => (
                                                          index+1 > firstTime && <p className="w-full px-2 py-1 text-white time" onClick={() => { handleTime(index) }} key={index}>{time}</p>
                                                        ))
                                                    }

                                                </div>
                                            }
                                        </div>

                                        {
                                            tempDuration ? <div className="my-2.5">
                                                {content && content.item_charge_rate == "person" ? <p className="font-15 ">Members</p> : <p className="font-15 ">Duration</p>}
                                                <InputDurationForDesktop first={tempDuration} handleDuration={handleDuration} setDurationIndex={setDurationIndex} />
                                            </div> : <div className="my-2.5">
                                                {content && content.item_charge_rate == "person" ? <p className="font-15 ">Members</p> : <p className="font-15 ">Duration</p>}
                                                <InputDurationForMobile first={durationIndex} handleDuration={handleDuration} setDurationIndex={setDurationIndex} />
                                            </div>
                                        }
                                        {
                                            userDetail && userDetail.length > 0 && userDetail[0]["credit_card_number"] ? <button className="flex justify-center w-full text-white rounded-lg font-15 bold" style={{ marginTop: "30px", marginBottom: "35px", padding: "15px 10px", background: "#0052cc" }} onClick={() => { handleReserve() }}>RESERVE</button> : <button className="flex justify-center w-full text-white rounded-lg font-15 bold" style={{ marginTop: "30px", marginBottom: "35px", padding: "15px 10px", background: "#b02b4a" }} onClick={() => { handlePayment() }}>PAYMENT REQUIRE</button>
                                        }
                                        <p className="text-white font-15">Total Price</p>
                                        <p className="text-white font-18 bold"> $ {result ? result.toFixed(2) : "0.00"} AUD</p>
                                        <div className="line" style={{ marginTop: "15px", marginBottom: "24px" }}></div>
                                        {
                                            content && content.item_charge_rate != "person" ? <div>
                                                <div className="flex flex-row justify-between my-1">
                                                    <p className="text-white font-15">${content && content.item_charge ? Number(content.item_charge).toFixed(2) : 0.00} &times; {durationIndex} {content && content.item_charge_rate}s</p>
                                                    <p className="text-white font-15">${content && (Number(content.item_charge) * Number(durationIndex)).toFixed(2)}</p>
                                                </div>
                                                <div className="flex flex-row justify-between my-1">
                                                    <p className="text-white font-15">Service Fee</p>
                                                    <p className="text-white font-15">${content && (Number(content.item_charge) * Number(durationIndex) * 0.2).toFixed(2)}</p>
                                                </div>
                                                <div className="flex flex-row justify-between my-1">
                                                    <p className="text-white font-15">GST</p>
                                                    <p className="text-white font-15">${content && (Number(content.item_charge) * Number(durationIndex * 0.15)).toFixed(2)}</p>
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
                                        <button className="flex justify-center w-full text-white rounded-lg font-15 bold" style={{ marginBottom: "20px", padding: "15px 10px", background: "#0052cc" }} onClick={() => { handleLogin() }}>LOGIN TO RESERVE</button>
                                        <p className="text-white">Charge Rate</p>
                                        <p className="text-white font-18 bold">{content && "$" + Number(content.item_charge).toFixed(2) + "/" + content.item_charge_rate}</p>
                                    </div>
                                }


                            </div> : <div className="flex flex-col justify-center w-full stickyReserve">
                                <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: "90px", color: "#47d585" }} className="mx-auto mr-auto text-center" />
                                <p className="text-white font-18 bold my-2.5 text-center">REQUEST SENT</p>
                                <p className="mb-5 text-center text-white font-15">Your request has been submitted, a notification will be sent to you once we get a reply from the owner.</p>
                                <p style={{ padding: "15px 20px", background: "#47d585" }} className="w-full text-center text-black rounded-lg cursor-pointer bold font-15" onClick={() => { handlefinish() }}>OK</p>
                            </div>
                        }


                    </div>
                </div>
                <div className="flex flex-col w-full" style={{ marginTop: "45px" }}>
                    <div className="flex flex-row items-center" style={{ marginBottom: "30px" }}>
                        <div className="flex">
                            {
                                ownerData && ownerData.length > 0 ?<img src={ownerData && ownerData[0]["profile_img"]} style={{ height: "50px", width: "50px", marginRight: "15px", borderRadius: "100px" }} className="object-cover " />:<div style={{ height: "50px", width: "50px", marginRight: "15px", borderRadius: "100px" }} className="sidebar-loading"></div>
                            }
                            {/* <img src={ownerData && ownerData[0]["profile_img"]} style={{ height: "50px", width: "50px", marginRight: "15px", borderRadius: "100px" }} className="object-cover " /> */}
                        </div>
                        <div className="flex flex-col">
                            {
                                ownerData && ownerData.length > 0 ? <Link href={`/rentalOwner?id=${ownerData && ownerData.length > 0 && ownerData[0]["nick_name"]}`}><p className="text-white underline font-18 bold">{ownerData && ownerData[0].nick_name}</p></Link>:<div className="w-56 h-6 mb-2 sidebar-loading"></div>
                            }
                            <p className="text-white">4.97 Google Ratings (52)</p>
                        </div>
                    </div>
                    <div className="flex flex-row flex-wrap">
                        {
                            similarData && similarData.length > 0 && similarData.map((hit, index) => (
                                <Itemcard details={hit} key={index} />
                            ))
                        }
                    </div>
                </div>
                <div className="fixed bottom-0 left-0 flex items-center justify-between w-full h-20 bg-black detailsticky" style={{ zIndex: "10002" }}>
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center" onClick={() => { handleUpdateSidebar() }}>
                            {
                                startdate && enddate ?  <p className="flex flex-row items-center text-white underline bg-black cursor-pointer font-14">{startdate && startdate.getDate() + " " + month[startdate.getMonth()] + "-" + enddate.getDate() + " " + month[enddate.getMonth()]}</p>:<div className="h-5 detail-loading w-36"></div>
                            }
                           
                            <FontAwesomeIcon icon={faPencil} className="text-base text-white" style={{ marginLeft: "7px" }} />
                        </div>
                        <p className="font-15 bold">${result && Number(result).toFixed(2)} Total</p>
                    </div>
                    {
                        userCredential.email ? <div>
                            {
                                userDetail && userDetail.length > 0 && userDetail[0]["credit_card_number"] ? <button className="detailstickybutton" onClick={() => { handleReserve() }}><p className="text-white font-15 bold">RESERVE</p></button> : <button className="detailstickybutton" style={{ background: "#b02b4a" }} onClick={() => { handlePayment() }}><p className="text-white font-15 bold paymentRequire">PAYMENT</p></button>
                            }</div> : <button className="detailstickybutton" onClick={handleLogin}><p className="text-white font-15 bold">LOGIN</p></button>
                    }
                </div>
                {
                    updateMobileSideBar && <MobileReserve content={content} ownerData={ownerData} date={startdate} startTime={startTime} durationIndex={durationIndex} setUpdateMobileSidebar={setUpdateMobileSidebar} value={value} setValue={setValue} disabledDates={disabledDates} setDate={setStartDate} setDurationIndex={setDurationIndex} setStartTime={setStartTime} tempDuration={tempDuration} setTempDuration={setTempDuration} firstTime={ firstTime}/>
                }
                {
                    !reserve ? <MobileSuccessNotification handlefinish={handlefinish} /> : <></>
                }
            </div>
        </section>
    )

}
export default Detail