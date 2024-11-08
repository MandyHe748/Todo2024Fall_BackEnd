import fs from "fs"
import path from "path";
import {pool} from "./db.js"
import bcrypt from "bcrypt"; // Import bcrypt
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(__dirname, "../todo2024_test.sql"), "utf8");
    
    pool.query(sql);
}
const insertTestUser = (email, password) => {
    bcrypt.hash(password, 10, (error, hashedPassword) => {
        pool.query("insert into account (email,password) values ($1,$2)",
            [email, hashedPassword]
    )
})
}
// const initializeTestDb = async () => {
//     const sql = fs.readFileSync(path.resolve(__dirname, "../todo2024_test.sql"), "utf8");
//     try {
//         await pool.query(sql);  // Wait for the query to complete before proceeding
//         console.log("Test database initialized");
//     } catch (error) {
//         console.error("Error initializing test database:", error);
//         throw error;
//     }
// };

// const insertTestUser = async (email, password) => {
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);  // Await bcrypt hash
//         await pool.query("INSERT INTO account (email, password) VALUES ($1, $2)", [email, hashedPassword]);
//         console.log(`Inserted test user: ${email}`);
//     } catch (error) {
//         console.error("Error inserting test user:", error);
//         throw error;
//     }
// };

const getToken = (email) => {
    return jwt.sign({user:email}, process.env.JWT_SECRET_KEY)
}
export { initializeTestDb, insertTestUser, getToken}


