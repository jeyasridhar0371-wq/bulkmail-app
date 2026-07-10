const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose')
// const dns = require('dns');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// dns.setServers(['1.1.1.1','8.8.8.8']);


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("passkey").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    // const credential = await client.db("passkey").collection("bulkmail").find({}).toArray();
    // await console.log(credential[0].user);
  }
}
run().catch(console.dir);


// mongoose.connect("mongodb+srv://new-user_31:kjzV.kzVbfrT6VX@cluster0.mwg5twz.mongodb.net/?appName=Cluster0").then(function () {
//     console.log("Connected to DB successfully")
// }).catch(function (error) {
//     console.log("Failed to connection "+error)
// })

// const credential = mongoose.model("credential", {}, "bulkmail")


app.post("/sendemail", (req, res) => {

    var msg = req.body.msg
    var emailList = req.body.emailList

    const credential = client.db("passkey").collection("bulkmail").find({}).toArray().then(function (data) {
        
        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: data[0].user,
                pass: data[0].pass,
            },
        });

        new Promise(async function (resolve, reject) {
            try {
                for (var i = 0; i < emailList.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "storiry9@gmail.com",
                            to: emailList[i],
                            subject: "Amessage from bulkmail app",
                            text: msg
                        }
                    )
                    console.log("Email sent to:" + emailList[i])
                }
                resolve("Success")
            } catch (error) {
                reject("Failed")
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })

    }).catch(function (error) {
        console.log(error)
    })

})


app.listen("3000", () => {
    console.log("Server Started...");
})