
import YahooFinance from "yahoo-finance2";
import { getStockSummary } from "../../../../src/db/stockSummary.js";
import { getPortfolioFundamentals } from '../../../../src/controllers/Portfolio/portfolioFundamentals.controller.js';


jest.mock("yahoo-finance2");
jest.mock("../../../../src/db/stockSummary.js");

describe('getPortfolioFundamentals() getPortfolioFundamentals method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { email: 'test@example.com' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy Paths', () => {
    it('should return portfolio fundamentals successfully', async () => {
      // Mocking getStockSummary to return a portfolio
      getStockSummary.mockResolvedValue([
        { symbol: 'AAPL', current_holding: 10 },
        { symbol: 'GOOGL', current_holding: 5 }
      ]);

      // Mocking YahooFinance to return quote summaries
      YahooFinance.prototype.quoteSummary.mockResolvedValueOnce({
        price: { symbol: 'AAPL', regularMarketPrice: 150, marketCap: 2e12 },
        summaryDetail: { averageVolume3Month: 1000000 },
        defaultKeyStatistics: { forwardEps: 5, forwardPE: 30 },
        calendarEvents: { dividendDate: '2023-12-01' }
      }).mockResolvedValueOnce({
        price: { symbol: 'GOOGL', regularMarketPrice: 2800, marketCap: 1.5e12 },
        summaryDetail: { averageVolume3Month: 1500000 },
        defaultKeyStatistics: { forwardEps: 10, forwardPE: 25 },
        calendarEvents: { dividendDate: '2023-11-01' }
      });

      await getPortfolioFundamentals(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: expect.any(Array)
      });
    });

    it('should return portfolio fundamentals successfully and empty', async () => {
      // Mocking getStockSummary to return a portfolio
      getStockSummary.mockResolvedValue([
        { symbol: 'AAPL', current_holding: 10 }
      ]);

      // Mocking YahooFinance to return quote summaries
      YahooFinance.prototype.quoteSummary.mockResolvedValueOnce({
        price: undefined,
        summaryDetail: undefined,
        defaultKeyStatistics: undefined,
        calendarEvents: undefined
      });

      await getPortfolioFundamentals(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: expect.any(Array)
      });
    });
    it('should return portfolio fundamentals successfully', async () => {
      // Mocking getStockSummary to return a portfolio
      getStockSummary.mockResolvedValue([
        { symbol: 'AAPL', current_holding: 10 },
        { symbol: 'GOOGL', current_holding: undefined }
      ]);

      // Mocking YahooFinance to return quote summaries
      YahooFinance.prototype.quoteSummary.mockResolvedValueOnce({
        price: { symbol: 'AAPL', regularMarketPrice: 0, marketCap: 2e12 },
        summaryDetail: { averageVolume3Month: 1000000 },
        defaultKeyStatistics: { forwardEps: 5, forwardPE: 30 },
        calendarEvents: { dividendDate: '2023-12-01' }
      }).mockResolvedValueOnce({
        price: { symbol: undefined, regularMarketPrice: 2800, marketCap: 1e12 },
        summaryDetail: { averageVolume3Month: 1500000,dividendYield: 0.02,trailingAnnualDividendYield: 0.03 },
        defaultKeyStatistics: { forwardEps: 10, forwardPE: 25 },
        calendarEvents: { dividendDate: '2023-11-01' }
      });

      await getPortfolioFundamentals(req, res);
      expect(YahooFinance.prototype.quoteSummary).toHaveBeenCalledWith('AAPL', {
        modules: ["price", "summaryDetail", "defaultKeyStatistics", "calendarEvents"]
      });
      expect(YahooFinance.prototype.quoteSummary).toHaveBeenCalledWith('GOOGL', {
        modules: ["price", "summaryDetail", "defaultKeyStatistics", "calendarEvents"]
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: [
            {
                symbol: "AAPL",
                lastPrice: "0.00",
                marketCap: "2.00T",
                avgVolume3M: "1.00M",
                epsEstimateNextYear: 5,
                forwardPE: 30,
                divPaymentDate: "2023-12-01",
                exDivDate: "--",
                dividendPerShare: "--",
                forwardAnnualDivRate: "--",
                forwardAnnualDivYield: "--",
                trailingAnnualDivRate: "--",
                trailingAnnualDivYield: "--",
                priceToBook: "--",
                currentHolding: 10
            },
            {
                symbol: "GOOGL",
                lastPrice: "2800.00",
                marketCap: "1.00T",
                avgVolume3M: "1.50M",
                epsEstimateNextYear: 10,
                forwardPE: 25,
                divPaymentDate: "2023-11-01",
                exDivDate: "--",
                dividendPerShare: "--",
                forwardAnnualDivRate: "--",
                forwardAnnualDivYield: "2.00%",
                trailingAnnualDivRate: "--",
                trailingAnnualDivYield: "3.00%",
                priceToBook: "--",
                currentHolding: 0
            }
        ]});
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 if email is not provided', async () => {
      req.user.email = null;

      await getPortfolioFundamentals(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email required'
      });
    });

    it('should return 404 if no holdings are found', async () => {
      getStockSummary.mockResolvedValue([]);

      await getPortfolioFundamentals(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No holdings found'
      });
    });

    it('should handle YahooFinance API failure gracefully', async () => {
      getStockSummary.mockResolvedValue([{ symbol: 'AAPL', current_holding: 10 }]);

      YahooFinance.prototype.quoteSummary.mockRejectedValueOnce(new Error('API Error'));

      await getPortfolioFundamentals(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: [
          {
            symbol: 'AAPL',
            error: 'Data not available'
          }
        ]
      });
    });

    it('should handle unexpected errors gracefully', async () => {
      getStockSummary.mockRejectedValue(new Error('Unexpected Error'));

      await getPortfolioFundamentals(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch portfolio financial details'
      });
    });
  });
    describe("Additional formatNumber branch coverage via controller", () => {
        it("should format numbers into T, B, M, --, and fixed decimals", async () => {
        getStockSummary.mockResolvedValue([
            { symbol: "AAA", current_holding: 1 },
            { symbol: "BBB", current_holding: 1 },
            { symbol: "CCC", current_holding: 1 },
            { symbol: "DDD", current_holding: 1 },
            { symbol: "EEE", current_holding: 1 },
        ]);

        YahooFinance.prototype.quoteSummary
            .mockResolvedValueOnce({
            price: { symbol: "AAA", regularMarketPrice: 2e12, marketCap: 2e12 },
            summaryDetail: { averageVolume3Month: 1000000 },
            defaultKeyStatistics: {},
            calendarEvents: {}
            })
            .mockResolvedValueOnce({
            price: { symbol: "BBB", regularMarketPrice: 1e9, marketCap: 5e9 },
            summaryDetail: { averageVolume3Month: 2000000 },
            defaultKeyStatistics: {},
            calendarEvents: {}
            })
            .mockResolvedValueOnce({
            price: { symbol: "CCC", regularMarketPrice: 3e6, marketCap: 3e6 },
            summaryDetail: { averageVolume3Month: 3000000 },
            defaultKeyStatistics: {},
            calendarEvents: {}
            })
            .mockResolvedValueOnce({
            price: { symbol: "DDD" },
            summaryDetail: {},
            defaultKeyStatistics: {},
            calendarEvents: {}
            })
            .mockResolvedValueOnce({
            price: { symbol: "EEE", regularMarketPrice: 500, marketCap: 500 },
            summaryDetail: { averageVolume3Month: 500 },
            defaultKeyStatistics: {},
            calendarEvents: {}
            });

        await getPortfolioFundamentals(req, res);

        const data = res.json.mock.calls[0][0].data;
        expect(data[0].lastPrice).toBe("2.00T");
        expect(data[0].marketCap).toBe("2.00T");
        expect(data[1].lastPrice).toBe("1.00B");
        expect(data[1].marketCap).toBe("5.00B");
        expect(data[2].lastPrice).toBe("3.00M");
        expect(data[2].marketCap).toBe("3.00M");
        expect(data[3].lastPrice).toBe("--");
        expect(data[3].marketCap).toBe("--");
        expect(data[4].lastPrice).toBe("500.00");
        expect(data[4].marketCap).toBe("500.00");
        });
    });
});

