const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const CSB = require("./routes/consumableStockBookRoute"); // CSB = consumableStockBook
const department = require("./routes/departmentRoute")
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser");
const indentBook = require("./routes/indentBookRoute");
const item = require("./routes/itemRoute");
const SBTP = require("./routes/stockBookToolsAndPlantsRoute"); // SBTP -> stockBookToolsAndPlant
const supplierItems = require("./routes/supplierItemsRoute");
const supplier = require("./routes/supplierRoute");

const app = express();

// Configure CORS with credentials
const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // This is important for credentials to be passed (cookies, tokens)
};

if (process.env.NODE_ENV === "production") {
    corsOptions.origin = process.env.FRONTEND_URL // Replace with your frontend domain
} else {
    corsOptions.origin = 'http://localhost:3000';
}

// Enable cors
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes middleware
app.use("/api/users", userRoute);
app.use("/api/CSB", CSB); // CSB = consumableStockBook  
app.use("/api/department", department);
app.use("/api/indentBook", indentBook);
app.use("/api/items", item);
app.use("/api/sbtp", SBTP); // SBTP -> stockBookToolsAndPlant
app.use("/api/supplierItems", supplierItems);
app.use("/api/supplier", supplier);

// Routes
app.get("/", (req, res) => {
    res.send("Home Page")
})

// Error Middleware
app.use(errorHandler);

// Connect to db and start server
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })
