const mysql = require("mysql2/promise");
const express = require("express");
const morgan = require("morgan")
const cors = require("cors");

const app = express();
app.use(morgan(("dev")));
app.use(express.json());
app.use(cors())


let db;

app.post("/contacts", async (req,res) => {
    const{name, email, mobile} = req.body;
    const [results] = await db.query(`INSERT INTO contacts(name, email, phone) values(?,?,?);`,[name, email, mobile])
    if(results){
        res.status(201).send(`resourse created with id - ${results.insertId}`);
    } else{
        res.status(500).send("Internal Server Error");
    }
})

mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "Mahendar@566",
    database: "contacts_db"
}).then((connection) =>{
    db = connection;
    console.log("Connected to Database Successfully");
    app.listen(3000, () => {
        console.log("Server Started, Listening at Port: 3000");
    })
});

