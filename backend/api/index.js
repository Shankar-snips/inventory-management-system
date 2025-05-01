const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const CSB = require("./routes/consumableStockBookRoute");
const department = require("./routes/departmentRoute");
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser");
const indentBook = require("./routes/indentBookRoute");
const item = require("./routes/itemRoute");
const SBTP = require("./routes/stockBookToolsAndPlantsRoute");
const supplierItems = require("./routes/supplierItemsRoute");
const supplier = require("./routes/supplierRoute");

const app = express();

// Configure CORS with credentials
const corsOptions = {
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes middleware
app.use("/api/users", userRoute);
app.use("/api/CSB", CSB);  // CSB = consumableStockBook  
app.use("/api/department", department);
app.use("/api/indentBook", indentBook);
app.use("/api/items", item);
app.use("/api/sbtp", SBTP);  // SBTP -> stockBookToolsAndPlant
app.use("/api/supplierItems", supplierItems);
app.use("/api/supplier", supplier);

// Error Middleware
app.use(errorHandler);

// Serve static files from the React app (after building it)
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// For all non-API routes (i.e., frontend routes), send the React app's index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

// Connect to db and start server
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
