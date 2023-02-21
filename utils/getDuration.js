import { collection, query, startAt, getDocs, limit } from "firebase/firestore";
import { db } from "../lib/initFirebase";
import { getFunctions, httpsCallable } from "firebase/functions"
const listCollectionRef = collection(db, 'users');
const storeDurationToSessionstorag = async () => {
    if (sessionStorage.getItem("durationResult") == "listed") {
        return "success";
    }
    let [someResult, anotherResult] = await Promise.all([position(), loadData()]);
    for (let i in anotherResult) {
        if (typeof anotherResult[i]["user_address"] === 'object' && Array.isArray(anotherResult[i]["user_address"])) {
            for (let j in anotherResult[i]["user_address"]) {
                let position_result = await Promise.all([ownerGeoLocation(anotherResult[i]["user_address"][j])]);
                const geodata = {
                    "originLat": someResult[0],
                    "originLng": someResult[1],
                    "destinationLat": position_result[0].geometry["location"].lat,
                    "destinationLng": position_result[0].geometry["location"].lng,
                }
                let resultOfDuration = await Promise.all([duration(geodata)]);
                if (resultOfDuration[0].data.rows[0].elements[0]["status"] != "OK") {
                    localStorage.setItem(JSON.stringify(anotherResult[i]["user_address"][j]), "More time");
                }
                if (resultOfDuration[0].data.rows[0].elements[0].status == "OK") {
                    let data = resultOfDuration[0].data.rows[0].elements[0].duration.text ;
                    localStorage.setItem(JSON.stringify(anotherResult[i]["user_address"][j]), data);
                }
            }
        }
        if (typeof anotherResult[i]["user_address"] === 'string'){
                let position_result = await Promise.all([ownerGeoLocation(anotherResult[i]["user_address"])]);
                const geodata = {
                    "originLat": someResult[0],
                    "originLng": someResult[1],
                    "destinationLat": position_result[0].geometry["location"].lat,
                    "destinationLng": position_result[0].geometry["location"].lng,
                }
                let resultOfDuration = await Promise.all([duration(geodata)]);
                if (resultOfDuration[0].data.rows[0].elements[0]["status"] != "OK") {
                    localStorage.setItem(JSON.stringify(anotherResult[i]["user_address"]), "More times");
                }
                if (resultOfDuration[0].data.rows[0].elements[0].status == "OK") {
                    let data = resultOfDuration[0].data.rows[0].elements[0].duration.text;
                    localStorage.setItem(JSON.stringify(anotherResult[i]["user_address"]), data);
                }

        }
    }
    localStorage.setItem("durationResult", "listed");
    return "success";

}
export default storeDurationToSessionstorag;
const loadData = async () => {
    const temp = [];
    let q = query(listCollectionRef, limit(10000));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        temp.push(doc.data())
    });
    return temp;
}
const position = async () => {
    const temp = [];
    await navigator.geolocation.getCurrentPosition(
        position => {
            temp[0] = position.coords.latitude;
            temp[1] = position.coords.longitude;
        }
        ,
        err => console.log(err)
    );
    return temp;
}
const ownerGeoLocation = async (address) => {
    let tempData = [];
    let temp = address.replaceAll(",", "%2c");
    temp = temp.replaceAll(" ", "%20");
    let url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + temp + "&key=" + process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
    await fetch(url)
        .then((response) => response.json())
        .then((data) => { tempData = data.results[0] })
    return tempData;
}
const duration = async (geodata) => {
    const functions = getFunctions();
    const getDuration = httpsCallable(functions, 'getDuration');
    const temp = await getDuration({ data: geodata });
    return temp;

}