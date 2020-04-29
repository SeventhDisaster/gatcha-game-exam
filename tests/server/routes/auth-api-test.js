const request = require('supertest');
const app = require('../../../src/server/app');

let counter = 0; // Used in userId's

test("Do Fail login", async () => {
    const userId = "Foo-" + (counter++);
    const response = await request(app)
        .post("/api/login")
        .send({userId: userId, password: "Bar"})
        .set("Content-Type", "application/json");

    expect(response.statusCode).toBe(401)
})

test("Do fail to get data of no user", async () => {
    const response = await request(app).get('/api/user');

    expect(response.statusCode).toBe(401);
})

test("Do create user, but fail to get data", async () => {
    const userId = "Foo-" + (counter++);

    let response = await request(app)
        .post('/api/signup')
        .send({userId, password: "bar"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);

    //No cookies, auth fail
    response = await request(app)
        .get('/api/user');

    expect(response.statusCode).toBe(401);
});

test("Do create a user with same ID as another", async () => {
    const userId = "Foo-" + (counter++);

    let response = await request(app)
        .post('/api/signup')
        .send({userId, password: "bar"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);

    response = await request(app)
        .post('/api/signup')
        .send({userId, password: "bar"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(400);
});

test("Do create user and get data", async () => {
    const userId = "Foo-" + (counter++);

    //Uses same cookie jar for the HTTP request
    const agent = request.agent(app)

    let response = await agent
        .post('/api/signup')
        .send({userId, password: "bar"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);

    response = await agent.get('/api/user');

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.password).toBeUndefined(); //Make sure the password is not sent back
})

test("Do create user and delete user", async () => {
    const userId = "Foo-" + (counter++);

    //Uses same cookie jar for the HTTP request
    const agent = request.agent(app)

    let response = await agent
        .post('/api/signup')
        .send({userId, password: "bar"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);

    let delResponse = await agent
        .delete("/api/user");

    expect(delResponse.statusCode).toBe(204)
})

test("Test create user, login in a different session to get data", async () => {
    const userId = "Foo-" + (counter++);

    let response = await request(app)
        .post('/api/signup')
        .send({userId, password: "bar"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);

    //Use a new cookie jar for HTTP requests
    const agent = request.agent(app)

    //Do login to get new cookie
    response = await agent
        .post('/api/login')
        .send({userId, password: "bar"})
        .set('Content-Type', 'application/json');


    expect(response.statusCode).toBe(204);

    response = await agent.get('/api/user');

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.password).toBeUndefined(); //Make sure the password is not sent back
})

test("Test login after logout", async () => {
    const userId = "Foo-" + (counter++);

    //Uses same cookie jar for the HTTP request
    const agent = request.agent(app)

    //Create user
    let response = await agent
        .post('/api/signup')
        .send({userId, password: "bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    //Can get info
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(200);

    //Logout
    response = await agent.post('/api/logout');
    expect(response.statusCode).toBe(204);

    //After logout should fail to get data
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(401);

    //do login
    response = await agent
        .post('/api/login')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    //after logging in again, can get info
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(200);
})