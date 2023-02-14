import '../socket.io/socket.io.js'

// Create a socket connection using Socket.IO.
const socket = window.io()

// Listen for "tasks/create" message from the server.
socket.on('issues/create', (issue) => console.log(issue))
