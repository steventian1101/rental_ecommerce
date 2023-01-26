import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/useAuth";
import DetailCarousel from "../home/detailCarousel";
import { useState, useEffect } from "react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import LeaveReview from "./leaveReview";
import Review from "./review";
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
};
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
const Complete = ({ setSideBar, id, ownerdata, customerdata, itemdata, booking }) => {
    const [groupbuttons, setGroupbuttons] = useState(false);
    const { userCredential } = useAuth();
    const [reviewborder, setReviewBorder] = useState(null);
    useEffect(() => {
        userCredential.email && selectButtons();
        userCredential.email && setreviewborder();
    }, []);
    const selectButtons = () => {
        if (userCredential.email == booking.owner_email) {
            setGroupbuttons(true);
        }
        else {
            setGroupbuttons(false);
        }
    }
    const setreviewborder = () => {
        if (userCredential.email == booking.owner_email) {
            if (booking.customer_feedback) {
                setReviewBorder(<>
                    <Review booking={booking} ownerdata={ownerdata} customerdata={customerdata} itemdata={itemdata} />
                    <div className="line"></div>
                    
                   </>);
            }
            else {
                setReviewBorder(<>
                    <LeaveReview booking={booking} ownerdata={ownerdata} customerdata={customerdata} itemdata={itemdata} setReviewborder={setReviewBorder}/>
                    <div className="line"></div>
                </>)
            }
        }
        if (userCredential.email == booking.customer_email) {
            if (booking.owner_feedback) {
                setReviewBorder(<>
                    <Review booking={booking} ownerdata={ownerdata} customerdata={customerdata} itemdata={itemdata} />
                    <div className="line"></div>
                   </>);
            }
            else {
                setReviewBorder(<>
                    <LeaveReview booking={booking} ownerdata={ownerdata} customerdata={customerdata} itemdata={itemdata} setReviewborder={setReviewBorder}/>
                    <div className="line"></div>
                </>)
            }
        }
    }
    return (
        <section className="overflow-auto bookingpending">
            <div style={{ height: "50px"}} className="flex flex-row  cursor-pointer mb-2.5 justify-between items-center"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => { setSideBar(null) }} /><div className="flex items-center justify-center w-10 h-10" style={{ borderRadius: "100px", border: "solid 1px white" }}><FontAwesomeIcon icon={faPencil} className="text-lg text-white" /></div></div>
            <p className="loginText complete">BOOKING COMPLETE</p>
            <p className="mb-10 loginDetail ellipsis">Booking Number: <span className="font-15 bold">{booking["booking_id"].toUpperCase()}</span></p>
            <div className="relative">
                <DetailCarousel imgArray={itemdata["item_photos"]} />
            </div>
            <div className="line"></div>
            {
                reviewborder
            }
            <div>
                <p className="mb-5 text-white font-18 bold">General Info</p>
                <div style={{ marginBottom: "15px" }}>
                    <p className="text-white font-15">Item Requested</p>
                    <p className="text-white underline font-15 ellipsis">{itemdata.item_name}</p>
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <p className="text-white font-15">Start Date & Time</p>
                    <p className="text-white font-15 ellipsis">{(booking.start_date).split(",")[0] + " " + (booking.start_date).split(",")[1]+ ", " + (booking.start_date).split(",")[2] + " " + time[booking.start_time]}</p>
                </div>
                {
                    itemdata.item_charge_rate == "person" ? <div style={{ marginBottom: "15px" }}>
                        <p className="text-white font-15">Members</p>
                        <p className="text-white font-15 ellipsis">{Math.abs(booking.result / (itemdata.item_charge * 1.35))}</p>
                    </div> : <div style={{ marginBottom: "15px" }}>
                        <p className="text-white font-15">Duration</p>
                        <p className="text-white font-15 ellipsis">{Math.abs(booking.result / (itemdata.item_charge * 1.35)) + " " + itemdata.item_charge_rate}</p>
                    </div>
                }
            </div>
            <div className="line"></div>
            <div>
                <p className="mb-5 text-white font-18 bold">Customer's Info</p>
                {
                    customerdata && customerdata[0].nick_name ? <div style={{ marginBottom: "15px" }} className="flex flex-row items-center justify-between"><div className="flex flex-col">
                        <p className="text-white font-15">Customer's Name</p>
                        <p className="text-white underline font-15 ellipsis">{customerdata[0].nick_name}</p></div><div className="flex items-center justify-center w-10 h-10" style={{ border: "solid 1px #ffffff4a", borderRadius: "100px" }}><FontAwesomeIcon icon={faCommentDots} className="text-white text-md" /></div>
                    </div> : <div style={{ marginBottom: "15px" }} className="flex flex-row items-center justify-between"><div className="flex flex-col">
                        <p className="text-white font-15">Customer's Email</p>
                        <p className="text-white underline font-15 ellipsis">{booking.customer_email}</p></div><div className="flex items-center justify-center w-10 h-10" style={{ border: "solid 1px #ffffff4a", borderRadius: "100px" }}><FontAwesomeIcon icon={faCommentDots} className="text-white text-md" /></div>
                    </div>
                }
                <div style={{ marginBottom: "15px" }}>
                    <p className="text-white font-15">Customer's Phone Number:</p>
                    <p className="text-white font-15 ellipsis">{booking.phone_number}</p>
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <p className="text-white font-15">Item Address:</p>
                    <p className="text-white font-15 ellipsis">{itemdata.item_location}</p>
                </div>

            </div>
            <div className="line"></div>
            <div>
                <p className="mb-5 text-white font-18 bold">Customer's Info</p>
                <div style={{ marginBottom: "15px" }}>
                    <p className="text-white font-15">Total Charge:</p>
                    <p className="font-20" style={{ color: "#e39457", marginBottom: "30px" }}>${Number(booking.result).toFixed(2)} AUD</p>
                    <div className="flex flex-row justify-between marginTop-5">
                        <p className="text-white ">${Number(itemdata.item_charge).toFixed(2)} &times; {Math.abs(booking.result / (1.35 * itemdata.item_charge))} {itemdata.item_charge_rate}</p>
                        <p className="text-white ">${Number(booking.result / 1.35).toFixed(2)}</p>
                    </div>
                    <div className="flex flex-row justify-between marginTop-5">
                        <p className="text-white">Service Fee</p>
                        <p className="text-white">${Number((booking.result / 1.35) * 0.2).toFixed(2)}</p>
                    </div>
                    <div className="flex flex-row justify-between marginTop-5">
                        <p className="text-white">GST</p>
                        <p className="text-white">${Number((booking.result / 1.35) * 0.15).toFixed(2)}</p>
                    </div>
                </div>

            </div>
        </section>
    )

}
export default Complete