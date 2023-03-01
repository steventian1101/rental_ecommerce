import { db } from "../lib/initFirebase";
import { collection, query, getDocs, doc, updateDoc, where } from "firebase/firestore";
import { httpsCallable, getFunctions } from "firebase/functions";
import { useAuth } from "../context/useAuth";
const getAndAddPmId = async (pm_id, email) => {
    let docID;
    const listCollectionRef = collection(db, 'users');
    let q = query(listCollectionRef, where("user_email", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        docID = doc.id;
    });
    const docRef = doc(db, "users", docID);
    const newdata = {
       pm_id: pm_id
    };
    console.log(newdata)
    updateDoc(docRef, newdata)
        .then((result) => {
        })
        .catch((error) => {
          console.log(error);
        });
}
export default getAndAddPmId
export async function createSource(detail, email){
    console.log(detail)
    const functions = getFunctions();
    const createCustomerSource = httpsCallable(functions, 'createCustomerSource');
    const result = await createCustomerSource({ data: detail});
    let docID;
    const listCollectionRef = collection(db, 'users');
    let q = query(listCollectionRef, where("user_email", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        docID = doc.id;
    });
    const docRef = doc(db, "users", docID);
    const newdata = {
       default_card_id: result.data.id
    };
    console.log(newdata)
    updateDoc(docRef, newdata)
        .then((result) => {
        })
        .catch((error) => {
          console.log(error);
        });
}