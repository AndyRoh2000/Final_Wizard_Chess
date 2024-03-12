class Piece {
    constructor(_scene,_x,_y,_img,_type){
        this.scene=_scene
        this.img=_img
        this.type=_type
        this.col=_x
        this.row=_y
        this.body=null
        this.fistMove=false;// for pawn
        this.hasClicked=false
        this.colorType=(this.type.includes("black"))?"black":"white";
        this.setUpPiece()
        this.addInteraction()
    }
    setUpPiece(){
        this.body=this.scene.add.sprite(this.col*100,this.row*100,"assets",this.img).setDisplaySize(100, 100).setOrigin(0, 0).setDepth(3).setInteractive()
    }
    addInteraction(){
        this.body.on('pointerdown', () => {
            if(this.colorType!=this.scene.turnPlay) return
            if(this.hasClicked){
                this.hasClicked=false
                this.scene.movable.destroyMoveLine()
                return
            }
            this.scene.movable.destroyMoveLine()
            this.hasClicked=true
            this.scene.au1.play()
            this.scene.movable.canMove(this)
        }, this.scene);
    }
}