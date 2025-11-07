import dotenv from "dotenv";
dotenv.config();

import { neon,neonConfig } from "@neondatabase/serverless";

let sql;
neonConfig.fetchConnectionCache = true;
const connectDB = () => {
    try {
        if(!sql){sql = neon(process.env.DATABASE_URL);
        console.log("DB Connected");}
        return sql;
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
        return null;
    }
};
export { connectDB };
export { sql };
