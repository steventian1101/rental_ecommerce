import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { db } from "../../lib/initFirebase"
import { updateDoc, deleteField, doc, getDoc, FieldValue } from "firebase/firestore";
import { useState, useEffect } from "react";
import DetailCarousel from "./detailCarousel";

const Detail = ({ id, setSideBar, setDetail, setItemID }) => {


    const [content, setContent] = useState(null);
    const [viewnumber, setViewnumber] = useState(null);
    console.log(id)
    const handleback = () => {
        setSideBar(<></>)
        setDetail(<></>)
        setItemID(null);
    }
    const getDetail = async (id) => {
        const docRef = doc(db, "rental_items", id);
        let querySnapshot = await getDoc(docRef);
        let tempdata = querySnapshot.data();
        setContent(tempdata);
    }
    useEffect(() => {
        id && getDetail(id);
    }, [])
    useEffect(() => {
        content && setViewnumber(Number(content["item_views"]) + 1);
    }, [content]);
    useEffect(() => {
        if (viewnumber) {
            const docRef = doc(db, "rental_items", id);
            const newdata = {
                item_views: viewnumber,
            };
            updateDoc(docRef, newdata)
                .then(() => {
                })
                .catch((error) => {
                    console.log(error);
                });

        }
    }, [viewnumber])
    return (
        <section className="fixed top-0 right-0 z-50 bg-white detail">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer" onClick={handleback}><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" /></div>
            {
                content && <DetailCarousel imgArray={content["item_photos"]} />
            }
            <p className="text-white detailTitle">{content && content["item_name"]}</p>
            <div className="flex flex-row flex-wrap">
                <div className="flex flex-row flex-wrap detailpart">
                    <p className="text-white font-15 mb-2.5" style={{ borderRight: "solid 1px #ffffff4d", padding: "0px 10px 0px 0px" }}>{content && content["item_rating"] + ' - ' + content["item_reviews"].length + " Reviews"}</p>
                    <p className="text-white font-15 mb-2.5" style={{ borderRight: "solid 1px #ffffff4d", padding: "0px 10px 0px 10px" }}>mins away</p>
                    <p className="text-white font-15 mb-2.5" style={{ borderRight: "solid 1px #ffffff4d", padding: "0px 10px 0px 10px" }}>{content && (Number(content["item_views"]) + 1) + " views "}</p>
                </div>
            </div>
        </section>
    )

}
export default Detail