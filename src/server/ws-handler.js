const express_ws = require('express-ws');

let ews; //Express Websocket

function init(app) {

    ews = express_ws(app);

    //Only allow 1 instance of the distribution to be active
    let isActive = false;

    app.ws('/', function (socket, req) {
        if(req.headers.cookie){
            console.log('Established a new WS connection');
            console.log("Current: " + ews.getWss().clients.size)
/*
            const lootBoxTimer = () => {
                ews.getWss().clients.forEach((client) => {
                    const data = JSON.stringify({freeBox: true});
                    console.log(data);
                    client.send(data);
                })
            }

            let distribute;
            if(!isActive){
                console.log("Started distribution")
                distribute = setInterval(lootBoxTimer, 10000)
                isActive = true;
            }

            socket.on('close', () => {
                console.log("Closed WS connection")
                console.log("Current: " + ews.getWss().clients.size)
                if(ews.getWss().clients.size > 1){
                    //Just close connection
                } else {
                    clearInterval(distribute)
                    console.log("Stopped distribution")
                    isActive = false;
                }
            })                                                      */
        }
    });
}


module.exports = {init};