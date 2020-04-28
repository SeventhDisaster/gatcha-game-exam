const express_ws = require('express-ws');

let ews; //Express Websocket

function init(app) {

    ews = express_ws(app);

    app.ws('/', function (socket, req) {
        console.log('Established a new WS connection');

        broadCastCount();

        //close is treated specially
        socket.on('close', () => {
            broadCastCount();
        });
    });
}

// Function broadcasts amount of connected clients.
function broadCastCount() {
    const n = ews.getWss().clients.size; //websocket clients.size = connected users

    //Iterate through all users
    ews.getWss().clients.forEach((client) => {

        //sends a data object containing the value
        const data = JSON.stringify({userCount: n});

        client.send(data);
    });
}


module.exports = {init};