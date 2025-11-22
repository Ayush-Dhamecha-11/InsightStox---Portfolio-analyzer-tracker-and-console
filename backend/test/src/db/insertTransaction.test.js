import { insertTransaction } from "../../../src/db/insertTransaction.js";
import { getPrice } from "../../../src/utils/getQuotes.js";
import { PriceStore } from "../../../src/utils/stores/priceRates.js";
import { sql } from "../../../src/db/dbConnection.js";
import YahooFinance from 'yahoo-finance2';

jest.mock("yahoo-finance2", () => {
    const mockQuoteSummary = jest.fn();
    const MockYahooFinance = jest.fn(() => ({
        quoteSummary: mockQuoteSummary
    }));
    MockYahooFinance.mockQuoteSummary = mockQuoteSummary;
    return MockYahooFinance;
});

jest.mock("../../../src/db/dbConnection.js", () => {
    const mockSql = jest.fn();
    mockSql.transaction = jest.fn();
    return { sql: mockSql };
});

jest.mock("../../../src/utils/getQuotes.js", () => ({
    getPrice: jest.fn(),
}));

jest.mock("../../../src/utils/stores/priceRates.js", () => ({
    PriceStore: {
        get: jest.fn(),
    },
}));

describe('insertTransaction Database Function', () => {
    const mockEmail = "test@example.com";
    const mockSymbol = "AAPL";
    const mockTime = new Date().toISOString();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Input Validation & Holdings Checks', () => {
        it('should return error if SELL requested but holding is insufficient', async () => {
            sql.mockResolvedValueOnce([{ current_holding: 5, avg_price: 100 }]);
            const result = await insertTransaction(mockEmail, mockSymbol, 10, 'SELL', mockTime);
            expect(sql).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ success: false, message: "Insufficient holdings to sell." });
        });

        it('should allow SELL if holding equals quantity', async () => {
            sql.mockResolvedValueOnce([{ current_holding: 10, avg_price: 100 }]);
            getPrice.mockResolvedValueOnce({ current: 150 });
            sql.transaction.mockResolvedValueOnce([{}, {}]);
            const result = await insertTransaction(mockEmail, mockSymbol, 10, 'SELL', mockTime);
            expect(result.success).toBe(true);
        });

        it('should initialize holding to 0 if no record exists', async () => {
            sql.mockResolvedValueOnce([]);
            sql.mockResolvedValueOnce([{ symbol: "AAPL" }]);
            getPrice.mockResolvedValueOnce({ current: 100 });
            sql.transaction.mockResolvedValueOnce([{}, {}]);
            await insertTransaction(mockEmail, mockSymbol, 1, 'BUY', mockTime);
            expect(sql).toHaveBeenCalledTimes(4);
        });
    });

    describe('BUY Transaction Flow', () => {
        it('should fetch YahooFinance data and insert stock if not in DB', async () => {
            sql.mockResolvedValueOnce([{ current_holding: 0, avg_price: 0 }]);
            sql.mockResolvedValueOnce([]);

            YahooFinance.mockQuoteSummary.mockResolvedValueOnce({
                price: {
                    shortName: 'Apple Inc.',
                    longName: 'Apple',
                    exchange: 'NASDAQ',
                    currency: 'USD',
                    quoteType: 'EQUITY',
                    market: 'US',
                    regularMarketPrice: 150
                },
                assetProfile: { sector: 'Technology' }
            });

            PriceStore.get.mockReturnValue(2);
            sql.mockResolvedValueOnce([{ symbol: "AAPL" }]);
            sql.transaction.mockResolvedValueOnce(['ins', 'upd']);

            const result = await insertTransaction(mockEmail, mockSymbol, 5, 'BUY', mockTime);

            expect(YahooFinance.mockQuoteSummary).toHaveBeenCalledWith(mockSymbol, { modules: ['assetProfile', 'price'] });
            expect(PriceStore.get).toHaveBeenCalledWith('USD');
            expect(sql).toHaveBeenNthCalledWith(3, expect.anything(), mockSymbol, 'Apple Inc.', 'Apple', 'Technology', 'USD', 'EQUITY', 'US', 'NASDAQ', mockTime);
            expect(result).toEqual({ success: true, insert: 'ins', update: 'upd' });
        });

        it('should handle missing assetProfile in Yahoo response', async () => {
            sql.mockResolvedValueOnce([{ current_holding: 0, avg_price: 0 }]);
            sql.mockResolvedValueOnce([]);

            YahooFinance.mockQuoteSummary.mockResolvedValueOnce({
                price: { currency: 'USD', regularMarketPrice: 100 }
            });

            PriceStore.get.mockReturnValue(1);
            sql.mockResolvedValueOnce([]);
            sql.transaction.mockResolvedValueOnce([]);

            await insertTransaction(mockEmail, mockSymbol, 1, 'BUY', mockTime);

            expect(sql).toHaveBeenNthCalledWith(3, expect.anything(), mockSymbol, undefined, undefined, "N/A", "USD", undefined, undefined, undefined, mockTime);
        });

        it('should return failure if Yahoo returns no price', async () => {
            sql.mockResolvedValueOnce([{ current_holding: 0, avg_price: 0 }]);
            sql.mockResolvedValueOnce([]);
            YahooFinance.mockQuoteSummary.mockResolvedValueOnce({});
            const result = await insertTransaction(mockEmail, mockSymbol, 1, 'BUY', mockTime);
            expect(result).toEqual({ success: false, message: "Unable to fetch stock details." });
        });

        it('should use getPrice if stock exists', async () => {
            sql.mockResolvedValueOnce([{ current_holding: 0, avg_price: 0 }]);
            sql.mockResolvedValueOnce([{ symbol: "AAPL" }]);
            getPrice.mockResolvedValueOnce({ current: 200 });
            sql.transaction.mockResolvedValueOnce([]);
            await insertTransaction(mockEmail, mockSymbol, 1, 'BUY', mockTime);
            expect(YahooFinance.mockQuoteSummary).not.toHaveBeenCalled();
            expect(getPrice).toHaveBeenCalledWith(mockSymbol);
        });

        it('should correctly convert Yahoo price (division)', async () => {
            sql.mockResolvedValueOnce([{ current_holding: 0, avg_price: 0 }]);
            sql.mockResolvedValueOnce([]);

            YahooFinance.mockQuoteSummary.mockResolvedValueOnce({
                price: { currency: 'USD', regularMarketPrice: 150 },
                assetProfile: {}
            });

            PriceStore.get.mockReturnValue(3);
            sql.mockResolvedValueOnce([]);
            sql.transaction.mockResolvedValueOnce([]);

            await insertTransaction(mockEmail, mockSymbol, 1, 'BUY', mockTime);

            const userTxCall = sql.mock.calls.find(call => call[0].join("").includes('user_transactions'));
            const params = userTxCall.slice(1);
            expect(params).toContain(50);
        });
    });

    describe('SELL Transaction Flow & Calculations', () => {
        it('should correctly compute profit, negative quantity, avg price, and SQL updates', async () => {
            sql.mockResolvedValueOnce([{ current_holding: 10, avg_price: 100 }]);
            getPrice.mockResolvedValueOnce({ current: 120 });

            sql.transaction.mockImplementation(async (queries) => ['ins', 'upd']);

            const result = await insertTransaction(mockEmail, mockSymbol, 5, 'SELL', mockTime);
            expect(result.success).toBe(true);

            const price = 120;
            const old = 100;

            const expectedProfit = (price - old) * 5;
            const expectedQuantity = -5;
            const expectedAvg = (old * (10 + expectedQuantity)) / (10 + expectedQuantity);
            const expectedSpend = price * expectedQuantity;

            const summaryCall = sql.mock.calls.find(call => call[0].join("").includes('ON CONFLICT') || call[0].join("").includes('INSERT INTO "stock_summary"'));
            const params = summaryCall.slice(1);

            expect(params).toContain(expectedQuantity);
            expect(params).toContain(expectedSpend);
            expect(params).toContain(expectedAvg);
            expect(params).toContain(expectedProfit);
        });

        it('should return null if getPrice fails', async () => {
            sql.mockResolvedValueOnce([{ current_holding: 10, avg_price: 100 }]);
            getPrice.mockRejectedValueOnce(new Error("API Error"));
            const result = await insertTransaction(mockEmail, mockSymbol, 5, 'SELL', mockTime);
            expect(result).toBeNull();
        });
    });

    describe('Mathematical Logic Mutations', () => {
        it('should compute BUY weighted avg and totalSpend correctly', async () => {
            sql.mockResolvedValueOnce([{ current_holding: 10, avg_price: 100 }]);
            sql.mockResolvedValueOnce([{ symbol: "AAPL" }]);

            getPrice.mockResolvedValueOnce({ current: 200 });
            sql.transaction.mockResolvedValueOnce([]);

            await insertTransaction(mockEmail, mockSymbol, 10, 'BUY', mockTime);

            const summaryCall = sql.mock.calls.find(call => call[0].join("").includes('ON CONFLICT') || call[0].join("").includes('INSERT INTO "stock_summary"'));
            const params = summaryCall.slice(1);

            const expectedAvg = ((100*10) + (200*10)) / (10 + 10);
            const expectedSpend = 200 * 10;

            expect(params).toContain(expectedAvg);
            expect(params).toContain(expectedSpend);
        });
    });

    describe('Error Handling', () => {
        it('should return null if DB throws before processing', async () => {
            sql.mockRejectedValueOnce(new Error("DB DEAD"));
            const result = await insertTransaction(mockEmail, mockSymbol, 10, 'BUY', mockTime);
            expect(result).toBeNull();
        });

        it('should return null if transaction fails', async () => {
            sql.mockResolvedValueOnce([{ current_holding: 0, avg_price: 0 }]);
            sql.mockResolvedValueOnce([{ symbol: "AAPL" }]);
            getPrice.mockResolvedValueOnce({ current: 100 });
            sql.transaction.mockRejectedValueOnce(new Error("TX FAIL"));
            const result = await insertTransaction(mockEmail, mockSymbol, 10, 'BUY', mockTime);
            expect(result).toBeNull();
        });
    });
});
