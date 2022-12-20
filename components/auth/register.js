import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react";
import { useRouter } from "next/router";

const Register = ({ sideBar, setSideBar }) => {

    return (
        <section className="register">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={ () =>setSideBar(0)}/></div>
            <p className="loginText">SIGN UP.</p>
            <div className="registerTextBack"></div>
            <p className="loginDetail">Login to Sydney's largest rental platform</p>
            <button className="flex flex-row items-center justify-center w-full text-white rounded-lg" style={{ fontSize: "15px", fontFamily: "poppins-light", border: "solid 1px #ffffff4d", height: "45px" }} ><img src="https://uploads-ssl.webflow.com/5efdc8a4340de947404995b4/638da718ba38ef5f02dcb35a_google.svg" style={{ marginRight: "10px" }} />Sign Up With Google</button>
            <div className="flex flex-row items-center justify-between my-5 mb-5">
                <div style={{ width: "100px", height: "1px", background: "#ffffff4d" }}></div>
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", color: "white" }}>OR</p>
                <div style={{ width: "100px", height: "1px", background: "#ffffff4d" }}></div>
            </div>
            <div className="flex flex-col loginForm">
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px" }} className="text-white">Email Address</p>
                <input type="email" className="w-full emailInput focus:bg-transparent" placeholder="E.g.johndoe@gmail.com"/>
            </div>
            <div className="flex flex-col loginForm">
                <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px" }} className="text-white">Password</p>
                <input type="password" className="w-full emailInput" placeholder="Min 8 Characters" />
            </div>
            <div className="registerButton">
                <button className="flex items-center justify-center">COMPLETE</button>
            </div>
            <div><p className="text-white cursor-pointer hover:underline"  onClick={ () =>setSideBar(1)} style={{ fontFamily: "poppins-light", marginBottom: "3px", fontSize: "15px" }} >Remembered your account? Login here.</p></div>
        </section>
    )
}
export default Register