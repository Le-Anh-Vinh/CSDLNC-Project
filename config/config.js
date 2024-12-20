import dotenv from "dotenv";
import assert from "assert";

dotenv.config();

const {
    PORT,
    HOST,
    HOST_URL,
    USER,
    PASSWORD,
    DATABASE,
    SESSION_SECRET
} = process.env;

assert(PORT, "PORT is required");
assert(HOST, "HOST is required");

const config = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    mssqlConfig: {
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        server: 'localhost',
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            encrypt: false,
            trustServerCertificate: true
        }
    }
}

export default config;