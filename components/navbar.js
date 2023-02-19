import { useAuth } from "../context/useAuth"
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Notification from "./notification/notification";
import { auth } from "../lib/initFirebase";
import { db } from "../lib/initFirebase";
import { collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import Link from "next/link"
import NavBarBack from "./navBarBack";

export default function Header({ search }) {
  const listCollectionRef = collection(db, "users")
  const notificationRef =  collection(db, "notifications")
  const { authenticated, userCredential, logOut } = useAuth();
  const [sideBar, setSideBar] = useState(0);
  const [drawbackground, setDrawbackground] = useState(false);
  const [drawSidebar, setDrawSidebar] = useState([]);
  const [profileImg, setProfileImg] = useState('');
  const [credentialEmail, setCredentialEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [dropbox, setDropbox] = useState(false);
  const [tempdata, setTempdata] = useState([]);
  const [searchShow, setSearchShow] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notifications, setNotifications] = useState(null);
  const handleProfileImage = async (email) => {
    let temp = [];
    let q = query(listCollectionRef, where("user_email", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      temp.push(doc.data());
    });
    setTempdata(temp)
  }
  const getNotification = async (email) => {
    const temp = [];
    let q = query(notificationRef, where("to", "==", email), where("show", "==", false), orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        var tempobject = Object.assign(doc.data(), { objectID: doc.id })
        temp.push(tempobject)
    })
    console.log(temp.length)
    setNotifications(temp)
  }
  useEffect(() => {
    userCredential.email && setCredentialEmail(userCredential.email)
    userCredential.email && getNotification(userCredential.email)
  }, [userCredential?.email])
  useEffect(() => {
    credentialEmail != "" && handleProfileImage(credentialEmail)
  }, [credentialEmail])
  const handleLogout = () => {
    logOut(auth);

  }
  const handleEnter = () => {
    setDropbox(true);
  }
  const handleLeave = () => {
    setDropbox(false)
  }
  useEffect(() => {
    tempdata && tempdata.length > 0 && setProfileImg(tempdata[0].profile_img)
    tempdata && tempdata.length > 0 && setNickname(tempdata[0].nick_name)
  }, [tempdata]);
  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        if (document.getElementById("homeSearch").value != null) {
          let text = document.getElementById('homeSearch').value;
          localStorage.setItem("searchText",text)
          if (text != "") { 
            let url = '/?query=' + text
            location.href = url
          }
        }
      }
    })
  }, []);
  const handleSearchClick = () => {
    setSearchShow(true);
  }
  const handleNotify = () =>{
    setDrawbackground(true);
    setNotify(true);
    
    
  }

  return (
    <>
      {
        drawbackground ? <NavBarBack setDrawbackground ={setDrawbackground} setNotify={ setNotify}/> : <></>
      }
      {
        notify?<Notification setDrawbackground = {setDrawbackground} setNotify={ setNotify}/>:<></>
      }
      <section className="fixed w-full bg-black" style={{ zIndex: "10000" }}>
        <div className='flex flex-row items-end justify-between navbar'>
          <Link href='/'>
            <div className='flex flex-row items-center' style={{ height: "40px" }}>
              <img src="/logo/logo.svg" className='mr-2.5 w-full' />
              <p className='text-white logo-title'>Sdrop.</p>
            </div></Link>
           {
            search && searchShow &&  <div className="flex flex-row items-center justify-around mr-0 clickBarSearch " >
            <FontAwesomeIcon icon={faSearch} className="mx-3 mr-0 text-xl font-thin text-white cursor-pointer" onClick={()=>{ setSearchShow(false)}}/>
            <input type="text" className="w-full p-0.5 mx-2 text-base text-white bg-transparent outline-none mr-0" id="homeSearch" placeholder="e.g.SnowBoards" defaultValue={typeof window !== "undefined" && "localStorage" in window && localStorage.getItem("searchText")}/>
          </div>
           }
            <div className="flex flex-row items-center">
            {
              search && !searchShow &&  <div className="flex flex-row">
                <div className="flex flex-row items-center justify-around mr-0 stickyBarSearch">
                  <FontAwesomeIcon icon={faSearch} className="mx-3 mr-0 text-xl font-thin text-white cursor-pointer" />
                  <input type="text" className="w-full p-0.5 mx-2 text-base text-white bg-transparent outline-none mr-0 animationinput" id="homeSearch" placeholder="e.g.SnowBoards" defaultValue={typeof window !== "undefined" && "localStorage" in window && localStorage.getItem("searchText")}/>
                </div>
                <div className="flex items-center justify-center cursor-pointer navbarIcon searchIcon" onClick={handleSearchClick}>
                  <FontAwesomeIcon icon={faSearch} style={{ color: "white", fontSize: "18px" }} />
                </div>
              </div>
            }
           {
            !searchShow && <>
             {
              authenticated ? <div className="flex flex-row justify-end w-full">
                <div className="flex items-center justify-center cursor-pointer navbarIcon">
                  <Link href="/booking"><FontAwesomeIcon icon={faCalendarCheck} style={{ color: "white", fontSize: "18px" }} /></Link>
                </div>
                <div className="relative flex items-center justify-center cursor-pointer navbarIcon">
                  <FontAwesomeIcon icon={faBell} style={{ color: "white", fontSize: "18px" }} onClick={() => { handleNotify () }} />
                  {
                    notifications && notifications.length != 0 ? <div className="absolute flex items-center justify-center bg-yellow-500 top-1 right-1" style={{ width:"15px", height:"15px", borderRadius:"100px"}}><p className="text-black bold" style={{ fontSize:"12px", lineHeight:"15px"}}>{notifications.length}</p></div>:<></>
                  }
                </div>
                <div className="flex items-center justify-center w-10 h-10 mx-2.5" style={{ position: "relative" }} onMouseEnter={() => { handleEnter() }}>
                  {
                    profileImg != "" ? <Link href="/profile"> <img src={profileImg} style={{ width: "100%", objectFit: "cover", borderRadius: "100px" }} className="w-10 h-10 overflow-hidden" /></Link> :
                      <div style={{ width: "100%", objectFit: "cover", borderRadius: "100px" }} className="w-10 h-10 overflow-hidden detail-loading"></div>
                  }
                  {
                    dropbox ? <div style={{ position: "absolute", top: "50px", right: "0px", width: "250px", height: "auto", background: '#131313', borderRadius: "8px", paddingTop: "20px", paddingBottom: "10px" }} className="flex flex-col" onMouseLeave={handleLeave}>
                      <div style={{ paddingLeft: "15px", paddingRight: "15px" }} className="flex flex-row">
                        <div className="relative">
                          {
                            profileImg != "" ? <img src={profileImg} className="object-cover w-10 h-10" style={{ borderRadius: "100px", marginRight: "15px" }} /> :
                              <div className="object-cover w-10 h-10 detail-loading" style={{ borderRadius: "100px", marginRight: "15px" }}></div>
                          }
                        </div>
                        <div className="flex flex-col">
                          <p className="text-white font-15" >{nickname}</p>
                          <Link href='/setting/profile'><p className="text-white underline cursor-pointer" style={{ fontSize: "15px" }}>Edit Profile</p></Link>
                        </div>
                      </div>
                      <div style={{ width: "100%", height: "1px", marginTop: "15px", marginBottom: "5px", background: "#ffffff33" }}></div>
                      <Link href='/setting'> <div className="flex flex-row cursor-pointer dropbox" style={{ padding: "10px 15px 10px 20px" }}>
                        <FontAwesomeIcon icon={faGear} style={{ fontSize: "20px", marginRight: "10px", color: "white" }} />
                        <p className="text-white" style={{ fontSize: "15px" }}>Settings</p>
                      </div> </Link>
                      <div className="flex flex-row cursor-pointer dropbox" style={{ padding: "10px 15px 10px 20px" }} onClick={handleLogout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ fontSize: "20px", marginRight: "10px", color: "white" }} />
                        <p className="text-white" style={{ fontSize: "15px" }} >Log Out</p>
                      </div>
                    </div> : <></>
                  }
                </div>
              </div> : <div className='flex flex-row'>
                <Link href= "/login"><p className='mx-5 text-white cursor-pointer'>Login</p></Link>
                <Link href = "/register"><p className='text-white cursor-pointer'>Sign Up</p></Link>
              </div>
            }</> 
           }

          </div>
        </div>
      </section>
    </>
  )
}
