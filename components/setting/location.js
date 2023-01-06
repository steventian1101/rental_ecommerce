import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/useAuth"
import { updateDoc, deleteField, doc, collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/initFirebase"
import AuthInput from "../auth/authInput"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import Loading from "../auth/loading";
import { useRouter } from "next/router"
const Location = ({ setSideBar }) => {

    const listCollectionRef = collection(db, "users");
    const { userCredential } = useAuth();
    const [tempdata, setTempdata] = useState(null);
    const [add, setAdd] = useState(false);
    const [addressvalidation, setAddressvalidation] = useState(false);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(null);
    const router = useRouter();

    const getDetail = async (email) => {
        let temp = [];
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let tempArray = doc.data();
            if (typeof (tempArray["user_address"]) == "string") {
                console.log("okay")
                temp.push(tempArray["user_address"]);
            }
            if (typeof (tempArray["user_address"]) == "object") {
                console.log("object");
                for (let i in tempArray["user_address"]) {
                    temp.push(tempArray["user_address"][i]);
                }
            }


        });
        console.log(temp)
        setTempdata(temp);
    }
    const addressValidation = (any) => {
        let str = /([0-9A-Za-z])[,]?([0-9])[,]?[| ]?\bAustralia\b$/;
        if (str.test(any)) {
            setAddress(any)
            setAddressvalidation(true);
        } else {
            setAddressvalidation(false);
        }

    }
    const handleAdd = () => {
        if (addressvalidation) {
            setTempdata([...tempdata, address]);
            setAdd(false);
        }
    }
    const handledelete = (index) => {
        console.log(index)
        tempdata.splice(index, 1);
        setTempdata([...tempdata]);

    }
    const handleUpload = () => {
        if (tempdata.length > 0) {
            setLoading(true)
            updateUserAddress(userCredential.email);
        }

    }
    const updateUserAddress = async (email) => {
        console.log(email)
        let docID;
        const listCollectionRef = collection(db, 'users');
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            docID = doc.id;
        });
        const docRef = doc(db, "users", docID);
        const data = {
            user_address: deleteField(),
        };
        const newdata = {
            user_address: tempdata,
        };
        updateDoc(docRef, data)
            .then(() => {
            })
            .catch((error) => {
                console.log(error);
            });
        updateDoc(docRef, newdata)
            .then(() => {
                setLoading(false);
                window.location.reload();

            })
            .catch((error) => {
                console.log(error);
            });

    }

    useEffect(() => {
        userCredential.email && getDetail(userCredential.email);
    }, []);
    return (
        <>
            {
                loading ? <Loading /> : <></>
            }
            <section className="overflow-auto addProfileInfo">
                <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
                <p className="loginText">Add Location</p>
                <p className="loginDetail">Add all possible item location.</p>
                {
                    tempdata && tempdata.length > 0 ? tempdata.map((address, index) => (<div className="flex flex-col mb-3"><p className="text-white " style={{ fontFamily: "poppins-bold" }}>Address{index + 1}</p>
                        <div className="flex flex-row items-center justify-between"><p className="text-white">{address}</p><button className="flex items-center justify-center w-8 h-8 mr-4 text-base text-white rounded-lg hover:bg-blue-700" onClick={() => { handledelete(index) }}><FontAwesomeIcon icon={faTrash} className="text-xs" /></button></div></div>)) : <div className="flex flex-col"><p className="w-2/3 h-5 mb-3 detail-loading"></p><p className="h-6 detail-loading"></p></div>}
                {
                    !add ? <button className="flex items-center justify-center w-20 h-10 bg-white felx-row addlocationbutton" onClick={() => { setAdd(true) }}>
                        <FontAwesomeIcon icon={faPlus} className="mr-1 text-md" />
                        <p>Add</p>
                    </button> : <div className="flex flex-col w-full"><AuthInput title={"New Address"} status={addressvalidation} placeholder={"E.g.20 Echidna Ave, 2035, Australia"} change={addressValidation} type={"text"} value={""} />
                        <div className="flex flex-row justify-end">
                            <button className="flex items-center justify-center w-8 h-8 mr-4 text-base text-white rounded-lg hover:bg-blue-700" onClick={() => {
                                handleAdd()
                            }}><FontAwesomeIcon icon={faCheck} /></button>
                            <button className="flex items-center justify-center w-8 h-8 mr-1 text-base text-white rounded-lg hover:bg-blue-600" onClick={() => { setAdd(false) }}><FontAwesomeIcon icon={faTimes} /></button>
                        </div>
                    </div>
                }
                <div className="loginButton">
                    <button className="flex items-center justify-center" onClick={() => { handleUpload() }}>UPDATE</button>
                </div>
                {/* <button className="flex items-center justify-center w-20 h-10 bg-white felx-row addlocationbutton">
            <FontAwesomeIcon icon = {faPlus} className="mr-1 text-md"/>
            <p>Add</p>
        </button> */}
            </section>'
        </>
    )

}
export default Location