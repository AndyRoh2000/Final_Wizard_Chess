class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: "GameOver" });
    }

    preload() {
        this.load.image('menuimg', './img/menu.png')
        this.load.image('gameoverimg', './img/gameover.png')
    }

    create() {
        this.bgMusic = this.sound.add('backgroundMusic').setVolume(0.3)
        this.au3= this.sound.add('au3').setVolume(7);
        this.add.sprite(0, 0, "gameoverimg").setDisplaySize(800, 800).setOrigin(0, 0)
        this.textRound = this.add.text(190, 100, "GAME OVER", {
            fontSize: '70px', color: 'red', stroke: '#ffffff', fontFamily: "Georgia",
            strokeThickness: 0
        }).setDepth(5).setInteractive();
        this.addButton()
    }
    addButton() {
        this.restart = this.add.text(330, 200, "Restart", {
            fontSize: '40px', color: 'black', stroke: '#ffffff', fontFamily: "Georgia",
            strokeThickness: 0
        }).setDepth(5).setInteractive();
        this.restart.on('pointerover', () => {
            this.restart.setColor('#00ff00');
        })
        this.restart.on('pointerout', () => {
            this.restart.setColor('black');
        })
        this.restart.on('pointerdown', () => {
            this.au3.play()
            this.restart.setColor('lightblue');
            this.time.delayedCall(300, () => {
                this.scene.start('playScene');

            })
        })
        this.restart.on('pointerup', () => {
            this.restart.setColor('black');
        })





        this.mainMenu = this.add.text(290, 250, "Main Menu", {
            fontSize: '40px', color: 'black', stroke: '#ffffff', fontFamily: "Georgia",
            strokeThickness: 0
        }).setDepth(5).setInteractive();
        this.mainMenu.on('pointerover', () => {
            this.mainMenu.setColor('#00ff00');
        })

        this.mainMenu.on('pointerout', () => {
            this.mainMenu.setColor('black');
        })
        this.mainMenu.on('pointerdown', () => {
            this.au3.play()
            this.mainMenu.setColor('lightblue');
            this.time.delayedCall(300, () => {
                this.scene.start('menuScene');

            })
        })
        this.mainMenu.on('pointerup', () => {
            this.mainMenu.setColor('black');
        })



    }
    update() {
     //   console.log("game over")
        if(!this.bgMusic.isPlaying){
            this.bgMusic.play()
        }
    }
    // any additional function
}
