import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import { updateDoc,deleteField,doc,collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/initFirebase"
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
                <img src={ tempData && tempData.length > 0 && tempData[0].profile_img} className="object-cover w-full h-full "/>
            </div>
            <div>
                <p className="text-center loginText" style={{ fontSize:"50px"}}>{tempData && tempData.length > 0 && tempData[0].nick_name.toUpperCase()}</p>
            </div>

        </section>
    )

}
export default Owner