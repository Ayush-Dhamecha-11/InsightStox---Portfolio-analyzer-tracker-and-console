import { sql } from "./dbConnection.js";

export const addSymbol = async (email, symbol) => {
    try {
        const result = await sql`INSERT INTO "watchlists" (email, symbol) VALUES (${email}, ${symbol}) ON CONFLICT (email, symbol) DO NOTHING`;
        if(!result) {
            return false;
        }
        return true;
    } catch (error) {
        console.log('Add to watchlist DB error:', error);
        return false;
    }   
};
export const removeSymbol = async (email, symbol) => {
    try {
        const result = await sql`DELETE FROM "watchlists" WHERE email=${email} AND symbol=${symbol}`;
        if(!result) {
            return false;
        }
        return true;
    } catch (error) {
        console.log('Remove from watchlist DB error:', error);
        return false;
    }
};
export const getWatchlist = async (email) => {
    try{
        const result = await sql`SELECT symbol FROM "watchlists" WHERE email=${email}`;
        if(!result) {
            return null;
        }
        return result;
    }catch(error){
        console.log('get watchlist DB error:', error);
        return null;
    }
}