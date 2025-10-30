import { getStockSummary } from "../../db/stockSummary.js";
import { getPrice } from "../../utils/getQuotes.js";
import { stockPriceStore } from "../../utils/stockPriceStore.js";
export const userStockSummary = async (req, res) => {
    const email = req.user.email;
    try {
        const stockSummary = await getStockSummary(email);
        if (!stockSummary) {
            return res.status(500).json({ success: false, message: "Failed to retrieve stock summary" });
        }
        const userStockSummary = await Promise.all(
    stockSummary.map(async ({ symbol, current_holding, avg_price }) => {
        if (!stockPriceStore.get(symbol)) {
            const q = await getPrice(symbol);
            stockPriceStore.add(symbol, {
                current: q.MarketPrice || 0,
                yesterdayClose: q.close || 0,
                currency: q.currency,
                expiresAt: Date.now() + 60 * 1000
            });
        }
        avg_price = Number(avg_price);
        current_holding = Number(current_holding);
        const priceData = stockPriceStore.get(symbol);
        const currentPrice = priceData ? priceData.current : 0;
        const value = current_holding * currentPrice;
        return {
            stock: symbol,
            quantity: current_holding,
            avg_price: avg_price.toFixed(2),
            current_price: currentPrice.toFixed(2),
            value: value.toFixed(2)
        };
    }));
    return res.status(200).json({ success: true, data: userStockSummary });
    } catch (error) {
        console.log('User stock summary error:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};