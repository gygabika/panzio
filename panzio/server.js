const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemon = require("nodemon");
const mysql = require("mysql");
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
    user:"root",
    host:"127.0.0.1",
    port: 3307,
    password:"",
    database:"fogado"
})

app.get("/", (req,res) => {
    res.send("Fut a backend!");
});

app.listen(3567, () => {
    console.log("A szerveren a 3567 porton fut!");
})

app.get("/",( req, res) => {
    const sql ="SELECT * FROM ``";
    db.query(sql, (err,result) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(result);
    })
})
 
app.get("/szobak",( req, res) => {
    const sql = "SELECT * FROM `szobak`";
    db.query(sql, (err,result) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(result);
    })
})

app.get("/foglalasok",( req, res) => {
    const sql = "SELECT szobak.szazon AS szoba, COUNT(DISTINCT foglalasok.vendeg) AS vendegek, SUM(DATEDIFF(foglalasok.tav, foglalasok.erk)) AS vendegejszakak FROM szobak JOIN foglalasok ON szobak.szazon = foglalasok.szoba GROUP BY szobak.szazon ORDER BY vendegejszakak ASC, vendegek ASC;";
    db.query(sql, (err,result) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(result);
    })
})

app.get("/foglaltsag",( req, res) => {
    const sql = "SELECT vendegek.vnev AS nev, foglalasok.erk AS erkezes, foglalasok.tav AS tavozas FROM foglalasok JOIN vendegek ON foglalasok.vendeg = vendegek.vsorsz WHERE foglalasok.szoba IN (1, 2, 3) ORDER BY vendegek.vnev ASC;";
    db.query(sql, (err,result) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(result);
    })
})

app.get("/foglaltsag/:szobaId",( req, res) => {
    const szobaId = req.params.szobaId;
    db.query("SELECT vendegek.vnev AS nev, foglalasok.erk AS erkezes, foglalasok.tav AS tavozas FROM foglalasok JOIN vendegek ON foglalasok.vendeg = vendegek.vsorsz WHERE foglalasok. szoba = ? ORDER BY vendegek.vnev ASC;",
    [szobaId],
    (err,result) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(result);
    })
})

app.listen(PORT, () => {
    console.log("Server fut:");
})