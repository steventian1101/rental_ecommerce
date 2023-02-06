import { useState, useEffect } from "react";
import { db } from "../../lib/initFirebase"
import { collection, getDocs, where, query} from "firebase/firestore";
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
const DetailReview = ({ useremail, date, content}) => {
    const [time, setTime] =useState(null);
    const [src, setSrc] = useState(null);
    const [username, setUsername] = useState(null);
    
    useEffect(()=>{
       getDateandTime();
       getUserDetail(useremail);
    },[])
    const getDateandTime = () =>{
        setTime(new Date(date.toDate()))
    }
    const getUserDetail = async (email) =>{
        const temp = [];
        const listCollectionRef = collection(db, "users");
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(doc.data());
        });
        setSrc(temp[0]["profile_img"]);
        setUsername(temp[0]["first_name"] + " " + temp[0]["last_name"])
    }
    return (
        <div className="flex flex-row items-start w-full" style={{ marginBottom:"30px"}}>
            <div className="detailReviewAvatar">
                <img src={src} className="object-cover w-full h-full" style={{ borderRadius: "100px" }} />
            </div>
            <div className="flex flex-col reviewcontent">
                <div className="flex flex-row" style={{ marginBottom: "5px" }}>
                    <p className="bold font-15" style={{ paddingRight: "10px", borderRight: "solid 1px #ffffff1a" }}>{username}</p>
                    <p className=" font-15" style={{ paddingLeft: "10px" }}> {time && month[time.getMonth()] +", " + time.getFullYear()} </p>
                </div>
               <p className="text-white font-15">
              {content}
               </p>
            </div>

        </div>
    )

}
export default DetailReview