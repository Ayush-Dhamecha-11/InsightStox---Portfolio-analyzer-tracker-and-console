jest.mock("../../../src/db/dbConnection.js", () => ({
  sql: jest.fn(),
}));

import { sql } from "../../../src/db/dbConnection.js";
import { searchUserByEmail } from "../../../src/db/findUser.js";

describe("searchUserByEmail", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it("should return user data when email exists", async () => {
  
     const responce = [{
            id: 1,
            name: "test",
            email: "test@example.com",
            password: "test123",
            registrationmethod: "normal",
            profileimage: "profileimage",
            investmentExperience: "beginner",
            riskProfile: "conservative",
            theme: "dark",
            aisuggestion: "false",
        }];
    sql.mockResolvedValue(responce);
    const result = await searchUserByEmail("test@example.com");
    
    expect(sql).toHaveBeenCalled();
    expect(result).toEqual(responce);
  });

  it("should return null array when email does not exist", async () => {
    
    sql.mockResolvedValue([]);
    const result = await searchUserByEmail("fail@example.com");
    
    expect(sql).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should return null when query fails", async () => {

    sql.mockRejectedValue();
    
    const result = await searchUserByEmail("fail@example.com");

    expect(sql).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
