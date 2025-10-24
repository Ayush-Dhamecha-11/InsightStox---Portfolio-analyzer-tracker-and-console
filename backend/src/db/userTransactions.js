import { sql } from "./dbConnection.js";

export const getPortfolioTransactions = async (email) => {
    try {
        const result = await sql`SELECT s.short_name,s.long_name,ut.transaction_type,ut.quantity,ut.price,ut.transaction_date FROM "user_transactions" as ut join "stocks" as s on ut.symbol=s.symbol Where ut.email=${email}`;
        return result;
    } catch (error) {
        console.log('Error fetching transactions:', error);
        return null;
    }
};