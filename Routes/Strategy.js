const express = require('express')
var jwt = require("jsonwebtoken");
const connection = require('../db');
require("dotenv").config();


let Months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]

let Tables = {
    "UV Special": ["rsi_nifty_trades_5m", "rsi_trades_5m"],
    "Private": ["scalper_master_reverse", "`scalper_master"],
    "Money Makers": ["candle_master_trades", "saturn_trades", "bnf_bramhastra_trades","test"],
    "Mint International": ["trades"],
    "God Trader": [
        "nifty_rsi_opening_trade_1m",
        "nifty_rsi_opening_trade_3m",
        "nifty_rsi_opening_trade_5m",
        "nifty_rsi_opening_trade_15m",
        "rsi_opening_trade_1m",
        "rsi_opening_trade_3m",
        "rsi_opening_trade_5m",
        "rsi_opening_trade_15m"
    ],

    "All": [
        "trades",
        "candle_master_trades",
        "saturn_trades",
        'rsi_nifty_trades_5m',
        "rsi_trades_5m",
        "bnf_bramhastra_trades",

        "nifty_rsi_opening_trade_1m",
        "nifty_rsi_opening_trade_3m",
        "nifty_rsi_opening_trade_5m",
        "nifty_rsi_opening_trade_15m",

        "rsi_opening_trade_1m",
        "rsi_opening_trade_3m",
        "rsi_opening_trade_5m",
        "rsi_opening_trade_15m",
        "test"
    ]
}

const ordertable = {
    UPSTOX: "upstox_orders",
    ANGEL: "orders",
    KOTAK:"kotak_orders",
    DHANHQ:"dhan_orders",
    KOTAK:"kotak_orders",
    FYERS:"fyers_orders"
  }

let Strategies = {
    "UV Special": ["UV5_Nifty", "UV5_BankNifty"],
    "Private": ["Scalper_Master_Reverse", "`Scalper_Master"],
    "Money Makers": ["Candle_Master", "Saturn", "BNF_Bramhastra","TEST"],
    "Mint International": ["BNF"],
    "God Trader": [
        "Nifty_GOD_1_1", "Nifty_GOD_1_2",
        "Nifty_GOD_1_3", "Nifty_GOD_1_4",
        'Nifty_GOD_3_1', 'Nifty_GOD_3_2',
        'Nifty_GOD_3_3', 'Nifty_GOD_3_4',
        'Nifty_GOD_5_1', 'Nifty_GOD_5_2',
        'Nifty_GOD_5_3', 'Nifty_GOD_5_4',
        "Nifty_GOD_15_1", "Nifty_GOD_15_2",
        "Nifty_GOD_15_3", "Nifty_GOD_15_4",

        "BankNifty_GOD_1_1", "BankNifty_GOD_1_2",
        "BankNifty_GOD_1_3", "BankNifty_GOD_1_4",
        "BankNifty_GOD_3_1", "BankNifty_GOD_3_2",
        "BankNifty_GOD_3_3", "BankNifty_GOD_3_4",
        "BankNifty_GOD_5_1", "BankNifty_GOD_5_2",
        "BankNifty_GOD_5_3", "BankNifty_GOD_5_4",
        "BankNifty_GOD_15_1", "BankNifty_GOD_15_2",
        "BankNifty_GOD_15_3", "BankNifty_GOD_15_4"
    ],
    "All": [
        "UV5_Nifty", "UV5_BankNifty", 
        "Candle_Master","Saturn", 
        "BNF","BNF_Bramhastra","TEST",

        "Nifty_GOD_1_1", "Nifty_GOD_1_2",
        "Nifty_GOD_1_3", "Nifty_GOD_1_4",
        'Nifty_GOD_3_1', 'Nifty_GOD_3_2',
        'Nifty_GOD_3_3', 'Nifty_GOD_3_4',
        'Nifty_GOD_5_1', 'Nifty_GOD_5_2',
        'Nifty_GOD_5_3', 'Nifty_GOD_5_4',
        "Nifty_GOD_15_1", "Nifty_GOD_15_2",
        "Nifty_GOD_15_3", "Nifty_GOD_15_4",

        "BankNifty_GOD_1_1", "BankNifty_GOD_1_2",
        "BankNifty_GOD_1_3", "BankNifty_GOD_1_4",
        "BankNifty_GOD_3_1", "BankNifty_GOD_3_2",
        "BankNifty_GOD_3_3", "BankNifty_GOD_3_4",
        "BankNifty_GOD_5_1", "BankNifty_GOD_5_2",
        "BankNifty_GOD_5_3", "BankNifty_GOD_5_4",
        "BankNifty_GOD_15_1", "BankNifty_GOD_15_2",
        "BankNifty_GOD_15_3", "BankNifty_GOD_15_4"
    ]
}

let trade_tables = {
    Nifty_GOD_1_1: "nifty_rsi_opening_trade_1m",
    Nifty_GOD_1_2: "nifty_rsi_opening_trade_1m",
    Nifty_GOD_1_3: "nifty_rsi_opening_trade_1m",
    Nifty_GOD_1_4: "nifty_rsi_opening_trade_1m",

    Nifty_GOD_3_1: "nifty_rsi_opening_trade_3m",
    Nifty_GOD_3_2: "nifty_rsi_opening_trade_3m",
    Nifty_GOD_3_3: "nifty_rsi_opening_trade_3m",
    Nifty_GOD_3_4: "nifty_rsi_opening_trade_3m",

    Nifty_GOD_5_1: "nifty_rsi_opening_trade_5m",
    Nifty_GOD_5_2: "nifty_rsi_opening_trade_5m",
    Nifty_GOD_5_3: "nifty_rsi_opening_trade_5m",
    Nifty_GOD_5_4: "nifty_rsi_opening_trade_5m",


    Nifty_GOD_15_1: "nifty_rsi_opening_trade_15m",
    Nifty_GOD_15_2: "nifty_rsi_opening_trade_15m",
    Nifty_GOD_15_3: "nifty_rsi_opening_trade_15m",
    Nifty_GOD_15_4: "nifty_rsi_opening_trade_15m",

    BankNifty_GOD_1_1: "rsi_opening_trade_1m",
    BankNifty_GOD_1_2: "rsi_opening_trade_1m",
    BankNifty_GOD_1_3: "rsi_opening_trade_1m",
    BankNifty_GOD_1_4: "rsi_opening_trade_1m",

    BankNifty_GOD_3_1: "rsi_opening_trade_3m",
    BankNifty_GOD_3_2: "rsi_opening_trade_3m",
    BankNifty_GOD_3_3: "rsi_opening_trade_3m",
    BankNifty_GOD_3_4: "rsi_opening_trade_3m",

    BankNifty_GOD_5_1: "rsi_opening_trade_5m",
    BankNifty_GOD_5_2: "rsi_opening_trade_5m",
    BankNifty_GOD_5_3: "rsi_opening_trade_5m",
    BankNifty_GOD_5_4: "rsi_opening_trade_5m",


    BankNifty_GOD_15_1: "rsi_opening_trade_15m",
    BankNifty_GOD_15_2: "rsi_opening_trade_15m",
    BankNifty_GOD_15_3: "rsi_opening_trade_15m",
    BankNifty_GOD_15_4: "rsi_opening_trade_15m",

    BNF_Bramhastra: "bnf_bramhastra_trades",
    BNF: "trades",
    Saturn: "saturn_trades",
    Candle_Master: "candle_master_trades",
    UV5_BankNifty: "rsi_trades_5m",
    UV5_Nifty: "rsi_nifty_trades_5m",
    TEST:"test",
    Scalper_Master_Reverse: "scalper_master_reverse",
    Scalper_Master: "scalper_master",

    All: [
        "trades",
        "saturn_trades",
        "candle_master_trades",
        "rsi_trades_5m",
        "rsi_nifty_trades_5m",
        "bnf_bramhastra_trades",
        "nifty_rsi_opening_trade_1m",
        "nifty_rsi_opening_trade_3m",
        "nifty_rsi_opening_trade_5m",
        "nifty_rsi_opening_trade_15m",
        "rsi_opening_trade_1m",
        "rsi_opening_trade_3m",
        "rsi_opening_trade_5m",
        "rsi_opening_trade_15m",
        "test"
    ],
};

function arrangeLiveTradesAccordingToStartegy(data){
    return new Promise(function(resolve, reject){
        try{
            let obj={}
            for(var a=0;a<data.length;a++){
                for(b=0;b<data[a].length;b++){
                    if(obj.hasOwnProperty(data[a][b].Id)){
                        obj[data[a][b].Id]=[...obj[data[a][b].Id],data[a][b]]
                    }
                    else{
                        obj[data[a][b].Id]=[data[a][b]]
                    }
                }
            }   
            resolve(Object.values(obj))
        }
        catch(e){
           resolve([])
        }
    })
}

function getCurrentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

const AMSstrategyRoute = express.Router()


AMSstrategyRoute.get("/running-trades", (req, res) => {
    try {

        const token = req.headers.token.split(" ")[1];

        var { AMSID, Group_Name } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        let today = new Date();
        let startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
        startOfDay = startOfDay.toISOString().split('T')[0] + ' 00:00:00';

        let results = {};
        Tables[Group_Name].forEach(table => {
            const query = `SELECT * FROM ${table} WHERE  (DateTime >= ?)`;

            connection.query(query, [startOfDay], async (err, queryResults) => {
                if (err) {
                    console.error(`Error executing query for table ${table}:`, err);
                    results[table] = [];
                } else {
                    results[table] = queryResults;
                }

                if (Object.keys(results).length === Tables[Group_Name].length) {
                    let temp=await arrangeLiveTradesAccordingToStartegy(Object.values(results))
                    res.status(200).send(temp);
                }
            });
        });
    } catch (err) {
        console.log(err.message, "error")
        res.send({ message: err.message, error: true });
    }
})

AMSstrategyRoute.get("/running-equity-trades", (req, res) => {
    try {
        const query = `SELECT * FROM equity_trades
            WHERE Id IN (
                SELECT Id
                FROM equity_trades
                GROUP BY Id
                HAVING COUNT(Id) = 1
            )`;

        connection.query(query, async (err, result) => {
            if (err) {
                console.error(`Error getting equity running trades`, err);
                return;
            } 
            res.status(200).send({ data: result, error: false });
            return;
        });

    } catch (err) {
        console.log(err.message, "error")
        res.send({ message: err.message, error: true });
    }
})

AMSstrategyRoute.get("/todays-order", (req, res) => {
    try {

        const token = req.headers.token.split(" ")[1];
        var { AMSID, Group_Name, Role } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

            let today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        let startOfDay = today.toISOString().slice(0, 19).replace("T", " ");
    
        let sql = ""
        let params = [];

        if (Role == "Master_Admin" || Role == "Creator") {
            sql = `
                SELECT U.Symbol, U.UserID, U.DateTime, U.Id, U.Strategy, U.Price, U.Message, U.Status, U.type, U.Token AS OrderID, U.Quantity, S.Name
                FROM upstox_orders U
                JOIN signup S ON U.UserID = S.UserID
                WHERE U.Strategy IN (?) AND U.DateTime >= ? 
                UNION 
                SELECT O.Symbol, O.UserID, O.DateTime, O.Id, O.Strategy, O.Price, O.Message, O.Status, O.type, O.OrderID, O.Quantity, S.Name
                FROM orders O
                JOIN signup S ON O.UserID = S.UserID
                WHERE O.Strategy IN (?) AND O.DateTime >= ?
                UNION 
                SELECT k.Symbol, k.UserID, k.DateTime, k.Id, k.Strategy, k.Price, k.Message, k.Status, k.type, k.Token AS OrderID, k.Quantity, S.Name
                FROM kotak_orders k
                JOIN signup S ON k.UserID = S.UserID
                WHERE k.Strategy IN (?) AND k.DateTime >= ?
                UNION 
                SELECT D.Symbol, D.UserID, D.DateTime, D.Id, D.Strategy, D.Price, D.Message, D.Status, D.type, D.Token AS OrderID, D.Quantity, S.Name
                FROM dhan_orders D
                JOIN signup S ON D.UserID = S.UserID
                WHERE D.Strategy IN (?) AND D.DateTime >= ?
                `;
                params = [Strategies[Group_Name], startOfDay, Strategies[Group_Name], startOfDay, Strategies[Group_Name], startOfDay, Strategies[Group_Name], startOfDay]
        }

        else if (Role == "Franchise") {
            sql = `
                SELECT U.Symbol, U.UserID, U.DateTime, U.Id, U.Strategy, U.Price, U.Message, U.Status, U.type, U.Token AS OrderID, U.Quantity, S.Name
                FROM upstox_orders U
                JOIN signup S ON U.UserID = S.UserID
                WHERE U.Strategy IN (?) AND U.DateTime >= ? AND S.Welcome=?
                UNION 
                SELECT O.Symbol, O.UserID, O.DateTime, O.Id, O.Strategy, O.Price, O.Message, O.Status, O.type, O.OrderID, O.Quantity, S.Name
                FROM orders O
                JOIN signup S ON O.UserID = S.UserID
                WHERE O.Strategy IN (?) AND O.DateTime >= ? AND S.Welcome=?
                UNION 
                SELECT k.Symbol, k.UserID, k.DateTime, k.Id, k.Strategy, k.Price, k.Message, k.Status, k.type, k.Token AS OrderID, k.Quantity, S.Name
                FROM kotak_orders k
                JOIN signup S ON k.UserID = S.UserID
                WHERE k.Strategy IN (?) AND k.DateTime >= ? AND S.Welcome=?
                UNION 
                SELECT D.Symbol, D.UserID, D.DateTime, D.Id, D.Strategy, D.Price, D.Message, D.Status, D.type, D.Token AS OrderID, D.Quantity, S.Name
                FROM dhan_orders D
                JOIN signup S ON D.UserID = S.UserID
                WHERE D.Strategy IN (?) AND D.DateTime >= ? AND S.Welcome=?
                `;
                params = [Strategies[Group_Name], startOfDay, AMSID, Strategies[Group_Name], startOfDay, AMSID, Strategies[Group_Name], startOfDay, AMSID,Strategies[Group_Name], startOfDay, AMSID]
        }


        connection.query(sql, params, (err, result) => {
            if (err) {
                console.log(err.message, "error")
                res
                    .status(500)
                    .json({ message: "Error getting orders", error: true });
                return;
            }
            res.status(200).send({ data: result, error: false });
            return;
        })

    } catch (err) {
        console.log(err.message, "error")
        res.status(500).send({ message: err.message, error: true });
    }
})

AMSstrategyRoute.post("/insert-trade",(req,res) => {
    try{
        let {Strategy,transactiontype,Id,Price,symbol,ExpiryDate,ExpiryMonth,ExpiryYear,Type,strikeprice}=req.body;
        let Name=symbol+ExpiryDate+Months[+ExpiryMonth-1]+ExpiryYear+strikeprice+Type
        const token = req.headers.token.split(" ")[1];
        let Quantities={BANKNIFTY:45, NIFTY:50}
        var { AMSID, Group_Name, Role } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        let DateTime=getCurrentDateTime()
        let Position;
        if(transactiontype=="BUY"||transactiontype=="SHORTEXIT"){
            Position=1
        }
        else{
            Position=0
        }
        if(Role ==="Master_Admin"||Role ==="Creator"){
            let query = `INSERT INTO ${trade_tables[Strategy]} (Name,Strategy,Type,Id,Price,Position,DateTime,Qty,Token,Idxprice,SL,TSL,Profit) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            connection.query(query, [Name, Strategy, transactiontype, Id, Price, Position, DateTime, Quantities[symbol], "None", "None", "None", "None", "None"], (err, result) => {
                if (err) {
                    console.log(err.message, "error");
                    res.status(500).json({ message: "Error getting subscriptions", error: true });
                    return;
                }
                res.status(201).send({ data: result, error: false });
                return;
            });
        }   
        else{
            res.status(401).send({ message: "Unauthorized User", error: true });
        }
    }
    catch (err) {
        console.log(err.message, "error")
        res.status(500).send({ message: err.message, error: true });
    }
})

AMSstrategyRoute.post("/insert-equity-trade",(req,res) => {
    try{
        let Price=0
        let { Reason,Symbol, Target,SL,Duration, BuyPrice1, BuyPrice2,Type, Id } = req.body;
        Symbol=Symbol.trim()
        Reason = JSON.stringify(Reason);
        let query = `SELECT * FROM stocks WHERE Symbol = ?`;
        connection.query(query, [Symbol], (err, results) => {
            if (err) {
                console.log('Error executing query:', err);
                res.status(500).send({message:'No data found for symbol'+ Symbol,error:true});
                return;
            }
            if (results.length === 0) {
                console.log('No data found for symbol'+ Symbol);
                res.status(500).send({message:'No data found for symbol '+ Symbol,error:true});
                return;
            }
            let Exited= Type==="BUY"?1:0
            const { Token, ISIN_Code  } = results[0];
            let DateTime=getCurrentDateTime()
            let insertQuery = 'INSERT INTO equity_trades (Token, ISIN_Code, Symbol, Reason, DateTime,Target,SL,Duration, BuyPrice1, BuyPrice2,Type, Id, Exited, Price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            connection.query(insertQuery, [Token, ISIN_Code, Symbol,[`${Reason}`],DateTime,Target,SL,Duration, BuyPrice1, BuyPrice2,Type, Id, Exited, Price], (err, results) => {
                if (err) {
                    console.log('Error inserting equity trade:', err);
                    res.status(500).send({message:'Error inserting equity trade',error:true});
                    return;
                }
    
                res.status(200).send({message:'trade inserted successfully',error:false});
            });
        });
    }
    catch (err) {
        console.log(err.message, "error")
        res.status(500).send({ message: err.message, error: true });
    }
})

AMSstrategyRoute.get("/today-traded-users", function (req, res) {
    try {
        const token = req.headers.token.split(" ")[1];
        var { AMSID, Group_Name, Role } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        let Query = ``
        let Param = []
        if (Role == "Franchise") {
            Query = `SELECT t.UserID, s.Name
        FROM (
            SELECT UserID, MAX(DateTime) AS DateTime
            FROM (
                SELECT UserID, DateTime FROM orders WHERE DateTime LIKE ?
                UNION ALL
                SELECT UserID, DateTime FROM upstox_orders WHERE DateTime LIKE ?
                UNION ALL
                SELECT UserID, DateTime FROM kotak_orders WHERE DateTime LIKE ?
                UNION ALL
                SELECT UserID, DateTime FROM fyers_orders WHERE DateTime LIKE ?
                UNION ALL
                SELECT UserID, DateTime FROM dhan_orders WHERE DateTime LIKE ?
            ) AS combined_orders
            GROUP BY UserID
        ) AS t
        INNER JOIN signup AS s ON t.UserID = s.UserID
        WHERE s.Welcome = ?`;
            Param = [`%${formattedDate}%`, `%${formattedDate}%`, `%${formattedDate}%`, `%${formattedDate}%`, `%${formattedDate}%`, AMSID]
        }
        else if (Role == "Master_Admin" || Role == "Creator") {
            Query = `SELECT t.UserID, s.Name FROM 
            ( SELECT UserID, MAX(DateTime) AS DateTime FROM ( 
            SELECT UserID, DateTime FROM orders WHERE DateTime LIKE ? AND Strategy IN (?)  
            UNION ALL SELECT UserID, DateTime FROM upstox_orders WHERE DateTime LIKE ? AND Strategy IN (?) 
            UNION ALL SELECT UserID, DateTime FROM kotak_orders WHERE DateTime LIKE ? AND Strategy IN (?)
            UNION ALL SELECT UserID, DateTime FROM dhan_orders WHERE DateTime LIKE ? AND Strategy IN (?) ) 
            AS combined_orders GROUP BY UserID ) AS t 
            INNER JOIN signup AS s ON t.UserID = s.UserID`
            Param = [`%${formattedDate}%`, Strategies[Group_Name],`%${formattedDate}%`, Strategies[Group_Name], `%${formattedDate}%`, Strategies[Group_Name], `%${formattedDate}%`, Strategies[Group_Name]]
        }

        connection.query(Query, Param, (err, result) => {
            if (err) {
                console.log(err.message, "error");
                res.status(500).json({ message: "Error getting traded users", error: true });
                return;
            }
            res.status(200).send({ data: result, error: false });
            return;
        });
    }
    catch (err) {
        console.log(err.message, "error")
        res.status(500).send({ message: err.message, error: true });
    }

})


AMSstrategyRoute.get("/users-live-trades/:id", function (req, res) {
    try {
        let UserID = req.params.id

        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        endDate = new Date().getTime() / 1000
        const oneDayInMillis = 24 * 60 * 60 * 1000;
        endDate = endDate + oneDayInMillis / 1000
        endDate = new Date(endDate * 1000)

        let Query = `Select Broker from api where UserID = ? `
        connection.query(Query, [UserID], (err, result) => {
            if (err) {
                res
                    .status(500)
                    .json({ message: "Error getting broker details", error: true });
                return;
            }
            if (result.length > 0 && Object.keys(ordertable).includes(result[0].Broker)) {
                let Broker = result[0].Broker;
                let Query = `SELECT * FROM ${ordertable[Broker]} WHERE UserID=? AND DateTime >= ? AND DateTime <= ? AND Status=1`

                connection.query(Query, [UserID, startDate, endDate], (err, result) => {
                    if (err) {
                        console.log(err.message)
                        res
                            .status(500)
                            .json({ message: "Error getting orders", error: true });
                        return;
                    }
                    if (result.length > 0) {
                        res.status(200).send({ message: "Success", data: result, status: true });
                    }
                    else {
                        res.status(200).send({ message: "No data Found", data: [], status: true })
                    }
                })
            }
            else {
                res.status(200).send({ message: "No data Found", data: [], status: true })
            }

        })
    }
    catch (error) {
        res.status(500).send({ message: error.message, error: true });
    }
})

AMSstrategyRoute.get("/orders-by-userid/:id",(req, res) => {
        try{

            const token = req.headers.token.split(" ")[1];
            var { AMSID, Group_Name, Role } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
            let today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            let startOfDay = today.toISOString().slice(0, 19).replace("T", " ");
                
            let UserID = req.params.id
            let Query=""
            let Params=""

            if(Role == "Franchise"){
                Query=`SELECT U.Symbol, U.UserID, U.DateTime, U.Id, U.Strategy, U.Price, U.Message, U.Status, U.type, U.Token AS OrderID, U.Quantity, S.Name
                FROM upstox_orders U
                JOIN signup S ON U.UserID = S.UserID
                WHERE U.Strategy IN (?) AND U.DateTime >= ? AND U.UserID = ? AND S.Welcome = ?
                UNION 
                SELECT O.Symbol, O.UserID, O.DateTime, O.Id, O.Strategy, O.Price, O.Message, O.Status, O.type, O.OrderID, O.Quantity, S.Name
                FROM orders O
                JOIN signup S ON O.UserID = S.UserID
                WHERE O.Strategy IN (?) AND O.DateTime >= ? AND O.UserID = ? AND S.Welcome = ?
                UNION 
                SELECT k.Symbol, k.UserID, k.DateTime, k.Id, k.Strategy, k.Price, k.Message, k.Status, k.type, k.Token AS OrderID, k.Quantity, S.Name
                FROM kotak_orders k
                JOIN signup S ON k.UserID = S.UserID
                WHERE k.Strategy IN (?) AND k.DateTime >= ? AND k.UserID = ? AND S.Welcome = ?`
                Params = [Strategies[Group_Name], startOfDay, UserID, AMSID, Strategies[Group_Name], startOfDay, UserID,AMSID, Strategies[Group_Name], startOfDay, UserID, AMSID]
            }
            else if(Role == "Master_Admin" || Role == "Creator"){
                Query=`SELECT U.Symbol, U.UserID, U.DateTime, U.Id, U.Strategy, U.Price, U.Message, U.Status, U.type, U.Token AS OrderID, U.Quantity, S.Name
                FROM upstox_orders U
                JOIN signup S ON U.UserID = S.UserID
                WHERE U.Strategy IN (?) AND U.DateTime >= ? AND U.UserID = ?
                UNION 
                SELECT O.Symbol, O.UserID, O.DateTime, O.Id, O.Strategy, O.Price, O.Message, O.Status, O.type, O.OrderID, O.Quantity, S.Name
                FROM orders O
                JOIN signup S ON O.UserID = S.UserID
                WHERE O.Strategy IN (?) AND O.DateTime >= ? AND O.UserID = ?
                UNION 
                SELECT D.Symbol, D.UserID, D.DateTime, D.Id, D.Strategy, D.Price, D.Message, D.Status, D.type, D.Quantity, S.Name, D.Token AS OrderID
                FROM dhan_orders D
                JOIN signup S ON D.UserID = S.UserID
                WHERE D.Strategy IN (?) AND D.DateTime >= ? AND D.UserID = ?
                UNION 
                SELECT k.Symbol, k.UserID, k.DateTime, k.Id, k.Strategy, k.Price, k.Message, k.Status, k.type, k.Token AS OrderID, k.Quantity, S.Name
                FROM kotak_orders k
                JOIN signup S ON k.UserID = S.UserID
                WHERE k.Strategy IN (?) AND k.DateTime >= ? AND k.UserID = ?`
                Params = [Strategies[Group_Name], startOfDay, UserID, Strategies[Group_Name], startOfDay, UserID, Strategies[Group_Name], startOfDay,UserID, Strategies[Group_Name], startOfDay, UserID]

            }

            connection.query(Query, Params, (err, result) => {
                if (err) {
                    console.log(err.message, "error")
                    res
                        .status(500)
                        .json({ message: "Error getting orders by UserID", error: true });
                    return;
                }
                res.status(200).send({ data: result, error: false });
                return;
            })
        }
        catch (error) {
            console.log(error.message, "error")
            res.status(500).send({ message: error.message, error: true });
        }
})

AMSstrategyRoute.post("/users-trades/:id", function (req, res) {
    try {
        let UserID = req.params.id
        let { startDate, endDate } = req.body
        startDate = new Date(startDate);
        endDate = new Date(endDate).getTime() / 1000
        const oneDayInMillis = 24 * 60 * 60 * 1000;
        endDate = endDate + oneDayInMillis / 1000
        endDate = new Date(endDate * 1000)

        let Query = `Select Broker from api where UserID = ? `
        connection.query(Query, [UserID], (err, result) => {
            if (err) {
                res
                    .status(500)
                    .json({ message: "Error getting broker details at user's trades", error: true });
                return;
            }
            if (result.length > 0 && Object.keys(ordertable).includes(result[0].Broker)) {
                let Broker = result[0].Broker;
                let Query = `SELECT * FROM ${ordertable[Broker]} WHERE UserID=? AND DateTime >= ? AND DateTime <= ? AND Status=1`
                connection.query(Query, [UserID,startDate,endDate], (err, result) => {
                    if (err) {
                        console.log(err.message, "error");
                        res.status(500).json({ message: "Error getting user's trades", error: true });
                        return;
                    }
                    res.status(201).send({ data: result, error: false });
                    return;
                });
            }
            else {
                res.status(200).send({ message: "No data Found", data: [], status: true })
            }

        })
    }
    catch (error) {
        console.log(error.message, "error")
        res.status(500).send({ message: error.message, error: true });
    }
})


module.exports = AMSstrategyRoute