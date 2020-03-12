function init(){
    draw()
}

let randomX = Math.floor(500 * Math.random() + 1)
let randomY = Math.floor(500 * Math.random() + 1)
function draw(){
    context.beginPath()
    context.fillStyle = "rgb(255,0,0)"
    //draw a circle
    context.arc(randomX, randomY, 10, 0, Math.PI * 2)
    context.fill()
    context.lineWidth = 3
    context.strokeStyle = 'rgb(0,0,255)'
    context.stroke()
    requestAnimationFrame(draw)
}