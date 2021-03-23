// import and instantiate express
const express = require("express") // CommonJS import style!
const app = express() // instantiate an Express object

const morgan = require("morgan") // middleware for nice logging of incoming HTTP requests
const multer = require("multer") // middleware to handle HTTP POST requests with file uploads
const axios = require("axios") // middleware for making requests to APIs
require("dotenv").config({ silent: true }) // load environmental variables from a hidden file named .env


// use the bodyparser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data
app.use(morgan("dev")) // dev style gives a concise color-coded style of log output


// we will put some server logic here later...


// export the express app we created to make it available to other modules
module.exports = app