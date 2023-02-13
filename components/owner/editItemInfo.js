import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import AuthInput from "../auth/authInput"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/useAuth"
import { updateDoc, deleteField, doc, collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/initFirebase"
import Textarea from "./textarea"
import back from "../../utils/handleBack"

const EditItemInfo = ({ setSideBar, setItemInfo, prevName, prevLocation, prevItemDesc, prevItemTag, setInfoUpload}) => {
    const [itemnamevalidation, setItemnamevalidation] = useState(true);
    const [itemname, setItemname] = useState('');
    const [location, setLocation] = useState('');
    const [locationvalidation, setLocationvalidation] = useState(true);
    const [itemDesc, setItemDesc] = useState('');
    const [itemTag, setItemTag] = useState('');
    const [itemtagvalidation, setItemtagvalidation] = useState(false);
    const [itemdescvalidation, setItemdescvalidation]= useState(true);
    const [tempdata, setTempdata] = useState(null);
    const { userCredential} = useAuth();
    const listCollectionRef = collection(db, "users");
    

    const handleComplete = () => {
        if (itemname != "" && location != "" && itemDesc != "" && itemTag != "") {
            let temp = {
                "itemname": itemname,
                "location": location,
                "itemDesc": itemDesc,
                "itemTag": itemTag
            }
            console.log(temp)
            setItemInfo(temp);
            setSideBar(0);
            setInfoUpload(true)
        }

    }

    const itemtagValidation = (any) => {
            setItemtagvalidation(true);
            setItemTag(any);
    }
    const itemnameValidation = (any) => {
      
            setItemnamevalidation(true);
            setItemname(any);
       
    }
    const locationValidation = (any) => {
        
            setLocationvalidation(true);
            setLocation(any);
        
    }
    const handleTextarea = (any) => {
       
            setItemdescvalidation(true);
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
            }
            if (typeof (tempArray["user_address"]) == "object") {
                for (let i in tempArray["user_address"]) {
                    temp.push(tempArray["user_address"][i]);
                }
            }
        });
        setTempdata(temp);
    }
    useEffect(()=>{
        userCredential.email && getDetail(userCredential.email);
    },[]);
    useEffect(()=>{
        locationValidation(prevLocation)
    },[prevLocation])

    return (
        <section className="overflow-auto addItemImg">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
            <p className="loginText">EDIT THE ITEM'S INFO</p>
            <p className="loginDetail">Add critical item information that will help other users know what they're receiving .</p>
            <AuthInput title={"Item Name"} status={itemnamevalidation} placeholder={"E.g.Dress"} change={itemnameValidation} type={"text"} value={prevName} />
            <Textarea title={"Item Description"} status={ itemdescvalidation} placeholder={"Describe your items."} change = {handleTextarea} value={prevItemDesc}/>
            <div>
                <p className="text-white" style={{ fontSize: "15px"}}>Item Location</p>
                <select className="w-full my-2.5 mb-5 py-3 pr-3 px-3 pb-3 bg-transparent text-white outline-none text-sm" style={{ border:"solid 1px #ffffff4d", borderRadius:"8px", fontFamily:"poppins-light"}} onChange={(e)=>{locationValidation(e.target.value)}} > 
                    {
                        prevLocation && <option className="p-2 mb-3 text-base bg-black rounded-lg" style={{ background:"#0e0e0e"}} value={prevLocation}>{prevLocation}</option>
                    }
                    {
                        tempdata && tempdata.length > 0 && tempdata.map((data)=>(
                            <option className="p-2 mb-3 text-base bg-black rounded-lg" style={{ background:"#0e0e0e"}} value={data}>{data}</option>
                        ))
                    }
                    {/* <option className="mb-3 bg-black rounded-lg" style={{ background:"#0e0e0e"}}>Random Address, 4536, Australia</option>
                    <option className="mb-3 bg-black rounded-lg" style={{ background:"#0e0e0e"}}>Random Address, 4536, Australia</option>
                    <option className="mb-3 bg-black rounded-lg" style={{ background:"#0e0e0e"}}>Random Address, 4536, Australia</option> */}
                </select>
            </div>
            <AuthInput title={"Item Tags"} status={itemtagvalidation} placeholder={"E.g.John Doe"} change={itemtagValidation} type={"text"} value={prevItemTag} />
            <div className="loginButton">
                <button className="flex items-center justify-center" onClick={() => handleComplete()}>Complete</button>
            </div>
        </section>
    )

}
export default EditItemInfo