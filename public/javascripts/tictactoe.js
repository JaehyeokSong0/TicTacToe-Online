var body = document.body;
var tictactoe = document.createElement('div');
tictactoe.id = "tictactoe";
var table = document.createElement('table');
var result = document.createElement('div');
result.style.textAlign = "center";
result.style.whiteSpace = "pre"
result.textContent = " ";
var cell = [];
var turn = 'O';
var turnCnt = 0;

//socket
import {
    socket,
    num,
    autoScroll
} from "./socket.js";
socket.on('startGame', () => {
    activateGame();
    $('#messages').append($('<li>').text("[System] 게임이 시작되었습니다"));
    autoScroll();
});
socket.on('clickBlock', (nRow, nCol, turn) => {
    cell[nRow][nCol].textContent = turn;
    nextTurn(checkLine(nRow,nCol));
})

// TEST CODE END
var ttt = function (e) {
    var nRow = e.target.parentNode.rowIndex;
    var nCol = e.target.cellIndex;
    if (cell[nRow][nCol].textContent === '') {
        socket.emit('clickBlock', num, nRow, nCol, turn);
        console.log(turn);
    }
}
var nextTurn = function (hasLine) {
    //줄이 만들어졌을 경우
    if (hasLine) {
        result.textContent = "Congratulation! " + turn + " Wins!";
        init();
    } else {
        if (turn === 'X') {
            turn = 'O';
        } else {
            turn = 'X';
        }
        turnCnt++;

        if (turnCnt === 9) {
            result.textContent = "Draw!";
            init();
        }
    }
}
var checkLine = function (nRow,nCol) {
    //가로줄 완성
    if (cell[nRow][0].textContent === turn &&
        cell[nRow][1].textContent === turn &&
        cell[nRow][2].textContent === turn) {
        return true;
    }
    //세로줄 완성
    else if (cell[0][nCol].textContent === turn &&
        cell[1][nCol].textContent === turn &&
        cell[2][nCol].textContent === turn) {
        return true;
    }
    //좌상우하 대각선 완성
    else if (cell[0][0].textContent === turn &&
        cell[1][1].textContent === turn &&
        cell[2][2].textContent === turn) {
        return true;
    }
    //우상좌하 대각선 완성
    else if (cell[0][2].textContent === turn &&
        cell[1][1].textContent === turn &&
        cell[2][0].textContent === turn) {
        return true;
    } else
        return false;
}
//승패가 갈리거나, 모든 칸이 꽉 차면 테이블 초기화
var init = function () {
    turn = 'O';
    turnCnt = 0;
    cell.forEach(function (row) {
        row.forEach(function (col) {
            col.textContent = '';
        });
    });
}
//테이블 생성 후 비활성화
var createTable = function (callback) {
    for (var i = 0; i < 3; i++) {
        var row = document.createElement('tr');
        cell.push([]);
        for (var j = 0; j < 3; j++) {
            var col = document.createElement('td');
            cell[i].push(col);
            row.appendChild(col);
        }
        table.appendChild(row);
    }
    callback;
}
//게임 비활성화
function deactivateGame() {
    $('td').off('click');
}
//게임 활성화
function activateGame() {
    $('td').on('click', ttt);
}
createTable(deactivateGame());
tictactoe.appendChild(table);
tictactoe.appendChild(result);
body.appendChild(tictactoe);