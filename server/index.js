const mysql = require("mysql2/promise");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

let db;

app.post("/contacts", async (req, res) => {
  const { name, email, mobile } = req.body;
  const [results] = await db.query(
    `INSERT INTO contacts(name, email, phone) values(?,?,?);`,
    [name, email, mobile]
  );
  if (results) {
    res.status(201).send(`resourse created with id - ${results.insertId}`);
  } else {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/contacts", async (req, res) => {
  const [results] = await db.query(`SELECT * FROM contacts`);

  if (results) {
    res.status(200).json(results);
  } else {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    const [results] = await db.query(
      `SELECT * FROM contacts
            where id = ?`,
      [id]
    );
    res.status(200).json(results);
  } else if ((results = [])) {
    res.status(404).send("Not Found");
  } else {
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/contacts/:id", async (req, res) => {
  const { id } = req.params;

  const [check] = await db.query(`SELECT * FROM CONTACTS where id = ?;`, [id]);
  console.log(check);
  if (check == []) {
    res.status(404).send("Not Found");
    return;
  } else {
    const [results] = await db.query(
      `DELETE FROM contacts
            where id = ?`,
      [id]
    );
    res.send("Object Deleted Successfully");
  }
});

app.put("/contacts/:id", async (req, res) => {
  const id = req.params.id;
  const { Name, Email, Phone } = req.body;

  if (!Name && !Email && !Phone) {
    res.status(400).send("Send Something HomeBoy");
  }

  let x = [];
  let y = [];

  if(Name){
    x.push("name=? ");
    y.push(Name);
  }
  if(Email){
    x.push("email=? ");
    y.push(Email);
  } 
  if(Phone){
    x.push("Phone=? ");
    y.push(Phone);
  }
  y.push(id);


  const [results] = await db.query(`UPDATE contacts SET ${x.join(", ")} WHERE id = ?;`, y);


  if(results.affectedRows > 0){
    res.status(202).send("Contact Updated")
  } else{
    res.status(500).send("Internal Server Error")
  }
  
});

mysql
  .createConnection({
    host: "localhost",
    user: "root",
    password: "Mahendar@566",
    database: "contacts_db",
  })
  .then((connection) => {
    db = connection;
    console.log("Connected to Database Successfully");
    app.listen(3000, () => {
      console.log("Server Started, Listening at Port: 3000");
    });
  });
