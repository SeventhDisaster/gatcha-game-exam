/*
* I DID NOT WRITE MOST OF THIS FILE
* The contents of this test file was copied from a class repository, and adjusted to fit
* the application's needs.
*
* Note, I do not test for random loot drops, as I don't want tests to run for a full minute every time
*
* https://github.com/arcuri82/web_development_and_api_design/blob/master/les10/connect4-v2/tests/server/match-test.js
*/

const app  = require('../../src/server/app');
const WS = require("ws");

const {checkConnectedWS} = require('../shared/test-utils-ws');

let server;
let port;

beforeAll(done => {

    server = app.listen(0, ()=> {
        port = server.address().port;
        done();
    });
});

afterAll(done => {
    server && server.close(done);
});



test("Can open web socket", async () => {

    const socket = new WS('ws://localhost:' + port);
    const connected = await checkConnectedWS(socket, 2000);
    expect(connected).toBe(true);
    socket.close();
});