var game = new Phaser.Game(1000,500);

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
	create: function(){
		game.stage.backgroundColor = '#BDC2C5';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.world.enableBody = true;

		//create player
		this.player = game.add.sprite(0, game.world.height -65, box({
			length: 32,
			width: 32,
			color: '#fff'
		})
		);

		//player settings
		game.physics.arcade.enable(this.player);
    	this.player.body.bounce.y = 0.1;
    	this.player.body.gravity.y = 600;
    	this.player.body.collideWorldBounds = true;

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

		//group of enemies
		this.enemies = game.add.group();
		this.enemies.enableBody = true;

		var enemy1 = this.enemies.create(game.world.width - 500, game.world.height - 65, 
			box({
				length: 32,
				width: 32,
				color: '#A96262'
			})
			);
		//add gravity and bounce to enemy
        enemy1.body.gravity.y = 300;
        enemy1.body.bounce.y = 0.7 + Math.random()* 0.2;

		var enemy2 = this.enemies.create(game.world.width - 300, game.world.height - 65, 
			box({
				length: 32,
				width: 32,
				color: '#A96262'
			})
			);

		//add gravity and bounce to enemy
        enemy2.body.gravity.y = 300;
        enemy2.body.bounce.y = 0.7 + Math.random()* 0.2;			
	},

	update: function(){

		var speed = 250;
		//enable collision between player and walls
		game.physics.arcade.collide(this.player, this.walls);

		//enable collision between enemies and walls
		game.physics.arcade.collide(this.enemies, this.walls);

		//player death if touch an enemy
		game.physics.arcade.collide(this.player, this.enemies, 
			this.handlePlayerDeath, null, this);
		
		//player movements
		this.player.body.velocity.x = 0;

		if (this.cursor.up.isDown && this.player.body.touching.down){
			this.player.body.velocity.y = -450;
		}
		else if (this.cursor.left.isDown){
			this.player.body.velocity.x -= speed;
		}
		else if (this.cursor.right.isDown){
			this.player.body.velocity.x += speed; 
		}

	},

	handlePlayerDeath: function(player, enemy){
		player.kill();
		game.state.start('gameOver');
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

game.state.add('main', mainState);
game.state.add('gameOver', gameOverState);
game.state.start('main');