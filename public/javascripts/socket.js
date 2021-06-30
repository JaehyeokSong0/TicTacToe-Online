const id = prompt('이름을 입력하세요');
const socket = io();
var room = ['room1', 'room2'];
var num = 0;

var autoScroll = function () {
    var msg = document.getElementById('messages');
    $('#messages').animate({
        scrollTop: msg.scrollHeight - msg.clientHeight
    }, 0);
};

socket.emit('joinRoom', num, id);

$('select').change(() => {
    socket.emit('leaveRoom', num, id);
    num++;
    num = num % 2;
    socket.emit('joinRoom', num, id);
});

$('#startBtn').click(() => {
    socket.emit('startGame', num);
});

$('#chat').submit((e) => {
    e.preventDefault();
    socket.emit('sendMsg', num, id, $('#chatBox').val());
    $('#chatBox').val("");
});

socket.on('sendMsg', (id, msg) => {
    $('#messages').append($('<li>').text(id + " : " + msg));
    autoScroll();
});

socket.on('joinRoom', (num, id) => {
    $('#messages').append($('<li>').text("[System] " + id + ' joined ' + room[num]));
    autoScroll();
});

socket.on('leaveRoom', (num, id) => {
    $('#messages').append($('<li>').text("[System] " + id + ' leaved ' + room[num]));
    autoScroll();
    $('#startBtn').attr('disabled', true);
});

socket.on('notFullRoom', () => {
    $('#startBtn').attr('disabled', true);
    $('#messages').append($('<li>').text("[System] 상대가 없습니다. 상대가 들어올 때까지 기다려주세요."));
    autoScroll();
});

socket.on('fullRoom', () => {
    $('#startBtn').attr('disabled', false);
    $('#messages').append($('<li>').text("[System] 방이 다 찼습니다. start 버튼을 클릭해 게임을 시작해주세요."));
    autoScroll();
});

export {
    socket,
    num,
    autoScroll
};