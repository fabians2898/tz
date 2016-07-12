var game = new Phaser.Game(1000,500);
var score;

//create a generic box, works nice for prototyping
var box = function(options){
	var bmd = game.add.bitmapData(options.length, options.width);
	bmd.ctx.beginPath();
	bmd.ctx.rect(0, 0, options.length, options.width);
	bmd.ctx.fillStyle = options.color;
	bmd.ctx.fill();
	return bmd;
};

var mainState ={
	preload: function(){
		game.load.spritesheet('player','assets/sprites/player.png', 25, 32);
	},
	create: function(){
		score = 0;
		game.stage.backgroundColor = '#BDC2C5';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.world.enableBody = true;

		//create player
		//this.player = game.add.sprite(0, game.world.height -65, box({
		//	length: 32,
		//	width: 32,
		//	color: '#fff'
		//})
		//);
		this.player = game.add.sprite(0, game.world.height - 65, 'player'),

		//player settings
		game.physics.arcade.enable(this.player);
    	this.player.body.bounce.y = 0.1;
    	this.player.body.gravity.y = 600;
    	this.player.body.collideWorldBounds = true;
    	this.player.animations.add('left', [6, 5, 4, 3, 2, 1, 0], 10, true);
        this.player.animations.add('right', [7, 8, 9, 10, 11, 12, 13], 10, true);

		//create cursor object
		this.cursor = game.input.keyboard.createCursorKeys();

		//group of walls
		this.walls = game.add.group();
		this.walls.enableBody = true;

		var bottom = this.walls.create(0, game.world.height -16, 
			box({
				length: game.world.width,
				width: 20,
				color: '#374A59'
			})
			);
		bottom.body.immovable = true;

		var platform1 = this.walls.create(0, game.world.height - 400, 
			box({
				length: 200,
				width: 30,
				color: '#374A59'
			})
			);
		platform1.body.immovable = true;

		var platform2 = this.walls.create(game.world.width - 600, game.world.height - 360, 
			box({
				length: 350,
				width: 30,
				color: '#374A59'
			})
			);
		platform2.body.immovable = true;

		var platform3 = this.walls.create(game.world.width - 100, game.world.height - 200, 
			box({
				length: 100,
				width: 30,
				color: '#374A59'
			})
			);
		platform3.body.immovable = true;

		var wall1 = this.walls.create(game.world.width - 850, game.world.height - 65, 
			box({
				length: 100,
				width: 100,
				color: '#374A59'
			})
			);
		wall1.body.immovable = true;

		var wall2 = this.walls.create(game.world.width - 450, game.world.height - 65, 
			box({
				length: 100,
				width: 100,
				color: '#374A59'
			})
			);
		wall2.body.immovable = true;

		var wall3 = this.walls.create(game.world.width -20, 0, 
			box({
				length: 20,
				width: game.world.height,
				color: '#374A59'
			})
			);
		wall3.body.immovable = true;

		//group of enemies
		this.enemies = game.add.group();
		this.enemies.enableBody = true;

		this.enemy1 = this.enemies.create(game.world.width - 500, game.world.height - 65, 
			box({
				length: 32,
				width: 32,
				color: '#A96262'
			})
			);
		//add gravity and bounce to enemy
        this.enemy1.body.gravity.y = 300;
        this.enemy1.body.bounce.y = 1;
        this.enemy1.body.velocity.x = 150;	

		this.enemy2 = this.enemies.create(game.world.width - 300, game.world.height - 65, 
			box({
				length: 32,
				width: 32,
				color: '#A96262'
			})
			);

		//add gravity and bounce to enemy
        this.enemy2.body.gravity.y = 300;
        this.enemy2.body.bounce.y = 1;	
        this.enemy2.body.velocity.x = 150;

        //group rewards
        this.rewards = game.add.group()
        this.rewards.enableBody = true;

        for (var i =0; i<=10; i++ ){
        	var reward = this.rewards.create(i*250, 0, box({
				length: 32,
				width: 32,
				color: '#000'
			}));
	        reward.body.gravity.y = 300;
	        reward.body.bounce.y = 0.5;
        }

        //the score
    	this.scoreText = game.add.text(16, 16, 'Score: 0',{fontSize: '32px', fill: '#000'});		
	},

	update: function(){

		var speed = 150;
		if (score >= 400){
			game.state.start('youWin');
		}
		//enable collision between player and walls
		game.physics.arcade.collide(this.player, this.walls);

		//enable collision between enemies and walls
		game.physics.arcade.collide(this.enemies, this.walls);

		//enable collision between rewards and walls
		game.physics.arcade.collide(this.rewards, this.walls);

		//player death if touch an enemy
		game.physics.arcade.collide(this.player, this.enemies, 
			this.handlePlayerDeath, null, this);

		game.physics.arcade.collide(this.player, this.rewards,
			this.collectRewards, null, this);
		
		//player movements
		this.player.body.velocity.x = 0;

		if (this.cursor.up.isDown && this.player.body.touching.down){
			this.player.body.velocity.y = -450;
		}
		else if (this.cursor.left.isDown){
			this.player.body.velocity.x -= speed;
			this.player.animations.play('left');
		}
		else if (this.cursor.right.isDown){
			this.player.body.velocity.x += speed;
			this.player.animations.play('right'); 
		}
		 else
	    {
	        this.player.animations.stop();
	        this.player.frame = 6;
	    }

		//enemies movements

		if (this.enemy1.body.touching.right){
			this.enemy1.body.velocity.x = -150;
		}

		else if (this.enemy1.body.touching.left){
			this.enemy1.body.velocity.x = 150;
		}

		if (this.enemy2.body.touching.right){
			this.enemy2.body.velocity.x = -150;
		}

		else if (this.enemy2.body.touching.left){
			this.enemy2.body.velocity.x = 150;
		}
	},

	handlePlayerDeath: function(player, enemy){
		player.kill();
		game.state.start('gameOver');
	},

	collectRewards: function(player, reward){
		reward.kill();
		score += 100;
    	this.scoreText.text = 'Score: ' + score;
	}
};

var gameOverState ={
	create: function(){
		this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		label = game.add.text(game.world.width / 2, game.world.height / 2,
			'GAME OVER\nPress SPACE to restart',
			{
				font: '22px Arial',
				fill: '#fff',
				align: 'center'
			}
		),
		label.anchor.setTo(0.5, 0.5);
	},
	update: function(){
		if (this.spacebar.isDown)
		{	
			game.state.start('main');
		}

	}

};

var youWin ={
	create: function(){
		this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		label = game.add.text(game.world.width / 2, game.world.height / 2,
			'YOU WIN\nPress SPACE to restart',
			{
				font: '22px Arial',
				fill: '#fff',
				align: 'center'
			}
		),
		label.anchor.setTo(0.5, 0.5);
	},
	update: function(){
		if (this.spacebar.isDown)
		{
			game.state.start('main');
		}

	}

};


game.state.add('main', mainState);
game.state.add('gameOver', gameOverState);
game.state.add('youWin', youWin);
game.state.start('main');