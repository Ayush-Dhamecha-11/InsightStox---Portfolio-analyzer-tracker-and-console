jest.mock("../../../../src/db/stockSummary.js");
jest.mock("../../../../src/utils/getQuotes.js");
jest.mock("../../../../src/utils/stores/priceRates.js", () => ({}));
jest.mock("../../../../src/db/dbConnection.js", () => ({
  sql: jest.fn()
}));
jest.mock("../../../../src/utils/stockPriceStore.js", () => ({
  stockPriceStore: {
    get: jest.fn(),
    add: jest.fn()
  }
}));
import { userStockSummary } from "../../../../src/controllers/dashBoard/userStockSummary.controller.js";
import { getStockSummary } from "../../../../src/db/stockSummary.js";
import { getPrice } from "../../../../src/utils/getQuotes.js";

const mockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("userStockSummary() controller", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { email: "test@example.com" } };
    res = mockRes();
    jest.clearAllMocks();
  });

  describe("Happy paths", () => {
    it("200 → returns formatted summary for single stock with numbers toFixed", async () => {
      getStockSummary.mockResolvedValue([
        { symbol: "AAPL", current_holding: 2, avg_price: 40 },
      ]);
      getPrice.mockResolvedValue({ current: 60, shortname: "Apple Inc" });

      await userStockSummary(req, res);

      expect(getStockSummary).toHaveBeenCalledWith("test@example.com");
      expect(getPrice).toHaveBeenCalledWith("AAPL");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [
          {
            symbol: "AAPL",
            shortName: "Apple Inc",
            quantity: 2,
            avg_price: "40.00",
            current_price: "60.00",
            value: "120.00",
          },
        ],
      });
    });

    it("200 → handles multiple stocks and aggregates value per item", async () => {
      getStockSummary.mockResolvedValue([
        { symbol: "AAPL", current_holding: 1, avg_price: 100 },
        { symbol: "GOOG", current_holding: 3, avg_price: 50 },
      ]);
      getPrice.mockImplementation((sym) => {
        if (sym === "AAPL") return { current: 10, shortname: "Apple" };
        if (sym === "GOOG") return { current: 20, shortname: "Google" };
        return null;
      });

      await userStockSummary(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [
          {
            symbol: "AAPL",
            shortName: "Apple",
            quantity: 1,
            avg_price: "100.00",
            current_price: "10.00",
            value: "10.00",
          },
          {
            symbol: "GOOG",
            shortName: "Google",
            quantity: 3,
            avg_price: "50.00",
            current_price: "20.00",
            value: "60.00",
          },
        ],
      });
    });
  });

  describe("Edge cases", () => {
    it("503 → when stockSummary is null", async () => {
      getStockSummary.mockResolvedValue(null);

      await userStockSummary(req, res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to retrieve stock summary",
      });
    });

    it("200 → defaults currentPrice to 0 and shortname undefined when price missing", async () => {
      getStockSummary.mockResolvedValue([
        { symbol: "TCS.NS", current_holding: 5, avg_price: 12.345 },
      ]);
      getPrice.mockResolvedValue(null);

      await userStockSummary(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [
          {
            symbol: "TCS.NS",
            shortName: "--",
            quantity: 5,
            avg_price: "12.35",
            current_price: "0.00",
            value: "0.00",
          },
        ],
      });
    });

    it("500 → on unexpected error in controller", async () => {
      getStockSummary.mockRejectedValue(new Error("DB down"));

      await userStockSummary(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });
    });

    it("200 → coerces string numbers and computes correctly", async () => {
      getStockSummary.mockResolvedValue([
        { symbol: "INFY.NS", current_holding: "4", avg_price: "7.1" },
      ]);
      getPrice.mockResolvedValue({ current: 2.5, shortname: "Infosys" });

      await userStockSummary(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [
          {
            symbol: "INFY.NS",
            shortName: "Infosys",
            quantity: 4,
            avg_price: "7.10",
            current_price: "2.50",
            value: "10.00",
          },
        ],
      });
    });
  });
});
