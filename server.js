// # Main application file
const express = require('express')
const app = express()
const db = require('./configure/db');
 require('dotenv').config(); // .env file 

//body parser
const bodyParser = require('body-parser') ;
app.use(bodyParser.json()) ; // req.body 
const PORT = process.env.PORT||3000  // THIS IS IMPORT FROM .ENV

app.listen(PORT , ()=>{
    console.log("server is listening on port 3000")
})

//GET METHOD of home
app.get('/', function (req, res) {
    res.send('welcome to drama blossom ')
  })

//IMPORT user router file 
const userRoutes = require('./routes/userRoutes');
//use routers
app.use('/user',userRoutes) ; 