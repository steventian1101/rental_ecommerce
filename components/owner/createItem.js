import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong}  from "@fortawesome/free-solid-svg-icons"
import { faArrowLeftLong}  from "@fortawesome/free-solid-svg-icons";
import { collection, addDoc, query, orderBy, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/initFirebase";
import AddItemImg from "./addItemImg";
import SidebarBack from "../sidebarBack";
import { useState,useEffect } from "react";
import AddItemInfo from "./addItemInfo";
import AddChargeRate from "./addChargeRate";
import { storage } from "../../lib/initFirebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useAuth } from "../../context/useAuth";
import Loading from "../auth/loading";
import { useRouter } from "next/router";

const CreateItem = () => {

    const [sideBar, setSideBar] = useState(0);
    const [drawSidebar, setDrawSidebar] = useState([]);
    const [profileImgs, setProfileImgs] = useState([]);
    const [itemInfo, setItemInfo] = useState(null);
    const [chargeRate, setChargeRate] = useState(null);
    const [imgArray, setImgArray] = useState([]);
    const [last, setLast] = useState(false);
    const listCollectionRef = collection(db, "rental_items");
    const { userCredential } = useAuth();
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState(null);
    const router = useRouter();

    const handleComplete = () =>{
        const temp = [];
        setTime(serverTimestamp());
        let j = 0;
        setLoading(true)
        for(let i in profileImgs){
            
            const storageRef = ref(storage, `items/${itemInfo.itemname + i + "(" + profileImgs[i].name + ")" + ".jpg"}`);
            const metadata = {
                contentType: 'image/jpeg'
            };
            uploadBytes(storageRef, profileImgs[i]).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                getDownloadURL(storageRef).then((downloadUrl) => {  
                    j++;                 
                    console.log(j);
                    temp.push(downloadUrl);
                    setImgArray(temp);
                    if(j == profileImgs.length){
                        setLast(true);
                    }
                });
            }); 
             
        }   
    }
    const handleSave = () =>{
        addDoc(listCollectionRef, { item_photos:imgArray, item_name:itemInfo.itemname, item_desc:itemInfo.itemDesc,item_location:itemInfo.location, item_search_tags:"", item_charge:chargeRate.price, item_charge_rate:chargeRate.charge_rate_type, item_rating:0, review_number:0, item_reviews:"", item_views:0, insurance:chargeRate.insurance, rental_owner:userCredential.email, createdTime:time }).then(response => {
            console.log(response);
            router.push("/profile");
        }).catch(error => {
               console.log(error.message)
        });
          
    }

    useEffect(() => {
      if(sideBar == 0){
        let temp = [];
        temp.push(<></>);
        setDrawSidebar(temp);
      }
      if(sideBar == 1){
        let temp = [];
        temp.push( <AddItemImg setSideBar={setSideBar} setProfileImgs={setProfileImgs}/>);
        setDrawSidebar(temp);
      }
      if(sideBar == 2){
        let temp = [];
        temp.push( <AddItemInfo setSideBar={setSideBar} setItemInfo = { setItemInfo}/>);
        setDrawSidebar(temp);
      }
      if(sideBar == 3){
        let temp = [];
        temp.push( <AddChargeRate setSideBar={setSideBar} setChargeRate={ setChargeRate}/>);
        setDrawSidebar(temp);
      }
    }, [sideBar]);
    
    useEffect(()=>{
        console.log(chargeRate);
    },[chargeRate]);
    useEffect(()=>{
        console.log(profileImgs);
    },[profileImgs.length]);
    useEffect(()=>{
        console.log(itemInfo);
    },[itemInfo]);
    useEffect(()=>{
         last && handleSave();
    },[last])
    return (
        <section className="setting">
            {
                loading? <Loading/>:<></>
            }
            <div className="flex items-center justify-start w-full">
                <div style={{ height: "70px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" /></div>
            </div>
            <p className="loginText settingTitle">CREATE AN ITEM</p>
            <p className="loginDetail" style={{ marginBottom: "30px" }}>Complete the sections below to add your item to the platform.</p>
            <div className="flex flex-row w-full setting_box_pan">
                <div className="relative flex flex-col setting_box" onClick={()=>{ setSideBar(1)}}>
                    <img src='/logo/addItemPhotos.svg' className="settingItemImg" />
                    <p className="text-white">Add Item Photos</p>
                    {
                        profileImgs && profileImgs.length > 0 ?<img src="/logo/checked-circle.svg" className="absolute" style={{ top:"10%", right:"5%"}}/>:<></>
                    }
                </div>
                <div className="relative flex flex-col setting_box" onClick={()=>{ setSideBar(2)}}>
                    <img src='/logo/addItemInfo.svg' className="settingItemImg" />
                    <p className="text-white">Add Item Info</p>
                    {
                        itemInfo ?<img src="/logo/checked-circle.svg" className="absolute" style={{ top:"10%", right:"5%"}}/>:<></>
                    }
                </div>
                <div className="relative flex flex-col setting_box" onClick={()=>{ setSideBar(3)}}>
                    <img src='/logo/money.svg' className="settingItemImg" />
                    <p className="text-white">Add Charge Rate</p>
                    {
                        chargeRate ?<img src="/logo/checked-circle.svg" className="absolute" style={{ top:"10%", right:"5%"}}/>:<></>
                    }
                </div>
            </div>
            {
                sideBar != 0?<SidebarBack/>:<></>
            }
            {
                 drawSidebar
            }
            <div className="flex items-end justify-end w-full createitembuttonbar">
                {
                    profileImgs !="" && itemInfo && chargeRate?  <div className="flex items-center justify-center createitembutton" onClick={()=>handleComplete()}>
                    <FontAwesomeIcon icon={ faArrowRightLong } className="text-white fontIcon"/>
                </div>: <div  className="flex items-center justify-center createitembutton opacity-30">
                    <FontAwesomeIcon icon={ faArrowRightLong } className="text-white fontIcon"/>
                </div>
                }    
            </div>
        </section>
    )

}
export default CreateItem