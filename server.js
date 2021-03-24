var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.listen(8081,function(){ // Listens to port 8081
  console.log('Listening on '+server.address().port);
});


server.lastPlayderID = 0; // Keep track of the last id assigned to a new player

io.on('connection',function(socket)
{
    socket.on('newPlayer',function()
    {
      console.log("server got a new player");

        socket.player = 
        {
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };

        // send a message to 1 specific socket
        // newly connected socket/player will have up to date info about other players
        socket.emit('refreshAllPlayers',getAllPlayers());

        // set message to all connected sockets, except the socket that triggered this
        // other sockets now know about the new player
        socket.broadcast.emit('newPlayer',socket.player);

        socket.on('disconnect', function()
        {
          console.log("disconnect");
          // send to all connected clients
          io.emit('remove', socket.player.id);
        });

        socket.on('click', function(x, y)
        {
            console.log("server receive click");
            console.log('click Detected' + x + ',' + y);
            socket.player.x = x;
            socket.player.y = y;

            io.emit('move', socket.player);
        });

    });
});

function getAllPlayers(){
  var players = [];
  Object.keys(io.sockets.connected).forEach(function(socketID){
      var player = io.sockets.connected[socketID].player;
      if(player) players.push(player);
  });

  console.log(players);

  return players;
}

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}