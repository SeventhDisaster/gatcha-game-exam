const request = require('supertest');
const app = require('../../../src/server/app');

let counter = 0;

test("Do fetch complete hero list", async () => {
    const response = await request(app)
        .get("/api/heroes")
        .send()
    expect(response.statusCode).toBe(200)
})

test("Do add new hero to the list", async () => {
    const response = await request(app)
        .put("/api/heroes")
        .send({ hero: {
                name: "Sample Hero",
                series: "Sample Series",
                description: "Sample Description",
                rarity: 1,
            }
        })
        .set("Content-Type", "application/json");

    expect(response.statusCode).toBe(201)
})