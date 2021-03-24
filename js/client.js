var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function()
{
    console.log("client socket emit new player");
    Client.socket.emit('newPlayer');
}

Client.socket.on('newPlayer',function(data){
    GameInst.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allPlayers',function(data){
    console.log(data);
    for(var i = 0; i < data.length; i++){
       // GameInst.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }
});