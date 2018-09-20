/**
* Abstract class contains main attributes and method of a bullet
* @constructor
* @param {string} spriteName - references to name of bullet image file was loaded in load.js
* @param {owner} owner - references to currently owner
*/
var Bullet = function(spriteName, owner) {
	this.owner = owner;

	// Sprite settings
	this.bullets = game.add.group();//用于存放子弹的组
	this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE; //子弹启动arcade物理引擎
    this.bullets.createMultiple(120, spriteName); //包含120个子弹的组
    this.bullets.setAll('outOfBoundsKill', true);//出边界后自动kill
    this.bullets.setAll('checkWorldBounds', true);//出边界检测
    //this.bullets.createMultiple(a,b,c,d,e).group
    this.bullets.setAll('anchor.x', 0.5); //set Sprite.anchor to 0.5 so the physics body is centered on the Sprite~
    this.bullets.setAll('anchor.y', 1);
    this.bulletTime = 0;
};

Bullet.prototype = {
	constructor: Bullet,

	update: function() {
		this.additionalUpdate();
		game.world.bringToTop(this.bullets);

	},

	additionalUpdate: function() {
        //遍历子弹当子弹出了游戏窗口，自动kill
		this.bullets.forEach(function(bullet) {
			if (bullet.x > w || bullet.x < 0 || bullet.y > h || bullet.y < 0) {
				bullet.kill();  //   enemyManager

			}
		});
	},

	fire: function() {
        //为了防止开火太快，设置时间限制
		if (game.time.now > this.bulletTime)
		{
			//  Grab the first bullet we can from the pool
			var bullet = this.bullets.getFirstExists(false);

			if (bullet)
			{
				//  And fire it
				bullet.reset(this.owner.x, this.owner.y); //bullet的发射位置在owner
				//bullet.body.velocity.y = -100;//设置y方向速度-800，即向上发射子弹
                bullet.body.velocity.x = 800;
			}
		}
	}
};

/**
* Mainbullet of owner. It inheritances from Bullet class
* @constructor
* @param {string} spriteName - references to name of bullet image file was loaded in load.js
* @param {owner} owner - references to currently owner
*/
var Laser = function(spriteName, owner) {
	Bullet.call(this, spriteName, owner);
};

Laser.prototype = Object.create(Bullet.prototype);

////关于level的大概可以删
//Laser.prototype.setLevel = function(level) {
//	this.level = level;
//};

//发射lazer
Laser.prototype.fireLazer = function() {
    //不要 Get the first dead pipe of our group
	var bullet = this.bullets.getFirstDead(false);
	if (bullet)
	{
        //重设子弹的position owner的x，owner的height的地方发射子弹
		bullet.reset(this.owner.sprite.x + this.owner.sprite.width/2, this.owner.sprite.y);
		//bullet.body.velocity.y = -800; //设置y方向速度-800，即向上发射子弹
        bullet.body.velocity.x = 800;
	}
};


// level1的时候fireone 1颗子弹，2时2颗。。。
Laser.prototype.fire = function() {
	 //  To avoid them being allowed to fire too fast we set a time limit
	if (game.time.now > this.bulletTime)
	{
			this.fireLazer();
		this.bulletTime = game.time.now + 100;
	}
};

/**
* Enemy weapon
* @constructor
* @param {string} spriteName - corresponding name of image file was loaded in loadState
* @param {boolean} isChase - the ability of chasing.
*/
var EnemyBullet = function(spriteName, isChase) {
	this.isChase = isChase;
	// Sprite settings
	this.bullets = game.add.group(); //用于存放子弹的组
	this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(60, spriteName);//子弹60个组
    this.bullets.setAll('anchor.x', 0.5)	;
    this.bullets.setAll('anchor.y', 0);
    this.bullets.setAll('outOfBoundsKill', true);//子弹出边界自动kill
    this.bullets.setAll('checkWorldBounds', true);//出边界检测
	this.bulletTime = game.time.now + 1000;
	// Collsion Handler
	this.outOfUsing = false;
}

EnemyBullet.prototype = {
	fire: function(enemy, target) {
		 //  To avoid them being allowed to fire too fast we set a time limit
		if (game.time.now > this.bulletTime)
		{
			//  Grab the first bullet we can from the pool
			var bullet = this.bullets.getFirstDead(false);
			if (bullet)
			{
				game.physics.enable(bullet, Phaser.Physics.ARCADE);
				//  And fire it
				bullet.reset(enemy.x, enemy.y);
				if (this.isChase)//追踪子弹！！！！！！！！！！！！！
                //moveToObject(displayObject, destination, speed, maxTime)返回值是number， radiation弧度
					bullet.rotation = game.physics.arcade.moveToObject(bullet, target.sprite, 10, Math.floor(1000 + Math.random() * 1000));
				else
					bullet.body.velocity.y = 800;//!!!!!!!!!!!!!!!!!!
				this.bulletTime = game.time.now + 1000;
			}
			
		}
	},
	
	update: function() {
		if (!this.bullets.getFirstExists(true)) {
			this.outOfUsing = true;
		} else this.outOfUsing = false;
	}
}
