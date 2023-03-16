import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import back from "../../utils/handleBack"
import Link from "next/link"
const Setting = () => {
    const router = useRouter();
    useEffect(()=>{
       router.query.query == "payment" && setSideBar(2)
    },[router.query?.query])
    return (
        <>
        <section className="setting">
            <div className="flex items-center justify-start w-full">
                <div style={{ height: "70px" }} className="flex flex-row items-center cursor-pointer" onClick={back}><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" /></div>
            </div>
            <p className="loginText settingTitle">Settings</p>
            <p className="loginDetail" style={{ marginBottom: "30px" }}>Complete the sections below to add your item to the platform.</p>
            <div className="flex flex-row flex-wrap w-full setting_box_pan">
                <Link href='/setting/profile'><div className="flex flex-col setting_box">
                    <img src='/logo/person.svg' className="settingItemImg" />
                    <p className="text-white">Profile Info</p>
                </div></Link>
                <Link href='/setting/payment'>
                <div className="flex flex-col setting_box" >
                    <img src='/logo/money.svg' className="settingItemImg" />
                    <p className="text-white">Payment</p>
                </div></Link>
                <Link href='/setting/location'>
                <div className="flex flex-col setting_box">
                    <FontAwesomeIcon icon={ faLocationDot} className="settingLocationImg"/>
                    <p className="text-white">Add Location</p>
                </div>
                </Link>
                {/* <Link href='/setting/bank'>
                <div className="flex flex-col setting_box" >
                    <img src='/logo/bank.svg' className="settingItemImg" />
                    <p className="text-white">Bank Account</p>
                </div>
                </Link> */}
            </div>
        </section>
        </>
    )

}
export default Setting