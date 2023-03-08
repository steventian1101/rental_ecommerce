const stripe = require('stripe')('sk_test_51IH8sJAZAQKiaOfYxdO4oKTRXeX0Nox65R7opwGOcSgxMDeQ42udiV9gvAGp8bH6MKW0mFUAVTlso0mIzZI17kEe00ifqlV1Mi');

async function balance(){
   const balance = await stripe.balance.retrieve();
   console.log(balance)
}
balance()