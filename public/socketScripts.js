let socket = io.connect("http://localhost:3000")

// this function is called when user clicks on start button
function init() {
    draw()

    // call the init event when the client is ready for data
    socket.emit('init', {
        playerName: player.name
    })
}

socket.on('initReturn', (data) => {
    orbs = data.orbs
    setInterval(() => {
        //dont send a tick if there's noting to update
        if (player.xVector || player.yVector) {
            socket.emit('tick', {
                xVector: player.xVector,
                yVector: player.yVector
            })
        }
    }, 33)
})

socket.on('tock', (data) => {
    players = data.players
})

socket.on('tickTock', (data) => {
    player.locX = data.playerX
    player.locY = data.playerY
})

socket.on('orbSwitch', (data) => {
    orbs.splice(data.orbIndex, 1, data.newOrb)
})