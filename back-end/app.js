// import and instantiate express
const express = require("express") // CommonJS import style!
const morgan = require("morgan") // middleware for nice logging of incoming HTTP requests
const app = express() // instantiate an Express object
app.use(morgan("dev")) // dev style gives a concise color-coded style of log output
// we will put some server logic here later...
// export the express app we created to make it available to other modules
module.exports = app