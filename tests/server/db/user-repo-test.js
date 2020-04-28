const {getUser, verifyUser, createUser, resetAllUsers} = require("../../../src/server/db/user-repo");

test("Test create and get users", () => {
    const userId = "test_user_id"

    createUser(userId,"test_user_nickname", "123456");
    expect(getUser(userId)).toBeDefined();
})

test("Test verify user", () => {
    const userId = "test_user_id"
    const pass = "123456"

    createUser(userId,"test_user_nickname", pass);
    expect(getUser(userId)).toBeDefined();

    expect(verifyUser(userId, pass)).toBe(true);
})