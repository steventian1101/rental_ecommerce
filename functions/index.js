const functions = require("firebase-functions");
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const timediff = require('timediff');
const date = require('date-and-time');
var admin = require("firebase-admin");

const time = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
]
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
var serviceAccount = require("./path/to/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = getFirestore();

const algoliasearch = require('algoliasearch');
const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;
const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('items');


exports.addToIndex = functions.firestore.document('rental_items/{docId}')

    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = snapshot.id;
        return index.saveObject({ ...data, objectID });
    });
exports.updateIndex = functions.firestore.document('rental_items/{docId}')

    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;
        return index.saveObject({ ...newData, objectID });
    });
exports.deleteFromIndex = functions.firestore.document('rental_items/{docId}')

    .onDelete(snapshot => index.deleteObject(snapshot.id));
exports.updateStatus = functions.pubsub.schedule('every 2 minutes').onRun(async (context) => {
    const temp = [];
    var start_date = '';
    var end_date = '';
    const serverTime = admin.firestore.Timestamp.now();
    const realdate = serverTime.toDate().getTime();

    const querySnapshot = await db.collection('bookings').get();
    await db.collection('tables').add({
       "servertime":realdate
    });
    querySnapshot.forEach((doc) => {
        var tempobject = Object.assign(doc.data(), { booking_id: doc.id })
        temp.push(tempobject);
    })
    for (var i in temp) {
        start_date = new Date(temp[i]["start_date"] + " " + time[temp[i]["start_time"]] + " " + "UTC+11");
        var itemdataRef = db.collection('rental_items').doc(temp[i]["item_id"]);
        var item_data = await itemdataRef.get();
        var item_charge_rate = item_data.data()["item_charge_rate"];
        const duration = Math.abs(Number(temp[i].result) / (1.35 * Number(item_data.data()["item_charge"])));
        if(item_charge_rate == "hour"){
            end_date = date.addHours(start_date, duration);
        }
        if(item_charge_rate == "day"){
            end_date = date.addDays(start_date, duration);
        }
        if(item_charge_rate == "week"){
            end_date = date.addDays(start_date, Number(duration)*7);
        }
        if(item_charge_rate == "month"){
            end_date = date.addMonths(start_date, duration);
        }
        if(item_charge_rate == "person"){
            var temp_date = date.addDays(start_date, 1);
            end_date = new Date(temp_date.getMonth()+" "+temp_date.getDate()+", "+temp_date.getFullYear+" 00:00:00 UTC+11");
        }
        if (start_date.getTime() < realdate) {
            if (temp[i]["status"] == "0") {
                var owner = '';
                var customer = '';
                const usersRef = db.collection('users');
                const snapshot = await usersRef.where('user_email', '==', temp[i]["owner_email"]).get();
                snapshot.forEach(doc => {
                   var tempdata = doc.data();
                   owner = tempdata.nick_name;
                });
                const customersnapshot = await usersRef.where('user_email', '==', temp[i]["customer_email"]).get();
                customersnapshot.forEach(doc => {
                   var tempdata = doc.data();
                   customer = tempdata.first_name+" "+tempdata.last_name;
                });
                const itemRef = db.collection('rental_items').doc(temp[i]["item_id"]);
                const itemdata = await itemRef.get();
                const itemname = itemdata.data().item_name;
                if(customer != ""){
                    await db.collection('notifications').add({
                        to:temp[i]["owner_email"],
                        notificationContent:customer+"'s booking of "+itemname + " has decliend because you did not accept booking request.",
                        time:serverTime,
                        show:false,
                        status:0
                    });
                    await db.collection('notifications').add({
                        to:temp[i]["customer_email"],
                        notificationContent:owner+" has decliend your bookings of " + itemname,
                        time:serverTime,
                        show:false,
                        status:0
                    });

                }
                else{
                    await db.collection('notifications').add({
                        to:temp[i]["owner_email"],
                        notificationContent:temp[i]["customer_email"]+"'s booking of "+itemname + " has decliend because you did not accept booking request.",
                        time:serverTime,
                        show:false,
                        status:0
                    });

                }
                await db.collection('bookings').doc(temp[i]["booking_id"]).delete();
               
            }
            if(temp[i]["status"] == "1"){
                var bookingRef = db.collection('bookings').doc(temp[i]["booking_id"]);
                await bookingRef.update({status: 2});
                var owner = '';
                var customer = '';
                const usersRef = db.collection('users');
                const snapshot = await usersRef.where('user_email', '==', temp[i]["owner_email"]).get();
                snapshot.forEach(doc => {
                   var tempdata = doc.data();
                   owner = tempdata.nick_name;
                });
                const customersnapshot = await usersRef.where('user_email', '==', temp[i]["customer_email"]).get();
                customersnapshot.forEach(doc => {
                   var tempdata = doc.data();
                   customer = tempdata.first_name+" "+tempdata.last_name;
                });
                const itemRef = db.collection('rental_items').doc(temp[i]["item_id"]);
                const itemdata = await itemRef.get();
                const itemname = itemdata.data().item_name;
                if(customer != ""){
                    await db.collection('notifications').add({
                        to:temp[i]["owner_email"],
                        notificationContent:customer+"'s booking of "+itemname + " has started.",
                        time:serverTime,
                        show:false,
                        status:3
                    });
                    await db.collection('notifications').add({
                        to:temp[i]["customer_email"],
                        notificationContent:"Your booking of the "+itemname+" has started.",
                        time:serverTime,
                        show:false,
                        status:3
                    });

                }
                else{
                    await db.collection('notifications').add({
                        to:temp[i]["owner_email"],
                        notificationContent:temp[i]["customer_email"]+"'s booking of "+itemname + " has started.",
                        time:serverTime,
                        show:false,
                        status:3
                    });

                }

            }
        }
        if(temp[i]["status"] == "2" && end_date.getTime() < realdate){
            var bookingRef = db.collection('bookings').doc(temp[i]["booking_id"]);
            await bookingRef.update({status: 3});
            var owner = '';
            var customer = '';
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('user_email', '==', temp[i]["owner_email"]).get();
            snapshot.forEach(doc => {
               var tempdata = doc.data();
               owner = tempdata.nick_name;
            });
            const customersnapshot = await usersRef.where('user_email', '==', temp[i]["customer_email"]).get();
            customersnapshot.forEach(doc => {
               var tempdata = doc.data();
               customer = tempdata.first_name+" "+tempdata.last_name;
            });
            const itemRef = db.collection('rental_items').doc(temp[i]["item_id"]);
            const itemdata = await itemRef.get();
            const itemname = itemdata.data().item_name;
            if(customer != ""){
                await db.collection('notifications').add({
                    to:temp[i]["owner_email"],
                    notificationContent:customer+"'s booking of "+itemname + " has been completed.",
                    time:serverTime,
                    show:false,
                    status:4
                });
                await db.collection('notifications').add({
                    to:temp[i]["customer_email"],
                    notificationContent:"Your booking of the "+itemname+" has been completed.",
                    time:serverTime,
                    show:false,
                    status:4
                });

            }
            else{
                await db.collection('notifications').add({
                    to:temp[i]["owner_email"],
                    notificationContent:temp[i]["customer_email"]+"'s booking of "+itemname + " has been completed.",
                    time:serverTime,
                    show:false,
                    status:4
                });

            }
        }


    }

});