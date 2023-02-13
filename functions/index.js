const functions = require("firebase-functions");
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const date = require('date-and-time');
const stripe = require('stripe')('sk_test_51IH8sJAZAQKiaOfYxdO4oKTRXeX0Nox65R7opwGOcSgxMDeQ42udiV9gvAGp8bH6MKW0mFUAVTlso0mIzZI17kEe00ifqlV1Mi');
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
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
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

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
exports.createStripeCustomer = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        getID().then((id) => {
            res.status(200).send({ result: id })
        });
    })
});
exports.uploadStripeCustomer = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        var detail = req.body.data.data;
        updateCustomer(detail.customer_id, detail.customer_email, detail.customer_name, detail.customer_phone).then((result) => {
            res.status(200).send({ data: result });
        });
    })
});
async function getID() {
    const customer = await stripe.customers.create();
    return customer.id;
}
async function updateCustomer(id, customer_email, customer_name, customer_phone) {
    const customer = await stripe.customers.update(
        id,
        {
            email: customer_email,
            name: customer_name,
            phone: customer_phone
        }
    );
    return customer;
}
exports.updateStatus = functions.pubsub.schedule('every 2 minutes').onRun(async (context) => {
    const temp = [];
    var start_date = '';
    var end_date = '';
    const serverTime = admin.firestore.Timestamp.now();
    const realdate = serverTime.toDate().getTime();

    const querySnapshot = await db.collection('bookings').get();
    await db.collection('tables').add({
        "servertime": realdate
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
        if (item_charge_rate == "hour") {
            end_date = date.addHours(start_date, duration);
        }
        if (item_charge_rate == "day") {
            end_date = date.addDays(start_date, duration);
        }
        if (item_charge_rate == "week") {
            end_date = date.addDays(start_date, Number(duration) * 7);
        }
        if (item_charge_rate == "month") {
            end_date = date.addMonths(start_date, duration);
        }
        if (item_charge_rate == "person") {
            var temp_date = date.addDays(start_date, 1);
            end_date = new Date(temp_date.getMonth() + " " + temp_date.getDate() + ", " + temp_date.getFullYear + " 00:00:00 UTC+11");
        }
        if (start_date.getTime() < realdate) {
            await db.collection('tables').add({
                "it is start": start_date.getTime()
            });
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
                    customer = tempdata.first_name + " " + tempdata.last_name;
                });
                const itemRef = db.collection('rental_items').doc(temp[i]["item_id"]);
                const itemdata = await itemRef.get();
                const itemname = itemdata.data().item_name;
                if (customer != "") {
                    await db.collection('notifications').add({
                        to: temp[i]["owner_email"],
                        notificationContent: customer + "'s booking of " + itemname + " has decliend because you did not accept booking request.",
                        time: serverTime,
                        show: false,
                        status: 0
                    });
                    await db.collection('notifications').add({
                        to: temp[i]["customer_email"],
                        notificationContent: owner + " has decliend your bookings of " + itemname,
                        time: serverTime,
                        show: false,
                        status: 0
                    });

                }
                else {
                    await db.collection('notifications').add({
                        to: temp[i]["owner_email"],
                        notificationContent: temp[i]["customer_email"] + "'s booking of " + itemname + " has decliend because you did not accept booking request.",
                        time: serverTime,
                        show: false,
                        status: 0
                    });

                }
                await db.collection('bookings').doc(temp[i]["booking_id"]).delete();

            }
            if (temp[i]["status"] == "1") {
                var bookingRef = db.collection('bookings').doc(temp[i]["booking_id"]);
                await bookingRef.update({ status: 2 });
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
                    customer = tempdata.first_name + " " + tempdata.last_name;
                });
                const itemRef = db.collection('rental_items').doc(temp[i]["item_id"]);
                const itemdata = await itemRef.get();
                const itemname = itemdata.data().item_name;
                if (customer != "") {
                    await db.collection('notifications').add({
                        to: temp[i]["owner_email"],
                        notificationContent: customer + "'s booking of " + itemname + " has started.",
                        time: serverTime,
                        show: false,
                        status: 3
                    });
                    await db.collection('notifications').add({
                        to: temp[i]["customer_email"],
                        notificationContent: "Your booking of the " + itemname + " has started.",
                        time: serverTime,
                        show: false,
                        status: 3
                    });

                }
                else {
                    await db.collection('notifications').add({
                        to: temp[i]["owner_email"],
                        notificationContent: temp[i]["customer_email"] + "'s booking of " + itemname + " has started.",
                        time: serverTime,
                        show: false,
                        status: 3
                    });

                }

            }
        }
        if (temp[i]["status"] == "2" && end_date.getTime() < realdate) {
            await db.collection('tables').add({
                "it is end": end_date.getTime()
            });
            var bookingRef = db.collection('bookings').doc(temp[i]["booking_id"]);
            await bookingRef.update({ status: 3 });
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
                customer = tempdata.first_name + " " + tempdata.last_name;
            });
            const itemRef = db.collection('rental_items').doc(temp[i]["item_id"]);
            const itemdata = await itemRef.get();
            const itemname = itemdata.data().item_name;
            if (customer != "") {
                await db.collection('notifications').add({
                    to: temp[i]["owner_email"],
                    notificationContent: customer + "'s booking of " + itemname + " has been completed.",
                    time: serverTime,
                    show: false,
                    status: 4
                });
                await db.collection('notifications').add({
                    to: temp[i]["customer_email"],
                    notificationContent: "Your booking of the " + itemname + " has been completed.",
                    time: serverTime,
                    show: false,
                    status: 4
                });

            }
            else {
                await db.collection('notifications').add({
                    to: temp[i]["owner_email"],
                    notificationContent: temp[i]["customer_email"] + "'s booking of " + itemname + " has been completed.",
                    time: serverTime,
                    show: false,
                    status: 4
                });

            }
        }


    }

});
exports.createPaymentMethod = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        var detail = req.body.data.data;
        attachPaymentMethodToCustomer(detail.card_number, detail.expiry_month, detail.expiry_year, detail.cvv, detail.customer_id).then((result) => {
            res.status(200).send({ data: result })
        });

    })
});
async function attachPaymentMethodToCustomer(card_number, exp_month, exp_year, cvc, customer_id) {
    var number = card_number.replaceAll(" ", "");
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            number: number,
            exp_month: Number(exp_month),
            exp_year: Number(exp_year),
            cvc: cvc,
        },
    });
    var pm_id = paymentMethod.id;
    const addcustomerPaymentMethod = await stripe.paymentMethods.attach(
        pm_id,
        { customer: customer_id }
    );
    return addcustomerPaymentMethod;
    // createPayment(card_number, expiry_month, expiry_year, cvv).then((result)=>{
    //    return result;
    //     attachPayment(paymentID, customer_id).then((result)=>{
    //         return result;
    //     })
    // })
}
exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        var detail = req.body.data.data;
        createIntent(detail).then((result) => {
            res.status(200).send({ data: result })
        });

    })
});
async function createIntent(detail) {
    const paymentIntent = await stripe.paymentIntents.create({
        customer: detail.customer_id,
        amount: Number(detail.total),
        currency: 'aud',
        automatic_payment_methods: { enabled: true },
    });
    return paymentIntent
}
exports.confirmPaymentIntent = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        confirmIntent().then((result) => {
            res.status(200).send({ data: result })
        });
    })
});
async function confirmIntent() {
    const confirmpaymentIntent = await stripe.paymentIntents.confirm(
        'pi_3MZ1iQAZAQKiaOfY2BLPzVyE',{
            return_url:'/'
        }
    );
    return confirmpaymentIntent
}
exports.createSetupIntent = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
       var amount = Number(req.body.data.data.amount);
       var cus_id = req.body.data.data.customer_id;
       createSetupIn(cus_id, amount).then((result)=>{
        res.status(200).send({ data: result })
       }).catch((error) => {
        res.status(200).send({ error: error.message })
      });
    })
});
async function createSetupIn (cus_id, amount) {
    try {
        // Create a SetupIntent for the customer
        const setupIntent = await stripe.setupIntents.create({
          customer: cus_id,
          payment_method_types: ['card'],
          usage: 'off_session',
        });
    
        return setupIntent;
      } catch (error) {
        console.error(error);
        return error;
      }
}
