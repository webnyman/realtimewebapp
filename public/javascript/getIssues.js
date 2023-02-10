import '../socket.io/socket.io.js'

// Create a socket connection using Socket.IO.
const socket = window.io()

// Listen for "tasks/create" message from the server.
socket.on('tasks/create', (task) => console.log(task))
