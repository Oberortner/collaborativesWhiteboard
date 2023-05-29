

/*
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:4200'
    ],
  },
});
const PORT = process.env['PORT'] || 3000;*/

import * as express from 'express';
//import * as http from 'http';
import { Server } from 'socket.io';

// express = require('express')
const app = express()

const PORT = process.env['PORT'] || 3000;
//app.use(express.static('public'))
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/',(req,res)=>res.sendFile(__dirname+'/index.html'));

http.listen(PORT,function (){
  console.log('listening on ${PORT}');
})

let users: { [key: string]: string } = {};


io.on('connection', (socket: any) => {
  console.log(`New user connected: ${socket.id}`);
  socket.emit('user-id', socket.id);

  socket.on('new-user', (userName: string) => {
    users[socket.id] = userName;
    socket.broadcast.emit('user-connected', userName);
  });

  socket.on('text', (data: any) => {
    socket.broadcast.emit('text', data);
  });

  socket.on('draw', (data: any) => {
    socket.broadcast.emit('draw', data);
  });

  socket.on('chat-message', (data: any) => {
    const message = {
      user: users[socket.id],
      text: data,
    };
    io.emit('chat-message', message);
  });

  socket.on('clear', () => {
    socket.broadcast.emit('clear');
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});

/*
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

 */
