/**
 * Created by Eitelkit on 3/30/15.
 */

//加载资源===========================
var load = {
    preload: function () {

        //label2 = game.add.text(Math.floor(w/2), Math.floor(h/2)-15, '加载中~', { font: '30px 微软雅黑', fill: '#fff' });
        //label2.anchor.setTo(0.5, 0.5);
        ////创建显示loading进度的sprite
        //preloading = game.add.sprite(w/2, h/2+19, 'loading');
        //preloading.x -= preloading.width/2;
        ////用setPreloadSprite方法来实现动态进度条的效果
        //game.load.setPreloadSprite(preloading);

        //load images
        game.load.image('menubg', 'images/菜单背景.jpg');
        game.load.image('background', 'images/背景.jpg');
        game.load.image('logo', 'images/标题.png');
        game.load.spritesheet('player', 'images/gundam.png', 350, 350, 1);
        game.load.image('laser', 'images/高达激光.png');
        game.load.image('enemylaserchase', 'images/敌军子弹.png');
        game.load.spritesheet('1', 'images/1.png', 350, 350, 1);
        game.load.spritesheet('2', 'images/2.png', 350, 350, 1);
        game.load.spritesheet('3', 'images/3.png', 350, 350, 1);
        game.load.spritesheet('4', 'images/4.png', 350, 350, 1);
        game.load.spritesheet('5', 'images/5.png', 350, 350, 1);
        game.load.spritesheet('explode', 'images/爆炸效果.png',133.5, 134, 12);
    },
    create: function () {
        game.state.start('menu');
    }
};

//菜单界面=========================
var menu = {

    create: function() {

        this.bg = game.add.tileSprite(0, 0, 1280, 1024, 'menubg');//1280 × 1024
        var scale = w/this.bg.width;
        this.bg.scale.x =  scale;
        this.bg.scale.y =  scale;

        //添加logo
        var logo = game.add.sprite(w/2, -150, 'logo');
        logo.anchor.setTo(0.5);
        //logo添加Tween弹出动画效果
        game.add.tween(logo).to({ y: h/2-80 }, 1000, Phaser.Easing.Bounce.Out).start();

        var label = game.add.text(w/2+50, h/2-60, '单击回车开始游戏', { font: '25px 微软雅黑', fill: ' #FF00FF' });
        label.anchor.setTo(0.5);
        label.alpha = 0;
        game.add.tween(label).delay(500).to({ alpha: 1}, 1000).start();
        game.add.tween(label).to({y: h/2+160}, 500).to({y: h/2+170}, 500).loop().start();
    },

    update: function() {
        if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            controllerType = 1;
            game.state.start('play');
        }
    }

};

//游戏界面、设置玩家血量===========================
var play = {

    create: function() {
        //playing = true;
        //Arcade物理引擎
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.time = 0;

        //add background
        this.bg = new BackgroundControl();


        //add player 初始位置，hp值
        this.playerPosition = {x:0, y: h/2};
        this.player = new Player('player', this.playerPosition, 1);//player 初始位置，hp值

        this.bg.getOriginalPos(this.player);

        //set the controller
        if (controllerType == 1)
            this.player.controller = new LeapController(this.player);

        //add enemy manager
        this.enemyManager = new EnemyManager(this.player);
        //Level Manager
        this.waveManager = new WaveManager(this.player, this.enemyManager);
        // CollisionManager
        this.collisionManager = new CollisionManager(this.player, this.enemyManager);

    },

    update: function() {
        //update background
        this.bg.update();
        //update player
        this.player.update();
        //update enemies
        this.enemyManager.update(this.player);
        //update enemy waves
        this.waveManager.update();
        // Collision
        this.collisionManager.update(this.player, this.enemyManager);
    }

};

var gameover = {

    create: function() {
        this.txt = game.add.text(w/2, -150, 'revenge', { font: '50px 微软雅黑', fill: '#fff' });
        this.txt.anchor.setTo(0.5);
        game.add.tween(this.txt).to({ y: h/2-80 }, 1000, Phaser.Easing.Bounce.Out).start();

        this.Text = game.add.text(w/2, h/2, '单击回车返回主界面', { font: '20px 微软雅黑', fill: '#fff' });
        this.Text.anchor.setTo(0.5);
        this.Text.alpha = 0;
        game.add.tween(this.Text).delay(500).to({ alpha: 1}, 1000).start();
        game.add.tween(this.Text).to({y: h/2+50}, 500).to({y: h/2+70}, 500).loop().start();

        if (status == 0) {
            this.txt.text = '~~~~~~~~~输了!';
        }
        if (status == 1) {
            this.txt.text = '恭喜~~~~~~~~~~~';
        }
    },

    update: function() {
        if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            game.state.start('menu');
        }
    }

};

var h = window.innerHeight;
var w = window.innerWidth;
var controllerType;
var status;
var game = new Phaser.Game(w, h, Phaser.CANVAS, 'canvas');

game.state.add('load', load);
game.state.add('menu', menu);
game.state.add('play', play);
game.state.add('gameover', gameover);
game.state.start('load');

