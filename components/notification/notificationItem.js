import { useEffect, useState } from "react"
import timediff from "timediff";
import Link from "next/link";
import { updateDoc, doc} from "firebase/firestore";
import { db } from "../../lib/initFirebase";
import { useRouter } from "next/router";
const NotificationItem = ({notification}) =>{
    const [background, setBackground] = useState("#ffffff");
    const [time, setTime] = useState(null);
    const router = useRouter();
    useEffect(()=>{
       notification && getTime();
       notification && getBackground();
    },[]);
    const getTime = () =>{
        let notify;
        console.log(notification.time.toDate(), new Date())
        const duration = timediff(new Date(notification.time.toDate()) , new Date,'Hm');
        if(duration.hours == "0"){
             notify = duration.minutes+ " min ";
        }
        else{
             notify = duration.hours + " hours " + duration.minutes+ " min ";
        }
        setTime(notify);
    }
    const getBackground = () =>{
        if(notification.status == "0"){
            setBackground("#d44e4e");
        }
        if(notification.status == "1"){
            setBackground("#e39457");
        }
        if(notification.status == "2"){
            setBackground("#29b34c");
        }
        if(notification.status == "3"){
            setBackground("#2962ff");
        }
        if(notification.status == "4"){
            setBackground("#802df5");
        }
    }
    const handleClick = () =>{
        console.log("I have already showned.")
        const docRef = doc(db, "notifications", notification.objectID);
        const newdata = {
            show: true,
        };
        updateDoc(docRef, newdata)
            .then(() => {
            })
            .catch((error) => {
                console.log(error);
            });
        router.push('/booking');
        window.location.reload();
    }

       return(
        <div className="flex flex-row items-start notificationItem" onClick={handleClick}>
            <div style={{ width:"30px", height:"30px", background:background, borderRadius:"100px", marginRight:"15px"}} className="flex items-center justify-center">
                <img src='/logo/blacklogo.svg' />
            </div>
            <div className="flex flex-col" style={{ width:"255px"}}>
                <p className="text-white" style={{ fontSize:"15px", marginBottom:"5px"}}>{notification && notification.notificationContent}</p>
                <p className="text-white" style={{fontSize:"12px", lingHeight:"15px", opacity:"0.7" }}>Sent {time} ago</p>
            </div>
        </div>
       )
}
export default NotificationItem