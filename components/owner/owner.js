import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import { updateDoc,deleteField,doc,collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/initFirebase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
const Owner = () =>{
    const { userCredential } = useAuth();
    const [ownerImg, setOwnerImg] = useState('');
    const [tempData, setTempdata] = useState([]);
    useEffect(()=>{
          userCredential.email && getDetail(userCredential.email)
    },[userCredential]);
    const getDetail = async (email) =>{
        let temp = [];
        const listCollectionRef = collection(db, 'users');
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(doc.data());
        });
        console.log(temp)
        setTempdata(temp);
    }
    return(
        <section className="w-full bg-black">
            <div className="relative w-full" style={{ height:"400px"}}>
                <div className="gradient"></div>
                {
                    tempData && tempData.length > 0 ?<img src={ tempData && tempData.length > 0 ? tempData[0].profile_img:''} className="object-cover w-full h-full "/>:<div className="w-full h-full detail-loading"></div>
                }
                {/* <img src={ tempData && tempData.length > 0 ? tempData[0].profile_img:''} className="object-cover w-full h-full "/>
                <div className="w-full h-full detail-loading"></div> */}
            </div>
            <div>
                <p className="mb-5 text-center ownerText">{tempData && tempData.length > 0 ? tempData[0].nick_name.toUpperCase():''}</p>
            </div>
            <div className="flex flex-row justify-center" style={{width:"90vw", margin:"auto"}}>
                <button className="flex flex-row ownerMessage"><img src="/logo/message.svg" className="fontIcon"/><p style={{ fontSize:"15px", color:"white"}}>Message Us</p></button>
                <button className="flex flex-row ownerMessage ownerWebsite"><img src="/logo/website.svg" className="fontIcon"/><p style={{ fontSize:"15px", color:"white"}}>Website</p></button>
                <button className="ownerRating">4.7 star(52 reviews)</button>
            </div>
            <div style={{ width:"90vw", background:"#ffffff33", height:"1px", marginRight:"auto", marginLeft:"auto", marginTop:"40px", marginBottom:"70px"}}></div>
            <div className="flex flex-row justify-center ownerItemBoard flex-nowrap">
                <div className="flex flex-col items-center justify-center addItem">
                    <FontAwesomeIcon icon={faPlus} style={{ color:"white", fontSize:"40px"}}/>
                    <p className="text-white">Add a new item</p>
                </div>
            </div>
        </section>
    )

}
export default Owner