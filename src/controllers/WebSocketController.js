const WebSocket = require('ws');
const wsData = require('../models/wsModel');

const wss = new WebSocket.Server({ port: 8000 });

exports.wss = wss;

wss.on('connection', ws => {
    console.log('Client Connected');
    ws.send(JSON.stringify({ msg: 'Welcome to web socket' }));

    ws.on('message', async message => {
        console.log(`Received: ${message}`);
        try {
            const parsedMessage = JSON.parse(message);
            const { user, message: userMessage } = parsedMessage;

            if (user && userMessage) {
                await wsData.create({
                    user,
                    message: userMessage
                });

                ws.send(JSON.stringify({ msg: `Data saved for message: ${userMessage}` }));
            } else {
                ws.send(JSON.stringify({ msg: 'Invalid message format' }));
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ msg: 'Error processing message' }));
        }
    });

    ws.on('close', close => {
        console.log(`Client Disconnect ${close}`);
    });

    ws.on('error', error => {
        console.error(`WebSocket error: ${error}`);
    });
});

console.log('WebSocket server is running on ws://localhost:8000');

// module.exports = wss;
