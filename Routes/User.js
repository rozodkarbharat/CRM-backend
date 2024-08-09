const express = require('express')
var jwt = require("jsonwebtoken");
require("dotenv").config();
const connection = require('../db');


let Strategies = {
    "UV Special": ["UV5_Nifty", "UV5_BankNifty"],
    "Private": ["Scalper_Master_Reverse", "`Scalper_Master"],
    "Money Makers": ["Candle_Master", "Saturn","bnf_bramhastra_trades"],
    "Mint International": ["BNF"],
    "All": ["UV5_Nifty", "UV5_BankNifty", "Candle_Master", "Saturn", "BNF","bnf_bramhastra_trades"]
}



const AMSuserRoute = express.Router()

AMSuserRoute.get("/get-user-name", (req,res)=>{
    try {
        const token = req.headers.token.split(" ")[1];

        let {Name,Role,AMSID}= jwt.verify(token, process.env.TOKEN_SECRET_KEY);
     
        res.status(200).json({Role,Name,AMSIDerror:false})
    } catch (error) {

        res.status(500).json({ message: "Internal Server Error", error: true });
        return; 
    }
})


AMSuserRoute.post("/login", (req, res) => {
    try {
        const { Number, Password } = req.body;
        console.log(Number, Password, "cred")
        let Query = `SELECT * FROM ams_users WHERE Number = '${Number}' AND Password = '${Password}'`;
         
        connection.query(Query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Error getting user details", error: true });
                return;
            }
          
            if (result.length > 0){
             
                var Token = jwt.sign({ AMSID: result[0].AMSID, Role: result[0].Role, Group_Name: result[0].Group_Name,Name:result[0].Name}, process.env.TOKEN_SECRET_KEY);

                res.status(200).send({ Message: "Login Successfully", Token, data: result[0], error: false,Name:result[0].Name});
                return;
            }
            else {
                res.status(200).send({ Message: "Invalid Credentials", Token, data: result.data, error: false });
                return;
            }
        })
    }
    catch (err) {
        console.log(err.message, "error")
        res.status(500).json({ message: "Unexpected error", error: true });
        return;
    }
})


AMSuserRoute.get("/all-users-count", (req, res) => {
    try {
        const token = req.headers.token.split(" ")[1];
        var { AMSID, Group_Name,Role } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        let Query=""
        if(Role==="Master_Admin"||Role==="Creator"){
             Query = 'SELECT COUNT(*) Total FROM signup';
        }
        else if(Role==="Franchise"){
            Query = 'SELECT COUNT(*) Total FROM signup WHERE Welcome=?';
        }

        connection.query(Query,[AMSID] ,(err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Error getting user count", error: true });
                return;
            }
            if (result.length > 0) {
                let Count = result[0].Total
                res.status(200).send({ Count, error: false });
            }
        })
    }
    catch (err) {
        console.log(err.message, "error")
        res.status(500).json({ message: "Unexpected error", error: true });
        return;
    }
})


AMSuserRoute.get("/active-users", (req, res) => {
    try {
        const token = req.headers.token.split(" ")[1];
        var { AMSID, Group_Name,Role } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        let SecondParam=""
        
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const year = today.getFullYear();
        const todayDate = `${day}-${month}-${year}`;

        if(Role==='Master_Admin'){
                            Query = `SELECT rb.*, bh.*, s.Name  from bot_history bh JOIN running_bots rb ON bh.UserID=rb.UserID AND bh.Script=rb.Script
                            JOIN signup s ON bh.UserID = s.UserID
                            WHERE bh.Date_Time LIKE ?                            
                        `
            }
            else if(Role==='Franchise'){
                SecondParam=AMSID
                Query = `SELECT rb.*, bh.*, s.Name  from bot_history bh JOIN running_bots rb ON bh.UserID=rb.UserID AND bh.Script=rb.Script
                JOIN signup s ON bh.UserID = s.UserID
                WHERE bh.Date_Time LIKE ? AND s.Welcome=?`
            }
            else if(Role==='Creator'){
                SecondParam=Strategies[Group_Name]
                Query = `SELECT rb.*, bh.*, s.Name  from bot_history bh JOIN running_bots rb ON bh.UserID=rb.UserID AND bh.Script=rb.Script
                JOIN signup s ON bh.UserID = s.UserID
                WHERE bh.Date_Time LIKE ? AND rb.Script IN (?)`
            }
   
        connection.query(Query, [`%${todayDate}%`,SecondParam], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Error getting active users", error: true });
                return;
            }
  
            if (result.length > 0) {
                res.status(200).send({ data: result, error: false });
            }
            else{
                res.status(200).send({ data: [], error: false });
            }
        })
    }
    catch (err) {
        console.log(err.message, "error")
        res.status(500).json({ message: "Unexpected error", error: true });
        return;
    }
})

AMSuserRoute.get("/allowed-startegies", function (req, res) {
    try {
        const token = req.headers.token.split(" ")[1];
        var { AMSID, Group_Name,Role } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        let Query=""
        if(Role=="Creator"){
             Query='SELECT information.Name as Strategy FROM information JOIN ams_users ON ams_users.Group_Name = information.Owner WHERE AMSID =?'
        }
        else if(Role=="Master_Admin"){
            Query='SELECT Name as Strategy FROM information'
        }
        connection.query(Query, [AMSID], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Error getting active users", error: true });
                return;
            }
  
            if (result.length > 0) {
                let data=[...result, {Strategy: 'TEST'}];
                if(Role=="Master_Admin"){
                    data=[...data,{Strategy: 'Equity'}]
                }
                res.status(200).send({ data , error: false });
            }
            else{
                res.status(200).send({ data: [], error: false });
            }
        })

    }
    catch (err) {
        console.log(err.message, "error")
        res.status(500).json({ message: "Unexpected error", error: true });
        return;
    }
})

AMSuserRoute.post("/voucher-create", (req, res) => {
    const { amount, voucherCode, quantity } = req.body;
    const token = req.headers.token.split(" ")[1];
   
  
    try {
      const { AMSID } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

       const checkCodeQuery =  'Select Voucher_Code from voucher_code where Voucher_Code = ?'

       connection.query(checkCodeQuery, [voucherCode], (err,result)=>{
        if(err){
            console.log(err, "error while geting Voucher_Code");
            return res.status(500).json({error:true, message:"server error"})
        }
        else if(result.length>0){
             
          return res.status(500).json({errro:true , message:"voucher code already exist please use unique code"})
         
        }else{
            const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            const currentDate = new Date().toLocaleString('en-IN', options)
            
            const date =  currentDate.split(",");
            const datepart =  date[0].split("/");
            const currentDateTime = `${datepart[2]}-${datepart[1]}-${datepart[0]} ${date[1]}`

          const insertQuery = `INSERT INTO voucher_code (AMSID, Voucher_Code, Quantity, Amount, DateTime) VALUES (?, ?, ?, ?, ?)`;
          connection.query(insertQuery, [AMSID, voucherCode, quantity, amount, currentDateTime], (err, result) => {
            if (err) {
              console.log(err,"error while inserting voucher");
              return res.status(500).json({error:true,message:'Server error in inserting voucher'});
            }
             res.status(200).json({error:false, message:'Voucher created successfully'});
          });
        }
       })

    } catch (error) {
      console.log(error);
      return res.status(401).json({error:true,message:'Internal Server error'})
    }
  });

  AMSuserRoute.get("/left-voucher", (req,res)=>{
    try {
        const token = req.headers.token.split(" ")[1];
         const{AMSID,Role} = jwt.verify(token,process.env.TOKEN_SECRET_KEY)
         let query  =  `Select Amount , Voucher_Code, Quantity  from voucher_code where AMSID = ?`
            if(Role==='Master_Admin'){
            query = `Select Amount , Voucher_Code, Quantity  from voucher_code `
            }
            connection.query(query, [AMSID], (err, result)=>{
            if(err){
                console.log(err, "Error executing query");
            }
            if(result.length>0){
                res.status(200).json({error:false, data:result})
            }else{
                res.status(200).json({error:false, data:[]})
            }
                
         })

        
    } catch (error) {
        console.log(error);
    }
  })



module.exports = AMSuserRoute