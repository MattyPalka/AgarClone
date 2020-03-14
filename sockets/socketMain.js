// main file where all the socket stuff goes

const io = require('../server').io


const Orb = require('./classes/Orb')
const Player = require('./classes/Player')
const PlayerConfig = require('./classes/PlayerConfig')
const PlayerData = require('./classes/PlayerData')

let orbs = []
let players = []

let settings = {
    defaultOrbs: 500,
    defaultSpeed: 6,
    defaultSize: 6,
    defaultZoom: 1.5, // as player gets bigger the zoom needs to go out
    worldWidth: 500,
    worldHeight: 500
}

initGame()

io.sockets.on('connection', (socket) => {
// A player has connected 

    socket.on('init', (data) => {
    // init respose from the client on start game button clicked
        // make a playerConfig object
        let playerConfig = new PlayerConfig(settings)
        // make a playerData object
        let playerData = new PlayerData(data.playerName, settings)
        // make a master player object to hold both
        let player = new Player(socket.id, playerConfig, playerData)

        socket.emit('initReturn', { orbs })
        players.push(PlayerData)
    })

})

function initGame() {
    for (let i = 0; i < settings.defaultOrbs; i++) {
        orbs.push(new Orb(settings))
    }
}

module.exports = io