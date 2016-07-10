var game = new Phaser.Game(800, 600, Phaser.AUTO, '',{preload: preload, create: create, update: update });        
function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/sprites/dude.png', 32, 48);
    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
}

var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;

function create() {
    //initialize Arcade physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //background for the game
    game.add.sprite(0, 0 , 'sky');

    //platforms contain the ground and and aditional two platforms
    platforms = game.add.group();

    //enable physics for any object of this group
    platforms.enableBody = true;

    //this is the ground
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //scale to fit the width to the game
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true

    //player settings

    player = game.add.sprite(32, game.world.height - 150, 'dude');
    //enable physics
    game.physics.arcade.enable(player);

    //Player physics properties
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //stars to collect
    stars = game.add.group();

    //enable physics for stars group
    stars.enableBody = true;

    for (var i=0; i < 12; i++)
    {
        //add a stat to the stars group
        var star = stars.create(i*70, 0, 'star');
        //add gravity to the star
        star.body.gravity.y = 300;

        //this give  a random bounce to each start
        star.body.bounce.y = 0.7 + Math.random()* 0.2;
    }

    //the score
    scoreText = game.add.text(16, 16, 'Score: 0',{fontSize: '32px', fill: '#000'});

    // Our controls
    cursors = game.input.keyboard.createCursorKeys();

}
function update() {
    // collide the player with the platforms
    game.physics.arcade.collide(player, platforms);
    //collide the stars with the platforms
    game.physics.arcade.collide(stars, platforms);
    //if the player overlaps with any of the stars collectStar function is call
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if  (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        player.animations.play('left');
    }

    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        player.animations.play('right');
    }

    else
    {
        player.animations.stop();
        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -450;
    }
  
}

function collectStar (player, star){
    //this remove a star from the screen
    star.kill();
    //  Add and update the score
    score += 100;
    scoreText.text = 'Score: ' + score;
}