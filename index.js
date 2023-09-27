const express = require("express");
const app = express();
const connection = require("./configs/db.connection")
const cors = require('cors')

require("dotenv").config()

app.use(express.json())

app.use(cors())



app.listen(8000, (err)=>{
    if(err){
        console.error(err)
        throw err
    }

    connection.connect((err) => {
          if (err) throw err
          console.log("Connected to DB")
        })
    console.log("server running on port: ", 8000)
})