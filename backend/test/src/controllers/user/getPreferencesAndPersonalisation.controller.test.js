import { getPreferencesAndPersonalisation } from "../../../../src/controllers/user/preferences.controller.js";

describe("getPreferencesAndPersonalisation", () => {
    let req, res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        // Restore console.log implementation
        jest.restoreAllMocks();
    });

    it("should return 200 and user preferences when req.user is available", async () => {
        req = { 
            user: { 
                theme: "dark", 
                dashboardlayout: "compact" 
            } 
        };

        await getPreferencesAndPersonalisation(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                theme: "dark",
                dashboardlayout: "compact",
            },
        });
    });

    it("should return 500 and an error message if req.user is missing or null", async () => {
        req = {};

        await getPreferencesAndPersonalisation(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: expect.any(String),
            })
        );
    });
});