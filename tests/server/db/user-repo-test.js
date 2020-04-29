const {getUser, verifyUser, createUser, resetAllUsers, consumeLootBox, boughtLootBox, rewardHeroes, didMillHero} = require("../../../src/server/db/user-repo");

beforeEach(() => {
    resetAllUsers();
})

test("Can create and get users", () => {
    const userId = "test_user_id"

    createUser(userId, "123456");
    expect(getUser(userId)).toBeDefined();
})

test("Can verify user", () => {
    const userId = "test_user_id"
    const pass = "123456"

    expect(verifyUser(userId, pass)).toBe(false);

    createUser(userId, pass);
    expect(getUser(userId)).toBeDefined();

    expect(verifyUser(userId, pass)).toBe(true);
})

test("Can create and remove users", () => {
    const userId = "test_user_id"
    createUser(userId, "123456");
    expect(getUser(userId)).toBeDefined();

    expect(createUser(userId, "123456")).toBe(false); //User already exists

    resetAllUsers();
    expect(getUser(userId)).toBeUndefined();
})

test("Can use lootbox", () => {
    const userId = "test_user_id"

    expect(consumeLootBox(userId, false)).toBe(false); //No user

    createUser(userId, "123456");
    expect(getUser(userId)).toBeDefined();

    expect(consumeLootBox(userId, false)).toBe(true);
    expect(consumeLootBox(userId, false)).toBe(true);
    expect(consumeLootBox(userId, false)).toBe(true);
    expect(consumeLootBox(userId, false)).toBe(false); //Out of boxes

})

test("Can buy and receive lootbox", () => {
    const userId = "test_user_id"

    expect(boughtLootBox(userId, true)).toBe(false) //No user

    createUser(userId, "123456");

    expect(boughtLootBox(userId, false)).toBe(false) // Attempt purchase without TF

    expect(getUser(userId).timeFragments = 100).toBeDefined();

    boughtLootBox(userId, false); //Purchase
    expect(getUser(userId).timeFragments).toBe(0);
    expect(getUser(userId).lootboxes).toBe(4);

    boughtLootBox(userId, true); //Free

    expect(getUser(userId).lootboxes).toBe(5);
})

test("Can recieve heroes", () => {
    const userId = "test_user_id"

    const sampleHero = [{
        name: "Sample Hero",
        series: "Sample Series",
        description: "Sample Description",
        rarity: 1
    }];

    expect(rewardHeroes(userId, sampleHero)).toBe(false); //No user

    createUser(userId, "123456");

    expect(getUser(userId)).toBeDefined();

    rewardHeroes(userId, sampleHero);

    expect(getUser(userId).collection[0]).toEqual(sampleHero[0])
})

test("Can mill heroes", () => {
    const userId = "test_user_id"

    expect(didMillHero(userId, 0)).toBe(false);

    createUser(userId, "123456");
    expect(getUser(userId)).toBeDefined();

    const sampleHeroes = [{
            name: "Sample R Hero",
            series: "Sample Series",
            description: "Sample Description",
            rarity: 1
        },
        {
            name: "Sample SR Hero",
            series: "Sample Series",
            description: "Sample Description",
            rarity: 2
        },
        {
            name: "Sample SSR Hero",
            series: "Sample Series",
            description: "Sample Description",
            rarity: 3
        },
        {
            name: "Sample Wrong Rarity",
            series: "Sample Series",
            description: "Sample Description",
            rarity: 0
        }];

    rewardHeroes(userId, sampleHeroes);

    expect(getUser(userId).collection[0]).toEqual(sampleHeroes[0])

    expect(didMillHero(userId, 0)).toBe(true); // R = 100
    expect(didMillHero(userId, 0)).toBe(true); // SR = 200
    expect(didMillHero(userId, 0)).toBe(true); // SSR = 300
    expect(didMillHero(userId, 0)).toBe(false); // Wrong

    expect(didMillHero(userId, 5)).toBe(false);

    expect(getUser(userId).timeFragments).toBe(600);
});