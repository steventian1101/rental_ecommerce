import { useAuth } from "../context/useAuth"
import Login from "./auth/login";
import SidebarBack from "./sidebarBack";
import { useState, useEffect } from "react";
import Register from "./auth/register";
import ResetPassword from "./auth/resetPassword";
import InputProfileInfo from "./auth/inputProfileInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import Notification from "./notification/notification";
import { auth } from "../lib/initFirebase";

export default function Header() {
  const { authenticated, userCredential} = useAuth();
  const [sideBar, setSideBar] = useState(0);
  const [ drawbackground, setDrawbackground] = useState(false);
  const [ drawSidebar, setDrawSidebar] = useState([]);
  console.log(authenticated)
  useEffect(()=>{
    console.log(sideBar, userCredential)
    let temp = [];
    if( sideBar == 0){
      setDrawbackground(false);
      temp.push(<></>);
      setDrawSidebar(temp);
    }
    if( sideBar == 1){
      setDrawbackground(true);
      temp.push(<Login setSideBar={ setSideBar}/>);
      setDrawSidebar(temp);
    }
    if( sideBar == 2){
      setDrawbackground(true);
      temp.push(<Register sideBar = { sideBar} setSideBar={ setSideBar} />);
      setDrawSidebar(temp);
    }
    if( sideBar == 3){
      setDrawbackground(true);
      temp.push(<ResetPassword sideBar = { sideBar} setSideBar={ setSideBar}/>);
      setDrawSidebar(temp);
    }
    if( sideBar == 4){
      setDrawbackground(true);
      temp.push(<Notification sideBar = { sideBar} setSideBar={ setSideBar}/>);
      setDrawSidebar(temp);
    }
  },[sideBar]) 
  return (
    <>
      {
        drawbackground?<SidebarBack/>:<></>
      }
      <section className='flex flex-row items-end justify-between navbar'>
        <div className='flex flex-row'>
          <img src="/logo/logo.svg" className='mr-2.5 w-full' />
          <p className='text-white logo-title'>Sdrop.</p>
        </div>
        {/* <div className='flex flex-row'>
          <p className='mx-5 text-white cursor-pointer'>Login</p>
          <p className='text-white cursor-pointer'>Sign Up</p>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-row items-center justify-around mr-0 stickyBarSearch">
            <FontAwesomeIcon icon={faSearch} className="mx-3 mr-0 text-xl font-thin text-white" />
            <input type="text" className="w-full p-0.5 mx-2 text-base text-white bg-transparent outline-none mr-0" id="home" placeholder="e.g.SnowBoards" />
          </div>
          <div className="flex items-center justify-center navbarIcon">
            <FontAwesomeIcon icon={ faCalendarCheck} style={{ color:"white", fontSize:"18px"}}/>
          </div>
          <div className="flex items-center justify-center navbarIcon">
            <FontAwesomeIcon icon={ faBell} style={{ color:"white", fontSize:"18px"}}/>
          </div>
          <div className="flex items-center justify-center w-10 h-10 mx-2.5" style={{ position:"relative"}}>
            <img src="https://uploads-ssl.webflow.com/5efdc8a4340de947404995b4/638de93ece20b775d2dc039f_6%20Haircut%20Trends%20for%20Late%202021.jpg" style={{ width:"100%",objectFit:"cover", borderRadius:"100px"}} className="w-10 h-10 overflow-hidden"/>
          </div>
        </div> */}
        {
          authenticated? <div className="flex flex-row">
          <div className="flex flex-row items-center justify-around mr-0 stickyBarSearch">
            <FontAwesomeIcon icon={faSearch} className="mx-3 mr-0 text-xl font-thin text-white" />
            <input type="text" className="w-full p-0.5 mx-2 text-base text-white bg-transparent outline-none mr-0" id="home" placeholder="e.g.SnowBoards" />
          </div>
          <div className="flex items-center justify-center navbarIcon">
            <FontAwesomeIcon icon={ faCalendarCheck} style={{ color:"white", fontSize:"18px"}}/>
          </div>
          <div className="flex items-center justify-center navbarIcon">
            <FontAwesomeIcon icon={ faBell } style={{ color:"white", fontSize:"18px"}} onClick={() =>{ setSideBar(4)}}/>
          </div>
          <div className="flex items-center justify-center w-10 h-10 mx-2.5" style={{ position:"relative"}}>
            <img src="https://uploads-ssl.webflow.com/5efdc8a4340de947404995b4/638de93ece20b775d2dc039f_6%20Haircut%20Trends%20for%20Late%202021.jpg" style={{ width:"100%",objectFit:"cover", borderRadius:"100px"}} className="w-10 h-10 overflow-hidden"/>
          </div>
        </div>:<div className='flex flex-row'>
          <p className='mx-5 text-white cursor-pointer' onClick={() =>{ setSideBar(1)}}>Login</p>
          <p className='text-white cursor-pointer' onClick={() =>{ setSideBar(2)}}>Sign Up</p>
        </div>
        }
      </section>
      {
        drawSidebar
      }
    </>
  )
}
