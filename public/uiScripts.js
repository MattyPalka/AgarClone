let wHeight = $(window).height()
let wWidth = $(window).width()
let player = {} // this will hold all things with 'this' player

let canvas = document.querySelector('#the-canvas')
let context = canvas.getContext('2d')
canvas.width = wWidth
canvas.height = wHeight

// Display login form (modal) on start
$(window).load(()=>{
    $('#loginModal').modal('show')
})

// Name form handling
$('.name-form').submit((event)=>{
    event.preventDefault()
    player.name = document.querySelector('#name-input').value
    $('#loginModal').modal('hide')
    $('#spawnModal').modal('show')
    document.querySelector('.player-name').innerHTML = player.name
})