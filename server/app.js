const express = require('express');
const http = require('http');
const app = express();
const {Server} = require('socket.io');
const port = process.env.PORT || 8000
const server = http.createServer(app);
 
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET","POST"],
    },
});

Farkel(io)

server.listen(port,()=>{
    console.log(`listening on ${port}`);
});
