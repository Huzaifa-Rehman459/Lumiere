const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const userRoute = require("./routes/userRoute");

//mongo connection
connectDB();

//middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//api routes
app.use("/api", userRoute);

//server started
app.listen(PORT, () =>{
    console.log(`Server started on PORT: ${PORT}`);
});