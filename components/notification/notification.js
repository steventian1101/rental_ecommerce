import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import NotificationItem from "./notificationItem"
import { db } from "../../lib/initFirebase"
import { collection, getDocs, where, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import NotificationLoading from "./notificationLoading";

const Notification = ({ setDrawbackground, setNotify }) => {
    const [notifications, setNotifications] = useState(null);
    const { userCredential } = useAuth();
    const listCollectionRef = collection(db, 'notifications');

    useEffect(() => {
        setNotifications(null);
        getNotification(userCredential.email);
    }, []);
    const getNotification = async (email) => {
        const temp = [];
        let q = query(listCollectionRef, where("to", "==", email), orderBy("time", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            var tempobject = Object.assign(doc.data(), { objectID: doc.id })
            temp.push(tempobject)
        })
        setNotifications(temp)
    }
    const handleBack = () => {
        setDrawbackground(false);
        setNotify(false);
        window.location.reload();
    }
    return (

        <section className="overflow-auto notification">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => handleBack()} /></div>
            <p className="loginText">NOTIFICATIONS</p>
            <p className="loginDetail">Get notified on any incoming requeststhat affects you.</p>
            <div className="overflow-auto">
                {
                    notifications && notifications.length > 0 ? notifications.map((notification, index) => (
                        <NotificationItem notification={notification} key={index} />
                    )) : [...Array(1)].map((_, index) => (
                        <NotificationLoading key={index} />))

                }
            </div>
        </section>
    )

}
export default Notification