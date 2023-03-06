const https = require("https");
const axios = require("axios");
const stripe = require('stripe')('sk_test_51IH8sJAZAQKiaOfYxdO4oKTRXeX0Nox65R7opwGOcSgxMDeQ42udiV9gvAGp8bH6MKW0mFUAVTlso0mIzZI17kEe00ifqlV1Mi');

// URL of the image
var frontImageUrl = "https://www.tutorialspoint.com/cg/images/cgbanner.jpg"
axios.get(frontImageUrl,{
   responseType: 'arraybuffer',
     headers: {
       'Content-Type': 'application/json'
     }
}).then((result)=>{
   getFileToken(result).then((result)=>{
      console.log(result)
   })
  
}).catch((error)=>{
    console.log(error)
});
async function getFileToken (result) {
   const frontfile = await stripe.files.create({
      purpose: 'identity_document',
      file: {
          data:result,
          name: 'success.png',
          type: 'application/octet-stream',
      },
  });
  return frontfile;

}