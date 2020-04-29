const request = require('supertest');
const app = require('../../../src/server/app');

let counter = 0;

test("Do receive user collection", async () => {
    const user = request.agent(app);

    const signup = await user.post('/api/signup')
        .send({userId:'auth_foo' + (counter++), password: "bar"})
        .set('Content-Type','application/json')

    expect(signup.statusCode).toBe(201);

    const response = await user.post("/api/collection")
    expect(response.status).toBe(200);

    const payload = JSON.parse(response.body);
    expect(payload.length).toBe(0);
})

test("Do open lootboxes", async () => {
    const user = request.agent(app);

    const signup = await user.post('/api/signup')
        .send({userId:'auth_foo' + (counter++), password: "bar"})
        .set('Content-Type','application/json')

    expect(signup.statusCode).toBe(201);

    const boxOne = await user.post("/api/openbox")
    expect(boxOne.status).toBe(200);

    const payloadOne = JSON.parse(boxOne.body);
    expect(payloadOne.length).toBe(3);

    const boxTwo = await user.post("/api/openbox")
    expect(boxTwo.status).toBe(200);

    const payloadTwo = JSON.parse(boxTwo.body);
    expect(payloadTwo.length).toBe(3);

    const boxThree = await user.post("/api/openbox")
    expect(boxOne.status).toBe(200);

    const payloadThree = JSON.parse(boxThree.body);
    expect(payloadThree.length).toBe(3);

    const boxFour = await user.post("/api/openbox")
    expect(boxFour.status).toBe(403);
})

test("Do mill a hero from reward and purchase loot box", async () => {
    const user = request.agent(app);

    const signup = await user.post('/api/signup')
        .send({userId:'auth_foo' + (counter++), password: "bar"})
        .set('Content-Type','application/json')

    expect(signup.statusCode).toBe(201);

    const getLoot = await user.post("/api/openbox");
    expect(getLoot.status).toBe(200);

    const getLootPayload = JSON.parse(getLoot.body);
    expect(getLootPayload.length).toBe(3);

    const millHero = await user.delete("/api/collection")
        .send({heroIndex: 2})
        .set('Content-Type','application/json');
    expect(millHero.status).toBe(204);

    const millHeroAgain = await user.delete("/api/collection")
        .send({heroIndex: 2}) //Hero 2 should be gone as it is the last of 3 in the array
        .set('Content-Type','application/json');
    expect(millHeroAgain.status).toBe(409); //Conflict


    /*
    * NOTE: When testing for purchasing lootboxes, due to the random nature of the loot boxes and
    * variable values of certain rewards, test case MAY sell a SSR card for 300 Time fragments,
    * thus multiple boxes must be bought to test for out of TF
    * */
    const boxOne = await user.post("/api/lootboxes");
    expect(boxOne.status).toBe(204)

    const boxTwo = await user.post("/api/lootboxes");
    const validTwo = boxTwo.status === 403 || boxTwo.status === 204
    expect(validTwo).toBe(true);

    const boxThree = await user.post("/api/lootboxes");
    const validThree = boxThree.status === 403 || boxThree.status === 204
    expect(validThree).toBe(true);

    //Only the fourth purchase is guaranteed to be unavailable
    const boxFour = await user.post("/api/lootboxes");
    expect(boxFour.status).toBe(403);
})