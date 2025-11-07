import { ResetPassword } from "../../../../src/controllers/user/resetPassword.controller.js";
import { searchUserByEmail } from "../../../../src/db/findUser.js";
import { updatePassword } from "../../../../src/db/updatePassword.js";
import bcrypt from "bcrypt";

jest.mock("../../../../src/db/findUser.js");
jest.mock("../../../../src/db/updatePassword.js");
jest.mock("bcrypt");

describe("ResetPassword", () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it("should return 401 if email, password, or newPassword is missing", async () => {
        req.body = { email: "", password: "", newPassword: "" };
        await ResetPassword(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Email, old password, and new password are required.",
        });
    });

    it("should return 500 if database error while searching user", async () => {
        req.body = { email: "test@example.com", password: "123", newPassword: "456" };
        searchUserByEmail.mockResolvedValue();
        await ResetPassword(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Database error. Please try again later.",
        });
    });

    it("should return 401 if user is not found", async () => {
        req.body = { email: "test@example.com", password: "123", newPassword: "456" };
        searchUserByEmail.mockResolvedValue([]);
        await ResetPassword(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Unauthorized user",
        });
    });

    it("should return 401 if current password is incorrect", async () => {
        req.body = { email: "test@example.com", password: "wrongpass", newPassword: "newpass" };
        searchUserByEmail.mockResolvedValue([{ email: "test@example.com", password: "hashedpass" }]);
        bcrypt.compare.mockResolvedValue(false);
        await ResetPassword(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Current password is incorrect.",
        });
    });

    it("should return 500 it database error while updating password", async () => {
        req.body = { email: "test@example.com", password: "oldpass", newPassword: "newpass" };
        const user = [{ email: "test@example.com", password: "hashedpass" }];
        searchUserByEmail.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);
        updatePassword.mockResolvedValue();
        await ResetPassword(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Database error. Please try again later.",
        });
    });

    it("should reset password successfully", async () => {
        req.body = { email: "test@example.com", password: "oldpass", newPassword: "newpass" };
        const user = [{ email: "test@example.com", password: "hashedpass" }];
        searchUserByEmail.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);
        bcrypt.hash.mockResolvedValue("hashednewpass");
        const updatePassQueryRes = [{ id: 1, email: "test@example.com" }]
        updatePassword.mockResolvedValue(updatePassQueryRes);

        await ResetPassword(req, res);
        expect(bcrypt.hash).toHaveBeenCalledWith("newpass", 10);
        expect(updatePassword).toHaveBeenCalledWith("test@example.com", "hashednewpass");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Password reset successfully.",
        });
    });

});
