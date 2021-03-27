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





app.get('/recipe', (req, res) => {

    // fetch recipe where slug === req.query.slug from database

    axios
    .get('https://my.api.mockaroo.com/recipe.json?key=f6a27260')
    .then(apiResponse => res.json(apiResponse.data[0]))
    .catch(err => next(err))
})

app.get('/usersbyname', (req, res) => {

    // fetch users where name === req.query.username 
    // or name === req.query.firstName
    // or name === req.query.lastName from database

    axios
    .get('https://my.api.mockaroo.com/user.json?key=f6a27260')
    .then(apiResponse => res.json(apiResponse.data))
    .catch(err => next(err))
})






app.get('/comments', (req, res) => {

    // fetch comments where recipe === req.query.recipeID from database

    axios
    .get('https://my.api.mockaroo.com/comment.json?key=f6a27260')
    .then(apiResponse => res.json(apiResponse.data))
    .catch(err => next(err))
})


// export the express app we created to make it available to other modules
module.exports = app