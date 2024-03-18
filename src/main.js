// Gyungmin Roh - Chess
// Physics, particles, text objects, tween, animation were used
// https://pixabay.com/music/search/success/ is the music source
// All the other source are made by me

"use strict"


let config = {
    type: Phaser.AUTO,
    height: 800,
    width: 800,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Menu, Play, GameOver ]//
}

let cursors
let game = new Phaser.Game(config);

let { height, width } = game.config


// SET US constructions
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3



