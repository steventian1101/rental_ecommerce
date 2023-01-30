import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { collection, serverTimestamp, doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "../../lib/initFirebase";
import AddItemImg from "./addItemImg";
import SidebarBack from "../sidebarBack";
import { useState, useEffect } from "react";
import EditItemInfo from "./editItemInfo";
import AddChargeRate from "./addChargeRate";
import { storage } from "../../lib/initFirebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useAuth } from "../../context/useAuth";
import Loading from "../auth/loading";
import { useRouter } from "next/router";
import EditItemImg from "./editItemImg";
import EditChargeRate from "./editChargeRate";
import back from "../../utils/handleBack";
const EditItem = ({ query }) => {
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
    const [previousData, setPreviousData] = useState(null);
    const [previousDelete, setPreviousDelete] = useState(false);
    const [imgUpload, setImgUpload] = useState(false);
    const [infoUpload, setInfoUpload] = useState(false);
    const [chargeRateUpload, setChargeRateUpload] = useState(false);
    const router = useRouter();
    const handleComplete = () => {
        const temp = [];
        setTime(serverTimestamp());
        let j = 0;
        setLoading(true)
        if (profileImgs.length > 0) {
            for (let i in profileImgs) {

                const storageRef = ref(storage, `items/${Math.floor(Math.random() * 100000000000000) + "(" + profileImgs[i].name + ")" + ".jpg"}`);
                const metadata = {
                    contentType: 'image/jpeg'
                };
                uploadBytes(storageRef, profileImgs[i]).then((snapshot) => {
                    getDownloadURL(storageRef).then((downloadUrl) => {
                        j++;
                        temp.push(downloadUrl);
                        setImgArray(temp);
                        if (j == profileImgs.length) {
                            setLast(true);
                        }
                    });
                });

            }
        }
        else {
            setLast(true);
        }
    }
    const handleSave = () => {
        const docRef = doc(db, "rental_items", id);
        const newdata = {
            //    item_name:itemInfo.itemname,
            //    insurance:chargeRate.insurance,
            //    item_charge:chargeRate.price,
            //    item_charge_rate:chargeRate.charge_rate_type,
            //    item_desc:itemInfo.itemDesc,
            //    item_location:itemInfo.location,
            //    item_search_tag:itemInfo.itemTag,
            item_photos: [...previousImgs, ...imgArray]
        };
        updateDoc(docRef, newdata)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const uploadInfo = () =>{
        setLoading(true)
        const docRef = doc(db, "rental_items", id);
        const newdata = {
               item_name:itemInfo.itemname,
               item_desc:itemInfo.itemDesc,
               item_location:itemInfo.location,
               item_search_tag:itemInfo.itemTag,
        };
        updateDoc(docRef, newdata)
            .then(() => {
                window.location.reload();

            })
            .catch((error) => {
                console.log(error);
            });
    }
    const uploadCharge = () =>{
        setLoading(true)
        const docRef = doc(db, "rental_items", id);
        const newdata = {
               insurance:chargeRate.insurance,
               item_charge:chargeRate.price,
               item_charge_rate:chargeRate.charge_rate_type,
        };
        updateDoc(docRef, newdata)
            .then(() => {
                window.location.reload();

            })
            .catch((error) => {
                console.log(error);
            });

    }
    useEffect(() => {
        if (sideBar == 0) {
            let temp = [];
            temp.push(<></>);
            setDrawSidebar(temp);
        }
        if (sideBar == 1) {
            let temp = [];
            temp.push(<EditItemImg setSideBar={setSideBar} setProfileImgs={setProfileImgs} previousImgs={previousImgs} setPreviousImgs={setPreviousImgs} setPreviousDelete={setPreviousDelete} key={sideBar} setImgUpload={setImgUpload} />);
            setDrawSidebar(temp);
        }
        if (sideBar == 2) {
            let temp = [];
            temp.push(<EditItemInfo setSideBar={setSideBar} setItemInfo={setItemInfo} prevName={previousData.item_name} prevLocation={previousData.item_location} prevItemDesc={previousData.item_desc} prevItemTag={previousData.item_search_tag} key={sideBar} setInfoUpload={ setInfoUpload}/>);
            setDrawSidebar(temp);
        }
        if (sideBar == 3) {
            let temp = [];
            temp.push(<EditChargeRate setSideBar={setSideBar} setChargeRate={setChargeRate} price={previousData.item_charge} chargetype={previousData.item_charge_rate} insurance={previousData.insurance} key={sideBar} setChargeRateUpload={ setChargeRateUpload}/>);
            setDrawSidebar(temp);
        }
    }, [sideBar]);
    useEffect(() => {
        last && handleSave();
    }, [last]);
    const getItemDetail = async (id) => {
        const docRef = doc(db, "rental_items", id);
        let querySnapshot = await getDoc(docRef);
        let tempdata = querySnapshot.data();
        setPreviousImgs(tempdata["item_photos"])
        setPreviousData(tempdata);
    }
    useEffect(() => {
        setId(query.query);
    }, [query?.query]);
    useEffect(() => {
        id && getItemDetail(id);
    }, [id]);
    useEffect(() => {
        imgUpload && handleComplete();
    }, [imgUpload]);
    useEffect(()=>{
        infoUpload && uploadInfo();
    },[infoUpload]);
    useEffect(()=>{
        chargeRateUpload && uploadCharge();
    },[chargeRateUpload])
    return (
        <section className="setting">
            {
                loading ? <Loading /> : <></>
            }
            <div className="flex items-center justify-start w-full">
                <div style={{ height: "70px" }} className="flex flex-row items-center cursor-pointer" onClick={back}><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" /></div>
            </div>
            <p className="loginText settingTitle">EDIT AN ITEM</p>
            <p className="loginDetail" style={{ marginBottom: "30px" }}>Complete the sections below to edit your item to the platform.</p>
            {
                previousData ?<div className="flex flex-row w-full setting_box_pan">
                <div className="relative flex flex-col setting_box" onClick={() => { setSideBar(1) }}>
                    <img src='/logo/addItemPhotos.svg' className="settingItemImg" />
                    <p className="text-white">Edit Item Photos</p>
                </div>
                <div className="relative flex flex-col setting_box" onClick={() => { setSideBar(2) }}>
                    <img src='/logo/addItemInfo.svg' className="settingItemImg" />
                    <p className="text-white">Edit Item Info</p>
                </div>
                <div className="relative flex flex-col setting_box" onClick={() => { setSideBar(3) }}>
                    <img src='/logo/money.svg' className="settingItemImg" />
                    <p className="text-white">Edit Charge Rate</p>
                </div>
            </div>:<div className="flex flex-row w-full setting_box_pan">
                <div className="relative flex flex-col setting_box detail-loading" >
                </div>
                <div className="relative flex flex-col setting_box detail-loading" >
                </div>
                <div className="relative flex flex-col setting_box detail-loading" >
                </div>
            </div>
            }
            {
                sideBar != 0 ? <SidebarBack /> : <></>
            }
            {
                drawSidebar
            }
        </section>
    )

}
export default EditItem
