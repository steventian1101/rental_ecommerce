import { useAuth } from "../../context/useAuth"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
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
const Review = ({booking, ownerdata, customerdata, inbounded}) =>{
    console.log(typeof(inbounded), "here is review", inbounded)
    const [reviewtitle, setReviewtitle] = useState(null);
    const [ratingdiv, setRatingdiv] = useState(null);
    const { userCredential} = useAuth();
    const [feedback, setFeedback] = useState(null);
    const getreviewtitle = () =>{
        if(userCredential.email == booking.owner_email && inbounded == "true" && booking.owner_feedback){
            setReviewtitle(<p className="mb-5 text-white font-18 bold">{ownerdata && ownerdata.length > 0 && ownerdata[0].nick_name}'s Feedback</p>);
        }
        if(userCredential.email == booking.customer_email && inbounded == "false" && booking.customer_feedback){
            setReviewtitle(<p className="mb-5 text-white font-18 bold">{ customerdata[0].nick_name ? ownerdata[0].nick_name:booking.customer_email}'s Feedback</p>);
        }
    }
    const getfeedback = () =>{
        if(userCredential.email == booking.owner_email && inbounded == "true" && booking.owner_feedback){
          
            setFeedback(<div className="w-full"><p className="text-white break-words font-15">{booking.owner_feedback}</p></div>);
        }
        if(userCredential.email == booking.customer_email && inbounded == "false" && booking.customer_feedback){
            setFeedback(<div className="w-full"><p className="text-white break-words font-15">{booking.customer_feedback}</p></div>);
        }

    }
    const getratingstars = () =>{
        if(userCredential.email ==  booking.owner_email && inbounded == "true"){
            if (booking.owner_rating == 0) {
                
                setRatingdiv(<div className="flex flex-row">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                    </div>)
            }
            if (booking.owner_rating == 1) {
                setRatingdiv(
                    <div className="flex flex-row">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                    </div>)
            }
            if (booking.owner_rating == 2) {
                setRatingdiv(
                    <div className="flex flex-row">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white " />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                    </div>)
            }
            if (booking.owner_rating == 3) {
                setRatingdiv(
                    <div className="flex flex-row">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                    </div>)
            }
            if (booking.owner_rating == 4) {
                setRatingdiv(
                    <div className="flex flex-row">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(1)}}/>
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(2)}}/>
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(3)}}/>
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(4)}}/>
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" onClick={()=>{ setStar(5)}}/>
                    </div>)
            }
            if (booking.owner_rating == 5) {
                setRatingdiv(
                    <div className="flex flex-row">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(1)}}/>
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(2)}}/>
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(3)}}/>
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(4)}}/>
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" onClick={()=>{ setStar(5)}}/>
                    </div>)
            }
           }
           if(userCredential.email ==  booking.customer_email && inbounded == "false"){
            if (booking.customer_rating == 0) {
                setRatingdiv(<div className="flex flex-row">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                    </div>)
            }
            if (booking.customer_rating == 1) {
                setRatingdiv(
                    <div className="flex flex-row">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                    </div>)
            }
            if (booking.customer_rating == 2) {
                setRatingdiv(
                    <div className="flex flex-row">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white " />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                    </div>)
            }
            if (booking.customer_rating == 3) {
                setRatingdiv(
                    <div className="flex flex-row">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                    </div>)
            }
            if (booking.customer_rating == 4) {
                setRatingdiv(
                    <div className="flex flex-row">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg borderColor" />
                    </div>)
            }
            if (booking.customer_rating == 5) {
                setRatingdiv(
                    <div className="flex flex-row">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-lg text-white" />
                    </div>)
            }
           }
    }
    useEffect(()=>{
       userCredential.email && getreviewtitle();
       userCredential.email && getratingstars();
       userCredential.email && getfeedback();
    },[]);
    return(
        <div>
            {
                reviewtitle
            }
            <div className="flex flex-row mb-2.5">
                {
                    ratingdiv
                }
                {
                    ratingdiv && <p className="text-white border-l-2 border-gray-600 font-15 px-2.5">{booking.start_date.split(",")[0] + ", " + (booking.start_date).split(",")[2]}</p>
                }

            </div>
           {
                feedback
           }

        </div>
    )

}
export default Review