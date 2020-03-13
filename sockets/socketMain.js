// main file where all the socket stuff goes
const io = require('../server').io
const Orb = require('./classes/Orb')
let orbs = []

initGame()

io.sockets.on('connection', (socket)=>{
    socket.emit('init', {orbs})
})

function initGame(){
    for(let i=0; i<500; i++){
        orbs.push(new Orb())
    }
}

module.exports = io