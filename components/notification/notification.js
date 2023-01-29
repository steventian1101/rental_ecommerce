import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import NotificationItem from "./notificationItem"
import { db } from "../../lib/initFirebase"
import { updateDoc, doc, getDoc, collection, getDocs, where, query, addDoc, serverTimestamp, limit, orderBy } from "firebase/firestore";
import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import timediff from "timediff";
import Link from "next/link";

const Notification = ({sideBar, setSideBar}) => {
    const [notifications, setNotifications] = useState(null);
    const { userCredential } = useAuth();
    const listCollectionRef =  collection(db, 'notifications');
    
        useEffect(()=>{
            getNotification(userCredential.email);
        },[]);
        const getNotification = async (email) =>{
            const temp = [];
            let q  = query(listCollectionRef, where("to", "==", email), where("show","==",false), orderBy("time","desc"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc)=>{
                temp.push(doc.data())
            })
            console.log(temp);
            setNotifications(temp);
        }

    return (
       
        <section className="overflow-auto notification">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={ () =>setSideBar(0)}/></div>
            <p className="loginText">NOTIFICATIONS</p>
            <p className="loginDetail">Get notified on any incoming requeststhat affects you.</p>
            <div>
              {
                notifications && notifications.length > 0 && notifications.map((notification,index)=>(
                    <NotificationItem notification={notification} key={index}/>
                ))
              }
            </div>
        </section>
    )

}
export default Notification