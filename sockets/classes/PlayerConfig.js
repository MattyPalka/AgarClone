// This is where only data about the player needed locally is stored
class PlayerConfig{
    constructor(settings){
        this.xVector = 0
        this.yVector = 0
        this.speed = settings.defaultSpeed
        this.zoom = settings.defaultZoom
    }
}

module.exports = PlayerConfig