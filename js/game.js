var config = {
  type: Phaser.AUTO,
  width : 800,
  height : 600,
  scene :{
    preload: preload,
    create: create,
    update: update
  }
};

var GameInst = new Phaser.Game(config);
GameInst.socket = io.connect();

function preload()
{
    this.load.image('BG', 'assets/BeachPartyIcon.png');
    this.load.image('SpriteChar', 'assets/SpriteChar.png');
}

function create()
{
    var sceneInst = this;

    this.playerMap = {};
    var BG = this.add.sprite(400, 300, 'BG').setInteractive();
    BG.on('pointerdown', function(pointer)
    {
      console.log("pointerdown");
      GameInst.socket.emit('click', pointer.worldX, pointer.worldY);
    });

    GameInst.socket.emit('newPlayer');

    // if server sends response of a new player being added, add it to my instance
    GameInst.socket.on('newPlayer',function(data)
    {
        addNewPlayer(data.id,data.x,data.y, sceneInst);
    });

    GameInst.socket.on('refreshAllPlayers',function(data)
    {
      for(var i = 0; i < data.length; i++)
      {
        addNewPlayer(data[i].id,data[i].x,data[i].y, sceneInst);
      }
    });

    GameInst.socket.on('remove', function(id)
    {
        removePlayer(id, sceneInst);
    });

    GameInst.socket.on('move', function(data)
    {
      console.log("moving");

      movePlayer(data.id, data.x, data.y, sceneInst);
    });
}

function movePlayer(id, targetX, targetY, sceneOwner)
{
  var targetPlayer = sceneOwner.playerMap[id];
 // var distance = Phaser.Math.distance(targetPlayer.x, targetPlayer.y, targetX, targetY);

  console.log("moving" + targetPlayer);
  sceneOwner.add.tween(
  {
    targets: targetPlayer,
    duration : 1000,
    x: targetX,
    y: targetY
  });
}

function update()
{

}

function removePlayer(id, sceneOwner)
{
  console.log("removing player");
  sceneOwner.playerMap[id].destroy();
  delete sceneOwner.playerMap[id];
}

function addNewPlayer(id,x,y, sceneOwner)
{
  console.log("adding new player to game");
  sceneOwner.playerMap[id] = sceneOwner.add.sprite(x,y,'SpriteChar');
};