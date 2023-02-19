import { query, where, getDocs, collection } from "firebase/firestore";
import { db } from "../../lib/initFirebase";
import { useState, useEffect } from "react";
import CardCarousel from "./cardCarousel";
const OwnerItemcard = ({ details }) => {
    const [ownerData, setOwnerData] = useState(null);
    const getOwnerDetail = async (email) => {
        const temp = [];
        const listCollectionRef = collection(db, "users");
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(doc.data());
        });
        setOwnerData(temp)
    }
    useEffect(() => {
        details.rental_owner && getOwnerDetail(details.rental_owner);
    }, [])
    return (
        <>{
            details && ownerData && ownerData.length > 0?<div className="relative ownerItemcard">
            <CardCarousel imgArray = { details.item_photos} id={details.item_id} location = {details.item_location}/>
            <p className="text-white itemcardname">{ details.item_name}</p>
            <p className="itemcardownernameandprice">{ ownerData && ownerData.length > 0 && ownerData[0]["nick_name"]}</p>
            <p className="itemcardownernameandprice mb-2.5">Min. { "$"+Number(details["item_charge"]).toFixed(2)+"/"+details.item_charge_rate}</p>
        </div>:<div className="ownerItemcard">
            <div className="carousel">
                <div className="w-full h-full detail-loading"></div>
            </div>
            <div className="flex flex-row items-center justify-between my-4">
                <div style={{ width: "40px", height: "40px", borderRadius: "100px" }} className="detail-loading"></div>
                <div style={{ width: "85%" }} className="flex flex-col justify-start">
                    <div style={{ width: "90%", height: "20px", marginBottom: "10px" }} className="detail-loading"></div>
                    <div style={{ width: "70%", height: "20px" }} className="detail-loading"></div>
                </div>
            </div>
        </div>
        }
        </>
        // <div className="relative ownerItemcard">
        //     <CardCarousel imgArray = { details.item_photos}/>
        //     <p className="text-white itemcardname">{ details.item_name}</p>
        //     <p className="itemcardownernameandprice">{ ownerData && ownerData.length > 0 && ownerData[0]["nick_name"]}</p>
        //     <p className="itemcardownernameandprice mb-2.5">Min. { "$"+Number(details["item_charge"]).toFixed(2)+"/"+details.item_charge_rate}</p>
        // </div>
        // <div className="ownerItemcard">
        //     <div className="carousel">
        //         <div className="w-full h-full detail-loading"></div>
        //     </div>
        //     <div className="flex flex-row items-center justify-between my-4">
        //         <div style={{ width: "40px", height: "40px", borderRadius: "100px" }} className="detail-loading"></div>
        //         <div style={{ width: "85%" }} className="flex flex-col justify-start">
        //             <div style={{ width: "90%", height: "20px", marginBottom: "10px" }} className="detail-loading"></div>
        //             <div style={{ width: "70%", height: "20px" }} className="detail-loading"></div>
        //         </div>
        //     </div>
        // </div>
    )

}
export default OwnerItemcard