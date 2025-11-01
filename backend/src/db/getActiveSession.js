import { sql } from "./dbConnection.js";

const getAllActiveSessionOfUser = async (email) => {
    try {
        const result = await sql`SELECT * FROM "active_session" WHERE email = ${email}`;
        return result;
    } catch (error) {
        console.log('Database Error - getAllActiveSessionOfUser');
        return null;
    }
}

const getActiveSessionByToken = async (token) => {
    try {
        const result = await sql`SELECT email FROM "active_session" WHERE token = ${token}`;
        return result;
    } catch (error) {
        console.log('Database Error - getActiveSessionByToken');
        return null;
    }
}

export { getAllActiveSessionOfUser , getActiveSessionByToken };