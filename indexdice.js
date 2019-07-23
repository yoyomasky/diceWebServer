var express = require('express');
var app = express();
let router = require("./router/dice");
let path = require("path");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "static")));

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

const server = require('http').Server(app);
const io = require('socket.io')(server);
io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
io.set('origins', '*:*');
io.on('connection', function (socket) { });
app.io = io;

app.use('/', router);

console.log("正在监听8999端口");
server.listen(8999);

module.exports = { app };