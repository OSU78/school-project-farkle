const express = require('express');
const http = require('http');
const app = express();
const {Server} = require('socket.io');
const Farkel = require('./sessionAndGameManagement/sessionManagement')
const port = process.env.PORT || 8000
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET","POST"],
    },
});

io.on('connect',(socket)=>{
    Farkel(socket)
})

server.listen(port,()=>{
    console.log(`listening on ${port}`);
});
