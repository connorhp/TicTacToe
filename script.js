let app = new Vue({
    el: '#app',
    data: {
        scores: {
            wins: 0,
            losses: 0,
            draws: 0
        },
        displayBoard: false,
        displayHowToPlay: false,
        player: '',
        computer: '',
        board: [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ],
        isEmpty: true,
        win: false,
        draw: false,
        loss: false,
        turns: 0,
        canChoose: true,
        lastMoveRow: -1,
        lastMoveCol: -1,
    },

    methods: {
        resetScores() {
            this.scores.wins = 0;
            this.scores.losses = 0;
            this.scores.draws = 0;
        },
        resetBoard() {
            for (let i = 0; i < this.board.length; ++i) {
                for (let j = 0; j < this.board[i].length; ++j) {
                    this.board[i][j] = '';
                    this.$forceUpdate();
                }
            }
            this.turns = 0;
        },
        howToPlay() {
            this.displayBoard = false;
            this.displayHowToPlay = true;
        },

        startGame(play, comp) {
            this.displayHowToPlay = false;
            this.canChoose = true;
            this.player = play;
            this.computer = comp;
            this.displayBoard = true;
            this.resetBoard();
            this.isEmpty = true;
            this.win = this.loss = this.draw = false;
            if (this.computer == 'X') this.computersTurn();
        },

        randomCorner() {
            let unused = [];
            for (let i = 0; i < this.board.length; i += 2) {
                for (let j = 0; j < this.board[i].length; j += 2) {
                    if (this.board[i][j] == '') unused.push([i, j]);
                }
            }
            let num = Math.floor(Math.random() * unused.length);
            return unused[num];
        },
        randomEdge() {
            let unused = [];
            if (this.board[0][1] == '') unused.push([0, 1]);
            if (this.board[1][0] == '') unused.push([1, 0]);
            if (this.board[1][2] == '') unused.push([1, 2]);
            if (this.board[2][1] == '') unused.push([2, 1]);
            let randNum = Math.floor(Math.random() * unused.length);
            console.log(unused);
            console.log(unused[randNum]);
            return unused[randNum];
        },
        randomPiece() {
            let unused = [];
            for (let i = 0; i < this.board.length; ++i) {
                for (let j = 0; j < this.board[i].length; ++j) {
                    if (this.board[i][j] == '') unused.push([i, j]);
                }
            }
            let num = Math.floor(Math.random() * unused.length);
            return unused[num];
        },

        canWin(who) {
            console.log("canWin: " + who);
            //check if there is a winning move on the rows
            for (let i = 0; i < this.board.length; ++i) {
                let row = -1;
                let col = -1;
                let howMany = 0;
                for (let j = 0; j < this.board[i].length; ++j) {
                    if (this.board[i][j] == who) ++howMany;
                    else if (this.board[i][j] == '') {
                        row = i;
                        col = j;
                    }
                }
                if (howMany == 2 && row != -1) {
                    console.log("Row Win");
                    console.log("Row: " + row + "Col: " + col);
                    this.choose(row, col, this.computer);
                    return true;
                }
            }
            // checks to see if there is a winning move on the columns
            for (let j = 0; j < this.board.length; ++j) {
                let row = -1;
                let col = -1;
                let howMany = 0;
                for (let i = 0; i < this.board[j].length; ++i) {
                    if (this.board[i][j] == who) ++howMany;
                    else if (this.board[i][j] == '') {
                        row = i;
                        col = j;
                    }
                }
                if (howMany == 2 && row != -1) {
                    console.log("Column win");
                    console.log("Row: " + row + "Col: " + col);
                    this.choose(row, col, this.computer);
                    return true;
                }
            }
            // checks for 00, 11, 22 winning move
            let howMany = 0;
            let row = -1;
            let col = -1;
            for (let i = 0; i < this.board.length; ++i) {
                if (this.board[i][i] == who) ++howMany;
                else if (this.board[i][i] == '') row = col = i;
            }
            if (howMany == 2 && row != -1) {
                console.log("downDiagonal win");
                console.log("Row: " + row + "Col: " + col);
                this.choose(row, col, this.computer);
                return true;
            }
            //checks 02, 11, 20 winning move
            howMany = 0;
            row = -1;
            col = -1;
            let i = 2;
            let j = 0;
            while (i > -1) {
                if (this.board[i][j] == who) ++howMany;
                else if (this.board[i][j] == '') {
                    row = i;
                    col = j;
                }
                i--;
                j++;
            }
            if (howMany == 2 && row != -1) {
                console.log("Up Diagonal Win");
                console.log("Row: " + row + "Col: " + col);
                this.choose(row, col, this.computer);
                return true;
            }
            return false;
        },


        compFirst() {
            let lRow = this.lastMoveRow;
            let lCol = this.lastMoveCol;
            //does middle move first
            if (this.isEmpty) this.choose(1, 1, this.computer);
            //if player chose a corner as first move
            else if (this.turns == 2) {
                if ((lRow == 0 || lRow == 2) && (lCol == 0 || lCol == 2)) {
                    if (lRow == lCol) this.choose(2 - lRow, 2 - lCol, this.computer);
                    else this.choose(lCol, lRow, this.computer);
                }
                else if (lRow == 1) this.choose(lRow + 1, 2 - lCol, this.computer);
                else this.choose(2 - lRow, lCol + 1, this.computer);
            }
            else if (this.turns == 4) {
                if (lRow == 1) {
                    this.choose(lRow + 1, 2 - lCol, this.computer);
                    this.choose(lRow - 1, 2 - lCol, this.computer);
                }
                else {
                    this.choose(2 - lRow, lCol + 1, this.computer);
                    this.choose(2 - lRow, lCol - 1, this.computer);
                }
            }
            else {
                let piece = this.randomPiece();
                this.choose(piece[0], piece[1], this.computer);
            }
        },
        compSecond() {
            let lRow = this.lastMoveRow;
            let lCol = this.lastMoveCol;
            if (this.turns == 1) {
                if (lRow == 1 && lCol == 1) {
                    let corner = this.randomCorner();
                    this.choose(corner[0], corner[1], this.computer)
                }
                else {
                    this.choose(1, 1, this.computer);
                }
            }
            else if (this.turns == 3) {
                if (this.board[1][1] == this.player) {
                    let corner = this.randomCorner();
                    this.choose(corner[0], corner[1], this.computer);
                }
                else if ((lRow == 0 || lRow == 2) && (lCol == 0 || lCol == 2)) {
                    let edge = this.randomEdge();
                    this.choose(edge[0],edge[1],this.computer);
                }
                else {
                    if ((this.board[1][0] == this.player || this.board[1][2] == this.player) && lRow != 1) {
                        if (lRow == 0) this.choose(0, 2, this.computer);
                        else this.choose(2, 0, this.computer);
                    }
                    else if ((this.board[0][1] == this.player || this.board[2][1] == this.player) && lRow == 1) {
                        if (this.board[lRow][1 - 1] == this.player) this.choose(lRow - 1, lCol, this.computer);
                        else this.choose(lRow + 1, lCol, this.computer);
                    }
                    else {
                        let piece = this.randomCorner();
                        this.choose(piece[0],piece[1], this.computer);
                    }

                }
            }
            else {
                 let piece = this.randomPiece();
                this.choose(piece[0], piece[1], this.computer);
            }
        },
        computersTurn() {
            if (this.canWin(this.computer)) this.lostTheGame();
            else if (!this.canWin(this.player)) {

                //if computer goes first
                if (this.turns % 2 == 0) this.compFirst();
                //if player goes first
                else this.compSecond();
            }
            else if (this.turns == 9) this.drawnTheGame();

        },

        choose(row, col, who) {
            console.log("Who: " + who + " Row: " + row + " Col: " + col);
            if (!this.canChoose) return false;
            this.isEmpty = false;
            this.lastMoveRow = row;
            this.lastMoveCol = col;
            if (this.board[row][col] !== '') return false;
            this.board[row][col] = who;
            this.$forceUpdate();
            this.turns++;
            if (who == this.player) {
                if (this.turns == 9) this.drawnTheGame();
                this.computersTurn();
            }
            else return true;
        },

        lostTheGame() {
            this.canChoose = false;
            this.loss = true;
            this.scores.losses++;
        },

        drawnTheGame() {
            this.canChoose = false;
            this.draw = true;
            this.scores.draws++;
        }

    }

});
