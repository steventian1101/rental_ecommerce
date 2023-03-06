import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import { updateDoc, deleteField, doc, collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/initFirebase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import OwnerItemcard from "./ownerItemcard";
import { getRatingAndReviewNumbersForOwner } from "../../utils/getRatingAndReviewsNumber";
const   Owner = () => {
    const { userCredential } = useAuth();
    const [ownerImg, setOwnerImg] = useState('');
    const [tempData, setTempdata] = useState([]);
    const listCollectionRef = collection(db, 'users');
    const itemListCollectionRef = collection(db, 'rental_items');
    const [items, setItems] = useState(null);
    const [reviewNumbers, setReviewNumbers] = useState(null);
    useEffect(() => {
        userCredential.email && getDetail(userCredential.email);
        userCredential.email && getRentalItems(userCredential.email);
        userCredential.email && getRatingAndReviewNumbersForOwner(userCredential.email).then((result)=>{
            setReviewNumbers(result);
        })
    }, [userCredential?.email]);
    const getDetail = async (email) => {
        let temp = [];
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(doc.data());
        });
        setTempdata(temp);
    }
    const getRentalItems = async (email) => {
        let temp = [];
        let q = query(itemListCollectionRef, where("rental_owner", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            var tempobject = Object.assign(doc.data(), { item_id: doc.id })
            temp.push(tempobject);
        });
        setItems(temp);
    }
    return (
        <section className="w-full my-20 bg-black owner">
            <div className="relative w-full" style={{ height: "400px" }}>
                <div className="gradient"></div>
                {
                    tempData && tempData.length > 0 ? <img src={tempData && tempData.length > 0 ? tempData[0].profile_img : ''} className="object-cover w-full h-full " /> : <div className="w-full h-full detail-loading"></div>
                }
                {/* <img src={ tempData && tempData.length > 0 ? tempData[0].profile_img:''} className="object-cover w-full h-full "/>
                <div className="w-full h-full detail-loading"></div> */}
            </div>
            <div>
                <p className="mb-5 text-center ownerText">{tempData && tempData.length > 0 ? tempData[0].nick_name.toUpperCase() : ''}</p>
            </div>
            <div className="flex flex-row justify-center" style={{ width: "90vw", margin: "auto" }}>
                <button className="flex flex-row ownerMessage"><img src="/logo/message.svg" className="fontIcon" /><p style={{ fontSize: "15px", color: "white" }}>Message Us</p></button>
                <Link href={tempData && tempData.length > 0 ? "https://" + tempData[0]["website"] : ""}>
                    <button className="flex flex-row ownerMessage ownerWebsite"><img src="/logo/website.svg" className="fontIcon" /><p style={{ fontSize: "15px", color: "white" }}>Website</p></button> </Link>
                {
                    reviewNumbers && reviewNumbers.reviewNumber != 0 && <button className="ownerRating">{
                        reviewNumbers.rating + " Star (" + reviewNumbers.reviewNumber + " Reviews)"
                    }</button>
                }


            </div>
            <div style={{ width: "90vw", background: "#ffffff33", height: "1px", marginRight: "auto", marginLeft: "auto", marginTop: "40px", marginBottom: "70px" }}></div>
            <div className="flex flex-row flex-wrap justify-center w-full ownerItemBoard">
                <Link href="/create" className="flex w-full addItemLink"><div className="flex flex-col items-center justify-center addItem">
                    <FontAwesomeIcon icon={faPlus} style={{ color: "white", fontSize: "40px" }} />
                    <p className="text-white">Add a new item</p>
                </div></Link>
                {
                    items && items.length > 0 && items.map((item) =>
                        (<OwnerItemcard details={item} />))
                }
            </div>
        </section>
    )

}
export default Owner