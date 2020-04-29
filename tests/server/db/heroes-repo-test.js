const {heroes, generateRewards, addHero} = require("../../../src/server/db/heroes-repo")

test("Hero database exists", () => {
    expect(heroes).toBeDefined();
})

test("Can add heroes", () => {
    expect(addHero()).toBe(false);

    const currentLength = heroes.length;

    expect(addHero("Sample", "Sample", "Sample", 3)).toBe(true);
    expect(heroes.length).toBeGreaterThan(currentLength);
})

test("Can get rewards", () => {
    const reward = generateRewards(3);
    expect(reward.length).toBe(3);
})

