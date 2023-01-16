import { useAuth } from "../../context/useAuth"
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import SelectStar from "./selectStar";
const LeaveReview = ({ booking, customerdata, ownerdata, itemdata }) => {
    const { userCredential } = useAuth();
    const [leaveRate, setLeaveRate] = useState(null);
    const [star, setStar] = useState(0);
    const [ratingtitle, setRatingtitle] = useState(null);
    const [ratingstars, setRatingstars] = useState(null);
    console.log("customere data", customerdata)

    useEffect(() => {
        userCredential.email && getratingtitle();
        // userCredential.email && getRatingstars();
    }, [userCredential?.email]);
    const getratingtitle = () => {
        if (userCredential.email == booking.owner_email) {
            if (!customerdata[0].nick_name) {
                setRatingtitle(<p className="mb-1 text-white font-15">Rate {booking.customer_email}</p>)
            }
            else {
                setRatingtitle(<p className="mb-1 text-white font-15">Rate {customerdata[0].nick_name}</p>)
            };
        }
    }
    useEffect(() => {
        userCredential.email && getRatingstars();
    }, [star]);
    const getRatingstars = () => {
        if (star == 0) {
            setRatingstars(
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(1)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(2)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(3)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(4)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(5)}}/>
                </div>)
        }
        if (star == 1) {
            setRatingstars(
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(1)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(2)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(3)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(4)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(5)}}/>
                </div>)
        }
        if (star == 3) {
            setRatingstars(
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(1)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(2)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(3)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(4)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(5)}}/>
                </div>)
        }
        if (star == 4) {
            setRatingstars(
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(1)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(2)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(3)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(4)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(5)}}/>
                </div>)
        }
        if (star == 5) {
            setRatingtars(
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(1)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(2)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(3)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(4)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(5)}}/>
                </div>)
        }
        if (star == 0) {
            setRatingstars(
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(1)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(2)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(3)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(4)}}/>
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(5)}}/>
                </div>)
        }
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

        </div>
    )

}
export default LeaveReview