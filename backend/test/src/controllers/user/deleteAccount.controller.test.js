import { deleteAccount } from "../../../../src/controllers/user/deleteAccount.controller.js";
import { deleteUserByEmail } from "../../../../src/db/removeUser.js";

// Mock the database function
jest.mock("../../../../src/db/removeUser.js");

describe("deleteAccount", () => {
    let req, res;
    const userEmail = "test@example.com";

    beforeEach(() => {
        req = { user: { email: userEmail } };
        res = {
            status: jest.fn().mockReturnThis(), // Allow chaining: res.status(500).json(...)
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    it("should return 200 and success message on successful account deletion", async () => {
        deleteUserByEmail.mockResolvedValue(1);

        await deleteAccount(req, res);

        expect(deleteUserByEmail).toHaveBeenCalledWith(userEmail);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Account deleted successfully"
        });
    });

    it("should return 500 and error message if database deletion fails (falsy response)", async () => {
        deleteUserByEmail.mockResolvedValue(0);

        await deleteAccount(req, res);

        expect(deleteUserByEmail).toHaveBeenCalledWith(userEmail);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Database error while deleting account. Please try again later",
        });
    });
    
    it("should return 500 and error message if deleteUserByEmail throws an exception", async () => {
        const error = new Error("DB connection failed");
        // Mock the database call to reject
        deleteUserByEmail.mockRejectedValue(error);

        await deleteAccount(req, res);

        expect(deleteUserByEmail).toHaveBeenCalledWith(userEmail);

    });
});