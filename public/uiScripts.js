let wHeight = $(window).height()
let wWidth = $(window).width()
let player = {} // this will hold all things with 'this' player

let orbs = []
let players = []

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

// Hide all modals on the game start, show what was hidden on start, initialize game
$('.start-game').click((event)=>{
    $('.modal').modal('hide')
    $('.hiddenOnStart').removeAttr('hidden')
    init()
})

// TODO: add login with github (or facebook?)