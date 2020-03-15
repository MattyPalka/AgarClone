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

socket.on('updateLeaderboard', (data) => {
    document.querySelector('.leader-board').innerHTML = ""
    data.forEach((curPlayer) => {
        document.querySelector('.leader-board').innerHTML += `
        <li class="leaderboard-player">${curPlayer.name}: ${curPlayer.score}</li>
        `
    })

    // TODO: update the score window in upper left
})

socket.on('playerDeath', (data)=> {
    document.querySelector('#game-message').innerHTML = `${data.died.name} got absorbed by ${data.killedBy.name}`
    $('game-message').css({ 'opacity': 1})
    $('game-message').show()
    $('game-message').fadeOut(4000)

    // TODO: if our player died (data.died) then set a var isAlive to false
    // and in canvasScript use that var that attach camera is only run when player is alive
})