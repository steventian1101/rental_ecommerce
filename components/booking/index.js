import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import CreateBooking from "./createBooking"
import Pending from "./pending"
import AddPayment from "./addPayment"
import BookingBack from "./sidebarBack"
import { collection, addDoc, query, orderBy, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/initFirebase"
import Loading from "../auth/loading"
import { useAuth } from "../../context/useAuth"
import BookingCard from "./bookingCard"
import InboundedBookingCard from "./inboundedBookingCard"
import { setLazyProp } from "next/dist/server/api-utils"
const Booking = () => {
    const [inbounded, setInbounded] = useState(true);
    const [screenNumber, setScreenNumber] = useState(0);
    const [sideBar, setSideBar] = useState(null);
    const [newBooking, setNewBooking] = useState(null);
    const [newPayment, setNewPayment] = useState(null);
    const [bookings, setBookings] = useState(null);
    const [email, setEmail] = useState(null);
    const [userDetail, setUserDetail] = useState(null)
    
    const [loading, setLoading] = useState(false);
    const { userCredential } = useAuth();
    const handleSidebar = (screenNumber) => {
        if (screenNumber % 5 == 0) {
            setSideBar(null)
        }
        if (screenNumber % 5 == 1) {
            setSideBar(<CreateBooking setScreenNumber={setScreenNumber} setNewBooking={setNewBooking} />)
        }
        if (screenNumber % 5 == 2) {
            setSideBar(<AddPayment setScreenNumber={setScreenNumber} setNewPayment={setNewPayment} />)
        }
    }
    useEffect(() => {
        handleSidebar(screenNumber);
    }, [screenNumber]);
    useEffect(() => {
        newPayment && newBooking && saveBooking();
    }, [newPayment]);
    const saveBooking = () => {
        const listCollectionRef = collection(db, "bookings");
        if (newPayment && newBooking) {
            setLoading(true)
            addDoc(listCollectionRef, { item_id: newBooking.item_id, start_date: newBooking.start_date, start_time: newBooking.start_time, customer_email: newBooking.email, phone_number: newBooking.phone_number, result: newBooking.result, driving_license: newBooking.driving_license, full_name: newPayment.full_name, credit: newPayment.credit, cvv: newPayment.cvv, expireDate: newPayment.expireDate, owner_email:userCredential.email, status:1, createdTime:serverTimestamp()}).then(response => {
                setLoading(false);
                window.location.reload();
            }).catch(error => {
            });
            const notificationRef = collection(db,"notifications");
            addDoc(notificationRef, { 
                to:newBooking.email,
                notificationContent:userDetail[0].nick_name +" has accepted your booking of " + newBooking["item_name"],
                show:false,
                time:serverTimestamp(),
                status:2
            }).then(response => {
            }).catch(error => {
                console.log(error)
            });
        }
    }
    const getallinboundedbooking  = async (email) =>{
        let temp = [];
        const listCollectionRef = collection(db, "bookings");
        let q = query(listCollectionRef, where("owner_email", "==", email), orderBy("status","asc"), orderBy("createdTime","desc"));
        const querysnapshot =  await getDocs(q);
        querysnapshot.forEach((doc)=>{
            var tempobject = Object.assign(doc.data(), { booking_id: doc.id })
            temp.push(tempobject);
     });
        setBookings(temp);
    }
    const getallcilentbooking  = async (email) =>{
        let temp = [];
        const listCollectionRef = collection(db, "bookings");
        let q = query(listCollectionRef, where("customer_email", "==", email), orderBy("status","asc"), orderBy("createdTime","desc"));
        const querysnapshot =  await getDocs(q);
        querysnapshot.forEach((doc)=>{
            var tempobject = Object.assign(doc.data(), { booking_id: doc.id })
            temp.push(tempobject);
        });
        setBookings(temp);
    }
    useEffect(()=>{
          userCredential.email && getUserDetail(userCredential.email)
          userCredential.email && setEmail(userCredential.email)
    },[userCredential?.email]);
    useEffect(()=>{
        setBookings(null);
        email && inbounded && getallinboundedbooking(userCredential.email);
        email && !inbounded && getallcilentbooking(userCredential.email);
    },[email]);
    useEffect(()=>{
        setBookings(null);
        email && inbounded && getallinboundedbooking(userCredential.email);
        email && !inbounded && getallcilentbooking(userCredential.email);
    },[inbounded]);
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
    return (
        <>
            {
                sideBar != null && <BookingBack setSideBar={setSideBar}/>
            }
            {
                sideBar
            }
            {
                loading?<Loading/>:<></>
            }
            <section className="booking">
                <div className="flex flex-row items-center justify-between" style={{ marginBottom: "30px" }}>
                    <div className="flex flex-col mb-2.5">
                        <p className="loginText settingTitle">YOUR BOOKINGS</p>
                        <p className="loginDetail" style={{ marginBottom: "0px" }}>Keep smashing at it.</p>
                    </div>
                    <button className="flex flex-row bookingbutton" onClick={() => { setScreenNumber(1) }}>
                        <FontAwesomeIcon icon={faPlus} className="text-lg text-white mr-2.5 icon" />
                        <p className="text-white font-15">Create Booking</p>
                    </button>
                </div>
                <div className="flex flex-row mb-10 bookingtab">
                    <p className="text-white font-15" style={{ borderBottom: inbounded ? "solid 1px white" : "solid 1px transparent", color: inbounded ? "white" : "#ffffff4d" }} onClick={() => { setInbounded(true) }}>Inbounded Bookings</p>
                    <p className="text-white font-15" style={{ borderBottom: inbounded ? "solid 1px transparent" : "solid 1px white", color: inbounded ? "#ffffff4d" : "white" }} onClick={() => { setInbounded(false) }}>Your Bookings</p>
                </div>
                <div className="flex flex-row flex-wrap w-full">
                   {
                    inbounded? bookings && bookings.length > 0 && bookings.map((booking, index)=>(<InboundedBookingCard booking={booking} key={index} inbounded = {inbounded} setSideBar={ setSideBar} setLoading={setLoading}/>)):bookings && bookings.length > 0 && bookings.map((booking, index)=>(<BookingCard booking={booking} key={index} inbounded = {inbounded} setSideBar={setSideBar} setLoading={ setLoading}/>))
                   }
                </div>
            </section>
        </>
    )

}
export default Booking