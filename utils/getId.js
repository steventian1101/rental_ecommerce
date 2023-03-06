import { db } from "../lib/initFirebase";
import { collection, query, getDocs, doc, updateDoc, where, set } from "firebase/firestore";
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
export default getAndAddPmId;
export async function createSource(detail) {
  let docID;
  const functions = getFunctions();
  const createCustomerSource = httpsCallable(functions, 'createCustomerSource');
  const result = await createCustomerSource({ data: detail });
  console.log(result);
  // const listCollectionRef = collection(db, 'users');
  // let q = query(listCollectionRef, where("user_email", "==", detail.email));
  // const querySnapshot = await getDocs(q);
  // querySnapshot.forEach((doc) => {
  //   docID = doc.id;
  //   console.log(doc.id)
  // });
  // const docRef = doc(db, "users", docID);
  // console.log(result)
  // const data = {
  //   account_id: result.data.id
  // };
  // console.log(data) 
  // await updateDoc(docRef,data)
  //   .then((result) => {
  //     // if (typeof window !== "undefined" && "localStorage" in window && localStorage.getItem("beforeAddPayment")) {
  //     //   let url = localStorage.getItem("beforeAddPayment");
  //     //   router.push(url)
  //     // } else {
  //     //   router.push('/setting');
  //     // }
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
}
export async function retrieveSource(acc_id){
  const functions = getFunctions();
  const retrieveAccount = httpsCallable(functions, 'retrieveAccount');
  const result = await retrieveAccount({ data: acc_id });
  return result;
}