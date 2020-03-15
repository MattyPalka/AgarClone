// main file where all the socket stuff goes

const io = require('../server').io
const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions

const Orb = require('./classes/Orb')
const Player = require('./classes/Player')
const PlayerConfig = require('./classes/PlayerConfig')
const PlayerData = require('./classes/PlayerData')

let orbs = []
let players = []

let settings = {
    defaultOrbs: 5000,
    defaultSpeed: 6,
    defaultSize: 6,
    defaultZoom: 1.5, // as player gets bigger the zoom needs to go out
    worldWidth: 5000,
    worldHeight: 5000
}

initGame()

// issue a msg to every connected socket every 30fps
setInterval(() => {
    if (players.length > 0) {
        io.to('game').emit('tock', {
            players
        })
    }
}, 33) // 1000ms / 30 = 33

io.sockets.on('connection', (socket) => {
    // A player has connected 
    let player = {}
    socket.on('init', (data) => {
        // init respose from the client on start game button clicked
        // add player to game namespace
        socket.join('game')
        // make a playerConfig object
        let playerConfig = new PlayerConfig(settings)
        // make a playerData object
        let playerData = new PlayerData(data.playerName, settings)

        // make a master player object to hold both
        player = new Player(socket.id, playerConfig, playerData)

        // issue a msg to every connected socket every 30fps
        setInterval(() => {
            socket.emit('tickTock', {
                playerX: player.playerData.locX,
                playerY: player.playerData.locY
            })
        }, 33) // 1000ms / 30 = 33

        socket.emit('initReturn', { orbs })
        players.push(playerData)
    })

    // client sent a tick event so we know what direction to move the player
    socket.on('tick', (data) => {
        speed = player.playerConfig.speed
        xV = player.playerConfig.xVector = data.xVector;
        yV = player.playerConfig.yVector = data.yVector;

        if ((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)) {
            player.playerData.locY -= speed * yV;
            console.log(player.playerData.locY)
        } else if ((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)) {
            player.playerData.locX += speed * xV;
        } else {
            player.playerData.locX += speed * xV;
            player.playerData.locY -= speed * yV;
        }

        let capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings)
        capturedOrb.then((data) => {
            // then runs if resolve runs | a collission happened
            const orbData = {
                orbIndex: data,
                newOrb: orbs[data]
            }

            // everysocket needs to know the leaderboard has changed
            io.sockets.emit('updateLeaderboard', getLeaderboard())

            // emit to all sockets the orb to replace
            io.sockets.emit('orbSwitch', orbData)
            
            // TODO: add zoom out when player absorbs the orbs, probably good thing is to 
            // try adding it in somewhere in check collisions

        }).catch(() => {
            //catch runs if reject runs | no collision happened
        })

        let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, player.socketId)
        playerDeath.then((data) => {

            // everysocket needs to know the leaderboard has changed
            io.sockets.emit('updateLeaderboard', getLeaderboard())
            io.sockets.emit('playerDeath', data)

            // TODO: add zoom out when player absorbs the other player, probably good thing is to 
            // try adding it in somewhere in check collisions
        }).catch(() => {
            // no player collision
        })
    })

    socket.on('disconnect', (data) => {
        //if player exists
        if (player.playerData) {
            players.forEach((curPlayer, i) => {
                if (curPlayer.uid == player.playerData.uid) {
                    players.splice(i, 1)
                    io.sockets.emit('updateLeaderboard', getLeaderboard())
                }
            })
        }
    })
})

function getLeaderboard() {
    players.sort((a, b) => { return b.score - a.score })
    let leaderBoard = players.map((curPlayer) => {
        return {
            name: curPlayer.name,
            score: curPlayer.score
        }
    })
    return leaderBoard
}

function initGame() {
    for (let i = 0; i < settings.defaultOrbs; i++) {
        orbs.push(new Orb(settings))
    }
}

module.exports = io