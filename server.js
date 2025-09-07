const express = require('express');
const path = require('path');
const { v4 } = require('node-uuid');
const socket = require('socket.io');

const app = express();

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, 'client')));

let tasks = [{ id: v4(), name: 'Shopping' }];

const PORT = process.env.PORT || 8000;

const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running at port ${PORT}...`);
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('Server socket connection');

  socket.broadcast.emit('updateData', tasks);

  // socket.on('join', (incomingClient) => {
  //   const client = { id: socket.id, name: incomingClient.author };
  //   users.push(client);
  //   const message = {
  //     author: 'Chat Bot',
  //     content: `${client.name} has joined the conversation!`,
  //   };
  //   socket.broadcast.emit('message', message);
  // });
  // socket.on('message', (message) => {
  //   messages.push(message);
  //   socket.broadcast.emit('message', message);
  // });
  // socket.on('disconnect', () => {
  //   const clientName = users.find((user) => user.id === socket.id).name;
  //   const message = {
  //     author: 'Chat Bot',
  //     content: `${clientName} has left the conversation...`,
  //   };
  //   socket.broadcast.emit('message', message);
  //   users = users.filter((user) => user.id !== socket.id);
  // });
});
