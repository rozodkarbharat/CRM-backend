const express = require("express");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const connection = require('../db');

let Strategies = {
  "UV Special": ["UV5_Nifty", "UV5_BankNifty"],
  "Private": ["Scalper_Master_Reverse", "`Scalper_Master"],
  "Money Makers": ["Candle_Master", "Saturn", "BNF_Bramhastra"],
  "Mint International": ["BNF"],
  "God Trader": [
      "Nifty_GOD_1_1", "Nifty_GOD_1_2",
      "Nifty_GOD_1_3", "Nifty_GOD_1_4",
      'Nifty_GOD_2_1', 'Nifty_GOD_2_2',
      'Nifty_GOD_2_3', 'Nifty_GOD_2_4',
      'Nifty_GOD_3_1', 'Nifty_GOD_3_2',
      'Nifty_GOD_3_3', 'Nifty_GOD_3_4',
      "Nifty_GOD_4_1", "Nifty_GOD_4_2",
      "Nifty_GOD_4_3", "Nifty_GOD_4_4",

      "BankNifty_GOD_1_1", "BankNifty_GOD_1_2",
      "BankNifty_GOD_1_3", "BankNifty_GOD_1_4",
      "BankNifty_GOD_2_1", "BankNifty_GOD_2_2",
      "BankNifty_GOD_2_3", "BankNifty_GOD_2_4",
      "BankNifty_GOD_3_1", "BankNifty_GOD_3_2",
      "BankNifty_GOD_3_3", "BankNifty_GOD_3_4",
      "BankNifty_GOD_4_1", "BankNifty_GOD_4_2",
      "BankNifty_GOD_4_3", "BankNifty_GOD_4_4",
      "Nifty_GOD",
      "BankNifty_GOD"
  ],
  "All": [
      "UV5_Nifty", "UV5_BankNifty", 
      "Candle_Master","Saturn", 
      "BNF","BNF_Bramhastra",
      "Nifty_GOD",
      "BankNifty_GOD",

      "Nifty_GOD_1_1", "Nifty_GOD_1_2",
      "Nifty_GOD_1_3", "Nifty_GOD_1_4",
      'Nifty_GOD_2_1', 'Nifty_GOD_2_2',
      'Nifty_GOD_2_3', 'Nifty_GOD_2_4',
      'Nifty_GOD_3_1', 'Nifty_GOD_3_2',
      'Nifty_GOD_3_3', 'Nifty_GOD_3_4',
      "Nifty_GOD_4_1", "Nifty_GOD_4_2",
      "Nifty_GOD_4_3", "Nifty_GOD_4_4",

      "BankNifty_GOD_1_1", "BankNifty_GOD_1_2",
      "BankNifty_GOD_1_3", "BankNifty_GOD_1_4",
      "BankNifty_GOD_2_1", "BankNifty_GOD_2_2",
      "BankNifty_GOD_2_3", "BankNifty_GOD_2_4",
      "BankNifty_GOD_3_1", "BankNifty_GOD_3_2",
      "BankNifty_GOD_3_3", "BankNifty_GOD_3_4",
      "BankNifty_GOD_4_1", "BankNifty_GOD_4_2",
      "BankNifty_GOD_4_3", "BankNifty_GOD_4_4"
  ]
}

function getFirstDateOfCurrentMonth() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  
  const pad = (num) => (num < 10 ? '0' : '') + num;
  
  const day = pad(firstDay.getDate());
  const month = pad(firstDay.getMonth() + 1); // getMonth() is zero-based
  const year = firstDay.getFullYear();
  const hours = pad(firstDay.getHours());
  const minutes = pad(firstDay.getMinutes());
  const seconds = pad(firstDay.getSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function getDateTimeTwoDaysAgoFromToday() {
  return new Promise((resolve, reject) => {
      try {
          let trial = 1;
          let twoDaysAgo = new Date();
          const weekday = twoDaysAgo.toLocaleDateString("en-US", {
              weekday: "short",
          });
          if (weekday === "Mon") {
              trial += 1;
          } else if (weekday === "Sat") {
              trial -= 1;
          }
          twoDaysAgo.setDate(twoDaysAgo.getDate() - trial);

          // Convert to the desired format: 'dd-mm-yyyy hh:mm:ss'
          const day = (`0${twoDaysAgo.getDate()}`).slice(-2);
          const month = (`0${twoDaysAgo.getMonth() + 1}`).slice(-2);
          const year = twoDaysAgo.getFullYear();
          const hours = (`0${twoDaysAgo.getHours()}`).slice(-2);
          const minutes = (`0${twoDaysAgo.getMinutes()}`).slice(-2);
          const seconds = (`0${twoDaysAgo.getSeconds()}`).slice(-2);

          const dateTimeTwoDaysAgo = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
          resolve(dateTimeTwoDaysAgo);
      } catch (err) {
          reject(err);
      }
  });
}

function GetTrialEnddate(StartDate) {

        try {
            let trial=1
            const [datePart, timePart] = StartDate.split(" ");
            const [day, month, year] = datePart.split("-").map(Number);
            const date = new Date(year, month - 1, day);
            StartDate = date.toLocaleDateString("en-GB");
            const weekday = date.toLocaleDateString("en-US", {
                weekday: "short",
            });
            if (weekday === "Sat") {
                trial += 2;
            } else if (weekday === "Sun") {
                trial += 1;
            }
            let newdate = new Date(date.setDate(date.getDate() + trial));
            EndDate = newdate.toLocaleDateString("en-GB");
            return EndDate
        }
        catch (err) {
            return StartDate;
        }

}

function ConvertTrialdata(result) {
    try {
        return new Promise((resolve, reject) => {
            Promise.all(result.map(async (elem) => {
                const endDate = await GetTrialEnddate(elem.DateTime);
                return { ...elem, endDate };
            })).then((updatedResult) => {
                resolve(updatedResult);
            }).catch((err) => {
                reject(err);
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
}


const AMSsubscriptionRoute = express.Router();

AMSsubscriptionRoute.get("/today-subscription", (req, res) => {

  try {
    const token = req.headers.token.split(" ")[1];

    var { AMSID, Group_Name,Role } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const currentDate = new Date();
    const expireDate = new Date(currentDate);
    expireDate.setDate(currentDate.getDate() - 1);

    const formattedExpireDate = expireDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

      let sql;
      let params = [];
  
      if (Role === "Franchise") {
        sql = `SELECT Name, subscription_by_strategy.DateTime as DateTime, Strategy, Amount 
               FROM subscription_by_strategy 
               JOIN signup ON subscription_by_strategy.UserID = signup.UserID 
               WHERE subscription_by_strategy.Strategy REGEXP ? 
               AND STR_TO_DATE(subscription_by_strategy.DateTime, '%d-%m-%Y') >= ? 
               AND signup.Welcome = ?`;  
               params.push(Strategies[Group_Name].join('|')); 
               
        params.push(formattedExpireDate);  
        params.push(AMSID);  
      } else {
        sql = `SELECT Name, subscription_by_strategy.DateTime as DateTime, Strategy, Amount 
               FROM subscription_by_strategy 
               JOIN signup ON subscription_by_strategy.UserID = signup.UserID 
               WHERE subscription_by_strategy.Strategy REGEXP ? 
               AND STR_TO_DATE(subscription_by_strategy.DateTime, '%d-%m-%Y') >= ?`;
               params.push(Strategies[Group_Name].join('|'));  
               
        params.push(formattedExpireDate);  
      }


    connection.query(sql, params, (err, result) => {
      // console.log(result, "result of sub")
      if (err) {
        console.log(err.message, "error");
        res
          .status(500)
          .json({ message: "Error getting subcriptions", error: true });
        return;
      }
    
        res.status(200).send({ data: result, error: false });
      return;
    });
  } catch (err) {
    console.log(err.message, "error");
    res.send({ message: err.message, error: true });
  }
});


AMSsubscriptionRoute.get("/all-subscription", (req, res) => {
  try {
    const token = req.headers.token.split(" ")[1];

    var { AMSID, Group_Name,Role } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const currentDate = new Date();
    const expireDate = new Date(currentDate);
    expireDate.setDate(currentDate.getDate() - 1);
    const formattedExpireDate = expireDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");


      let sql;
    let params = [];  

    if (Role === "Franchise") {
      sql = ` SELECT 
      SUM(subscription_by_strategy.Amount) AS Amount, 
      COUNT(DISTINCT subscription_by_strategy.UserID) AS Count 
    FROM 
      subscription_by_strategy 
    JOIN 
      signup ON subscription_by_strategy.UserID = signup.UserID 
    WHERE 
      signup.Welcome = ? 
      AND subscription_by_strategy.Strategy REGEXP ?`;
      params.push(AMSID); 
      params.push(`[${Strategies[Group_Name]}]`);  
    } else {
      sql = `SELECT SUM(Amount) as Amount, COUNT(DISTINCT subscription_by_strategy.UserID) AS Count FROM subscription_by_strategy WHERE Strategy REGEXP ?`;
      params.push(`[${Strategies[Group_Name]}]`); 
    }


    connection.query(sql, params, (err, result) => {
      if (err) {
        console.log(err.message, "error");
        res
          .status(500)
          .json({ message: "Error getting subcriptions", error: true });
        return;
      }
      if (result ){
        res
          .status(200)
          .send({ data:result, error: false });
        return;
      }
    });
  } catch (err) {
    console.log(err.message, "error");
    res.send({ message: err.message, error: true });
  }
});

 

const getQueryForSubscriptionDetail = () => {
  return `
  SELECT subscription_by_strategy.DateTime, 
         subscription_by_strategy.Amount, 
         subscription_by_strategy.Strategy, 
         signup.Name, 
         signup.Number
  FROM subscription_by_strategy 
  JOIN signup ON subscription_by_strategy.UserId = signup.UserId
`;
};


AMSsubscriptionRoute.get("/subscription-details", (req, res) => {
  try {
    const token = req.headers.token.split(" ")[1];
    var { AMSID, Group_Name, Role } = jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY
    );
     

    let sql = getQueryForSubscriptionDetail();
    let params = [];

    if (Role === "Master_Admin") {
    } else if (Role === "Franchise") {
      sql += ` WHERE signup.welcome = ? AND subscription_by_strategy.UserId = signup.UserId
      `;
      params.push(AMSID);
    } else {
      const strategyList = Strategies[Group_Name];
      if (!strategyList) {
        return res
          .status(400)
          .json({message:"Invalid Group Name",error:true});
         
      }
      const strategyRegex = strategyList.join("|");
      sql += ` WHERE subscription_by_strategy.Strategy REGEXP ?
    `;
      params.push(strategyRegex);
    }


    const currentDate = new Date();
    const expireDate = new Date(currentDate);
    expireDate.setDate(currentDate.getDate() - 1);
    const formattedExpireDate = expireDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    sql += ` AND STR_TO_DATE(subscription_by_strategy.DateTime, '%d-%m-%Y') >= ?`;

    params.push(formattedExpireDate);

    connection.query(sql, params, (error, results) => {
      if (error) {
        console.error("Error executing SQL query:", error);
        res
          .status(500)
          .json({message:"An error occurred while fetching subscription details",error:true});
      } else {
         
        res.status(200).json({data:results,error:false});
      }
    });
  } catch (error) {
    console.log(error.message, "error");
    res.send({ message: err.message, error: true });
  }
});

AMSsubscriptionRoute.get("/All-trial-users", async (req, res) => {
  try {
      const token = req.headers.token.split(" ")[1];
      const { AMSID, Group_Name, Role } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
      
      // Get the DateTime two days ago from today
      let DateTime = await getDateTimeTwoDaysAgoFromToday();
console.log(DateTime);
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;
      const searchQuery = req.query.search;

      let sql = `SELECT 
                   Name,
                   signup.UserID as UserID,
                   signup.EmailID as EmailID,
                   subcription.DateTime as DateTime,
                   Number,
                   Strategies 
                 FROM 
                   subcription 
                 JOIN 
                 signup ON subcription.UserID = signup.UserID 
                 WHERE subcription.Subcription = 'Trial' 
                 AND STR_TO_DATE(subcription.DateTime, '%d-%m-%Y %H:%i:%s') >= STR_TO_DATE(?, '%d-%m-%Y %H:%i:%s')`;

      let params = [DateTime];

      if (Role === "Franchise") {
          sql += ` AND signup.Welcome = ?`;
          params.push(AMSID);
      }

      if (searchQuery) {
          const searchConditions = `Name LIKE ? OR signup.EmailID LIKE ? OR Number LIKE ? OR Strategies LIKE ?`;
          sql += ` AND (${searchConditions})`;
          const likeParam = `%${searchQuery}%`;
          params.push(likeParam, likeParam, likeParam, likeParam);
      }

      sql += ` LIMIT ? OFFSET ?`;
      params.push(pageSize, offset);

      connection.query(sql, params, async (err, result) => {
          if (err) {
              console.log(err.message, "error");
              res.status(500).json({ message: "Error getting subscriptions", error: true });
              return;
          }

          if (result.length > 0) {
              ConvertTrialdata(result).then((response) => {
                  console.log(response[0], "result");
                  res.status(200).json({ data: response, error: false });
              });
          } else {
              res.status(200).json({ data: [], error: false });
          }
      });
  } catch (err) {
      console.log(err.message, "error");
      res.status(500).send({ message: err.message, error: true });
  }
});


AMSsubscriptionRoute.post("/subscription-details-filter", (req, res) => {
  const { startDate, endDate, selectedStrategy } = req.body;
  try {
    const token = req.headers.token.split(" ")[1];
    var { AMSID, Group_Name, Role } = jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY
    );
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
 
    let sql = getQueryForSubscriptionDetail();
    let params = [startDate, endDate];

    if (Role === "Master_Admin") {
      sql += ` WHERE STR_TO_DATE(subscription_by_strategy.DateTime, '%d-%m-%Y') BETWEEN ? AND ?
      `;
    }
    if (Role === "Franchise") {
      sql += `
      WHERE STR_TO_DATE(subscription_by_strategy.DateTime, '%d-%m-%Y') BETWEEN ? AND ? AND signup.welcome = ? AND subscription_by_strategy.UserId = signup.UserId
      `;
      params.push(AMSID);
    }

    if (Role === "Creator") {
      sql += ` WHERE STR_TO_DATE(subscription_by_strategy.DateTime, '%d-%m-%Y') BETWEEN ? AND ?
      `;
    }
       
     
    if (selectedStrategy !== "All") {
      sql += `
        AND subscription_by_strategy.Strategy = ?
      `;
      params.push(selectedStrategy);
    }

    const offset = (page - 1) * pageSize;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);
console.log(page);

    connection.query(sql, params, (error, results) => {
      if (error) {
        console.error("Error executing SQL query:", error);
       return res
          .status(500)
          .json({message:"An error occurred while fetching subscription details",error:true});
      } else {
         
        res.status(200).json({ data: results, error: false });
      }
    });
  } catch (error) {
    console.log(error.message, "error");
    res.send({ message: error.message, error: true });
  }
});

AMSsubscriptionRoute.get("/current-month-subscription", (req, res) => {
  try {
    const token = req.headers.token.split(" ")[1];
    var { AMSID, Group_Name, Role } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    let date = getFirstDateOfCurrentMonth();
    let sql;
    let params = [];

    if (Role === "Franchise") {
      sql = `SELECT SUM(Amount) AS Sum
             FROM subscription_by_strategy 
             JOIN signup ON subscription_by_strategy.UserID = signup.UserID 
             WHERE subscription_by_strategy.Strategy REGEXP ? 
             AND STR_TO_DATE(subscription_by_strategy.DateTime, '%d-%m-%Y %H:%i:%s') >= STR_TO_DATE(?, '%d-%m-%Y %H:%i:%s') 
             AND signup.Welcome = ?`;
      params.push(Strategies[Group_Name].join('|'));
      params.push(date);
      params.push(AMSID);
    } else {
      sql = `SELECT SUM(Amount) AS Sum
             FROM subscription_by_strategy 
             JOIN signup ON subscription_by_strategy.UserID = signup.UserID 
             WHERE subscription_by_strategy.Strategy REGEXP ? 
             AND STR_TO_DATE(subscription_by_strategy.DateTime, '%d-%m-%Y %H:%i:%s') >= STR_TO_DATE(?, '%d-%m-%Y %H:%i:%s')`;
      params.push(Strategies[Group_Name].join('|'));
      params.push(date);
    }

    connection.query(sql, params, (err, result) => {
      if (err) {
        console.log(err.message, "error in");
        res
          .status(500)
          .json({ message: "Error getting current months subcriptions", error: true });
        return;
      }
      if (result){
        res
          .status(200)
          .send({ data:result[0], error: false });
        return;
      }
    });

  }
  catch (error) {
    console.log(error.message, "error");
    res.send({ message: error.message, error: true });
  }
})


AMSsubscriptionRoute.get("/subscription-expiring-in-seven-days", (req, res) => {
  try {
    const token = req.headers.token.split(" ")[1];
    var { AMSID, Group_Name, Role } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    const currentDate = new Date();
    const newcurrent = new Date()
    const expireDate = new Date(currentDate);
    const toDate = new Date(newcurrent);
    toDate.setDate(newcurrent.getDate() - 38);
    expireDate.setDate(currentDate.getDate() - 45);
    const formattedExpireDate = expireDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const formattedEndExpireDate = toDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    let sql = ""
    let params = [formattedExpireDate, formattedEndExpireDate]
    if (Role === "Franchise") {
      sql = `SELECT signup.Number, signup.EmailID, signup.Name, signup.UserID,subscription_by_strategy.Amount, subscription_by_strategy.DateTime,subscription_by_strategy.Strategy FROM subscription_by_strategy JOIN signup on signup.UserID=subscription_by_strategy.UserID WHERE STR_TO_DATE(subscription_by_strategy.DateTime, '%d-%m-%Y %H:%i:%s')>=? AND STR_TO_DATE(subscription_by_strategy.DateTime, '%d-%m-%Y %H:%i:%s') <= ? AND signup.welcome=?`;
      params.push(AMSID)
    }

    if (Role === "Creator" || Role === "Master_Admin") {
      sql = `SELECT signup.Number,signup.EmailID,signup.Name, signup.UserID, subscription_by_strategy.Amount,subscription_by_strategy.DateTime,subscription_by_strategy.Strategy FROM subscription_by_strategy JOIN signup on signup.UserID=subscription_by_strategy.UserID WHERE STR_TO_DATE(subscription_by_strategy.DateTime, '%d-%m-%Y %H:%i:%s')>=? AND STR_TO_DATE(subscription_by_strategy.DateTime, '%d-%m-%Y %H:%i:%s') <= ? AND subscription_by_strategy.Strategy REGEXP ?`;
      params.push(Strategies[Group_Name].join('|'))
    }

    connection.query(sql, params, (err, result) => {
      if (err) {
        console.log(err.message, "error in expiring subscriptions");
        res
          .status(500)
          .json({ message: "Error getting expiring subscriptions ", error: true });
        return;
      }
      if (result) {
        res
          .status(200)
          .send({ data: result, error: false });
        return;
      }
    });
  }

  catch (error) {
    console.log(error.message, "error");
    res.send({ message: error.message, error: true });
  }
})

module.exports = AMSsubscriptionRoute
