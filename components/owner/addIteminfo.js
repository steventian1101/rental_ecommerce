import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import AuthInput from "../auth/authInput"
import { useState, useEffect } from "react"
const AddItemInfo = ({ setSideBar }) => {
    const [itemnamevalidation, setItemnamevalidation] = useState(true);
    const [itemname, setItemname] = useState('');
    const [locaion, setLocation] = useState('');
    const [locationvalidation, setLocationvalidation] = useState(true);
    const [color, setColor]= useState('');
    const [itemDesc, setItemDesc] = useState('');
    const itemnameValidation = (any) =>{
        if(any != ""){
            setItemnamevalidation(true);
            setItemname(any);
        }
        else{
            setItemnamevalidation(false);
        }
    }
    const locationValidation = (any) =>{
        if(any != ""){
            setLocationvalidation(true);
            setLocation(any);
        }
        else{
            setLocationvalidation(false);
        }
    }
    const handleTextarea = (any) =>{
        if(any != ""){
            setLocationvalidation(true);
            setLocation(any);
        }
        else{
            setLocationvalidation(false);
        }
    }
    
    return (
        <section className="overflow-auto addItemImg">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
            <p className="loginText">ADD THE ITEM'S INFO</p>
            <p className="loginDetail">Add critical item information that will help other users know what they're receiving .</p>
            <AuthInput title={"Item Name"} status={itemnamevalidation} placeholder={"E.g.Dress"} change={itemnameValidation} type={"text"} value={""} />
            <div>
                <p className="text-white" style={{ fontSize:"15px"}}>Item Description</p>
                <textarea className="w-full bg-transparent outline-none" rows="7" placeholder="Example Text" style={{borderColor:color}} onChange={(e)=>handleTextarea(e.target.value)}/>
            </div>
            <AuthInput title={"Item's Location"} status={locationvalidation} placeholder={"E.g.John Doe"} change={locationValidation} type={"text"} value={""} />
        </section>
    )

}
export default AddItemInfo