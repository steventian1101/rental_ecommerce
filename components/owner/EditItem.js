import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong}  from "@fortawesome/free-solid-svg-icons"
import { faArrowLeftLong}  from "@fortawesome/free-solid-svg-icons";
import { collection, serverTimestamp , doc, getDoc, updateDoc, deleteField} from "firebase/firestore";
import { db } from "../../lib/initFirebase";
import AddItemImg from "./addItemImg";
import SidebarBack from "../sidebarBack";
import { useState,useEffect } from "react";
import EditItemInfo from "./editItemInfo";
import AddChargeRate from "./addChargeRate";
import { storage } from "../../lib/initFirebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useAuth } from "../../context/useAuth";
import Loading from "../auth/loading";
import { useRouter } from "next/router";
import EditItemImg from "./editItemImg";
import EditChargeRate from "./editChargeRate";
const EditItem = ({query}) =>{
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
    const [id, setId] = useState(null);
    const [previousImgs, setPreviousImgs] = useState([]);
    const [previousData,setPreviousData] = useState([]);
    const [previousDelete, setPreviousDelete] = useState(false);
    const router = useRouter();
    console.log(query)

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
        const docRef = doc(db, "rental_items", id);
        const data = {
            item_name: deleteField(),
            insurance: deleteField(),
            item_charge: deleteField(),
            item_charge_rate: deleteField(),
            item_desc: deleteField(),
            item_location: deleteField(),
            item_photos:deleteField(),
            item_search_tag:deleteField()
        };
        const newdata = {
           item_name:itemInfo.itemname,
           insurance:chargeRate.insurance,
           item_charge:chargeRate.price,
           item_charge_rate:chargeRate.charge_rate_type,
           item_desc:itemInfo.itemDesc,
           item_location:itemInfo.location,
           item_search_tag:itemInfo.itemTag,
           item_photos:[...previousImgs, ...imgArray]
        };
        updateDoc(docRef, data)
            .then(() => {
            })
            .catch((error) => {
                console.log(error);
            });
        updateDoc(docRef, newdata)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
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
        temp.push( <EditItemImg setSideBar={setSideBar} setProfileImgs={setProfileImgs} previousImgs ={previousImgs} setPreviousImgs={setPreviousImgs} setPreviousDelete={setPreviousDelete} key={sideBar}/>);
        setDrawSidebar(temp);
      }
      if(sideBar == 2){
        let temp = [];
        temp.push( <EditItemInfo setSideBar={setSideBar} setItemInfo = { setItemInfo} prevName={previousData.item_name} prevLocation={previousData.item_location} prevItemDesc = {previousData.item_desc} prevItemTag={""} key={sideBar}/>);
        setDrawSidebar(temp);
      }
      if(sideBar == 3){
        let temp = [];
        temp.push( <EditChargeRate setSideBar={setSideBar} setChargeRate={ setChargeRate} price={previousData.item_charge} chargetype={ previousData.item_charge_rate} insurance={previousData.insurance} key={sideBar}/>);
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
    },[last]);
    const getItemDetail = async(id) =>{
        const docRef = doc(db, "rental_items", id);
        let querySnapshot = await getDoc(docRef);
        let tempdata = querySnapshot.data();
        setPreviousImgs(tempdata["item_photos"])
        setPreviousData(tempdata);
    }
    useEffect(()=>{
       setId(query.query);
    },[query?.query]);
    useEffect(()=>{
      id && getItemDetail(id);
    },[id]);
    return (
        <section className="setting">
            {
                loading? <Loading/>:<></>
            }
            <div className="flex items-center justify-start w-full">
                <div style={{ height: "70px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" /></div>
            </div>
            <p className="loginText settingTitle">EDIT AN ITEM</p>
            <p className="loginDetail" style={{ marginBottom: "30px" }}>Complete the sections below to edit your item to the platform.</p>
            <div className="flex flex-row w-full setting_box_pan">
                <div className="relative flex flex-col setting_box" onClick={()=>{ setSideBar(1)}}>
                    <img src='/logo/addItemPhotos.svg' className="settingItemImg" />
                    <p className="text-white">Edit Item Photos</p>
                    {
                        previousDelete || profileImgs && profileImgs.length > 0 ?<img src="/logo/checked-circle.svg" className="absolute" style={{ top:"10%", right:"5%"}}/>:<></>
                    }
                </div>
                <div className="relative flex flex-col setting_box" onClick={()=>{ setSideBar(2)}}>
                    <img src='/logo/addItemInfo.svg' className="settingItemImg" />
                    <p className="text-white">Edit Item Info</p>
                    {
                        itemInfo ?<img src="/logo/checked-circle.svg" className="absolute" style={{ top:"10%", right:"5%"}}/>:<></>
                    }
                </div>
                <div className="relative flex flex-col setting_box" onClick={()=>{ setSideBar(3)}}>
                    <img src='/logo/money.svg' className="settingItemImg" />
                    <p className="text-white">Edit Charge Rate</p>
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
                    (previousDelete || profileImgs !="") && itemInfo && chargeRate?  <div className="flex items-center justify-center createitembutton" onClick={()=>handleComplete()}>
                    <FontAwesomeIcon icon={ faArrowRightLong } className="text-white fontIcon"/>
                </div>: <div  className="flex items-center justify-center createitembutton opacity-30">
                    <FontAwesomeIcon icon={ faArrowRightLong } className="text-white fontIcon"/>
                </div>
                }    
            </div>
        </section>
    )

}
export default EditItem
