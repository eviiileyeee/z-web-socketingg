const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
const users = {};


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'));
});

io.on('connection', (socket) => {

    socket.on('new-user-joined',(name)=>{
        console.log(name,"joined the chat");
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected',users[socket.id]);
        socket.broadcast.emit('user-disconnected',users[socket.id])
      });

      socket.on('chat message', (name,msg) => {
        io.emit('chat message', msg,name);
        console.log(`${name}: ${msg}`);
      }); 
  });


server.listen(5000, () => {
  console.log('server running at http://localhost:5000');
});