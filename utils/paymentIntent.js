import { db } from "../lib/initFirebase";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable, getFunctions } from "firebase/functions";
export async function createPi(pm_id, budget, customer_id) {
    const functions = getFunctions();
    const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
    const detail = {
        pm_id:pm_id,
        result:Number(budget)*1000,
        cus_id:customer_id
    }
    let result = await createPaymentIntent({ data: detail })
    return result;
}
export async function capturePi(pi_id){
    console.log(pi_id)
    const functions = getFunctions();
    const capturePaymentIntent = httpsCallable(functions, 'capturePaymentIntent');
    const detail = {
        pi_id:pi_id,
    }
    let result = await capturePaymentIntent({ data: detail })
    console.log(result)

}