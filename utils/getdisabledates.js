import { db } from "../lib/initFirebase";
import { updateDoc, doc, getDoc, collection, getDocs, where, query, addDoc, serverTimestamp } from "firebase/firestore";
import date from "date-and-time";
import timediff from "timediff";
const time = [
    "12:00 AM",
    "01:00 AM",
    "02:00 AM",
    "03:00 AM",
    "04:00 AM",
    "05:00 AM",
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
    "11:00 PM",
];
const month = {
    "0": "January",
    "1": "February",
    "2": "March",
    "3": "April",
    "4": "May",
    "5": "June",
    "6": "July",
    "7": "August",
    "8": "September",
    "9": "October",
    "10": "November",
    "11": "December"
};
export async function getdisabledates(id, content) {
    const temp = await getdisabletimes(id, content);
    return temp;
}

const getItem = async (id) => {
    const temp = [];
    const listCollectionRef = collection(db, 'bookings');
    let q = query(listCollectionRef, where("item_id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        temp.push(doc.data())
    })
    return temp;
}
const getdisabletimes = async (id, content) => {
    const temp = [];
    const disabledates = [];
    const items = await getItem(id);
    items.forEach((item) => {
        temp.push(item);
    });
    if (content && content["item_charge_rate"] == "day") {
        for (let i in temp) {
            let disabletemp = [];
            const duration = Math.abs(Number(temp[i].result) / (1.35 * Number(content.item_charge)));
            for (let j = 0; j < duration; j++) {
                if (j == 0) {
                    disabletemp[j]=(new Date(temp[i].start_date + " " + time[temp[i].start_time]));
                    if(duration == 1){
                        disabletemp.push(date.addDays(disabletemp[j],1))
                    }
                }
                else {
                    let nextdate = date.addDays(new Date(disabletemp[j - 1]), 1)
                    disabletemp[j] = nextdate
                }
            }
            disabledates.push.apply(disabledates, disabletemp);
        }
    }
    if (content && content.item_charge_rate == "hour") {
        for (let i in temp) {
            let disabletemp = [];
            const duration = Math.abs(Number(temp[i].result) / (1.35 * Number(content.item_charge)));
            const enddate = date.addHours(new Date(temp[i].start_date + " " + time[temp[i].start_time]), duration);
            const days = (timediff(new Date(temp[i].start_date + " " + time[temp[i].start_time]),enddate,'D')).days;
            if(days != 0){
                for (let j = 0; j <= days; j++) {
                    if (j == 0) {
                        disabletemp[j]=(new Date(temp[i].start_date + " " + time[temp[i].start_time]));
                    }
                    else {
                        let nextdate = date.addDays(new Date(disabletemp[j - 1]), 1)
                        disabletemp[j] = nextdate
                    }
                }
                disabledates.push(disabletemp);
            }
            if(days ==  0){
                let tempdate = new Date(temp[i].start_date + " " + time[temp[i].start_time]);
                disabledates.push(tempdate)
            }
            
        }
    }
    if (content && content.item_charge_rate == "week") {
        for (let i in temp) {
            let disabletemp = [];
            const duration = Math.abs(Number(temp[i].result) / (1.35 * Number(content.item_charge)));
            for (let j = 0; j <= duration * 7; j++) {
                if (j == 0) {
                    disabletemp[j]=(new Date(temp[i].start_date + " " + time[temp[i].start_time]));
                }
                else {
                    let nextdate = date.addDays(new Date(disabletemp[j - 1]), 1)
                    disabletemp[j] = nextdate
                }
            }
            disabledates.push.apply(disabledates, disabletemp);
        }
    }
    if(content && content.item_charge_rate == "person"){
        for( let i in temp){
        disabledates.push(new Date(temp[i].start_date + " " + time[temp[i].start_time]));}
    }
    if (content && content.item_charge_rate == "month") {
        for (let i in temp) {
            let disabletemp = [];
            const duration = Math.abs(Number(temp[i].result) / (1.35 * Number(content.item_charge)));
            const enddate = date.addMonths(new Date(temp[i].start_date + " " + time[temp[i].start_time]), duration);
            const days = (timediff(new Date(temp[i].start_date + " " + time[temp[i].start_time]),enddate,'D')).days;

            if(days != 0){
                for (let j = 0; j <= days; j++) {
                    if (j == 0) {
                        disabletemp[j]=(new Date(temp[i].start_date + " " + time[temp[i].start_time]));
                    }
                    else {
                        let nextdate = date.addDays(new Date(disabletemp[j - 1]), 1)
                        disabletemp[j] = nextdate
                    }
                }
                disabledates.push.apply(disabledates, disabletemp);
            }
        }
    }
    return disabledates;
}