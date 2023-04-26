const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

// It allows you to create environment variables in a .env file instead of putting them in your code.
dotenv.config({ path: "./config.env" });

//using this to keep password out of code
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

//connecting to db
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//will use port comming from config or either 3000
const port = process.env.PORT || 3000;

//server start
app.listen(port, () => {
  console.log("App running on port");
});
