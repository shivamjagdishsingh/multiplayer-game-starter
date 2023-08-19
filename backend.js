const express = require('express')
const app = express()

// Socket.io requires http server and not express server
const http = require('http');
const { eventNames } = require('process');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 });

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
const backEndPlayers = {}

io.on('connection', (socket) => {
  backEndPlayers[socket.id] = {
    x: 500*Math.random(),
    y: 500*Math.random(),
    color: `hsl(${Math.random()*360}, 100%, 50%)`
  }

  io.emit('updatePlayers', backEndPlayers);

  socket.on('disconnect', (reason) => {
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers);
  });

  socket.on('keydown', (keycode) => {
    switch (keycode) {
      case 'KeyW':
        backEndPlayers[socket.id].y -= 5
        break

      case 'KeyA':
        backEndPlayers[socket.id].x -= 5
        break

      case 'KeyS':
        backEndPlayers[socket.id].y += 5
        break

      case 'KeyD':
        backEndPlayers[socket.id].x += 5
        break
      }
  });
});

setInterval(() => {
  io.emit('updatePlayers', backEndPlayers);
}, 15) // 15 ms

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
