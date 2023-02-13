import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import AuthInput from "../auth/authInput"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/useAuth"
import { updateDoc, deleteField, doc, collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/initFirebase"
import Textarea from "./textarea"

const AddItemInfo = ({ setSideBar, setItemInfo, itemInfo}) => {
    const [itemnamevalidation, setItemnamevalidation] = useState(true);
    const [itemname, setItemname] = useState('');
    const [location, setLocation] = useState('');
    const [locationvalidation, setLocationvalidation] = useState(true);
    const [color, setColor] = useState('');
    const [fontColor, setFontColor] = useState('white');
    const [itemDesc, setItemDesc] = useState('');
    const [itemTag, setItemTag] = useState('');
    const [itemtagvalidation, setItemtagvalidation] = useState(true);
    const [tempdata, setTempdata] = useState(null);
    const { userCredential} = useAuth();
    const listCollectionRef = collection(db, "users");
    const [locationvalue, setLocationvalue] = useState(null);
 
    const handleComplete = () => {
        if (itemname != "" && location != "" && itemDesc != "" && itemTag != "") {
            let temp = {
                "itemname": itemname,
                "location": location,
                "itemDesc": itemDesc,
                "itemTag": itemTag
            }
            setItemInfo(temp);
            setSideBar(0);
        }

    }
    useEffect(()=>{
        itemInfo && itemInfo.location ? setLocationvalue(itemInfo.location):"";
    },[])
    const itemtagValidation = (any) => {
            setItemtagvalidation(true);
            setItemTag(any);
    }
    const itemnameValidation = (any) => {
            setItemnamevalidation(true);
            setItemname(any);
    }
    const locationValidation = (any) => {
        setLocation(any);
        setLocationvalue(any);
    }
    const handleTextarea = (any) => {
            setColor("#ffffff4d");
            setFontColor("white")
            setItemDesc(any.replace(/\n/g, "<br>")); 
    }

    const getDetail = async (email) => {
        let temp = [];
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let tempArray = doc.data();
            if (typeof (tempArray["user_address"]) == "string") {
                temp.push(tempArray["user_address"]);
                setLocation(temp[0])
            }
            if (typeof (tempArray["user_address"]) == "object") {
                for (let i in tempArray["user_address"]) {
                    temp.push(tempArray["user_address"][i]);
                }
                setLocation(temp[0])
            }
        });
        setTempdata(temp);
    }
    useEffect(()=>{
        userCredential.email && getDetail(userCredential.email);
    },[]);

    return (
        <section className="overflow-auto addItemImg">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
            <p className="loginText">ADD THE ITEM'S INFO</p>
            <p className="loginDetail">Add critical item information that will help other users know what they're receiving .</p>
            <AuthInput title={"Item Name"} status={itemnamevalidation} placeholder={"E.g.Dress"} change={itemnameValidation} type={"text"} value={itemInfo && itemInfo.itemname ? itemInfo.itemname:""} />
            <Textarea title={"Item Description"} status={ true} placeholder={"Describe your items."} change = {handleTextarea} value={itemInfo && itemInfo.itemDesc ? itemInfo.itemDesc : ""}/>
            <div>
                <p className="text-white" style={{ fontSize: "15px"}}>Item Location</p>
                <select className="w-full my-2.5 mb-5 py-3 pr-3 px-3 pb-3 bg-transparent text-white outline-none text-sm" style={{ border:"solid 1px #ffffff4d", borderRadius:"8px", fontFamily:"poppins-light"}} onChange={(e)=>{locationValidation(e.target.value)}} value={locationvalue}> 
                    {
                        tempdata && tempdata.length > 0 && tempdata.map((data)=>(
                            <option className="p-2 mb-3 text-base bg-black rounded-lg" style={{ background:"#0e0e0e"}} value = {data}>{data}</option>
                        ))
                    }
                    {/* <option className="mb-3 bg-black rounded-lg" style={{ background:"#0e0e0e"}}>Random Address, 4536, Australia</option>
                    <option className="mb-3 bg-black rounded-lg" style={{ background:"#0e0e0e"}}>Random Address, 4536, Australia</option>
                    <option className="mb-3 bg-black rounded-lg" style={{ background:"#0e0e0e"}}>Random Address, 4536, Australia</option> */}
                </select>
            </div>
            {/* <AuthInput title={"Item's Location"} status={locationvalidation} placeholder={"E.g.John Doe"} change={locationValidation} type={"text"} value={""} /> */}
            <AuthInput title={"Item Tags"} status={itemtagvalidation} placeholder={"E.g.John Doe"} change={itemtagValidation} type={"text"} value={itemInfo && itemInfo.itemTag ? itemInfo.itemTag: ""} />
            <div className="loginButton">
                <button className="flex items-center justify-center" onClick={() => handleComplete()}>Complete</button>
            </div>
        </section>
    )

}
export default AddItemInfo