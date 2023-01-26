import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
const MobileSuccessNotification = ({handlefinish}) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black mobilesuccessnoti">
            <div className="flex flex-col items-center justify-center">
                <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: "90px", color: "#47d585" }} className="mx-auto mr-auto text-center" />
                <p className="text-white font-18 bold my-2.5 text-center">REQUEST SENT</p>
                <p className="mb-5 text-center text-white font-15">Your request has been submitted, a notification will be sent to you once we get a reply from the owner.</p>
                <p style={{ padding: "15px 20px", background: "#47d585" }} className="w-full text-center text-black rounded-lg cursor-pointer bold font-15" onClick={() => { handlefinish() }}>OK</p>
            </div>
        </div>
    )

}
export default MobileSuccessNotification