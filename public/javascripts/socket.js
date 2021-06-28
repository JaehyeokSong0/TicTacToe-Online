const name = prompt('이름을 입력하세요');
const socket = io();
var room = ['room1', 'room2'];
var num = 0;

var autoScroll = function () {
    var msg = document.getElementById('messages');
    $('#messages').animate({
        scrollTop: msg.scrollHeight - msg.clientHeight
    }, 0);
};

socket.emit('joinRoom', num, name);

$('select').change(() => {
    socket.emit('leaveRoom', num, name);
    num++;
    num = num % 2; //본격적인 구현 시 로직 수정 필요
    socket.emit('joinRoom', num, name);
});

$('#chat').submit((e) => {
    e.preventDefault();
    socket.emit('sendMsg', num, name, $('#chatBox').val());
    $('#chatBox').val("");
});

socket.on('sendMsg', (name, msg) => {
    $('#messages').append($('<li>').text(name + " : " + msg));
    autoScroll();
});

socket.on('joinRoom', (num, name) => {
    $('#messages').append($('<li>').text("[System] " + name + ' joined ' + room[num]));
    autoScroll();

});

socket.on('leaveRoom', (num, name) => {
    $('#messages').append($('<li>').text("[System] " + name + ' leaved ' + room[num]));
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