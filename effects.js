/**
* Effects occur when enemy explode
* @constructor
* @param {number} loop - denfine the number of times the animation of this effects play
*/
var BoomEffects = function(loop) {
    this.loop = loop;
    this.effects = game.add.group();
    this.effects.createMultiple(60, 'explode', false);
    this.effects.setAll('anchor.x', 0.5);
    this.effects.setAll('anchor.y', 0.5);
    this.effects.callAll('animations.add', 'animations', 'boom',[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 20, true);

    this.play = function(x, y) {
        var boom = this.effects.getFirstExists(false);
		// reset loopCount
        if (boom) {
            boom.reset(x, y);
			boom.animations.currentAnim.restart();
        }
    }
    
    this.update = function() {
       	this.effects.forEach(function(boom){
			if(boom.animations.currentAnim.loopCount == loop){
				boom.kill();
			}
    	});
        
	}	
}


/**
* Handle background controlling during the gametime
* @constructor
*/
var BackgroundControl = function() {
	this.bg = game.add.tileSprite(0, 0, 1280, 1024, 'background');//1280 × 1024
	var scale = w/this.bg.width;
	this.bg.scale.x =  scale;
	this.bg.scale.y =  scale;

	this.playerOriginPos = {};
	this.update = function() {
	}

	this.getOriginalPos = function(player) {
		this.playerOriginPos.x = player.sprite.x;
		this.playerOriginPos.y = player.sprite.y;
	}
}

/**
* Handle Collision 碰撞检测 血量更新
* @constructor
* @param player - current game player, instance of Player
* @param enemyManager - current instance of EnemyManager
*/
var CollisionManager = function(player, enemyManager) {
    this.enemyManager = enemyManager;
    this.player = player;
    this.boomEffect = new BoomEffects(1);
    
    this.update = function() {
        if (this.player && this.enemyManager) {
            game.physics.arcade.overlap(this.player.mainBullet.bullets, this.enemyManager.sprites, this.bulletHitEnemy, null, this);
            
            this.enemyManager.sprites.forEach(this.updateOperating, this, false, this.player);          
        }
        
        this.boomEffect.update();
    }
    
    this.updateOperating = function(enemy, player) {
        game.physics.arcade.overlap(player.sprite, enemy.owner.bullet.bullets, this.bulletHitPlayer, null, this);
    }
    
    this.collisionSprite = function(sprite1, sprite2) {
		return game.physics.arcade.overlap(sprite1, sprite2);
	}

    //子弹击中敌人效果：击中敌人后子弹消失 hp减少 当敌人hp=0，爆炸effect
    this.bulletHitEnemy = function(bullet, enemy) {
		if (bullet.overlap(enemy.owner.collisionSprite)) {
            enemy.owner.HP--;
            bullet.kill();
            if (enemy.y > 0) {
                if (enemy.owner.HP <= 0) {
                    enemy.kill();
                    this.boomEffect.play(enemy.x, enemy.y);
                }
				}
		}
    }

    //子弹击中玩家效果：击中玩家后子弹消失 hp减少 当玩家hp=0，输
    this.bulletHitPlayer = function(player, bullet) {
        player.owner.HP--;
        bullet.kill();
        if (player.owner.HP == 0) {
        	status = 0;
        	game.time.events.add(100, function(){
        		game.state.start('gameover');
        	});
        	
        }
    }
}
