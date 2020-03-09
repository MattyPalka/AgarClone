//initial server configuration
const express = require('express')
const app = express()
app.use(express.static(__dirname + '/public'))
const socketio = require('socket.io')
const expressServer = app.listen(3000)
const io = socketio(expressServer)
const helmet = require('helmet')
app.use(helmet())

