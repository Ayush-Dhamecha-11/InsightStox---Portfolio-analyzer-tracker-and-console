import { calculatePortfolio } from "../../../../src/controllers/dashBoard/portfolioCalculation.controller.js";
import { getStockSummary } from "../../../../src/db/stockSummary.js";
import { getPrice } from "../../../../src/utils/getQuotes.js";
import { stockPriceStore } from "../../../../src/utils/stockPriceStore.js";
jest.mock("../../../../src/db/stockSummary.js");
jest.mock("../../../../src/utils/getQuotes.js");

jest.mock("../../../../src/utils/stockPriceStore.js", () => ({
    stockPriceStore: {
        get: jest.fn(),
        add: jest.fn(),
    },
}));

const MOCK_USER_EMAIL = "test@example.com";
const MOCK_STOCK_SUMMARY = [
    { symbol: 'AAPL', current_holding: 10, spended_amount: 1500.00, yestarday_holding: 10 },
    { symbol: 'GOOG', current_holding: 5, spended_amount: 5000.00, yestarday_holding: 5 },
];

const MOCK_AAPL_PRICE = { MarketPrice: 160.00, close: 158.00, currency: 'USD' };
const MOCK_GOOG_PRICE = { MarketPrice: 1050.00, close: 1040.00, currency: 'USD' };

describe("calculatePortfolio", () => {
    let req, res;

    beforeEach(() => {
        req = { user: { email: MOCK_USER_EMAIL } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        jest.clearAllMocks();

        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it("should calculate portfolio metrics successfully using cached prices", async () => {
        getStockSummary.mockResolvedValue(MOCK_STOCK_SUMMARY);

        // Setup: Mock price store to simulate a cache hit for both symbols
        stockPriceStore.get.mockImplementation((symbol) => {
            if (symbol === 'AAPL') return { current: MOCK_AAPL_PRICE.MarketPrice, yesterdayClose: MOCK_AAPL_PRICE.close };
            if (symbol === 'GOOG') return { current: MOCK_GOOG_PRICE.MarketPrice, yesterdayClose: MOCK_GOOG_PRICE.close };
            return undefined;
        });

        await calculatePortfolio(req, res);

        expect(getStockSummary).toHaveBeenCalledWith(MOCK_USER_EMAIL);
        expect(stockPriceStore.get).toHaveBeenCalledTimes(2);
        expect(getPrice).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            totalValuation: "6850.00",
            overallProfitLoss: "350.00",
            todayProfitLoss: "70.00",
            ttodayProfitLosspercentage: "1.02", 
            overallProfitLosspercentage: "5.38"
        });
    });

    it("should calculate portfolio metrics successfully and fetch uncached prices", async () => {
        getStockSummary.mockResolvedValue(MOCK_STOCK_SUMMARY);

        stockPriceStore.get.mockReturnValue(undefined);

        getPrice.mockImplementation((symbol) => {
            if (symbol === 'AAPL') return Promise.resolve(MOCK_AAPL_PRICE);
            if (symbol === 'GOOG') return Promise.resolve(MOCK_GOOG_PRICE);
        });
        
        await calculatePortfolio(req, res);

        expect(getPrice).toHaveBeenCalledTimes(2);
        expect(getPrice).toHaveBeenCalledWith('AAPL');
        expect(getPrice).toHaveBeenCalledWith('GOOG');
        expect(stockPriceStore.add).toHaveBeenCalledTimes(2);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            totalValuation: "6850.00",
            overallProfitLoss: "350.00",
            ttodayProfitLosspercentage: "1.02",
        }));
    });


    it("should return 500 if external price fetching fails (returns falsy)", async () => {
        getStockSummary.mockResolvedValue([
            { symbol: 'FAIL', current_holding: 1, spended_amount: 10, yestarday_holding: 1 },
        ]);
        
        stockPriceStore.get.mockReturnValue(undefined); 
        getPrice.mockResolvedValue(null); 

        await calculatePortfolio(req, res);

        expect(getPrice).toHaveBeenCalledWith('FAIL');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Failed to fetch stock prices.",
        });
    });

    it("should calculate portfolio correctly when price data is 0 (zero-based calculation)", async () => {
        const summaryForZeroTest = [
            { symbol: 'SKIP', current_holding: 10, spended_amount: 100, yestarday_holding: 10 },
        ];
        getStockSummary.mockResolvedValue(summaryForZeroTest);

        stockPriceStore.get.mockReturnValue(undefined);
        getPrice.mockResolvedValue({ MarketPrice: 0, close: 0, currency: 'USD' });

        await calculatePortfolio(req, res); 

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            totalValuation: "0.00",
            overallProfitLoss: "-100.00",
            todayProfitLoss: "0.00",
        }));
    });


    it("should return 404 if no stock summary is found (empty array)", async () => {
        getStockSummary.mockResolvedValue([]);

        await calculatePortfolio(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "No stock summary found for the user.",
        });
    });

    it("should return 500 if DB fetching stock summary throws an error", async () => {
        const error = new Error("DB connection failed");
        getStockSummary.mockRejectedValue(error);

        await calculatePortfolio(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            success: false, 
            message: "An error occurred while calculating the portfolio." 
        });
    });
});
