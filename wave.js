var WaveManager = function (player, enemyManager) {
    this.enemyManager = enemyManager;
    this.player = player;
    this.currentWave = 1;
    this.requestNextWave = false;
    this.requested = false;

};

WaveManager.prototype = {
    constructor: WaveManager,
    update: function () {
        //如果一波敌军被玩家打完了，或者出界面了则下一波
        if (this.enemyManager.isOutOfEnemies && !this.requested) {
                this.requestNextWave = true;
        }

        if (this.requestNextWave) {
            this.requestNextWave = false;
            this.requested = true;
            game.time.events.add(1000, function () {


                switch (this.currentWave) {
                    case 1:this.wave_1();break;
                    case 2:this.wave_2();break;
                    case 3:this.wave_3();break;
                    case 4:this.wave_4();break;
                    case 5:this.wave_5();break;
                    //case 6:this.wave_6();break;
                    //case 7:this.wave_7();break;
                    //case 8:this.wave_8();break;
                    //case 9:this.wave_9();break;
                    default:status = 1; //win
                        game.time.events.add(1000, function () {
                            game.state.start('gameover');
                        });
                        break;
                }
                this.currentWave++;
                this.requested = false;
            }, this);
        }

    },

    //addEnemy: function (type, path, count) {
    //    if (type < 3) {
    //        ////addEnemyGroup: function(enemyNumber, x, y, bulletSprite, isChase, enemyCount, path)
    //        this.enemyManager.addEnemyGroup(type, 400, 50, 'enemylaserunchase', false, count, path);
    //    }
    //    // else {
    //    ////    this.enemyManager.addEnemyGroup(type, 400, 50, 'enemylaserchase', true, count, path);
    //    ////}
    //},

    wave_1: function () {
        for (var i = 0; i < 2; i++) { //2个
            //addEnemy: function(enemyNumber, x, y, bulletSprite, isChase, direction, path) enemyNumber 是第几个enemy的图
            this.enemyManager.addEnemy(1, w, h/2, 'enemylaserchase', true, 1, this.enemyManager.STRAIGHTPATH);
        }
    },

    wave_2: function () {
            this.enemyManager.addEnemy(2, w, h/4, 'enemylaserchase', true, 1, this.enemyManager.STRAIGHTPATH);
            this.enemyManager.addEnemy(2, w, 3*h/4, 'enemylaserchase', true, 1, this.enemyManager.STRAIGHTPATH);
    },
    wave_3: function () {
        this.enemyManager.addEnemy(1, w, h/4, 'enemylaserchase', true, 1, this.enemyManager.STRAIGHTPATH);
        this.enemyManager.addEnemy(2, w, h/2, 'enemylaserchase', true, 1, this.enemyManager.STRAIGHTPATH);
        this.enemyManager.addEnemy(3, w, 3*h/4, 'enemylaserchase', true, 1, this.enemyManager.STRAIGHTPATH);
    },

    wave_4: function () {
        for (var i = 0; i < 5; i++) {
                this.enemyManager.addEnemy(i+1, 150 * i,h - (200 * i - 50), 'enemylaserchase', true, 2, this.enemyManager.CROSSPATH);
        }
    },

    wave_5: function () {

        for (var i = 1; i < 5; i++) {
            this.enemyManager.addEnemy(i, w, h/4*i, 'enemylaserchase', true, 1, this.enemyManager.STRAIGHTPATH);
            this.enemyManager.addEnemy(2, w, h/2, 'enemylaserchase', true, 1, this.enemyManager.STRAIGHTPATH);
            this.enemyManager.addEnemy(3, w, 3*h/4, 'enemylaserchase', true, 1, this.enemyManager.STRAIGHTPATH);
        }
    },

    //wave_6: function () {
    //    var type = (Math.floor(this.currentWave / 2) + 1) % 5 + 1;
    //    for (var i = 0; i < 3; i++) {
    //        if (type < 3) {
    //            this.enemyManager.addEnemy(type, -100 * i, -150 * i, 'enemylaserunchase', false, 1, this.enemyManager.CROSSPATH);
    //            this.enemyManager.addEnemy(type, w - (-100 * i), -150 * i - 75, 'enemylaserunchase', false, 2, this.enemyManager.CROSSPATH);
    //        }
    //        //else {
    //        //    this.enemyManager.addEnemy(type, -100 * i, -150 * i, 'enemylaserchase', true, 1, this.enemyManager.CROSSPATH);
    //        //    this.enemyManager.addEnemy(type, w - (-100 * i), -150 * i - 75, 'enemylaserchase', true, 2, this.enemyManager.CROSSPATH);
    //        //}
    //    }
    //},
    //
    //wave_7: function () {
    //    //var type = Math.floor(Math.random() * 5) + 1;
    //    for (var i = 0; i < 5; i++) {
    //        if (type < 3) {
    //            this.enemyManager.addEnemy(type, Math.random() * (w - 150) + 150, Math.random() * (-200) - 50, 'enemylaserunchase', false, 1, this.enemyManager.RANDOMPATH);
    //        }
    //        //else {
    //        //    this.enemyManager.addEnemy(type, Math.random() * (w - 150) + 150, Math.random() * (-200) - 50, 'enemylaserchase', true, 1, this.enemyManager.RANDOMPATH);
    //        //}
    //    }
    //},
    //
    //wave_8: function () {
    //    var type = (Math.floor(this.currentWave / 2) + 1) % 5 + 1;
    //    if (type < 3) {
    //        this.enemyManager.addEnemy(type, w / 2, 0, 'enemylaserunchase', false, 5, this.enemyManager.STRAIGHTPATH);
    //        this.enemyManager.addEnemy(type, w / 2 - 150, -200, 'enemylaserunchase', false, 5, this.enemyManager.STRAIGHTPATH);
    //        this.enemyManager.addEnemy(type, w / 2 + 150, -200, 'enemylaserunchase', false, 5, this.enemyManager.STRAIGHTPATH);
    //        this.enemyManager.addEnemy(type, w / 2 - 75, -460, 'enemylaserunchase', false, 5, this.enemyManager.STRAIGHTPATH);
    //        this.enemyManager.addEnemy(type, w / 2 + 75, -460, 'enemylaserunchase', false, 5, this.enemyManager.STRAIGHTPATH);
    //    }
    //    //else {
    //    //    this.enemyManager.addEnemy(type, w / 2, 0, 'enemylaserchase', true, 5, this.enemyManager.STRAIGHTPATH);
    //    //    this.enemyManager.addEnemy(type, w / 2 - 150, -200, 'enemylaserchase', true, 5, this.enemyManager.STRAIGHTPATH);
    //    //    this.enemyManager.addEnemy(type, w / 2 + 150, -200, 'enemylaserchase', true, 5, this.enemyManager.STRAIGHTPATH);
    //    //    this.enemyManager.addEnemy(type, w / 2 - 75, -460, 'enemylaserchase', true, 5, this.enemyManager.STRAIGHTPATH);
    //    //    this.enemyManager.addEnemy(type, w / 2 + 75, -460, 'enemylaserchase', true, 5, this.enemyManager.STRAIGHTPATH);
    //    //}
    //
    //    for (var i = 0; i < 5; i++) {
    //        this.enemyManager.sprites.getAt(i).owner.HP = 10;  //enemy hp 10
    //    }
    //
    //},
    //
    //wave_9: function () {
    //    var type = (Math.floor(this.currentWave / 2) + 1) % 5 + 1;
    //    this.wave_8();
    //    for (var i = 0; i < 5; i++) {
    //        if (type < 3) {
    //            this.enemyManager.addEnemy(type, w / 2, -200 * i, 'enemylaserunchase', false, 3, this.enemyManager.CIRCLEPATH);
    //        }
    //    //    else
    //    //        this.enemyManager.addEnemy(type, w / 2, -200 * i, 'enemylaserchase', true, 3, this.enemyManager.CIRCLEPATH);
    //    }
    //}
};
