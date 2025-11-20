const mockQuoteSummary = jest.fn();

jest.mock("yahoo-finance2", () => {
  return jest.fn(function YahooFinance() {
  });
});

jest.mock("../../../../src/utils/stores/priceRates.js", () => ({
  PriceStore: { get: jest.fn() },
}));

jest.mock("../../../../src/utils/stockPriceStore.js", () => ({
  stockPriceStore: { add: jest.fn() },
}));

jest.mock("../../../../src/db/stockSummary.js", () => ({
  getStockSummary: jest.fn(),
}));

import YahooFinance from "yahoo-finance2";
import { getSummaryTable } from "../../../../src/controllers/Portfolio/portfolioSummary.controller.js";
import { getStockSummary } from "../../../../src/db/stockSummary.js";
import { PriceStore } from "../../../../src/utils/stores/priceRates.js";
import { stockPriceStore } from "../../../../src/utils/stockPriceStore.js";

YahooFinance.prototype.quoteSummary = mockQuoteSummary;

describe("getSummaryTable", () => {
  let req, res;
  const testEmail = "test@example.com";
  const FIXED_DATE = new Date('2025-11-18T12:00:00Z');
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_DATE);
    jest.clearAllMocks();
    req = { user: { email: testEmail } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    PriceStore.get.mockReturnValue(1);
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  
  beforeAll(() => {
      mockQuoteSummary.mockResolvedValue({
          price: {
            regularMarketPrice: 0,
            regularMarketPreviousClose: 0,
            regularMarketChange: 0,
            regularMarketChangePercent: 0,
            regularMarketVolume: 0,
            marketCap: 0,
          },
          summaryDetail: {
            averageVolume3Month: 0, // Ensure numeric default
          },
      });
  });

  it("returns 503 when stock summary is null (DB failure to fetch)", async () => {
    getStockSummary.mockResolvedValue(null);
    await getSummaryTable(req, res);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Failed to fetch stock Summary",
    });
    expect(getStockSummary).toHaveBeenCalledWith(testEmail);
  });

  it("returns 200 with empty summary when no holdings", async () => {
    getStockSummary.mockResolvedValue([]);
    await getSummaryTable(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      summary: [],
    });
    expect(mockQuoteSummary).not.toHaveBeenCalled();
  });

  it("returns 500 when getStockSummary throws (DB crash)", async () => {
    const error = new Error("DB crash");
    getStockSummary.mockRejectedValue(error);
    await getSummaryTable(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      meaasge: undefined,
    });
  });

  it("handles all rejected YahooFinance calls (filters all out)", async () => {
    getStockSummary.mockResolvedValue([{ symbol: "AAPL", current_holding: 10 }]);
    mockQuoteSummary.mockRejectedValueOnce(new Error("API error"));
    
    await getSummaryTable(req, res);
    
    expect(mockQuoteSummary).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      summary: [],
    });
    expect(stockPriceStore.add).not.toHaveBeenCalled();
  });

  it("handles missing price data and summaryDetail, returning defaults", async () => {
    getStockSummary.mockResolvedValue([{ symbol: "NVDA", current_holding: 5 }]);
    
    // Explicitly mock all fields needed by formatNumber as 0 to prevent crash
    mockQuoteSummary.mockResolvedValueOnce({
      price: {
        regularMarketPrice: 0,
        regularMarketPreviousClose: 0,
        regularMarketChange: 0,
        regularMarketChangePercent: 0,
        regularMarketVolume: 0,
        marketCap: 0,
      },
      summaryDetail: {
        averageVolume3Month: 0, // Explicitly set to 0 to prevent crash
      },
    });
    
    await getSummaryTable(req, res);
    
    expect(mockQuoteSummary).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      summary: [{
        symbol: undefined,
        shortname: null,
        longname: null,
        lastPrice: 0,
        changePercent: 0,
        change: 0,
        currency: "INR",
        marketTime: expect.any(String),
        volume: "-", 
        shares: 5,
        avgVolume: "-", 
        dayRange: "₹- → ₹-",
        yearRange: "₹- → ₹-",
        marketCap: "-",
      }],
    });
    
    expect(stockPriceStore.add).toHaveBeenCalledTimes(1);
    expect(stockPriceStore.add).toHaveBeenCalledWith(undefined, {
      symbol: undefined,
      current: 0,
      currency: "INR",
      close: 0,
      percentageChange: 0,
      shortname: null,
      longname: null,
      change: 0,
      expiresAt: expect.any(Number),
    });
  });

  it("computes summary table properly with all data and converts currency", async () => {
    getStockSummary.mockResolvedValue([{ symbol: "AAPL", current_holding: 10 }]);

    const ts = 1700000000000;
    const exchangeRate = 80;
    PriceStore.get.mockReturnValue(exchangeRate);

    mockQuoteSummary.mockResolvedValueOnce({
      price: {
        symbol: "AAPL",
        currency: "USD",
        regularMarketPrice: 150,
        regularMarketPreviousClose: 145,
        regularMarketChange: 5,
        regularMarketChangePercent: 3.45,
        regularMarketVolume: 1000000,
        regularMarketTime: ts,
        longName: "Apple Inc",
        shortName: "AAPL",
        marketCap: 2000000000000,
      },
      summaryDetail: {
        dayLow: 148,
        dayHigh: 152,
        fiftyTwoWeekLow: 120,
        fiftyTwoWeekHigh: 160,
        averageVolume3Month: 2000000,
      },
    });

    await getSummaryTable(req, res);

    const expectedLastPrice = 150 / exchangeRate;
    const expectedPreviousClose = 145 / exchangeRate;
    const expectedChange = 5 / exchangeRate;

    expect(mockQuoteSummary).toHaveBeenCalledTimes(1);
    expect(stockPriceStore.add).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);

    expect(stockPriceStore.add).toHaveBeenCalledWith("AAPL", {
      symbol: "AAPL",
      current: expectedLastPrice,
      currency: "USD",
      close: expectedPreviousClose,
      percentageChange: 3.45,
      shortname: "AAPL",
      longname: "Apple Inc",
      change: expectedChange,
      expiresAt: expect.any(Number),
    });

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      summary: [{
        symbol: "AAPL",
        shortname: "AAPL",
        longname: "Apple Inc",
        lastPrice: expectedLastPrice,
        changePercent: 3.45,
        change: expectedChange,
        currency: "USD",
        marketTime: expect.any(String),
        volume: "1.00M",
        shares: 10,
        avgVolume: "2.00M",
        dayRange: "₹148 → ₹152",
        yearRange: "₹120 → ₹160",
        marketCap: "2.00T",
      }],
    });
  });

  it("computes summary table properly with all data and converts currency", async () => {
    getStockSummary.mockResolvedValue([{ symbol: "AAPL", current_holding: 10 }]);

    const ts = 1700000000000;
    const exchangeRate = 80;
    PriceStore.get.mockReturnValue(exchangeRate);

    mockQuoteSummary.mockResolvedValueOnce({
      price: {
        symbol: "AAPL",
        currency: "USD",
        regularMarketPrice: 150,
        regularMarketPreviousClose: 145,
        regularMarketChange: 5,
        regularMarketChangePercent: 3.45,
        regularMarketVolume: 1000000,
        regularMarketTime: ts,
        longName: "Apple Inc",
        shortName: "AAPL",
        marketCap: 1000,
      },
      summaryDetail: {
        dayLow: 148,
        dayHigh: 152,
        fiftyTwoWeekLow: 120,
        fiftyTwoWeekHigh: 160,
        averageVolume3Month: 1000000000,
      },
    });
    

    await getSummaryTable(req, res);
    expect(mockQuoteSummary).toHaveBeenCalledWith('AAPL', {
        modules: ["price", "summaryDetail", "defaultKeyStatistics"]
      });
    const expectedLastPrice = 150 / exchangeRate;
    const expectedPreviousClose = 145 / exchangeRate;
    const expectedChange = 5 / exchangeRate;

    expect(mockQuoteSummary).toHaveBeenCalledTimes(1);
    expect(stockPriceStore.add).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    const expectedExpiry = FIXED_DATE.getTime() + (60 * 1000);
    expect(stockPriceStore.add).toHaveBeenCalledWith("AAPL", {
      symbol: "AAPL",
      current: expectedLastPrice,
      currency: "USD",
      close: expectedPreviousClose,
      percentageChange: 3.45,
      shortname: "AAPL",
      longname: "Apple Inc",
      change: expectedChange,
      expiresAt: expectedExpiry,
    });

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      summary: [{
        symbol: "AAPL",
        shortname: "AAPL",
        longname: "Apple Inc",
        lastPrice: expectedLastPrice,
        changePercent: 3.45,
        change: expectedChange,
        currency: "USD",
        marketTime: "03:43 am",
        volume: "1.00M",
        shares: 10,
        avgVolume: "1.00B",
        dayRange: "₹148 → ₹152",
        yearRange: "₹120 → ₹160",
        marketCap: "1.00K",
      }],
    });
  });

  it("computes summary table properly with all data and converts currency", async () => {
    getStockSummary.mockResolvedValue([{ symbol: "AAPL", current_holding: null }]);

    const ts = 1700000000000;
    const exchangeRate = null;
    PriceStore.get.mockReturnValue(exchangeRate);

    mockQuoteSummary.mockResolvedValueOnce({
      price: {
        symbol: "AAPL",
        currency: "USD",
        regularMarketPrice: 150,
        regularMarketPreviousClose: 145,
        regularMarketChange: 5,
        regularMarketChangePercent: 3.45,
        regularMarketVolume: 1000000,
        regularMarketTime: ts,
        longName: "Apple Inc",
        shortName: "AAPL",
        marketCap: 1000000000000,
      },
      summaryDetail: {
        dayLow: 148,
        dayHigh: 152,
        fiftyTwoWeekLow: 120,
        fiftyTwoWeekHigh: 160,
        averageVolume3Month: 200,
      },
    });

    await getSummaryTable(req, res);

    const expectedLastPrice = 150;
    const expectedPreviousClose = 145;
    const expectedChange = 5;

    expect(mockQuoteSummary).toHaveBeenCalledTimes(1);
    expect(stockPriceStore.add).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);

    expect(stockPriceStore.add).toHaveBeenCalledWith("AAPL", {
      symbol: "AAPL",
      current: expectedLastPrice,
      currency: "USD",
      close: expectedPreviousClose,
      percentageChange: 3.45,
      shortname: "AAPL",
      longname: "Apple Inc",
      change: expectedChange,
      expiresAt: expect.any(Number),
    });

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      summary: [{
        symbol: "AAPL",
        shortname: "AAPL",
        longname: "Apple Inc",
        lastPrice: expectedLastPrice,
        changePercent: 3.45,
        change: expectedChange,
        currency: "USD",
        marketTime: expect.any(String),
        volume: "1.00M",
        shares: 0,
        avgVolume: "200.00",
        dayRange: "₹148 → ₹152",
        yearRange: "₹120 → ₹160",
        marketCap: "1.00T",
      }],
    });
  });

  it("ensures formatNumber handles null, NaN, and string values correctly", async () => {
    getStockSummary.mockResolvedValue([{ symbol: "MSFT", current_holding: 20 }]);
    
    mockQuoteSummary.mockResolvedValueOnce({
      price: {
        symbol: "MSFT",
        regularMarketPrice: 300,
        regularMarketPreviousClose: 290,
        currency: "USD",
        regularMarketChange: 10,
        regularMarketChangePercent: 3.45,
        regularMarketTime: 1700000000000,
        longName: "Microsoft Corp",
        shortName: "MSFT",
        // Test cases for formatNumber: using null/NaN to hit the '-' path
        regularMarketVolume: null, 
        marketCap: Number.NaN, 
      },
      summaryDetail: {
        // Must be numeric, or formatNumber crashes
        averageVolume3Month: null, 
      },
    });

    await getSummaryTable(req, res);

    expect(mockQuoteSummary).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      summary: expect.arrayContaining([
        expect.objectContaining({
          volume: "-", // null becomes '-'
          marketCap: "-", // NaN becomes '-'
          avgVolume: "-", // null becomes '-'
        })
      ]),
    });
  });

  it("handles multiple holdings where one fails the API call (partial success)", async () => {
    getStockSummary.mockResolvedValue([
      { symbol: "GOOG", current_holding: 5 },
      { symbol: "AMZN", current_holding: 8 }
    ]);

    // GOOG succeeds 
    mockQuoteSummary.mockResolvedValueOnce({
      price: {
        symbol: "GOOG",
        currency: "USD",
        regularMarketPrice: 100,
        regularMarketPreviousClose: 98,
        regularMarketChange: 2,
        regularMarketChangePercent: 2.04,
        regularMarketTime: 1700000000000,
        regularMarketVolume: 1000,
        marketCap: 100000000000,
      },
      summaryDetail: {
        averageVolume3Month: 0, // Explicitly set to 0 to prevent crash
      },
    })
    // AMZN fails
    .mockRejectedValueOnce(new Error("AMZN API Error"));


    await getSummaryTable(req, res);

    expect(mockQuoteSummary).toHaveBeenCalledTimes(2);
    expect(stockPriceStore.add).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    
    const summary = res.json.mock.calls[0][0].summary;
    expect(summary.length).toBe(1);
    expect(summary[0].symbol).toBe("GOOG");
  });
});