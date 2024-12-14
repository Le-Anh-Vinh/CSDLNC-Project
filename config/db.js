import sql from "mssql";
import config from "./config.js";

const connectDB = async () => {
    try {
        await sql.connect(config.mssqlConfig);
        console.log("Connected to MSSQL database");
    } catch (err) {
        console.log(err);
    }
};

const closeDB = async () => {
    try {
        await sql.close();
        console.log("Disconnected to MSSQL database");
    } catch (err) {
        console.log(err);
    }
};

export { connectDB, closeDB };