import { useAuth } from "../context/useAuth"
import Login from "./auth/login";
import SidebarBack from "./sidebarBack";
import { useState, useEffect } from "react";
import Register from "./auth/register";
import ResetPassword from "./auth/resetPassword";
import InputProfileInfo from "./auth/inputProfileInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsAmericanSignLanguageInterpreting, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Notification from "./notification/notification";
import { auth } from "../lib/initFirebase";
import { db } from "../lib/initFirebase";
import { collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { async } from "@firebase/util";
import Link from "next/link"
import NavBarBack from "./navBarBack";

export default function Header({ login, setLogin, search }) {
  const listCollectionRef = collection(db, "users")
  const { authenticated, userCredential, logOut } = useAuth();
  const [sideBar, setSideBar] = useState(0);
  const [drawbackground, setDrawbackground] = useState(false);
  const [drawSidebar, setDrawSidebar] = useState([]);
  const [profileImg, setProfileImg] = useState('');
  const [credentialEmail, setCredentialEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [dropbox, setDropbox] = useState(false);
  const [tempdata, setTempdata] = useState([]);
  let i = 0;
  useEffect(() => {
    if (login) {
      setSideBar(1);
      setLogin(false);
    }
  }, [login])
  useEffect(() => {
    i++;
    let temp = [];
    if (sideBar == 0) {
      setDrawbackground(false);
      temp.push(<></>);
      setDrawSidebar(temp);
    }
    if (sideBar == 1) {
      setDrawbackground(true);
      temp.push(<Login setSideBar={setSideBar} key={i} />);
      setDrawSidebar(temp);
    }
    if (sideBar == 2) {
      setDrawbackground(true);
      temp.push(<Register sideBar={sideBar} setSideBar={setSideBar} key={i} />);
      setDrawSidebar(temp);
    }
    if (sideBar == 3) {
      setDrawbackground(true);
      temp.push(<ResetPassword sideBar={sideBar} setSideBar={setSideBar} key={i} />);
      setDrawSidebar(temp);
    }
    if (sideBar == 4) {
      setDrawbackground(true);
      temp.push(<Notification sideBar={sideBar} setSideBar={setSideBar} key={i} />);
      setDrawSidebar(temp);
    }
    if (sideBar == 5) {
      setDrawbackground(true);
      temp.push(<InputProfileInfo sideBar={sideBar} setSideBar={setSideBar} key={i} />);
      setDrawSidebar(temp);
    }
  }, [sideBar])
  const handleProfileImage = async (email) => {
    let temp = [];
    let q = query(listCollectionRef, where("user_email", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      temp.push(doc.data());
    });
    setTempdata(temp)
  }
  useEffect(() => {
    userCredential.email && setCredentialEmail(userCredential.email)
  }, [userCredential])
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
           if(document.getElementById("homeSearch").value != null){
            let text = document.getElementById('homeSearch').value;
            if (text != "") {
                let url = '/?query=' + text
                location.href = url
            }
           }
        }
    })
}, [])
  return (
    <>
      {
        drawbackground ? <NavBarBack /> : <></>
      }
      <section className="fixed w-full bg-black" style={{ zIndex:"10000"}}>
        <div className='flex flex-row items-end justify-between navbar'>
          <Link href='/'>
            <div className='flex flex-row items-center' style={{ height: "40px" }}>
              <img src="/logo/logo.svg" className='mr-2.5 w-full' />
              <p className='text-white logo-title'>Sdrop.</p>
            </div>
          </Link>
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
          <div className="flex flex-row items-center">
            {
              search && <div className="flex flex-row">
              <div className="flex flex-row items-center justify-around mr-0 stickyBarSearch">
                <FontAwesomeIcon icon={faSearch} className="mx-3 mr-0 text-xl font-thin text-white" />
                <input type="text" className="w-full p-0.5 mx-2 text-base text-white bg-transparent outline-none mr-0" id="homeSearch" placeholder="e.g.SnowBoards" />
              </div>
              <div className="flex items-center justify-center navbarIcon searchIcon">
                <FontAwesomeIcon icon={faSearch} style={{ color: "white", fontSize: "18px" }} />
              </div>
            </div>
            }
            {
              authenticated ? <div className="flex flex-row justify-end w-full">
                <div className="flex items-center justify-center navbarIcon">
                  <Link href="/booking"><FontAwesomeIcon icon={faCalendarCheck} style={{ color: "white", fontSize: "18px" }} /></Link>
                </div>
                <div className="flex items-center justify-center navbarIcon">
                  <FontAwesomeIcon icon={faBell} style={{ color: "white", fontSize: "18px" }} onClick={() => { setSideBar(4) }} />
                </div>
                {/* <div className="flex items-center justify-center navbarIcon">
              <FontAwesomeIcon icon={faSearch} style={{ color: "white", fontSize: "18px" }}  />
            </div> */}
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
                          <p className="text-white" style={{ fontSize: "15px" }}>{nickname}</p>
                          <p className="text-white underline cursor-pointer" style={{ fontSize: "15px" }} onClick={() => { setSideBar(5) }}>Edit Profile</p>
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
                <p className='mx-5 text-white cursor-pointer' onClick={() => { setSideBar(1) }}>Login</p>
                <p className='text-white cursor-pointer' onClick={() => { setSideBar(2) }}>Sign Up</p>
              </div>
            }

          </div>
        </div>
        {
          drawSidebar
        }
      </section>
    </>
  )
}
