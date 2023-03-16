const functions = require("firebase-functions");
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage')
const date = require('date-and-time');
const initStripe = require('stripe');
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const fs = require("fs");
const formidable = require("formidable");
const https = require("https");
const os = require('os');
const path = require('path');
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

const stripe = initStripe(
    'sk_test_51IH8sJAZAQKiaOfYxdO4oKTRXeX0Nox65R7opwGOcSgxMDeQ42udiV9gvAGp8bH6MKW0mFUAVTlso0mIzZI17kEe00ifqlV1Mi'
)
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
var serviceAccount = require("./path/to/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'version2-3284e.appspot.com'
});
const db = getFirestore();
const storage = getStorage();

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
exports.deleteBooking = functions.firestore.document('bookings/{docId}')

    .onDelete(async (snapshot) => {
        const data = snapshot.data();
        if (data.status == "0") {
            const pi_id = data["pi_id"];
            const refund = await stripe.refunds.create({ payment_intent: pi_id });
        }
    });
exports.updateCustomerStatus = functions.firestore.document('bookings/{docId}')
    .onUpdate(async (change) => {
        const newData = change.after.data();
        if (newData.status == "3") {
            const tempdata = [];
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('user_email', '==', newData.owner_email).get();
            let amount = (Number(newData.result) / 1.35) * 100;
            snapshot.forEach(doc => {
                tempdata.push(doc.data());
            });
            let acc_id = tempdata[0]["account_id"]
            await createTransfer(amount, acc_id);
            await db.collection('news').add({
                amonut: amount,
                bank_id: bank_id,
            });
        }

    });

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
                        status: 0,
                        bookingId: temp[i]["booking_id"],
                        inbounded: true
                    });
                    await db.collection('notifications').add({
                        to: temp[i]["customer_email"],
                        notificationContent: owner + " has decliend your bookings of " + itemname,
                        time: serverTime,
                        show: false,
                        status: 0,
                        bookingId: temp[i]["booking_id"],
                        inbounded: false
                    });

                }
                else {
                    await db.collection('notifications').add({
                        to: temp[i]["owner_email"],
                        notificationContent: temp[i]["customer_email"] + "'s booking of " + itemname + " has decliend because you did not accept booking request.",
                        time: serverTime,
                        show: false,
                        status: 0,
                        bookingId: temp[i]["booking_id"],
                        inbounded: true
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
                        status: 3,
                        bookingId: temp[i]["booking_id"],
                        inbounded: true
                    });
                    await db.collection('notifications').add({
                        to: temp[i]["customer_email"],
                        notificationContent: "Your booking of the " + itemname + " has started.",
                        time: serverTime,
                        show: false,
                        status: 3,
                        bookingId: temp[i]["booking_id"],
                        inbounded: false
                    });

                }
                else {
                    await db.collection('notifications').add({
                        to: temp[i]["owner_email"],
                        notificationContent: temp[i]["customer_email"] + "'s booking of " + itemname + " has started.",
                        time: serverTime,
                        show: false,
                        status: 3,
                        bookingId: temp[i]["booking_id"],
                        inbounded: true
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
                    status: 4,
                    bookingId: temp[i]["booking_id"],
                    inbounded: true
                });
                await db.collection('notifications').add({
                    to: temp[i]["customer_email"],
                    notificationContent: "Your booking of the " + itemname + " has been completed.",
                    time: serverTime,
                    show: false,
                    status: 4,
                    bookingId: temp[i]["booking_id"],
                    inbounded: false
                });

            }
            else {
                await db.collection('notifications').add({
                    to: temp[i]["owner_email"],
                    notificationContent: temp[i]["customer_email"] + "'s booking of " + itemname + " has been completed.",
                    time: serverTime,
                    show: false,
                    status: 4,
                    bookingId: temp[i]["booking_id"],
                    inbounded: true
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
        }).catch((error) => {
            res.status(200).send({ data: error })
        });

    })
});
async function createIntent(detail) {
    const paymentIntent = await stripe.paymentIntents.create({
        currency: 'aud',
        amount: detail.result,
        customer: detail.cus_id
    });
    const result = await stripe.paymentIntents.confirm(paymentIntent.id, {
        payment_method: detail.pm_id,
        receipt_email: "margaudjin419@gmail.com"
    });
    return result;

}
exports.capturePaymentIntent = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        var detail = req.body.data.data;
        captureIntent(detail).then((result) => {
            res.status(200).send({ data: result })
        }).catch((error) => {
            res.status(200).send({ data: error })

        });
    })
});
async function captureIntent(detail) {
    var pi_id = detail["pi_id"]
    const paymentIntent = await stripe.paymentIntents.capture(
        pi_id
    );
    return paymentIntent;
}
exports.createSetupIntent = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        var amount = Number(req.body.data.data.amount);
        var cus_id = req.body.data.data.customer_id;
        createSetupIn(cus_id, amount).then((result) => {
            res.status(200).send({ data: result })
        }).catch((error) => {
            res.status(200).send({ error: error.message })
        });
    })
});
async function createSetupIn(cus_id, amount) {
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
exports.getDuration = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        var url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + req.body.data.data.originLat + "%2C" + req.body.data.data.originLng + "&destinations=side_of_road%3A" + req.body.data.data.destinationLat + "%2C" + req.body.data.data.destinationLng + "&key=AIzaSyBLkRbbKO5XGR2VTHUocfd72Fgjy4VNm-0";
        axios.get(url).then(resp => {
            res.status(200).send({ result: resp.data })
        }).catch(function (error) {
            res.status(200).send({ result: error })
        });
    })
});
async function getDurationResult(url) {
    await axios.get(url).then(resp => {
        return resp;
    }).catch(function (error) {
        return error
    });
}
exports.createCustomerSource = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        var detail = req.body.data.data;
        createSource(detail).then((result) => {
            res.status(200).send({ data: result })
        }).catch((error) => {
            res.status(200).send({ data: error })

        });
    })
});
async function createSource(detail) {
    var account_number = String(detail.accountnumber).replaceAll(" ", "");
    var bsb_number = String(detail.bsb).replaceAll(" ", "");
    var first_name = detail.accountname.split(" ")[0];
    var last_name = detail.accountname.split(" ")[1];
    const bankAccount = {
        country: 'AU',
        currency: 'aud',
        account_holder_name: detail.accountname,
        account_holder_type: 'individual',
        routing_number: bsb_number,
        account_number: account_number,
        usage: 'source',
    };
    const bank_token = await stripe.tokens.create({ bank_account: bankAccount });
    const account = await stripe.accounts.create({
        type: 'custom',
        country: 'AU',
        email: detail.email,
        business_type: "individual",
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
        }
    });
    const externalAccount = await stripe.accounts.createExternalAccount(
        account.id,
        {
            external_account: bank_token.id
        }
    );
    const serviceaccount = await stripe.accounts.update(
        account.id,
        { tos_acceptance: { date: bank_token.created, ip: bank_token.client_ip } },
    );
    const person = await stripe.accounts.update(
        account.id,
        {
            individual: {
                first_name: first_name,
                last_name: last_name,
                address: {
                    city: detail.city,
                    line1: detail.line1,
                    postal_code: detail.postal_code,
                    state: detail.state
                },
                dob: {
                    day: detail.dob_day,
                    month: detail.dob_month,
                    year: detail.dob_year

                },
                email: detail.email,
                phone: detail.phone
            }
        }
    );
    const business = await stripe.accounts.update(
        account.id,
        {
            business_profile: {
                mcc: detail.mcc,
                url: detail.url
            }
        }
    );
    const verifiedaccount = await stripe.accounts.update(
        account.id,
        {
            individual: {
                verification:
                {
                    document:
                    {
                        back: detail.backImage,
                        front: detail.frontImage
                    }
                }
            }
        }
    );

    return verifiedaccount;
}
async function fromStripeToCustomer() {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // $10.00 in cents
        currency: 'usd',
        payment_method_types: ['card'],
        payment_method: 'CUSTOMER_CARD_ID',
    });
}
exports.retriveAccount = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        var acc_id = req.body.data.data;
        retriveAccountFunction(acc_id).then((result) => {
            res.status(200).send({ data: result })
        }).catch((error) => {
            res.status(500).send({ data: error })
        })
    })
});
async function retriveAccountFunction(acc_id) {
    const account = await stripe.accounts.retrieve(
        acc_id
    );
    return account;

}
exports.download = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        var path = req.body.data.data
        const bucket = getStorage().bucket().file(path)
            .download(async (err, data) => {
                try {
                    console.log({ data })
                    if (!err) {
                        let result = await createFileToken(data);
                        res.status(200).send({ data: result });
                    }
                    else {
                        throw err;
                    }
                } catch (error) {
                    res.status(500).send({ data: err })
                }
            });
    })
});
async function createFileToken(data) {
    return await stripe.files.create({
        purpose: 'identity_document',
        file: {
            data: data,
            name: 'success.png',
            type: 'application/octet-stream',
        },
    });
}
exports.refund = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        var pi_id = req.body.data.data;
        refundPayment(pi_id).then((result) => {
            res.status(200).send({ data: result })
        }).catch((error) => {
            res.status(500).send({ data: error })
        })
    })
});
async function refundPayment(pi_id) {
    const refund = await stripe.refunds.create({ payment_intent: pi_id });
    return refund;
}
async function createTransfer(result, bank_id) {
    const transfer = await stripe.transfers.create({
        amount: result,
        currency: 'aud',
        destination: bank_id,
    });
}



