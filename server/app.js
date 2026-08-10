const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const registerQuizSockets = require('./sockets/quizHandler');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

registerQuizSockets(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Quiz Socket Server running on http://localhost:${PORT}`);
});