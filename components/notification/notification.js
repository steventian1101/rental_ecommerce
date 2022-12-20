import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import NotificationItem from "./notificationItem"
const Notification = ({sideBar, setSideBar}) => {
    return (
        <section className="notification">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={ () =>setSideBar(0)}/></div>
            <p className="loginText">NOTIFICATIONS</p>
            <p className="loginDetail">Get notified on any incoming requeststhat affects you.</p>
            <div>
                <NotificationItem/>
                <NotificationItem/>
                <NotificationItem/>
                <NotificationItem/>
                <NotificationItem/>
            </div>
        </section>
    )

}
export default Notification