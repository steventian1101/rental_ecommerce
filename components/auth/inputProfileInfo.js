import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
const InputProfileInfo = () => {
    return (
        <section className="overflow-auto addProfileInfo">
            <p className="loginText" style={{ marginTop: "60px" }}>Add Your Profile Info.</p>
            <p className="loginDetail">Explore Sydney's largest rental platform</p>
            <div className="flex flex-col items-center justify-center w-full" style={{ height: "180px", border: "1px solid #ffffff4a", borderRadius: "8px" }}>
                <FontAwesomeIcon icon={faPlus} style={{ fontSize: "30px", color: "white" }} />
                <p className="text-white">Add Profile Photo</p>
            </div>
            <div style={{ marginTop: "30px", marginBottom: "30px", width: "100%", height: "1px", background: "#ffffff4a" }}></div>
            <div className="flex flex-col loginForm">
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px" }} className="text-white">First Name</p>
                <input type="text" className="w-full emailInput focus:bg-transparent" placeholder="E.g.John" />
            </div>
            <div className="flex flex-col loginForm">
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px" }} className="text-white">Last Name</p>
                <input type="text" className="w-full emailInput focus:bg-transparent" placeholder="E.g.Doe" />
            </div>
            <div className="flex flex-col loginForm">
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px" }} className="text-white">SDrop Nickname</p>
                <input type="text" className="w-full emailInput focus:bg-transparent" placeholder="E.g.John Doe Rentals" />
            </div>
            <div className="flex flex-col loginForm">
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px" }} className="text-white">Phone Number</p>
                <input type="text" className="w-full emailInput focus:bg-transparent" placeholder="E.g.+61 488 789" />
            </div>
            <div className="flex flex-col loginForm">
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px" }} className="text-white">Address</p>
                <input type="text" className="w-full emailInput focus:bg-transparent" placeholder="E.g.20 Echidna Ave, 2035, Australia" />
            </div>
            <div className="registerButton">
                <button className="flex items-center justify-center">COMPLETE</button>
            </div>
        </section>
    )

}
export default InputProfileInfo