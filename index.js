var express = require("express");
const errorhandler = require("./middleware/errorhandler");
const dotenv = require("dotenv").config();
const app = express();
//app.set("view engine", "ejs");

const connectDb = require("./config/dbConnection");
connectDb();

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorhandler);

app.listen(3000);
