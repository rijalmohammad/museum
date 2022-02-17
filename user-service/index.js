const express = require("express")

var constants = require('./constants')
const DB_HOST = constants.DB_HOST
const DB_USER = constants.DB_USER
const DB_PASSWORD = constants.DB_PASSWORD
const DB_DATABASE = constants.DB_DATABASE
const DB_PORT = constants.DB_PORT

const app = express()
const mysql = require("mysql")

const port = constants.PORT
var server = app.listen(port, ()=> console.log(`Server Started on port ${port}...`))
server.setTimeout(500000);

const bcrypt = require("bcrypt")

const db = mysql.createPool({
   connectionLimit: 1000,
   connectTimeout: 60 * 60 * 1000,
   acquireTimeout: 60 *  60 * 1000,
   timeout: 60 * 60 * 1000,
   host: DB_HOST,
   user: DB_USER,
   password: DB_PASSWORD,
   database: DB_DATABASE,
   port: DB_PORT             
})

db.getConnection( (err, connection)=> {
   if (err) throw (err)
   console.log ("DB connected successful: " + connection.threadId)
})

app.use(express.json())
//middleware to read req.body.<params>
//CREATE USER
app.post("/createUser", async (req, res) => {
const firstName = req.body.firstName;
const surName = req.body.surName;
const email = req.body.email;
const phoneNumber = req.body.phoneNumber;
const hashedPassword = await bcrypt.hash(req.body.password, 10);

db.getConnection( async (err, connection) => {
 if (err) throw (err)
 const sqlSearch = "SELECT * FROM user WHERE email = ?"
 const search_query = mysql.format(sqlSearch,[email])
 const sqlInsert = "INSERT INTO user VALUES (0,?,?,?,?,?,?,?)"
 const insert_query = mysql.format(sqlInsert,[firstName, surName, email, phoneNumber, null, hashedPassword, null])
 // ? will be replaced by values
 // ?? will be replaced by string
 await connection.query (search_query, async (err, result) => {
  if (err) throw (err)
  console.log("------> Search Results")
  console.log(result.length)
  if (result.length != 0) {
   connection.release()
   console.log("------> User already exists")
   res.sendStatus(409) 
  } 
  else {
   await connection.query (insert_query, (err, result)=> {
   connection.release()
   if (err) throw (err)
   console.log ("--------> Created new User")
   console.log(result.insertId)
   res.sendStatus(201)
  })
 }
}) //end of connection.query()
}) //end of db.getConnection()
}) //end of app.post()

//LOGIN (AUTHENTICATE USER)
app.post("/login", (req, res) => {
   const user = req.body.email
   const password = req.body.password
   db.getConnection ( async (err, connection)=> {
    if (err) throw (err)
    const sqlSearch = "Select * from user where email = ?"
    const search_query = mysql.format(sqlSearch,[user])
    await connection.query (search_query, async (err, result) => {
     connection.release()
     
     if (err) throw (err)
     if (result.length == 0) {
      console.log("--------> User does not exist")
      res.sendStatus(404)
     } 
     else {
        const hashedPassword = result[0].password
        //get the hashedPassword from result
       if (await bcrypt.compare(password, hashedPassword)) {
       console.log("---------> Login Successful")
       res.send(result[0])
       } 
       else {
       console.log("---------> Password Incorrect")
       res.send("Password incorrect!")
       } //end of bcrypt.compare()
     }//end of User exists i.e. results.length==0
    }) //end of connection.query()
   }) //end of db.connection()
}) //end of app.post()