const request = require('supertest');
const app = require('../../../src/server/app');
const { getUser } = require('../../../src/server/db/user-repo')

let counter = 0;

test("Try call collection without authentication", async () => {
    const getCollection = await request(app)
        .post("/api/collection")
    expect(getCollection.statusCode).toBe(401)
})

test("Try mill collection without authentication", async () => {
    const millHero = await request(app)
        .delete("/api/collection")
    expect(millHero.statusCode).toBe(401)
})

test("Try purchase lootbox without authentication", async () => {
    const purchaseBox = await request(app)
        .post("/api/lootboxes")
    expect(purchaseBox.statusCode).toBe(401)
})

test("Try call open lootbox without authentication", async () => {
    const openBox = await request(app)
        .post("/api/openbox")
    expect(openBox.statusCode).toBe(401)
})

test("Try open lootbox without any boxes available", async () => {
    const agent = request.agent(app);

    const userId = 'auth_foo' + (counter++)

    const signup = await agent.post('/api/signup')
        .send({userId: userId, password: "bar"})
        .set('Content-Type','application/json')
    expect(signup.statusCode).toBe(201);

    const user = getUser(userId);
    user.lootboxes = 0; //Take away all lootboxes

    const openBox = await agent
        .post("/api/openbox")
    expect(openBox.statusCode).toBe(403)
})

test("Try delete user without authentication", async () => {
    const agent = request.agent(app)

    let delResponse = await agent
        .delete("/api/user");

    expect(delResponse.statusCode).toBe(403)
})