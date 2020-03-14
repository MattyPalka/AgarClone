let socket = io.connect("http://localhost:3000")

// this function is called when user clicks on start button
function init(){
    draw()

    // call the init event when the client is ready for data
    socket.emit('init', {
        playerName: player.name
    })
}

socket.on('initReturn', (data)=>{
    orbs = data.orbs
})