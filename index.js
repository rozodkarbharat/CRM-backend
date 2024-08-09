const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connection = require("./db");
require("dotenv").config()
const AMSuserRoute = require("./Routes/User");
const AMSsubscriptionRoute = require("./Routes/Subscription");
const AMSstrategyRoute = require("./Routes/Strategy");
const CRMRoute = require("./Routes/Crm");

 

 


const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());


app.use("/ams_user",AMSuserRoute);
app.use("/ams_subscription",AMSsubscriptionRoute);
app.use("/ams_strategy",AMSstrategyRoute);
app.use("/crm",CRMRoute)

app.get("/", (req, res) => {
  res.send("Welcome to the AMS");
});


app.listen(process.env.PORT, async () => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      return;
    }

    console.log("Connected on Port " + process.env.PORT);
  });
});
