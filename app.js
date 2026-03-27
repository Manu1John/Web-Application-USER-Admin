const express = require("express");
const session = require("express-session");
const connectDB = require("./config/db");
const { disableCache } = require("./middlewares/authMiddleware");


// Route imports
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();
// Initialize DB
connectDB();

// Global Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false,
}));
app.use(disableCache);

// Mount Routes
app.use("/", userRoutes);
app.use("/", adminRoutes);



app.listen(3000, () => console.log("server started on port 3000"));