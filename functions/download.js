const https = require("https");
const axios = require("axios");


async function balance(){
   const balance = await stripe.balance.retrieve();
   console.log(balance)
}
balance()
