import { sql } from "./dbConnection.js";

const updateProfileName = async (email, name) => {
    try {
        const result =
            await sql`UPDATE "user" SET name=${name} WHERE email=${email} RETURNING id`;
        return result;
    } catch (error) {
        console.log("Error updating profile name:", error);
        return null;
    }
};

const updateProfileInvestmentExperience = async (
    email,
    investmentExperience
) => {
    try {
        const result =
            await sql`UPDATE "user" SET investmentExperience=${investmentExperience} WHERE email=${email} RETURNING id`;
        return result;
    } catch (error) {
        console.log("Error updating profile investment experience:", error);
        return null;
    }
};

const updateProfileRiskProfile = async (email, riskProfile) => {
    try {
        const result =
            await sql`UPDATE "user" SET riskProfile=${riskProfile} WHERE email=${email} RETURNING id`;
        return result;
    } catch (error) {
        console.log("Error updating profile risk profile:", error);
        return null;
    }
};

const updateProfileFinancialGoals = async (email, financialGoals) => {
    try {
        const result =
            await sql`UPDATE "user" SET financialGoals=${financialGoals} WHERE email=${email} RETURNING id`;
        return result;
    } catch (error) {
        console.log("Error updating profile financial goals:", error);
        return null;
    }
};

const updateProfileInvestmentHorizon = async (email, investmentHorizon) => {
    try {
        const result =
            await sql`UPDATE "user" SET investmentHorizon=${investmentHorizon} WHERE email=${email} RETURNING id`;
        return result;
    } catch (error) {
        console.log("Error updating profile investment horizon:", error);
        return null;
    }
};

export {
    updateProfileName,
    updateProfileInvestmentExperience,
    updateProfileRiskProfile,
    updateProfileFinancialGoals,
    updateProfileInvestmentHorizon,
};
