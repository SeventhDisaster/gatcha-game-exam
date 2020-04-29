const { boughtLootBox } = require('./db/user-repo');

const express_ws = require('express-ws');

let ews; //Express Websocket

//Websocket for distributing free packages runs on a global 60 second timer
//note: Slight issue is that consecutive logged in users might receive their first box before 60
//seconds have passed since login

//When a user is logged in, they let the websocket know they are so through a message, and
//are recorded in the clients array.
//Lootbox distribution is handled on the server side, and state is re-fetched on client

function init(app) {

    ews = express_ws(app);

    const clients = []; // To prevent abusing the system by opening more tabs
    let distributing = false;

    app.ws('/', function (socket, req) {
        console.log('Established a new WS connection');

        //I was uncertain of how to send only to specific logged in clients, but implemnted
        //this workaround for that issue.
        function lootBoxTimer() {
            ews.getWss().clients.forEach((client) => {
                client.send(JSON.stringify(clients));
            })
            for(let userId of clients){
                console.log("Giving lootbox to: " + userId)
                boughtLootBox(userId, true);
            }
        }

        const distribute = () => {
            setInterval(lootBoxTimer, 60000)
        }

        socket.on('message', fromClient => {
            const dto = JSON.parse(fromClient)
            if(dto.userId){
                if(!clients.includes(dto.userId)){
                    clients.push(dto.userId)
                }
                if(!distributing){
                    distribute()
                    distributing = true;
                }
            }
            if(dto.clearUserId){
                clients.splice(clients.indexOf(dto.clearUserId), 1);
            }
        })

        socket.on('close', () => {
            if(ews.getWss().clients.size < 1){
                clearInterval(distribute)
                distributing = false;
            }
        })
    })
}


module.exports = {init};