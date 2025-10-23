import { sql } from "./dbConnection.js";

const toggleAiSuggestion = async (email) => {
    try {
        const result =
            await sql`UPDATE "user" SET aiSuggestion = NOT aiSuggestion WHERE email=${email} RETURNING id`;
        return result;
    } catch (error) {
        console.log("Error updating password:", error);
        return null;
    }
};
export { toggleAiSuggestion };
