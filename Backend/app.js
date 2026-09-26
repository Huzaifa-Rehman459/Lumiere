const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const categoryRoute = require("./routes/categoryRoutes");

//mongo connection
connectDB();

//middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//api routes
app.use("/api", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/categories", categoryRoute);

//server started
app.listen(PORT, () =>{
    console.log(`Server started on PORT: ${PORT}`);
});