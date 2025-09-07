const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, 'client')));

let tasks = [];

const PORT = process.env.PORT || 8000;

const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running at port ${PORT}...`);
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('updateData', tasks);
  });

  socket.on('removeTask', (id) => {
    tasks = tasks.filter((task) => task.id !== id);
    socket.broadcast.emit('removeTask', id);
  });
});
