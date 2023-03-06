const fs = require("fs");
const https = require("https");

exports.download = () =>  {
    return new Promise((resolve, reject) => {
        const url = "https://www.tutorialspoint.com/cg/images/cgbanner.jpg";
        console.log("here")
        https.get(url, (res) => {
           const path = "downloaded-image.jpg";
           const writeStream = fs.createWriteStream(path);
           res.pipe(writeStream);
           writeStream.on("finish", () => {
              writeStream.close();
              resolve(path);
           })
           writeStream.on("error", (err) => {
                writeStream.close();
                reject(err);
            })
        })
    })
}