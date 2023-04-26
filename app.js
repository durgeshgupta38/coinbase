const express = require("express");
const morgan = require("morgan")
const userRouter = require("./routes/userRoutes")
const app = express();

//logging request for development
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

//body parser, reading data from body into req.body
app.use(express.json());

//user route define
app.use('/api/v1/users',userRouter)

module.exports = app;