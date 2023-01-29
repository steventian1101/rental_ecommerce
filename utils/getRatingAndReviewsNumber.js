import { doc, getDocs, collection, query, where } from "firebase/firestore"
import { db } from "../lib/initFirebase"
const getRatingAndReviewNumbers =  async (id) =>{
    const temp = [];
    let i = 0;
    let average = 0 ;
    let sum = 0;
    const listCollectionRef = collection(db, 'bookings');
    let q = query(listCollectionRef, where("item_id","==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)=>{
        if(doc.data().owner_feedback){
            i++;
            temp.push(doc.data().owner_rating)
        }
    })
    for (let j in temp){
        sum = sum + Number(temp[j])
    }
    average = Number(sum/(temp.length)).toFixed(2)
    const result = {
        reviewNumber:i,
        rating:average
    }
    return result
}
export const getRatingAndReviewNumbersForOwner = async  (email) => {
    const temp = [];
    let i = 0;
    let average = 0 ;
    let sum = 0;
    const listCollectionRef = collection(db,"bookings");
    let q = query(listCollectionRef, where("owner_email","==",email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)=>{
        if(doc.data().owner_feedback){
            i++;
            temp.push(doc.data().owner_rating)
        }
    });
    for (let j in temp){
        sum = sum + Number(temp[j])
    }
    average = Number(sum/(temp.length)).toFixed(2)
    const result = {
        reviewNumber:i,
        rating:average
    }
    return result


}
export default getRatingAndReviewNumbers