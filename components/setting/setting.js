import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
import InputProfileInfo from "../auth/inputProfileInfo"
import { useState, useEffect } from "react"
import SidebarBack from "../sidebarBack"
import Payment from "./payment"
import Location from "./location"
const Setting = () => {
    const [sideBar, setSideBar]= useState(0);
    const [drawSidebar, setDrawSidebar] = useState([]);
    useEffect(()=>{
       if(sideBar == 1){
        let temp = [];
        temp.push(<InputProfileInfo setSideBar={ setSideBar } key={sideBar}/>);
        setDrawSidebar(temp);
       }
       if(sideBar == 2){
        let temp = [];
        temp.push(<Payment setSideBar={ setSideBar } key={sideBar}/>);
        setDrawSidebar(temp);
       }
       if(sideBar == 3){
        let temp = [];
        temp.push(<Location setSideBar={ setSideBar } key={sideBar}/>);
        setDrawSidebar(temp);
       }
       if(sideBar == 0){
        let temp = [];
        temp.push(<></>);
        setDrawSidebar(temp);
       }
    },[sideBar])
    return (
        <>
        {
            sideBar != 0?<SidebarBack/>:<></>
        }
        <section className="setting">
            <div className="flex items-center justify-start w-full">
                <div style={{ height: "70px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" /></div>
            </div>
            <p className="loginText settingTitle">Settings</p>
            <p className="loginDetail" style={{ marginBottom: "30px" }}>Complete the sections below to add your item to the platform.</p>
            <div className="flex flex-row w-full setting_box_pan">
                <div className="flex flex-col setting_box" onClick={()=>{ setSideBar(1)}}>
                    <img src='/logo/person.svg' className="settingItemImg" />
                    <p className="text-white">Profile Info</p>
                </div>
                <div className="flex flex-col setting_box" onClick={()=>{ setSideBar(2)}}>
                    <img src='/logo/money.svg' className="settingItemImg" />
                    <p className="text-white">Payment</p>
                </div>
                <div className="flex flex-col setting_box" onClick={()=>{ setSideBar(3)}}>
                    <FontAwesomeIcon icon={ faLocationDot} className="settingLocationImg"/>
                    <p className="text-white">Add Location</p>
                </div>
            </div>
        </section>
        {
            drawSidebar
        }
        </>
    )

}
export default Setting