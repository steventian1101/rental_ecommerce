import { db } from "../../lib/initFirebase";
import { collection, serverTimestamp, doc, getDoc, updateDoc, deleteField, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Result } from "postcss";
import date from "date-and-time"
import { getMultiFactorResolver } from "firebase/auth";
import Pending from "./pending";
import Ready from "./ready.js";
import Use from "./use";
import Complete from "./complete";
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
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
];
const InboundedBookingCard = ({ booking, inbounded, setSideBar, setLoading}) => {
    const [itemdata, setItemdata] = useState(null);
    const [ownerdata, setOwnerdata] = useState(null);
    const [customerdata, setCustomerdata] = useState(null);
    const [img, setImg] = useState(null);
    const [enddate, setEnddate] = useState(null);
    const [color, setColor] = useState(0);
    const getItemDetail = async (id) => {
        const docRef = doc(db, "rental_items", id);
        let querySnapshot = await getDoc(docRef);
        let tempdata = querySnapshot.data();
        console.log(tempdata)
        setItemdata(tempdata);
    }
    const getCustomerdetail = async (email) => {
        let temp = [];
        const listCollectionRef = collection(db, "users");
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            {
                let img = { "profile_img": "/logo/random_user.png" };
                temp.push(img);
                setCustomerdata(temp);
            }

        } else {
            querySnapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            setCustomerdata(temp);
        }


    }
    const getOwnerdetail = async (email) => {
        console.log("this is the owner email", email)
        let temp = [];
        const listCollectionRef = collection(db, "users");
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot)
        querySnapshot.forEach((doc) => {
            temp.push(doc.data())
        });
        console.log(temp)
        setOwnerdata(temp)
    }

    useEffect(() => {
        setItemdata(null);
        setCustomerdata(null);
        setOwnerdata(null)
        setImg(null);
        setColor(0);
        getItemDetail(booking.item_id);
        getOwnerdetail(booking.owner_email);
        getCustomerdetail(booking.customer_email);
       
    }, [booking.item_id]);
    useEffect(() => {
        if (ownerdata && customerdata) {
            if (inbounded) {
                setImg(customerdata[0].profile_img);
                getColor();
            }
            else {
                console.log(ownerdata[0]["profile_img"]);
                getColor();
            }
        }
    }, [ownerdata, customerdata]);
    useEffect(() => {
        itemdata && getenddate();
    }, [itemdata]);
    const getenddate = () => {
        if (itemdata.item_charge_rate == "hour") {
            const start = (booking.start_date).split(",")[2] + "/" + month[(booking.start_date).split(",")[1]] + "/" + (booking.start_date).split(",")[0] + " " + time[booking.start_time] + ":" + "00 ";
            const duration = Math.abs(booking.result / (1.35 * itemdata.item_charge));
            console.log(duration)
            const end = date.addHours(new Date(start), duration)
            console.log(end);
            setEnddate(end)
            // YYYY/MM/DD HH:mm:ss 
        }
        if (itemdata.item_charge_rate == "day") {
            const start = (booking.start_date).split(",")[2] + "/" + month[(booking.start_date).split(",")[1]] + "/" + (booking.start_date).split(",")[0] + " " + time[booking.start_time] + ":" + "00 ";
            const duration = Math.abs(booking.result / (1.35 * itemdata.item_charge));
            console.log(duration)
            const end = date.addDays(new Date(start), duration)
            console.log(end)
            setEnddate(end)
            // YYYY/MM/DD HH:mm:ss 
        }
        if (itemdata.item_charge_rate == "week") {
            const start = (booking.start_date).split(",")[2] + "/" + month[(booking.start_date).split(",")[1]] + "/" + (booking.start_date).split(",")[0] + " " + time[booking.start_time] + ":" + "00 ";
            const duration = Math.abs(booking.result / (1.35 * itemdata.item_charge));
            console.log(duration)
            const end = date.addDays(new Date(start), duration * 7)
            console.log(end)
            setEnddate(end)
            // YYYY/MM/DD HH:mm:ss 
        }
        if (itemdata.item_charge_rate == "month") {
            const start = (booking.start_date).split(",")[2] + "/" + month[(booking.start_date).split(",")[1]] + "/" + (booking.start_date).split(",")[0] + " " + time[booking.start_time] + ":" + "00 ";
            const duration = Math.abs(booking.result / (1.35 * itemdata.item_charge));
            console.log(duration)
            const end = date.addMonths(new Date(start), duration)
            console.log(end)
            setEnddate(end)
            // YYYY/MM/DD HH:mm:ss 
        }

    }
    const getColor = () => {
        if (booking.status == 0) {
            setColor("#ff9d00")
        }
        if (booking.status == 1) {
            setColor("#29b34c")
        }
        if (booking.status == 2) {
            setColor("#2962ff")
        }
        if (booking.status == 3) {
            setColor("#802df5")
        }
        if (booking.status == 4) {
            setColor("#ff9d00")
        }
    }
    const handleBookingClick = () =>{
        if(booking.status ==0 ){
            setSideBar(<Pending setSideBar={setSideBar} id={ booking.item_id} ownerdata={ownerdata} customerdata={ customerdata} itemdata={itemdata} booking={ booking} setLoading={ setLoading}/>);
        }
        if(booking.status ==1 ){
            setSideBar(<Ready setSideBar={setSideBar} id={ booking.item_id} ownerdata={ownerdata} customerdata={ customerdata} itemdata={itemdata} booking={ booking} setLoading={setLoading}/>);
        }
        if(booking.status ==2 ){
            setSideBar(<Use setSideBar={setSideBar} id={ booking.item_id} ownerdata={ownerdata} customerdata={ customerdata} itemdata={itemdata} booking={ booking} setLoading={setLoading}/>);

        }
        if(booking.status ==3 ){
            setSideBar(<Complete setSideBar={setSideBar} id={ booking.item_id} ownerdata={ownerdata} customerdata={ customerdata} itemdata={itemdata} booking={ booking} setLoading={setLoading}/>);

        }
        if(booking.status ==4 ){

        }
    }


    return (
        ownerdata && customerdata && <div className="booking_card" onClick={()=>{handleBookingClick()}}>
            <div className="flex flex-row items-center justify-between mb-5">
                <div className="flex flex-col w-2/3">
                    <p className="text-white font-20 ellipsis"># {String(booking.booking_id).toUpperCase()}</p>
                    <p className="text-white font-15 bold ellipsis">{itemdata && itemdata.item_name}</p>
                </div>
                <div className="flex flex-row">
                    <div className="w-10 h-10" style={{ background: color, borderRadius: "100px" }}></div>
                    {
                        ownerdata && customerdata && <img src={customerdata[0]["profile_img"]} className="object-cover w-10 h-10 -mx-5" style={{ background: "#e39457", borderRadius: "100px" }} />
                    }

                </div>
            </div>
            <div className="flex flex-col">
                <p className="flex text-white">Start: {(booking.start_date).split(",")[0] + " " + month[(booking.start_date).split(",")[1]] + " " + (booking.start_date).split(",")[2] + " " + time[booking.start_time]}</p>
                {
                    itemdata && itemdata.item_charge_rate == "person" ? <></> : <p className="flex text-white">End: {enddate && enddate.getDate() + " " + month[enddate.getMonth()] + " " + enddate.getFullYear() + " " + String(enddate.getHours()).padStart(2, "0") + ":" + String(enddate.getMinutes()).padStart(2, "0")}</p>
                }
                <p className="flex text-white">Charge: +${booking.result.toFixed(2)}</p>
            </div>
        </div>
    )

}
export default InboundedBookingCard