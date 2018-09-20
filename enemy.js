/**
* Enemy of the game
* @constructor
* @param spriteName - name of sprite of enemy
* @param x - x coordinates at first loading
* @param y - y coordinates at first loading
* @param hp - hp of enemy
* @param bulletSprite - name of spirte of corresponding enemy bullet
* @param isChase - define the ability of chasing to the player of enemy bullet
* @param path - define the moving path of enemy
*/
var Enemy = function(spriteName, x, y, hp, bulletSprite, isChase, direction, path) {
	this.HP = hp;
	//add sprite
	this.sprite = game.add.sprite(x, y, spriteName);
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.anchor.set(0.5);
	this.sprite.body.allowRotation = false;
	this.sprite.animations.add('fly', [0]); //飞的时候第一个图
	this.sprite.animations.play('fly', 5, true);
	
	this.collisionSprite = this.sprite;
	this.collisionSprite.owner = this;
	this.sprite.owner = this;
	
	this.sprite.scale.x = this.sprite.scale.y = 0.5;  //enemy 图片比例
	this.sprite.owner = this;
	//bullet
	this.bullet = new EnemyBullet(bulletSprite, isChase);

	
	// Path
	this.path = path;
	//this.pathNeededToUpdate = true;
	this.direction = direction;
	this.time = 0;
};

//当
Enemy.prototype = {

	constructor: Enemy,
	
	update: function() {
		if (this.sprite.y > h - this.sprite.height/2){
			this.sprite.exists = false;
		}

	},
};

//==================================================================================================================================================================

var EnemyManager = function(owner) {
	this.owner = owner;
	this.sprites = game.add.group();
	this.sprites.enableBody = true;
    this.sprites.physicsBodyType = Phaser.Physics.ARCADE;
	this.movePathManager = new MovePathManager();
	this.STRAIGHTPATH = 0;
	this.CROSSPATH =1;
	this.isOutOfEnemies = true;
};

EnemyManager.prototype = {	

	constructor: EnemyManager,

	updateOperating: function(enemy, owner){
		if(enemy){
			enemy.owner.update();
			enemy.owner.bullet.update();
		}
		if (enemy && !enemy.exists && enemy.owner.bullet.outOfUsing) {
			this.kill(enemy);
		}
		if (enemy && !(enemy.owner.isBoss)) {
			// Only visible enemy can fire
			if (enemy.exists == true) {
				enemy.owner.bullet.fire(enemy, owner);
			}

		
			if (enemy.owner.path == this.STRAIGHTPATH) {
				this.movePathManager.straightPath(enemy);
			}else if (enemy.owner.path == this.CROSSPATH) {
				this.movePathManager.crossPath(enemy);
			}
		}
	},
		
	update: function(owner) {
		this.sprites.forEach(this.updateOperating, this, false, owner);

		if (!this.sprites.getFirstExists(true)) {
			this.isOutOfEnemies = true;
		} else {
			this.isOutOfEnemies = false;
		}
	},

	kill: function(enemy) {
		if (enemy) {
			enemy.kill();
			this.sprites.remove(enemy);
		}
	},

    //enemy1,enemy2,enemy3
	addEnemy: function(enemyNumber, x, y, bulletSprite, isChase, direction, path) {
		var enemy = new Enemy(enemyNumber, x, y, enemyNumber, bulletSprite, isChase, direction, path);
		this.sprites.add(enemy.sprite);
	},
	
	//addEnemyGroup: function(enemyNumber, x, y, bulletSprite, isChase, enemyCount, path) {
	//	if (path == this.STRAIGHTPATH) {
	//		for (var i = 0; i < enemyCount; i++) {
	//			this.addEnemy(enemyNumber, x, y - 150 * i, bulletSprite, isChase, path);
	//		}
	//	} else if (path == this.CIRCLEPATH) {
	//		for (var i = 0; i < enemyCount; i++) {
	//			this.addEnemy(enemyNumber, w / 2, y - 150 * i, bulletSprite, isChase, path);
	//		}
	//	} else if (path == this.RANDOMPATH) {
	//		for (var i = 0; i < enemyCount; i++) {
	//			this.addEnemy(enemyNumber, x + 75 + Math.floor(100 * Math.random()), y - 100 * i, bulletSprite, isChase, path);
	//		}
	//	} else if (path == this.BARPATH) {
	//		for (var i = 0; i < enemyCount; i++) {
	//			this.addEnemy(enemyNumber, x + 100 * i, y, bulletSprite, isChase, path);
	//		}
	//	}
	//
	//},
	//

};

//==================================================================================================================================================================

//定义enemy行动轨迹
var MovePathManager = function() {
    this.straightPath = function(enemy) {
        if (enemy) {
            if (enemy.x < (w / 2)) {
                enemy.body.velocity.x = -200;
                if (enemy.owner.direction === 1)
                    enemy.body.velocity.y = 200;
                else if (enemy.owner.direction === 2)
                    enemy.body.velocity.y = -20;
            } else {
                enemy.body.velocity.x = -300;
            }
        }
    }

	this.crossPath = function(enemy) {
		enemy.body.velocity.x = -200;
		if (enemy.owner.direction === 1) {
			enemy.body.velocity.y = -250;
			enemy.angle = -45;
		}
		else {
			enemy.body.velocity.y = 250;
			enemy.angle = 45;
		}		
	}
}