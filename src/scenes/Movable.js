const pawn = {
    canMove: {
        x: 0,
        y: 1
    },
    maxMove: 1,
    eat: {
        x: 1,
        y: 1
    }
}
const pieceType = {
    pawn: "pawn",
    queen: "queen",
    bishop: "bishop",
    king: "king",
    rook: "rook",
    knight: "knight"
}

class Movable {
    constructor(_scene) {
        this.scene = _scene
        this.isMove = false
        this.firstLine = []
        this.rectangleCanMove = []
        this.rectangleCanEat = []
        this.rectangleCanTurnOtherPiece = []
    }
    canMove(_target) {
        if (_target.type.includes(pieceType.pawn))
            this.pawnMove(_target)
        if (_target.type.includes(pieceType.knight))
            this.KnightMove(_target)
        if (_target.type.includes(pieceType.rook))
            this.rookMove(_target)
        if (_target.type.includes(pieceType.bishop))
            this.bishopMove(_target)
        if (_target.type.includes(pieceType.queen))
            this.queenMove(_target)
        if (_target.type.includes(pieceType.king))
            this.kingMove(_target)
    }
    pawnMove(_target) {
        // check Move
        var delta = 1
        if (!_target.type.includes("white")) {
            delta = -1
        }
        if (!(_target.row - delta >= 0 && _target.row - delta < 8 && _target.col >= 0 && _target.col < 8)) {
            return
        }
        //  find where can move or eat 
        if (this.scene.board[_target.row - delta][_target.col] == null) {
            var index = 0
            this.rectangleCanMove[index] = this.scene.add.rectangle(_target.col * 100, (_target.row - delta) * 100, 100, 100, 0x00ff00).setDepth(2).setOrigin(0, 0).setAlpha(0.25).setInteractive()
            if (!_target.fistMove && this.scene.board[_target.row - delta * 2][_target.col] == null) {
                index++
                this.rectangleCanMove[index] = this.scene.add.rectangle(_target.col * 100, (_target.row - delta * 2) * 100, 100, 100, 0x00ff00).setDepth(2).setOrigin(0, 0).setAlpha(0.25).setInteractive()
            }
            this.rectangleCanMove.forEach(element => {
                element.on('pointerdown', () => { this.moveTo(_target, element.y / 100, element.x / 100) })
            });
        }
        //eat
        if (this.scene.board[_target.row - delta][_target.col + 1] != null || this.scene.board[_target.row - delta][_target.col - 1] != null) {
            var index = 0
            if (this.scene.board[_target.row - delta][_target.col + 1] != null && !this.scene.board[_target.row - delta][_target.col + 1].includes(_target.colorType)) {
                var x = (_target.col + 1) * 100
                var y = (_target.row - delta) * 100
                this.rectangleCanEat[index] = this.scene.add.rectangle(x, y, 100, 100, 0xff0000).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
            }
            if (this.scene.board[_target.row - delta][_target.col - 1] != null && !this.scene.board[_target.row - delta][_target.col - 1].includes(_target.colorType)) {
                index++
                var x = (_target.col - 1) * 100
                var y = (_target.row - delta) * 100
                this.rectangleCanEat[index] = this.scene.add.rectangle(x, y, 100, 100, 0xff0000).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
            }
            this.rectangleCanEat.forEach(element => {
                element.on('pointerdown', () => { this.eat(_target, element.y / 100, element.x / 100) })
            });
        }

    }
    checkCanMoveToNewPos(_row, _col) {
        if (_row >= 0 && _row < 8 && _col >= 0 && _col < 8) {
            if (this.scene.board[_row][_col] == null)
                return true
        }
        return false
    }
    //#region knight
    checkKnightCanEat(_target, _row, _col) {
        //if(_row==null||_col==null) return false
        if (_row >= 0 && _row < 8 && _col >= 0 && _col < 8) {
            if (this.scene.board[_row][_col] != null && !this.scene.board[_row][_col].includes(_target.colorType))
                return true
        }
        return false
    }
    KnightMove(_target) {
        // check Move
        var delta = 1
        if (!_target.type.includes("white")) {
            delta = -1
        }
        //  find where can move or eat 
        var knightmove = [
            this.checkCanMoveToNewPos(_target.row - delta * 2, _target.col - 1) ? { _row: _target.row - delta * 2, _col: _target.col - 1 } : false,
            this.checkCanMoveToNewPos(_target.row - delta * 2, _target.col + 1) ? { _row: _target.row - delta * 2, _col: _target.col + 1 } : false,
            this.checkCanMoveToNewPos(_target.row + delta * 2, _target.col - 1) ? { _row: _target.row + delta * 2, _col: _target.col - 1 } : false,
            this.checkCanMoveToNewPos(_target.row + delta * 2, _target.col + 1) ? { _row: _target.row + delta * 2, _col: _target.col + 1 } : false,
            this.checkCanMoveToNewPos(_target.row - delta, _target.col - 2) ? { _row: _target.row - delta, _col: _target.col - 2 } : false,
            this.checkCanMoveToNewPos(_target.row + delta, _target.col - 2) ? { _row: _target.row + delta, _col: _target.col - 2 } : false,
            this.checkCanMoveToNewPos(_target.row - delta, _target.col + 2) ? { _row: _target.row - delta, _col: _target.col + 2 } : false,
            this.checkCanMoveToNewPos(_target.row + delta, _target.col + 2) ? { _row: _target.row + delta, _col: _target.col + 2 } : false
        ]
        var index = 0
        knightmove.forEach(element => {
            this.rectangleCanMove[index] = this.scene.add.rectangle(element._col * 100, element._row * 100, 100, 100, 0x00ff00).setDepth(2).setOrigin(0, 0).setAlpha(0.25).setInteractive()
            index++;
        });
        this.rectangleCanMove.forEach(element => {
            element.on('pointerdown', () => { this.moveTo(_target, element.y / 100, element.x / 100) })
        });
        //eat

        var knightCanEat = [
            this.checkKnightCanEat(_target, _target.row - delta * 2, _target.col - 1) ? { _row: _target.row - delta * 2, _col: _target.col - 1 } : false,
            this.checkKnightCanEat(_target, _target.row - delta * 2, _target.col + 1) ? { _row: _target.row - delta * 2, _col: _target.col + 1 } : false,
            this.checkKnightCanEat(_target, _target.row + delta * 2, _target.col - 1) ? { _row: _target.row + delta * 2, _col: _target.col - 1 } : false,
            this.checkKnightCanEat(_target, _target.row + delta * 2, _target.col + 1) ? { _row: _target.row + delta * 2, _col: _target.col + 1 } : false,
            this.checkKnightCanEat(_target, _target.row - delta, _target.col - 2) ? { _row: _target.row - delta, _col: _target.col - 2 } : false,
            this.checkKnightCanEat(_target, _target.row + delta, _target.col - 2) ? { _row: _target.row + delta, _col: _target.col - 2 } : false,
            this.checkKnightCanEat(_target, _target.row - delta, _target.col + 2) ? { _row: _target.row - delta, _col: _target.col + 2 } : false,
            this.checkKnightCanEat(_target, _target.row + delta, _target.col + 2) ? { _row: _target.row + delta, _col: _target.col + 2 } : false

        ]
        //  console.log(knightCanEat)
        var index2 = 0
        knightCanEat.forEach((element) => {
            var x = (element._col) * 100
            var y = (element._row) * 100
            this.rectangleCanEat[index2] = this.scene.add.rectangle(x, y, 100, 100, 0xff0000).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
            index2++
        })
        this.rectangleCanEat.forEach(element => {
            console.log(_target.type)
            element.on('pointerdown', () => { this.eat(_target, element.y / 100, element.x / 100) })
        });

    }
    //#endregion
    maxOfSquareCanMoveStraight(_target, _delta) {
        var maxDistance = {
            left: { _row: _target.row, _col: _target.col },
            right: { _row: _target.row, _col: _target.col },
            top: { _row: _target.row, _col: _target.col },
            down: { _row: _target.row, _col: _target.col }
        }
        // left
        for (let i = _target.col - 1; i >= 0; i--) {
            if (this.checkCanMoveToNewPos(_target.row, i)) {
                maxDistance.left._col = i
                maxDistance.left._row = _target.row
            }
            else break
        }
        // right
        for (let i = _target.col + 1; i < 8; i++) {
            if (this.checkCanMoveToNewPos(_target.row, i)) {
                maxDistance.right._col = i
                maxDistance.right._row = _target.row
            }
            else break
        }
        // top
        for (let i = _target.row - 1; i >= 0; i--) {
            if (this.checkCanMoveToNewPos(i, _target.col)) {
                maxDistance.top._row = i
                maxDistance.top._col = _target.col
            }
            else break
        }
        for (let i = _target.row + 1; i < 8; i++) {
            if (this.checkCanMoveToNewPos(i, _target.col)) {
                maxDistance.down._row = i
                maxDistance.down._col = _target.col
            }
            else break
        }
        return maxDistance;
    }
    rookMove(_target) {
        var delta = 1
        // if (!_target.type.includes("white")) {
        //     delta = -1
        // }
        var rookMove = this.maxOfSquareCanMoveStraight(_target, delta);
        var index = 0
        if (delta == 1) {

        }
        if (rookMove.top._row != null) {
            for (let i = _target.row - delta; i >= rookMove.top._row; i--) {
                var x = (rookMove.top._col) * 100
                var y = (i) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
            }
        }
        if (rookMove.down._row != null) {
            for (let i = _target.row + delta; i <= rookMove.down._row; i++) {
                var x = (rookMove.down._col) * 100
                var y = (i) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
            }
        }
        if (rookMove.left._row != null) {
            for (let i = _target.col - delta; i >= rookMove.left._col; i--) {
                var x = (i) * 100
                var y = (_target.row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
            }
        }
        if (rookMove.right._row != null) {
            for (let i = _target.col + delta; i <= rookMove.right._col; i++) {
                var x = (i) * 100
                var y = (_target.row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
            }
        }
        this.rectangleCanMove.forEach(element => {
            console.log(_target.type)
            element.on('pointerdown', () => { this.moveTo(_target, element.y / 100, element.x / 100) })
        });
        // eat

        var rookCanEat = [
            this.checkKnightCanEat(_target, rookMove.left._row, rookMove.left._col - delta) ? { _row: rookMove.left._row, _col: rookMove.left._col - delta } : false,
            this.checkKnightCanEat(_target, rookMove.right._row, rookMove.right._col + delta) ? { _row: rookMove.right._row, _col: rookMove.right._col + delta } : false,
            this.checkKnightCanEat(_target, rookMove.top._row - delta, rookMove.top._col) ? { _row: rookMove.top._row - delta, _col: rookMove.top._col } : false,
            this.checkKnightCanEat(_target, rookMove.down._row + delta, rookMove.down._col) ? { _row: rookMove.down._row + delta, _col: rookMove.down._col } : false,

        ]
        console.log(rookCanEat)
        var index2 = 0
        rookCanEat.forEach((element) => {
            var x = (element._col) * 100
            var y = (element._row) * 100
            this.rectangleCanEat[index2] = this.scene.add.rectangle(x, y, 100, 100, 0xff0000).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
            index2++
        })
        this.rectangleCanEat.forEach(element => {
            // console.log(_target.type)
            element.on('pointerdown', () => { this.eat(_target, element.y / 100, element.x / 100) })
        });
    }
    maxOfSquareCanMoveCurve(_target, _delta) {
        var maxDistance = {
            leftTop: { _row: _target.row, _col: _target.col },
            rightTop: { _row: _target.row, _col: _target.col },
            leftDown: { _row: _target.row, _col: _target.col },
            rightDown: { _row: _target.row, _col: _target.col }
        }
        // left top
        var row = _target.row - 1
        var col = _target.col - 1
        while (this.checkCanMoveToNewPos(row, col)) {
            maxDistance.leftTop._col = col
            maxDistance.leftTop._row = row
            col--
            row--
        }
        // right top
        var row = _target.row - 1
        var col = _target.col + 1
        while (this.checkCanMoveToNewPos(row, col)) {
            maxDistance.rightTop._col = col
            maxDistance.rightTop._row = row
            col++
            row--
        }
        // left down
        var row = _target.row + 1
        var col = _target.col - 1
        while (this.checkCanMoveToNewPos(row, col)) {
            maxDistance.leftDown._col = col
            maxDistance.leftDown._row = row
            col--
            row++
        }
        // right down
        var row = _target.row + 1
        var col = _target.col + 1
        while (this.checkCanMoveToNewPos(row, col)) {
            maxDistance.rightDown._col = col
            maxDistance.rightDown._row = row
            col++
            row++
        }
        return maxDistance;
    }
    bishopMove(_target) {
        var delta = 1
        // if (!_target.type.includes("white")) {
        //     delta = -1
        // }
        var bishopMove = this.maxOfSquareCanMoveCurve(_target, delta);
        var index = 0
        if (bishopMove.leftTop._row != null) {
            var row = _target.row - 1
            var col = _target.col - 1
            while (this.checkCanMoveToNewPos(row, col)) {
                var x = col * 100
                var y = (row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                col--
                row--
            }
        }
        if (bishopMove.rightTop._row != null) {
            var row = _target.row - 1
            var col = _target.col + 1
            while (this.checkCanMoveToNewPos(row, col)) {
                var x = col * 100
                var y = (row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                col++
                row--
            }
        }
        if (bishopMove.leftDown._row != null) {
            var row = _target.row + 1
            var col = _target.col - 1
            while (this.checkCanMoveToNewPos(row, col)) {
                var x = col * 100
                var y = (row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                col--
                row++
            }
        }
        if (bishopMove.rightDown._row != null) {
            var row = _target.row + 1
            var col = _target.col + 1
            while (this.checkCanMoveToNewPos(row, col)) {
                var x = col * 100
                var y = (row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                col++
                row++
            }
        }
        this.rectangleCanMove.forEach(element => {
            console.log(_target.type)
            element.on('pointerdown', () => { this.moveTo(_target, element.y / 100, element.x / 100) })
        });
        // eat

        var bishopCanEat = [
            this.checkKnightCanEat(_target, bishopMove.leftTop._row - delta, bishopMove.leftTop._col - delta) ? { _row: bishopMove.leftTop._row - delta, _col: bishopMove.leftTop._col - delta } : false,
            this.checkKnightCanEat(_target, bishopMove.rightTop._row - delta, bishopMove.rightTop._col + delta) ? { _row: bishopMove.rightTop._row - delta, _col: bishopMove.rightTop._col + delta } : false,
            this.checkKnightCanEat(_target, bishopMove.leftDown._row + delta, bishopMove.leftDown._col - delta) ? { _row: bishopMove.leftDown._row + delta, _col: bishopMove.leftDown._col - delta } : false,
            this.checkKnightCanEat(_target, bishopMove.rightDown._row + delta, bishopMove.rightDown._col + delta) ? { _row: bishopMove.rightDown._row + delta, _col: bishopMove.rightDown._col + delta } : false,

        ]
        console.log(bishopCanEat)
        var index2 = 0
        bishopCanEat.forEach((element) => {
            var x = (element._col) * 100
            var y = (element._row) * 100
            this.rectangleCanEat[index2] = this.scene.add.rectangle(x, y, 100, 100, 0xff0000).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
            index2++
        })
        this.rectangleCanEat.forEach(element => {
            // console.log(_target.type)
            element.on('pointerdown', () => { this.eat(_target, element.y / 100, element.x / 100) })
        });

    }
    queenMove(_target) {
        var delta = 1
        // if (!_target.type.includes("white")) {
        //     delta = -1
        // }
        var bishopMove = this.maxOfSquareCanMoveCurve(_target, delta);
        var rookMove = this.maxOfSquareCanMoveStraight(_target, delta);
        var index = 0
        if (bishopMove.leftTop._row != null) {
            var row = _target.row - 1
            var col = _target.col - 1
            while (this.checkCanMoveToNewPos(row, col)) {
                var x = col * 100
                var y = (row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                col--
                row--
            }
        }
        if (bishopMove.rightTop._row != null) {
            var row = _target.row - 1
            var col = _target.col + 1
            while (this.checkCanMoveToNewPos(row, col)) {
                var x = col * 100
                var y = (row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                col++
                row--
            }
        }
        if (bishopMove.leftDown._row != null) {
            var row = _target.row + 1
            var col = _target.col - 1
            while (this.checkCanMoveToNewPos(row, col)) {
                var x = col * 100
                var y = (row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                col--
                row++
            }
        }
        if (bishopMove.rightDown._row != null) {
            var row = _target.row + 1
            var col = _target.col + 1
            while (this.checkCanMoveToNewPos(row, col)) {
                var x = col * 100
                var y = (row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                col++
                row++
            }
        }
        if (rookMove.top._row != null) {
            for (let i = _target.row - delta; i >= rookMove.top._row; i--) {
                var x = (rookMove.top._col) * 100
                var y = (i) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
            }
        }
        if (rookMove.down._row != null) {
            for (let i = _target.row + delta; i <= rookMove.down._row; i++) {
                var x = (rookMove.down._col) * 100
                var y = (i) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
            }
        }
        if (rookMove.left._row != null) {
            for (let i = _target.col - delta; i >= rookMove.left._col; i--) {
                var x = (i) * 100
                var y = (_target.row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
            }
        }
        if (rookMove.right._row != null) {
            for (let i = _target.col + delta; i <= rookMove.right._col; i++) {
                var x = (i) * 100
                var y = (_target.row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
            }
        }
        this.rectangleCanMove.forEach(element => {
            console.log(_target.type)
            element.on('pointerdown', () => { this.moveTo(_target, element.y / 100, element.x / 100) })
        });
        // eat

        var bishopCanEat = [
            this.checkKnightCanEat(_target, bishopMove.leftTop._row - delta, bishopMove.leftTop._col - delta) ? { _row: bishopMove.leftTop._row - delta, _col: bishopMove.leftTop._col - delta } : false,
            this.checkKnightCanEat(_target, bishopMove.rightTop._row - delta, bishopMove.rightTop._col + delta) ? { _row: bishopMove.rightTop._row - delta, _col: bishopMove.rightTop._col + delta } : false,
            this.checkKnightCanEat(_target, bishopMove.leftDown._row + delta, bishopMove.leftDown._col - delta) ? { _row: bishopMove.leftDown._row + delta, _col: bishopMove.leftDown._col - delta } : false,
            this.checkKnightCanEat(_target, bishopMove.rightDown._row + delta, bishopMove.rightDown._col + delta) ? { _row: bishopMove.rightDown._row + delta, _col: bishopMove.rightDown._col + delta } : false,

        ]
        /// console.log(bishopCanEat)
        var index2 = 0
        bishopCanEat.forEach((element) => {
            var x = (element._col) * 100
            var y = (element._row) * 100
            this.rectangleCanEat[index2] = this.scene.add.rectangle(x, y, 100, 100, 0xff0000).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
            index2++
        })


        var rookCanEat = [
            this.checkKnightCanEat(_target, rookMove.left._row, rookMove.left._col - delta) ? { _row: rookMove.left._row, _col: rookMove.left._col - delta } : false,
            this.checkKnightCanEat(_target, rookMove.right._row, rookMove.right._col + delta) ? { _row: rookMove.right._row, _col: rookMove.right._col + delta } : false,
            this.checkKnightCanEat(_target, rookMove.top._row - delta, rookMove.top._col) ? { _row: rookMove.top._row - delta, _col: rookMove.top._col } : false,
            this.checkKnightCanEat(_target, rookMove.down._row + delta, rookMove.down._col) ? { _row: rookMove.down._row + delta, _col: rookMove.down._col } : false,

        ]
        rookCanEat.forEach((element) => {
            var x = (element._col) * 100
            var y = (element._row) * 100
            this.rectangleCanEat[index2] = this.scene.add.rectangle(x, y, 100, 100, 0xff0000).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
            index2++
        })
        this.rectangleCanEat.forEach(element => {
            // console.log(_target.type)
            element.on('pointerdown', () => { this.eat(_target, element.y / 100, element.x / 100) })
        });
    }
    kingMove(_target) {
        var delta = 1
        // if (!_target.type.includes("white")) {
        //     delta = -1
        // }
        var bishopMove = this.maxOfSquareCanMoveCurve(_target, delta);
        var rookMove = this.maxOfSquareCanMoveStraight(_target, delta);
        var index = 0
        if (bishopMove.leftTop._row != null) {
            var row = _target.row - 1
            var col = _target.col - 1
            while (this.checkCanMoveToNewPos(row, col)) {
                var x = col * 100
                var y = (row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                col--
                row--
                break
            }
        }
        if (bishopMove.rightTop._row != null) {
            var row = _target.row - 1
            var col = _target.col + 1
            while (this.checkCanMoveToNewPos(row, col)) {
                var x = col * 100
                var y = (row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                col++
                row--
                break
            }
        }
        if (bishopMove.leftDown._row != null) {
            var row = _target.row + 1
            var col = _target.col - 1
            while (this.checkCanMoveToNewPos(row, col)) {
                var x = col * 100
                var y = (row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                col--
                row++
                break
            }
        }
        if (bishopMove.rightDown._row != null) {
            var row = _target.row + 1
            var col = _target.col + 1
            while (this.checkCanMoveToNewPos(row, col)) {
                var x = col * 100
                var y = (row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                col++
                row++
                break
            }
        }
        if (rookMove.top._row != null) {
            for (let i = _target.row - delta; i >= rookMove.top._row; i--) {
                var x = (rookMove.top._col) * 100
                var y = (i) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                break
            }
        }
        if (rookMove.down._row != null) {
            for (let i = _target.row + delta; i <= rookMove.down._row; i++) {
                var x = (rookMove.down._col) * 100
                var y = (i) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                break
            }
        }
        if (rookMove.left._row != null) {
            for (let i = _target.col - delta; i >= rookMove.left._col; i--) {
                var x = (i) * 100
                var y = (_target.row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                break
            }
        }
        if (rookMove.right._row != null) {
            for (let i = _target.col + delta; i <= rookMove.right._col; i++) {
                var x = (i) * 100
                var y = (_target.row) * 100
                this.rectangleCanMove[index] = this.scene.add.rectangle(x, y, 100, 100, 0x00ff00).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
                index++
                break
            }
        }
        this.rectangleCanMove.forEach(element => {
            console.log(_target.type)
            element.on('pointerdown', () => { this.moveTo(_target, element.y / 100, element.x / 100) })
        });
        // eat

        var bishopCanEat = [
            this.checkKnightCanEat(_target, _target.row - delta, _target.col - delta) ? { _row: _target.row - delta, _col: _target.col - delta } : false,
            this.checkKnightCanEat(_target, _target.row - delta, _target.col + delta) ? { _row: _target.row - delta, _col: _target.col + delta } : false,
            this.checkKnightCanEat(_target, _target.row + delta, _target.col - delta) ? { _row: _target.row + delta, _col: _target.col - delta } : false,
            this.checkKnightCanEat(_target, _target.row + delta, _target.col + delta) ? { _row: _target.row + delta, _col: _target.col + delta } : false,

        ]
        /// console.log(bishopCanEat)
        var index2 = 0
        bishopCanEat.forEach((element) => {
            var x = (element._col) * 100
            var y = (element._row) * 100
            this.rectangleCanEat[index2] = this.scene.add.rectangle(x, y, 100, 100, 0xff0000).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
            index2++
        })


        var rookCanEat = [
            this.checkKnightCanEat(_target, _target.row, _target.col - delta) ? { _row: _target.row, _col: _target.col - delta } : false,
            this.checkKnightCanEat(_target, _target.row, _target.col + delta) ? { _row: _target.row, _col: _target.col + delta } : false,
            this.checkKnightCanEat(_target, _target.row - delta, _target.col) ? { _row: _target.row - delta, _col: _target.col } : false,
            this.checkKnightCanEat(_target, _target.row + delta, _target.col) ? { _row: _target.row + delta, _col: _target.col } : false,

        ]
        rookCanEat.forEach((element) => {
            var x = (element._col) * 100
            var y = (element._row) * 100
            this.rectangleCanEat[index2] = this.scene.add.rectangle(x, y, 100, 100, 0xff0000).setDepth(5).setOrigin(0, 0).setAlpha(0.3).setInteractive()
            index2++
        })
        this.rectangleCanEat.forEach(element => {
            // console.log(_target.type)
            element.on('pointerdown', () => { this.eat(_target, element.y / 100, element.x / 100) })
        });
    }
    moveTo(_target, _row, _col, _isEatting) {
        if (!_isEatting)
            this.scene.au3.play()
        if (_target.type == "black_pawn" && _row == 7 || _target.type == "white_pawn" && _row == 0) {
            this.promote(_target)
        }
        _target.fistMove = true
        this.scene.board[_target.row][_target.col] = null

        this.scene.board[_row][_col] = _target.type
        //  

        // update target
        _target.hasClicked = false
        _target.row = _row
        _target.col = _col
        //
        this.scene.tweens.add({
            targets: _target.body,
            x: _col * 100,
            y: _row * 100,
            duration: 300,
            ease: 'Power2',
            onStart: () => {


            },
            onComplete: () => {
            }
        });
        // _target.body.x = 
        // _target.body.y = 
        this.destroyMoveLine()
        if (this.scene.turnPlay == "white")
            this.scene.turnPlay = "black"
        else this.scene.turnPlay = "white"
    }
    eat(_target, _row, _col) {
        setTimeout(() => {
            this.scene.au4.play()
            this.scene.explouseEffect.setPosition((_col + 0.5) * 100, (_row + 0.5) * 100);
            this.scene.explouseEffect.visible = true;
            this.scene.explouseEffect.setFrame(0)
            this.scene.explouseEffect.anims.play("explouse_anim", true)
        }, 100);
        if (this.scene.board[_row][_col] == "white_king" || this.scene.board[_row][_col] == "black_king") {
            this.scene.time.delayedCall(1500, () => {
                this.scene.gameOver();
            })
        }
        this.destroyMoveLine()
        this.scene.pieces.forEach((element) => {
            if (element.row == _row && element.col == _col)
                element.body.destroy();
        })
        this.scene.board[_row][_col] = null
        this.moveTo(_target, _row, _col, true)
    }
    promote(_target) {
        console.log(_target.type + " promote")
        if (_target.type == "black_pawn") {
            _target.type = "black_queen"
            _target.colorType = "black"
            _target.body.setFrame("black_queen")
            _target.body.setDisplaySize(100, 100).setOrigin(0, 0).setDepth(3).setInteractive()
        } else if (_target.type == "white_pawn") {
            _target.type = "white_queen"
            _target.colorType = "white"
            _target.body.setFrame("white_queen")
            _target.body.setDisplaySize(100, 100).setOrigin(0, 0).setDepth(3).setInteractive()
        }
    }
    destroyMoveLine() {
        this.rectangleCanMove.forEach(element => {
            element.destroy()
        });
        this.rectangleCanEat.forEach(element => {
            element.destroy()
        });
        this.firstLine.forEach(element => {
            element.destroy()
        });
    }
}