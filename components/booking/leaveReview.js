import { useAuth } from "../../context/useAuth"
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import SelectStar from "./selectStar";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../lib/initFirebase";
import { collection, addDoc, query, orderBy, where, getDocs, serverTimestamp } from "firebase/firestore";
import LeaveAlert from "./leavealert";
const LeaveReview = ({ booking, customerdata, ownerdata, itemdata, setReviewborder }) => {
    const { userCredential } = useAuth();
    const [leaveRate, setLeaveRate] = useState(null);
    const [star, setStar] = useState(0);
    const [ratingtitle, setRatingtitle] = useState(null);
    const [ratingstars, setRatingstars] = useState(null);
    const [reviewtitle, setReviewtitle] = useState(null);
    const [text, setText] = useState('');
    useEffect(() => {
        userCredential.email && getratingtitle();
        userCredential.email && setreviewtitle();
        // userCredential.email && getRatingstars();
    }, [userCredential?.email]);
    const getratingtitle = () => {
        if (userCredential.email == booking.owner_email) {
            if (!customerdata[0].nick_name) {
                setRatingtitle(<p className="mb-1 text-white font-15">Rate {booking.customer_email}</p>)
            }
            else {
                setRatingtitle(<p className="mb-1 text-white font-15">Rate {customerdata[0].first_name+" "+customerdata[0].last_name}</p>)
            };
        }
        if (userCredential.email == booking.customer_email) {

            setRatingtitle(<p className="mb-1 text-white font-15">Rate {ownerdata[0].nick_name}</p>)

        }
    }
    const setreviewtitle = () => {
        if (userCredential.email == booking.owner_email) {
            if (!customerdata[0].nick_name) {
                setReviewtitle(<p className="my-5 mb-1 text-white font-15">Review {booking.customer_email}</p>)
            }
            else {
                setReviewtitle(<p className="my-5 mb-1 text-white font-15">Review {customerdata[0].first_name+" "+customerdata[0].last_name}</p>)
            };
        }
        if (userCredential.email == booking.customer_email) {

            setRatingtitle(<p className="mb-1 text-white font-15">Review {ownerdata[0].nick_name}</p>)
        }

    }
    useEffect(() => {
        userCredential.email && getRatingstars();
    }, [star]);
    const handleRatingandReview = () => {
        if (userCredential.email == booking.owner_email) {

            if (star != 0 && text != "") {
                const docRef = doc(db, "bookings", booking.booking_id);
                const data = {
                    customer_feedback: text,
                    customer_rating: star,
                };
                updateDoc(docRef, data)
                    .then(() => {
                        setReviewborder(<LeaveAlert booking={booking} setReviewborder={setReviewborder} ownerdata={ownerdata} customerdata={customerdata} />)
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                const notificationRef = collection(db, "notifications");
                addDoc(notificationRef, {
                    to: booking.customer_email,
                    notificationContent: ownerdata[0].nick_name + " has shared experience with you ",
                    show: false,
                    time: serverTimestamp(),
                    status: 4
                }).then(response => {
                }).catch(error => {
                    console.log(error)
                });
            }
        }
        if (userCredential.email == booking.customer_email) {
            if (star != 0 && text != "") {
                const docRef = doc(db, "bookings", booking.booking_id);
                const data = {
                    owner_feedback: text,
                    owner_rating: star,
                };
                updateDoc(docRef, data)
                    .then(() => {
                        setReviewborder(<LeaveAlert booking={booking} setReviewborder={setReviewborder} ownerdata={ownerdata} customerdata={customerdata} />)
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                    const notificationRef = collection(db, "notifications");
                addDoc(notificationRef, {
                    to: booking.owner_email,
                    notificationContent: customerdata[0].first_name+ " " + customerdata[0].last_name + " has shared experience with you ",
                    show: false,
                    time: serverTimestamp(),
                    status: 4
                }).then(response => {
                }).catch(error => {
                    console.log(error)
                });
            }
        }


    }
    const getRatingstars = () => {
        if (star == 0) {
            setRatingstars(<div className="flex flex-row">
                <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(1) }} />
                <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(2) }} />
                <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(3) }} />
                <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(4) }} />
                <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(5) }} />
            </div>)
        }
        if (star == 1) {
            setRatingstars(
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(1) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(2) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(3) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(4) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(5) }} />
                </div>)
        }
        if (star == 2) {
            setRatingstars(
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(1) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white " onClick={() => { setStar(2) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(3) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(4) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(5) }} />
                </div>)
        }
        if (star == 3) {
            setRatingstars(
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(1) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(2) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(3) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(4) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(5) }} />
                </div>)
        }
        if (star == 4) {
            setRatingstars(
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(1) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(2) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(3) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(4) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={() => { setStar(5) }} />
                </div>)
        }
        if (star == 5) {
            setRatingstars(
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(1) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(2) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(3) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(4) }} />
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={() => { setStar(5) }} />
                </div>)
        }
    }
    const handleText = (e) => {
        setText(e.target.value)
    }
    return (
        <div>
            <p className="mb-5 text-white font-18 bold">Leave Review and Rating</p>
            {
                ratingtitle
            }
            {
                ratingstars

            }
            {
                reviewtitle
            }
            <textarea rows="8" className="w-full text-white bg-transparent font-15 my-2.5 mb-2.5 outline-none" onChange={(e) => { handleText(e) }}></textarea>
            <button className="flex items-center justify-center w-full text-white rounded-lg" style={{ height: "45px", background: "#802df5" }} onClick={() => { handleRatingandReview() }}><p className="text-white font-15 bold">SUBMIT REVIEW</p></button>
        </div>
    )

}
export default LeaveReview