import fs from "fs"
import path from "path";
import {pool} from "./db.js"
import bcrypt from "bcrypt"; // Import bcrypt
import jwt from "jsonwebtoken"; // Import jsonwebtoken
// const __dirname = import.meta.dirname
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
// import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(__dirname , "../todo2024_.sql"), "utf8");
    pool.query(sql)
}

const insertTestUser = (email, password) => {
    bcrypt.hash(password, 10,(error, hashedPassword) => {

        pool.query("insert into account (email,password) values ($1,$2)",
            [email, hashedPassword]
    )
})
}

const getToken = (email) => {
    return jwt.sign({user:email}, process.env.JWT_SECRET_KEY)
}
export { initializeTestDb, insertTestUser, getToken}