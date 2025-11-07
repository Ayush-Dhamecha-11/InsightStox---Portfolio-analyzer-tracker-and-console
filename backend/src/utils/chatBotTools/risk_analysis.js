import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { getStockSummary } from "../../db/stockSummary.js"
import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

export const Risk_analysis_tool = tool(
  // Risk analysis tool
  async (input,context) => {
    const userDetails = context.configurable.userDetails || {};
    const email_Id = userDetails.emailId || context.configurable.thread_id;
    const name = userDetails.name || "User";
    const userPortfolio = await getStockSummary(email_Id);
    console.log("portfolio of user with email id", email_Id, "and name", name, "is", userPortfolio);
    if (!userPortfolio || userPortfolio.length === 0) {
      console.log("No portfolio found for user with email id", email_Id);
      throw new Error("No portfolio found for the current user.");
    }

    const history = await yahooFinance.historical('RVNL.NS', {
          period1: start.toISOString().slice(0, 10),
          period2: end.toISOString().slice(0, 10)
        });

    console.log("Historical data for RVNL:", history);
    
    return { message: "Risk analysis completed successfully." };
  },{
    name: "Risk Analysis Tool",
    description: "Analyzes the risk associated with a stock or portfolio.",
    schema: z.object({
        queryType: z.string().optional().describe("do risk analysis based on 'portfolio' or 'stock'"),
    })
  }
);