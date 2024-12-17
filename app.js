import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./config/config.js";
import session from "express-session";
import { connectDB, closeDB } from "./config/db.js";
import router from "./routes/router.js";
import dotenv from "dotenv";

const app = express();
connectDB();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("./public"));

app.use('/', router);

app.use((req, res, next) => {
    const err = new Error("Page Not Found");
    err.statusCode = 404;
    err.desc = "The page you are looking for does not exist.";
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).render(`error/error${status}`, {
        statusCode: status,
        message: err.message,
        desc: err.desc
    });
});

app.listen(config.port, () => {
    console.log(`App is running on url http://localhost:${config.port}`);
});

process.on("SIGINT", () => {
  closeDB();
  console.log('Server shutting down.');
  process.exit(0);
});