// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { PeerServer } = require('peer');

// Initialize the app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the frontend (if you have a frontend directory, like create-react-app)
app.use(express.static('public'));

// Initialize PeerJS server
const peerServer = PeerServer({
    port: 9000,
    path: '/myapp',
});

peerServer.on('open', () => {
    console.log('Peer server running on port 9000');
});

// Socket.IO for signaling
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Handle sending signal messages to other users
    socket.on('offer', (data) => {
        io.to(data.target).emit('offer', {
            sdp: data.sdp,
            sender: socket.id,
        });
    });

    socket.on('answer', (data) => {
        io.to(data.target).emit('answer', {
            sdp: data.sdp,
            sender: socket.id,
        });
    });

    socket.on('ice-candidate', (data) => {
        io.to(data.target).emit('ice-candidate', {
            candidate: data.candidate,
            sender: socket.id,
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Start the server
server.listen(8001, () => {
    console.log('Server running on port 8001');
});
