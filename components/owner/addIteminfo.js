import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import AuthInput from "../auth/authInput"
import { useState, useEffect } from "react"
const AddItemInfo = ({ setSideBar, setItemInfo}) => {
    const [itemnamevalidation, setItemnamevalidation] = useState(true);
    const [itemname, setItemname] = useState('');
    const [location, setLocation] = useState('');
    const [locationvalidation, setLocationvalidation] = useState(true);
    const [color, setColor] = useState('');
    const [fontColor, setFontColor] = useState('white');
    const [itemDesc, setItemDesc] = useState('');
    const [itemTag, setItemTag] = useState('');
    const [itemtagvalidation, setItemtagvalidation] = useState(true);

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

    const itemtagValidation = (any) => {
        if (any != "") {
            setItemtagvalidation(true);
            setItemTag(any);
        }
        else {
            setItemtagvalidation(false);
        }
    }
    const itemnameValidation = (any) => {
        if (any != "") {
            setItemnamevalidation(true);
            setItemname(any);
        }
        else {
            setItemnamevalidation(false);
        }
    }
    const locationValidation = (any) => {
        if (any != "") {
            setLocationvalidation(true);
            setLocation(any);
        }
        else {
            setLocationvalidation(false);
        }
    }
    const handleTextarea = (any) => {
        if (any != "") {
            setColor("#ffffff4d");
            setFontColor("white")
            setItemDesc(any.replace(/\n/g, "<br>"));
        }
        else {
            setFontColor("#f66")
            setColor('#f66')
        }
    }
    useEffect(() => {
        console.log(itemDesc)
    }, [itemDesc])

    return (
        <section className="overflow-auto addItemImg">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
            <p className="loginText">ADD THE ITEM'S INFO</p>
            <p className="loginDetail">Add critical item information that will help other users know what they're receiving .</p>
            <AuthInput title={"Item Name"} status={itemnamevalidation} placeholder={"E.g.Dress"} change={itemnameValidation} type={"text"} value={""} />
            <div>
                <p className="text-white" style={{ fontSize: "15px", color:fontColor }}>Item Description</p>
                <textarea className="w-full bg-transparent outline-none" rows="7" placeholder="Example Text" style={{ borderColor: color }} onChange={(e) => handleTextarea(e.target.value)} />
            </div>
            <AuthInput title={"Item's Location"} status={locationvalidation} placeholder={"E.g.John Doe"} change={locationValidation} type={"text"} value={""} />
            <AuthInput title={"Item Tags"} status={itemtagvalidation} placeholder={"E.g.John Doe"} change={itemtagValidation} type={"text"} value={""} />
            <div className="loginButton">
                <button className="flex items-center justify-center" onClick={() => handleComplete()}>Complete</button>
            </div>
        </section>
    )

}
export default AddItemInfo