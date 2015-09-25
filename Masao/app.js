var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var States;
    (function (States) {
        var GameState = (function (_super) {
            __extends(GameState, _super);
            function GameState() {
                _super.apply(this, arguments);
            }
            return GameState;
        })(States.AbstractState);
        States.GameState = GameState;
        var Preload = (function (_super) {
            __extends(Preload, _super);
            function Preload() {
                _super.apply(this, arguments);
            }
            Preload.prototype.enter = function (sm) {
                var assets = sm.game.assets;
                assets.image.regist_image("title", "title.gif");
                assets.image.regist_image("gameover", "gameover.gif");
                assets.image.regist_image("ending", "ending.gif");
                assets.image.regist_pattern("pattern", "pattern.gif", 32, 32);
                assets.load();
            };
            Preload.prototype.update = function (sm) {
                var loader = sm.game.assets.loader;
                if (loader.state == 2 /* NOTHING2LOAD */) {
                    sm.replace(new States.Title());
                }
            };
            return Preload;
        })(GameState);
        States.Preload = Preload;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="./out.d.ts"/>
/// <reference path="./src/states/preload.ts"/>
var game;
window.onload = function () {
    var el = document.getElementById('content');
    var map = [
        "aa..........................................................",
        "a...........................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................999.............",
        "............................................999.............",
        "............................................................",
        "............................................aaa.............",
        "............................................................",
        "........G...................................................",
        "a...aa.aaa.....................99...........................",
        "aa.aaa.......................................aa.............",
        "a...6..a.a...................................a..............",
        "a..5...............J........................................",
        "a.aaaaa.aaa....H.I..12.....9P9...aaa.....aa.aaaaaaaa...12...",
        "a....aa.a..A..............aaaaa..............9.aaaaa........",
        "aaaa..C.aaaaaa......aa..................B...aaaaaaaa........",
        "8....a5aa...............R...........aaaaa...9.9aa999........",
        "..aaaaaa7...........................9.9.9...aaaaaaaa........",
        "...........aaaaaa..aaaaaa....................9.aaaaa........",
        "...333....aaaaaaa..aaaaaa...Q........D......aaaaaaaa........",
        "bbbbbbbbbbbbbbbbb..bbbbbb.bbbbbbbbbbbbbbbbbbbbbbbbbb5bbbbbb.",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "...12....12.....12.....12....12....12.......................",
        "............................................................",
        "............................................................",
        "...................O........................................",
        ".................aaaa...................feef................",
        ".............aaaaaaaaaaa................e..e..............E.",
        ".....P....O..aaaaaaaaaaa.O.....O........feefeef..feeeefeeeef",
        "..bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.......e..e..e..e....e....e",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "........................................................8...",
        "..................99........12.....12....12....12.......a...",
        "..................dd...................................aaa..",
        "..e.ef...................9.9.9.9......................aaaaa.",
        "..e..e.............................................F.aaaaaaa",
        "..e..e.......E..............................aaaaaaaaaaaaaaaa",
        "..e..e.feeefeeef..99...................F....aaaaaaaaaaaaaaaa",
        "..feef.e...e...e..dd...aaaaaaaaaaaaaaaaaaa..aaaaaaaaaaaaaaaa"
    ];
    var images = {
        "gameover": "gameover.gif",
        "ending": "ending.gif",
        "title": "title.gif",
        "pattern": "pattern.gif"
    };
    game = new Game.Game({ map: map, images: images });
    game.setparent(el);
    game.start(new Game.States.Preload());
};
var Game;
(function (Game) {
    var AbstractEntity = (function (_super) {
        __extends(AbstractEntity, _super);
        function AbstractEntity(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, 0, dx, dy);
            this.counter = {};
            this.flags = {};
            this.flags["isAlive"] = true;
            this.z = 256;
        }
        AbstractEntity.prototype.update = function () {
            if (this.moving)
                this.moving.update();
        };
        return AbstractEntity;
    })(Game.Sprite);
    Game.AbstractEntity = AbstractEntity;
    var EntityStateMachine = (function (_super) {
        __extends(EntityStateMachine, _super);
        function EntityStateMachine(e, parent) {
            if (parent === void 0) { parent = null; }
            _super.call(this, parent);
            this.e = e;
        }
        return EntityStateMachine;
    })(Game.StateMachine);
    Game.EntityStateMachine = EntityStateMachine;
})(Game || (Game = {}));
/// <reference path="entity.ts"/>
var Game;
(function (Game) {
    var AbstractBlock = (function (_super) {
        __extends(AbstractBlock, _super);
        function AbstractBlock(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, dx, dy);
            this.z = 512;
            this.initPatternCode();
            //this.addEventHandler("onhit", this.onHit);
        }
        // to be overridden
        AbstractBlock.prototype.initPatternCode = function () {
            this.code = 0;
        };
        return AbstractBlock;
    })(Game.AbstractEntity);
    Game.AbstractBlock = AbstractBlock;
    var Block1 = (function (_super) {
        __extends(Block1, _super);
        function Block1() {
            _super.apply(this, arguments);
        }
        Block1.prototype.initPatternCode = function () {
            this.code = 20;
        };
        return Block1;
    })(AbstractBlock);
    Game.Block1 = Block1;
    var Block2 = (function (_super) {
        __extends(Block2, _super);
        function Block2() {
            _super.apply(this, arguments);
        }
        Block2.prototype.initPatternCode = function () {
            this.code = 21;
        };
        return Block2;
    })(AbstractBlock);
    Game.Block2 = Block2;
    var Block3 = (function (_super) {
        __extends(Block3, _super);
        function Block3() {
            _super.apply(this, arguments);
        }
        Block3.prototype.initPatternCode = function () {
            this.code = 22;
        };
        return Block3;
    })(AbstractBlock);
    Game.Block3 = Block3;
    var Block4 = (function (_super) {
        __extends(Block4, _super);
        function Block4() {
            _super.apply(this, arguments);
        }
        Block4.prototype.initPatternCode = function () {
            this.code = 23;
        };
        return Block4;
    })(AbstractBlock);
    Game.Block4 = Block4;
    var Block5 = (function (_super) {
        __extends(Block5, _super);
        function Block5() {
            _super.apply(this, arguments);
        }
        Block5.prototype.initPatternCode = function () {
            this.code = 24;
        };
        return Block5;
    })(AbstractBlock);
    Game.Block5 = Block5;
    var Block6 = (function (_super) {
        __extends(Block6, _super);
        function Block6() {
            _super.apply(this, arguments);
        }
        Block6.prototype.initPatternCode = function () {
            this.code = 25;
        };
        return Block6;
    })(AbstractBlock);
    Game.Block6 = Block6;
})(Game || (Game = {}));
/// <reference path="entity.ts"/>
var Game;
(function (Game) {
    var AbstractEnemy = (function (_super) {
        __extends(AbstractEnemy, _super);
        function AbstractEnemy(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, dx, dy);
            this.z = 256;
            this.counter["ac"] = 0;
            this.flags["isActivated"] = false;
            this.flags["isOnGround"] = false;
            this.counter["viewx_activate"] = Math.floor(x / this.width) * this.width - Game.SCREEN_WIDTH - this.width;
            this.addEventHandler("onground", this.onGround);
        }
        AbstractEnemy.prototype.onGround = function (e) {
            this.flags["isOnGround"] = true;
        };
        AbstractEnemy.prototype.update = function () {
            var players = this.ss.Players.get_all();
            // プレイヤーより大幅に左側にいる場合、処理を行わない
            var flg = false;
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                if (this.x >= p.view_x - Game.SCREEN_WIDTH) {
                    flg = true;
                    break;
                }
            }
            if (!flg)
                return;
            if (!this.flags["isActivated"]) {
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (p.view_x >= this.counter["viewx_activate"]) {
                        this.flags["isActivated"] = true;
                        break;
                    }
                }
                if (!this.flags["isActivated"])
                    return;
                else {
                    this.update();
                }
            }
            if (this.moving)
                this.moving.update();
            this.move();
        };
        AbstractEnemy.prototype.move = function () {
            this.x += this.vx / 10;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            this.y += this.vy / 10;
            this.checkCollisionWithBlocksVertical(); // 接触判定
        };
        AbstractEnemy.prototype.checkCollisionWithBlocksVertical = function () {
            this.flags["isOnGround"] = false;
            // check
            var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height + 1); // 足元+1ピクセルも含めて取得
            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                var bc = b.getCollision();
                var col = this.getRect();
                if (this.vy < 0) {
                    // up
                    if (col.collision(bc) && !(new Game.Rect(this.x, this.bottom, this.width, 0).collision(bc))) {
                        this.y = b.bottom;
                        this.vy = 0;
                    }
                }
                else if (this.vy >= 0) {
                    // down || //
                    if (col.collision(bc) && !(new Game.Rect(this.x, this.y, this.width, 0).collision(bc))) {
                        this.dispatchEvent(new Game.Event("onground"));
                        this.bottom = b.y;
                        this.vy = 0;
                    }
                }
            }
        };
        AbstractEnemy.prototype.checkCollisionWithBlocksHorizontal = function () {
            // check
            var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height);
            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                var bc = b.getCollision();
                var col = this.getRect();
                if (this.vx > 0) {
                    // right
                    if (col.collision(bc)) {
                        this.right = b.x;
                        this.vx = 0;
                        this.reverse_horizontal = !this.reverse_horizontal;
                    }
                }
                else if (this.vx < 0) {
                    // left
                    if (col.collision(bc)) {
                        this.x = b.right;
                        this.vx = 0;
                        this.reverse_horizontal = !this.reverse_horizontal;
                    }
                }
            }
        };
        return AbstractEnemy;
    })(Game.AbstractEntity);
    Game.AbstractEnemy = AbstractEnemy;
    var States;
    (function (States) {
        var AbstractStampableAlive = (function (_super) {
            __extends(AbstractStampableAlive, _super);
            function AbstractStampableAlive() {
                _super.apply(this, arguments);
            }
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            AbstractStampableAlive.prototype.checkCollisionWithPlayer = function (sm) {
                var e = sm.e;
                var players = sm.e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            var dy = Math.abs(e.y - p.y); // プレイヤーとのy座標の差
                            if (p.flags["isAlive"] && dx < 30 && dy < 23) {
                                if (dx < 27 && p.vy > 0 || (p.flags["isStamping"] && p.counter["stamp_waiting"] == 5)) {
                                    e.dispatchEvent(new Game.SpriteCollisionEvent("onstamped", p));
                                    p.y = e.y - 12;
                                    p.dispatchEvent(new Game.NumberEvent("onstamp", 1));
                                    e.addOnceEventHandler("killed", function () {
                                        p.dispatchEvent(new Game.ScoreEvent("addscore", 10));
                                    });
                                }
                                else {
                                    p.dispatchEvent(new Game.PlayerMissEvent("miss", 1));
                                }
                            }
                        });
                    })(p);
                }
            };
            return AbstractStampableAlive;
        })(States.AbstractState);
        States.AbstractStampableAlive = AbstractStampableAlive;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="enemy.ts"/>
var Game;
(function (Game) {
    var Bomber = (function (_super) {
        __extends(Bomber, _super);
        function Bomber(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.FlierFlyingHorizontal());
            this.addEventHandler("onstamped", this.onStamped);
        }
        Bomber.prototype.onStamped = function (e) {
            if (this.flags["isAlive"])
                this.moving.replace(new States.BomberStamped());
            this.vx = 0;
            this.vy = 0;
        };
        Bomber.prototype.move = function () {
            this.x += this.vx / 10;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            this.y += this.vy / 10;
        };
        Bomber.prototype.checkCollisionWithBlocksHorizontal = function () {
            // check
            if (this.vx > 0) {
                // right
                var blocks = this.ss.getBlocks(this.x + this.width, this.y, this.width, this.height); // 右寄りに取得
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    if (new Game.Point(this.centerx + this.width - 1, this.bottom - 1).collision(bc)) {
                        this.right = b.x - 16;
                        this.vx = 0;
                        this.reverse_horizontal = !this.reverse_horizontal;
                    }
                }
            }
            else if (this.vx < 0) {
                // left
                var blocks = this.ss.getBlocks(this.x - this.width, this.y, this.width, this.height); // 左寄りに取得
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    if (new Game.Point(this.centerx - this.width, this.bottom - 1).collision(bc)) {
                        this.x = b.right + 16;
                        this.vx = 0;
                        this.reverse_horizontal = !this.reverse_horizontal;
                    }
                }
            }
        };
        return Bomber;
    })(Game.AbstractEnemy);
    Game.Bomber = Bomber;
    var BomberWithoutReturn = (function (_super) {
        __extends(BomberWithoutReturn, _super);
        function BomberWithoutReturn(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.BomberFlyingWithoutReturn());
        }
        BomberWithoutReturn.prototype.move = function () {
            // 接触判定を行わない
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        };
        return BomberWithoutReturn;
    })(Bomber);
    Game.BomberWithoutReturn = BomberWithoutReturn;
    var States;
    (function (States) {
        var BomberFlyingWithoutReturn = (function (_super) {
            __extends(BomberFlyingWithoutReturn, _super);
            function BomberFlyingWithoutReturn() {
                _super.apply(this, arguments);
            }
            BomberFlyingWithoutReturn.prototype.enter = function (sm) {
            };
            BomberFlyingWithoutReturn.prototype.update = function (sm) {
                var e = sm.e;
                e.code = 164;
                if (e.counter["ac"] >= 0) {
                    e.vx = -40;
                    e.counter["ac"] += 1;
                    if (e.counter["ac"] == 1) {
                        // 爆撃
                        var attack = new BombLeft(e.x, e.y + 19, e.imagemanager, e.label);
                        e.ss.add(attack);
                    }
                    else if (e.counter["ac"] > 26) {
                        e.counter["ac"] = 0;
                    }
                }
                var blocks = e.ss.getBlocks(e.x + e.vx / 10, e.y, e.width, e.height);
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    if (new Game.Point(e.x + e.vx / 10, e.bottom - 1).collision(bc)) {
                        e.x = b.right;
                        e.vx = 0;
                        e.counter["ac"] = -1; // 停止
                    }
                }
                this.checkCollisionWithPlayer(sm);
            };
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            BomberFlyingWithoutReturn.prototype.checkCollisionWithPlayer = function (sm) {
                var e = sm.e;
                var players = sm.e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            var dy = Math.abs(e.y - p.y); // プレイヤーとのy座標の差
                            if (p.flags["isAlive"] && dx < 30 && dy < 23) {
                                if (dx < 27 && p.vy > 0 || (p.flags["isStamping"] && p.counter["stamp_waiting"] == 5)) {
                                    e.dispatchEvent(new Game.SpriteCollisionEvent("onstamped", p));
                                    p.y = e.y - 12;
                                    p.dispatchEvent(new Game.NumberEvent("onstamp", 2));
                                    e.addOnceEventHandler("killed", function () {
                                        p.dispatchEvent(new Game.ScoreEvent("addscore", 10));
                                    });
                                }
                                else {
                                    p.dispatchEvent(new Game.PlayerMissEvent("miss", 1));
                                }
                            }
                        });
                    })(p);
                }
            };
            return BomberFlyingWithoutReturn;
        })(States.AbstractState);
        States.BomberFlyingWithoutReturn = BomberFlyingWithoutReturn;
        var BomberStamped = (function (_super) {
            __extends(BomberStamped, _super);
            function BomberStamped() {
                _super.apply(this, arguments);
            }
            BomberStamped.prototype.enter = function (sm) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 165;
                sm.e.flags["isAlive"] = false;
            };
            BomberStamped.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 165;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] > 14) {
                    e.kill();
                }
            };
            return BomberStamped;
        })(States.AbstractState);
        States.BomberStamped = BomberStamped;
    })(States = Game.States || (Game.States = {}));
    var BombLeft = (function (_super) {
        __extends(BombLeft, _super);
        function BombLeft(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.BombMoving());
            this.z = 257;
            this.vx = -40;
            this.vy = 0;
        }
        return BombLeft;
    })(Game.AbstractEntity);
    Game.BombLeft = BombLeft;
    var BombRight = (function (_super) {
        __extends(BombRight, _super);
        function BombRight(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.BombMoving());
            this.z = 257;
            this.vx = 40;
            this.vy = 0;
            this.reverse_horizontal = true;
        }
        return BombRight;
    })(Game.AbstractEntity);
    Game.BombRight = BombRight;
    var States;
    (function (States) {
        var BombMoving = (function (_super) {
            __extends(BombMoving, _super);
            function BombMoving() {
                _super.apply(this, arguments);
            }
            BombMoving.prototype.enter = function (sm) {
                var e = sm.e;
                e.counter["ac"] = 0;
                e.code = 171;
            };
            BombMoving.prototype.update = function (sm) {
                var e = sm.e;
                if (!e.flags["isAlive"]) {
                    e.kill();
                    return;
                }
                if (e.vx > 0) {
                    e.vx -= 2;
                }
                else if (e.vx < 0) {
                    e.vx += 2;
                }
                e.vy += 8;
                if (e.vy > 200) {
                    e.vy = 200;
                }
                e.x += Math.floor(e.vx / 10);
                e.y += Math.floor(e.vy / 10);
                if (Math.abs(e.vx) > 28) {
                    e.code = 171;
                }
                else {
                    e.code = 170;
                    e.reverse_horizontal = false;
                }
                var blocks = e.ss.getBlocks(e.x, e.y, e.width, e.height);
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    if (new Game.Point(e.centerx - 1, e.centery - 1).collision(bc)) {
                        e.y = Math.floor((e.centery - 1) / e.height) * e.height - Math.floor(e.height / 2);
                        sm.replace(new BombExploding());
                    }
                }
                this.checkOutOfScreen(sm);
                if (e.flags["isAlive"])
                    this.checkCollisionWithPlayer(sm);
            };
            BombMoving.prototype.checkOutOfScreen = function (sm) {
                var e = sm.e;
                // スクロール範囲外に出ていたら消失
                var players = e.ss.Players.get_all();
                var flg = false;
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (e.y < p.view_y + Game.SCREEN_HEIGHT + e.width) {
                        flg = true;
                        break;
                    }
                }
                if (!flg) {
                    e.kill();
                    return;
                }
            };
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            BombMoving.prototype.checkCollisionWithPlayer = function (sm) {
                var e = sm.e;
                var players = e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            var dy = Math.abs(e.y - p.y); // プレイヤーとのy座標の差
                            if (p.flags["isAlive"] && dx <= 23 && dy <= 28) {
                                // TODO:バリア判定はここに書く
                                // プレイヤーにダメージ
                                p.dispatchEvent(new Game.PlayerMissEvent("miss", 2));
                            }
                        });
                    })(p);
                }
            };
            return BombMoving;
        })(States.AbstractState);
        States.BombMoving = BombMoving;
        var BombExploding = (function (_super) {
            __extends(BombExploding, _super);
            function BombExploding() {
                _super.apply(this, arguments);
            }
            BombExploding.prototype.enter = function (sm) {
                var e = sm.e;
                e.counter["ac"] = 0;
                e.code = 172;
                e.vx = 0;
                e.vy = 0;
            };
            BombExploding.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] += 1;
                if (e.counter["ac"] <= 3) {
                    e.code = 172;
                }
                else if (e.counter["ac"] <= 6) {
                    e.code = 173;
                }
                else if (e.counter["ac"] <= 9) {
                    e.code = 174;
                }
                else {
                    e.kill();
                    return;
                }
                if (e.flags["isAlive"])
                    this.checkCollisionWithPlayer(sm);
            };
            return BombExploding;
        })(BombMoving);
        States.BombExploding = BombExploding;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="entity.ts"/>
var Game;
(function (Game) {
    var Decoration = (function (_super) {
        __extends(Decoration, _super);
        function Decoration(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, dx, dy);
            this.z = 512;
            this.initPatternCode();
            //this.addEventHandler("onhit", this.onHit);
        }
        // to be overridden
        Decoration.prototype.initPatternCode = function () {
            this.code = 20;
        };
        return Decoration;
    })(Game.AbstractEntity);
    Game.Decoration = Decoration;
    var CloudLeft = (function (_super) {
        __extends(CloudLeft, _super);
        function CloudLeft() {
            _super.apply(this, arguments);
        }
        CloudLeft.prototype.initPatternCode = function () {
            this.code = 1;
        };
        return CloudLeft;
    })(Decoration);
    Game.CloudLeft = CloudLeft;
    var CloudRight = (function (_super) {
        __extends(CloudRight, _super);
        function CloudRight() {
            _super.apply(this, arguments);
        }
        CloudRight.prototype.initPatternCode = function () {
            this.code = 2;
        };
        return CloudRight;
    })(Decoration);
    Game.CloudRight = CloudRight;
    var Grass = (function (_super) {
        __extends(Grass, _super);
        function Grass() {
            _super.apply(this, arguments);
        }
        Grass.prototype.initPatternCode = function () {
            this.code = 3;
        };
        return Grass;
    })(Decoration);
    Game.Grass = Grass;
    var Torch = (function (_super) {
        __extends(Torch, _super);
        function Torch(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, dx, dy);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.TorchMoving());
        }
        Torch.prototype.initPatternCode = function () {
            this.code = 96;
        };
        return Torch;
    })(Decoration);
    Game.Torch = Torch;
    var States;
    (function (States) {
        var TorchMoving = (function (_super) {
            __extends(TorchMoving, _super);
            function TorchMoving() {
                _super.apply(this, arguments);
            }
            TorchMoving.prototype.enter = function (sm) {
                var e = sm.e;
                e.counter["ac"] = 0;
            };
            TorchMoving.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2)
                    e.code = 96;
                else
                    e.code = 97;
            };
            return TorchMoving;
        })(States.AbstractState);
        States.TorchMoving = TorchMoving;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="enemy.ts"/>
var Game;
(function (Game) {
    var ElectricShooter = (function (_super) {
        __extends(ElectricShooter, _super);
        function ElectricShooter(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.ElectricShooterWaiting());
            //this.code = 140;
            this.addEventHandler("onstamped", this.onStamped);
            //this.addEventHandler("onhit", this.onHit);
        }
        ElectricShooter.prototype.onStamped = function (e) {
            if (this.flags["isAlive"])
                this.moving.replace(new States.ElectricShooterStamped());
            this.vx = 0;
            this.vy = 0;
        };
        return ElectricShooter;
    })(Game.AbstractEnemy);
    Game.ElectricShooter = ElectricShooter;
    var States;
    (function (States) {
        var ElectricShooterWaiting = (function (_super) {
            __extends(ElectricShooterWaiting, _super);
            function ElectricShooterWaiting() {
                _super.apply(this, arguments);
            }
            ElectricShooterWaiting.prototype.enter = function (sm) {
            };
            ElectricShooterWaiting.prototype.update = function (sm) {
                var e = sm.e;
                e.vx = 0;
                e.vy = 0;
                e.code = 143;
                var players = sm.e.ss.Players.get_all();
                if (e.counter["ac"] <= 0) {
                    var flg = false;
                    for (var i = 0; i < players.length; i++) {
                        var p = players[i];
                        if (p.x >= e.x - 240 && p.x <= e.x + 240) {
                            flg = true;
                            break;
                        }
                    }
                    if (flg) {
                        e.counter["ac"] = 0;
                        e.vy = -140 + 10;
                        sm.replace(new ElectricShooterJumping());
                    }
                }
                else {
                    e.counter["ac"] -= 1;
                }
                var pt = null; // 最も近いプレイヤー
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (pt == null) {
                        pt = p;
                    }
                    else if (Math.abs(p.x - e.x) < Math.abs(pt.x - e.x)) {
                        pt = p;
                    }
                }
                if (pt != null) {
                    if (e.x + 8 >= pt.x)
                        e.reverse_horizontal = false; // 最も近いプレイヤーに合わせて反転状態を決定
                    else
                        e.reverse_horizontal = true;
                }
                this.checkCollisionWithPlayer(sm);
            };
            return ElectricShooterWaiting;
        })(States.AbstractStampableAlive);
        States.ElectricShooterWaiting = ElectricShooterWaiting;
        var ElectricShooterJumping = (function (_super) {
            __extends(ElectricShooterJumping, _super);
            function ElectricShooterJumping() {
                _super.apply(this, arguments);
            }
            ElectricShooterJumping.prototype.enter = function (sm) {
                sm.e.flags["isOnGround"] = false;
            };
            ElectricShooterJumping.prototype.update = function (sm) {
                var e = sm.e;
                e.vy += 10; // y速度加算
                if (e.vy > 140)
                    e.vy = 140;
                if (e.vy <= -10) {
                    e.code = 144;
                }
                else {
                    e.code = 145;
                }
                var players = sm.e.ss.Players.get_all();
                var pt = null; // 最も近いプレイヤー
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (pt == null) {
                        pt = p;
                    }
                    else if (Math.abs(p.x - e.x) < Math.abs(pt.x - e.x)) {
                        pt = p;
                    }
                }
                if (e.vy == 0 && pt != null && (Math.abs(pt.x - e.x) > 32 || e.y <= pt.y)) {
                    // 攻撃
                    var attack = new ElectricShot(e.x, e.y, e.imagemanager, e.label, pt);
                    e.ss.add(attack);
                }
                if (pt != null) {
                    if (e.x + 8 >= pt.x)
                        e.reverse_horizontal = false; // 最も近いプレイヤーに合わせて反転状態を決定
                    else
                        e.reverse_horizontal = true;
                }
                if (e.flags["isOnGround"]) {
                    e.counter["ac"] = 30 + 1;
                    sm.replace(new ElectricShooterWaiting());
                    sm.update();
                }
                this.checkCollisionWithPlayer(sm);
            };
            return ElectricShooterJumping;
        })(States.AbstractStampableAlive);
        States.ElectricShooterJumping = ElectricShooterJumping;
        var ElectricShooterStamped = (function (_super) {
            __extends(ElectricShooterStamped, _super);
            function ElectricShooterStamped() {
                _super.apply(this, arguments);
            }
            ElectricShooterStamped.prototype.enter = function (sm) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 146;
                sm.e.flags["isAlive"] = false;
            };
            ElectricShooterStamped.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 146;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] > 14) {
                    e.kill();
                }
            };
            return ElectricShooterStamped;
        })(States.AbstractState);
        States.ElectricShooterStamped = ElectricShooterStamped;
    })(States = Game.States || (Game.States = {}));
    var ElectricShot = (function (_super) {
        __extends(ElectricShot, _super);
        function ElectricShot(x, y, imagemanager, label, target) {
            if (target === void 0) { target = null; }
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.ElectricShotMoving());
            if (target == null) {
                var players = this.ss.Players.get_all();
                var pt = null; // 最も近いプレイヤー
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (pt == null) {
                        pt = p;
                    }
                    else if (Math.abs(p.x - this.x) < Math.abs(pt.x - this.x)) {
                        pt = p;
                    }
                }
                target = pt;
                if (target == null) {
                    this.kill();
                    return;
                }
            }
            this.z = 257;
            var dx = target.x - this.x;
            var dy = target.y - this.y;
            var r = Math.floor(Math.sqrt(dx * dx + dy * dy));
            if (r < 48) {
                this.kill();
                return;
            }
            this.vx = Math.floor(14 * dx / r) * 10;
            this.vy = Math.floor(14 * dy / r) * 10;
            this.x += Math.floor(this.vx * 16 / 140);
            this.y += Math.floor(this.vy * 16 / 140);
        }
        return ElectricShot;
    })(Game.AbstractEntity);
    Game.ElectricShot = ElectricShot;
    var States;
    (function (States) {
        var ElectricShotMoving = (function (_super) {
            __extends(ElectricShotMoving, _super);
            function ElectricShotMoving() {
                _super.apply(this, arguments);
            }
            ElectricShotMoving.prototype.enter = function (sm) {
                var e = sm.e;
                e.counter["ac"] = 0;
                e.code = 120;
                // 水で消える設定の時の判定はここに書く
            };
            ElectricShotMoving.prototype.update = function (sm) {
                var e = sm.e;
                if (!e.flags["isAlive"]) {
                    e.kill();
                    return;
                }
                e.x += Math.floor(e.vx / 10);
                e.y += Math.floor(e.vy / 10);
                e.counter["ac"] = (e.counter["ac"] + 1) % 2;
                if (e.counter["ac"] == 0)
                    e.code = 120;
                else
                    e.code = 121;
                var blocks = e.ss.getBlocks(e.x, e.y, e.width, e.height);
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    // ブロックと衝突したら消失
                    if (new Game.Point(e.centerx - 1, e.centery - 3).collision(bc) || new Game.Point(e.centerx - 1, e.centery + 3).collision(bc)) {
                        e.flags["isAlive"] = false;
                        e.kill();
                        return;
                    }
                }
                this.checkOutOfScreen(sm);
                this.checkCollisionWithPlayer(sm);
            };
            ElectricShotMoving.prototype.checkOutOfScreen = function (sm) {
                var e = sm.e;
                // スクロール範囲外に出ていたら消失
                var players = e.ss.Players.get_all();
                var flg = false;
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (e.x >= p.view_x - e.width && e.x <= p.view_x + Game.SCREEN_WIDTH + e.width * 4 && e.y >= p.view_y - e.width - Game.SCREEN_HEIGHT / 2 && e.y <= p.view_y + Game.SCREEN_HEIGHT) {
                        flg = true;
                        break;
                    }
                }
                if (!flg) {
                    e.kill();
                    return;
                }
            };
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            ElectricShotMoving.prototype.checkCollisionWithPlayer = function (sm) {
                var e = sm.e;
                var players = e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            var dy = Math.abs(e.y - p.y); // プレイヤーとのy座標の差
                            if (p.flags["isAlive"] && dx <= 23 && dy <= 28) {
                                // TODO:バリア判定はここに書く
                                // プレイヤーにダメージ
                                p.dispatchEvent(new Game.PlayerMissEvent("miss", 2));
                            }
                        });
                    })(p);
                }
            };
            return ElectricShotMoving;
        })(States.AbstractState);
        States.ElectricShotMoving = ElectricShotMoving;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="enemy.ts"/>
var Game;
(function (Game) {
    var FireShooter = (function (_super) {
        __extends(FireShooter, _super);
        function FireShooter(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.FireShooterWaiting());
            this.addEventHandler("onstamped", this.onStamped);
        }
        FireShooter.prototype.onStamped = function (e) {
            if (this.flags["isAlive"])
                this.moving.replace(new States.FireShooterStamped());
            this.vx = 0;
            this.vy = 0;
        };
        return FireShooter;
    })(Game.AbstractEnemy);
    Game.FireShooter = FireShooter;
    var States;
    (function (States) {
        var FireShooterWaiting = (function (_super) {
            __extends(FireShooterWaiting, _super);
            function FireShooterWaiting() {
                _super.apply(this, arguments);
            }
            FireShooterWaiting.prototype.enter = function (sm) {
            };
            FireShooterWaiting.prototype.update = function (sm) {
                var e = sm.e;
                e.vx = 0;
                e.vy = 0;
                e.code = 158;
                var players = sm.e.ss.Players.get_all();
                var pt = null; // 最も近いプレイヤー
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (pt == null) {
                        pt = p;
                    }
                    else if (Math.abs(p.x - e.x) < Math.abs(pt.x - e.x)) {
                        pt = p;
                    }
                }
                if (pt != null) {
                    if (e.x + 8 >= pt.x)
                        e.reverse_horizontal = false; // 最も近いプレイヤーに合わせて反転状態を決定
                    else
                        e.reverse_horizontal = true;
                }
                if (e.counter["ac"] > 0) {
                    e.counter["ac"] += 1;
                    if (e.counter["ac"] == 2) {
                        if (e.reverse_horizontal) {
                            // 右向きに発射
                            var attack = new FireShotRight(e.x, e.y, e.imagemanager, e.label);
                        }
                        else {
                            // 左向きに発射
                            var attack = new FireShotLeft(e.x, e.y, e.imagemanager, e.label);
                        }
                        e.ss.add(attack);
                    }
                    if (e.counter["ac"] > 40)
                        e.counter["ac"] = 0;
                }
                else {
                    var flg = false;
                    for (var i = 0; i < players.length; i++) {
                        var p = players[i];
                        if (p.x >= e.x - 256 && p.x <= e.x + 192 && Math.abs(p.x - e.x) >= 96) {
                            flg = true;
                            break;
                        }
                    }
                    if (flg) {
                        e.counter["ac"] = 1;
                    }
                }
                this.checkCollisionWithPlayer(sm);
            };
            return FireShooterWaiting;
        })(States.AbstractStampableAlive);
        States.FireShooterWaiting = FireShooterWaiting;
        var FireShooterStamped = (function (_super) {
            __extends(FireShooterStamped, _super);
            function FireShooterStamped() {
                _super.apply(this, arguments);
            }
            FireShooterStamped.prototype.enter = function (sm) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 159;
                sm.e.flags["isAlive"] = false;
            };
            FireShooterStamped.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 159;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] > 14) {
                    e.kill();
                }
            };
            return FireShooterStamped;
        })(States.AbstractState);
        States.FireShooterStamped = FireShooterStamped;
    })(States = Game.States || (Game.States = {}));
    var FireShotLeft = (function (_super) {
        __extends(FireShotLeft, _super);
        function FireShotLeft(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.FireShotMoving());
            this.z = 257;
            this.vx = -120;
            this.vy = 0;
            this.x += this.vx / 10;
            this.y += this.vy / 10;
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        }
        return FireShotLeft;
    })(Game.AbstractEntity);
    Game.FireShotLeft = FireShotLeft;
    var FireShotRight = (function (_super) {
        __extends(FireShotRight, _super);
        function FireShotRight(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.FireShotMoving());
            this.z = 257;
            this.vx = 120;
            this.vy = 0;
            this.x += this.vx / 10;
            this.y += this.vy / 10;
            this.x += this.vx / 10;
            this.y += this.vy / 10;
            this.reverse_horizontal = this.vx > 0;
        }
        return FireShotRight;
    })(Game.AbstractEntity);
    Game.FireShotRight = FireShotRight;
    var States;
    (function (States) {
        var FireShotMoving = (function (_super) {
            __extends(FireShotMoving, _super);
            function FireShotMoving() {
                _super.apply(this, arguments);
            }
            FireShotMoving.prototype.enter = function (sm) {
                var e = sm.e;
                e.counter["ac"] = 0;
                e.code = 126;
            };
            FireShotMoving.prototype.update = function (sm) {
                var e = sm.e;
                if (!e.flags["isAlive"]) {
                    e.kill();
                    return;
                }
                e.x += e.vx / 10;
                e.y += e.vy / 10;
                e.code = 126 + e.counter["ac"];
                e.counter["ac"] = (e.counter["ac"] + 1) % 2;
                var blocks = e.ss.getBlocks(e.x, e.y, e.width, e.height);
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    if (new Game.Point(e.centerx - e.width / 4, e.centery - 1).collision(bc) || new Game.Point(e.centerx + e.width / 4 - 1, e.centery - 1).collision(bc)) {
                        e.kill();
                        return;
                    }
                }
                this.checkOutOfScreen(sm);
                if (e.flags["isAlive"])
                    this.checkCollisionWithPlayer(sm);
            };
            FireShotMoving.prototype.checkOutOfScreen = function (sm) {
                var e = sm.e;
                // スクロール範囲外に出ていたら消失
                var players = e.ss.Players.get_all();
                var flg = false;
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (e.y < p.view_y + Game.SCREEN_HEIGHT + e.width) {
                        flg = true;
                        break;
                    }
                }
                if (!flg) {
                    e.kill();
                    return;
                }
            };
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            FireShotMoving.prototype.checkCollisionWithPlayer = function (sm) {
                var e = sm.e;
                var players = e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            var dy = Math.abs(e.y - p.y); // プレイヤーとのy座標の差
                            if (p.flags["isAlive"] && dx <= 23 && dy <= 28) {
                                // TODO:バリア判定はここに書く
                                // プレイヤーにダメージ
                                p.dispatchEvent(new Game.PlayerMissEvent("miss", 2));
                            }
                        });
                    })(p);
                }
            };
            return FireShotMoving;
        })(States.AbstractState);
        States.FireShotMoving = FireShotMoving;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="enemy.ts"/>
var Game;
(function (Game) {
    var Flier = (function (_super) {
        __extends(Flier, _super);
        function Flier(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.FlierFlyingHorizontal());
            this.addEventHandler("onstamped", this.onStamped);
        }
        Flier.prototype.onStamped = function (e) {
            if (this.flags["isAlive"])
                this.moving.replace(new States.FlierStamped());
            this.vx = 0;
            this.vy = 0;
        };
        Flier.prototype.move = function () {
            this.x += this.vx / 10;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            this.y += this.vy / 10;
        };
        Flier.prototype.checkCollisionWithBlocksHorizontal = function () {
            // check
            if (this.vx > 0) {
                // right
                var blocks = this.ss.getBlocks(this.x + this.width, this.y, this.width, this.height); // 右寄りに取得
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    if (new Game.Point(this.centerx + this.width - 1, this.bottom - 1).collision(bc)) {
                        this.right = b.x - 16;
                        this.vx = 0;
                        this.reverse_horizontal = !this.reverse_horizontal;
                    }
                }
            }
            else if (this.vx < 0) {
                // left
                var blocks = this.ss.getBlocks(this.x - this.width, this.y, this.width, this.height); // 左寄りに取得
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    if (new Game.Point(this.centerx - this.width, this.bottom - 1).collision(bc)) {
                        this.x = b.right + 16;
                        this.vx = 0;
                        this.reverse_horizontal = !this.reverse_horizontal;
                    }
                }
            }
        };
        return Flier;
    })(Game.AbstractEnemy);
    Game.Flier = Flier;
    var FlierUpDown = (function (_super) {
        __extends(FlierUpDown, _super);
        function FlierUpDown(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.FlierFlyingVertical());
            this.counter["y_lower"] = this.y - 52;
            this.counter["y_upper"] = this.y - 12;
        }
        FlierUpDown.prototype.move = function () {
            // 接触判定は行わない
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        };
        return FlierUpDown;
    })(Flier);
    Game.FlierUpDown = FlierUpDown;
    var ThreeFlierGenerator = (function (_super) {
        __extends(ThreeFlierGenerator, _super);
        function ThreeFlierGenerator(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.Generate3FlierState());
        }
        return ThreeFlierGenerator;
    })(Game.AbstractEntity);
    Game.ThreeFlierGenerator = ThreeFlierGenerator;
    var States;
    (function (States) {
        var FlierFlyingHorizontal = (function (_super) {
            __extends(FlierFlyingHorizontal, _super);
            function FlierFlyingHorizontal() {
                _super.apply(this, arguments);
            }
            FlierFlyingHorizontal.prototype.enter = function (sm) {
            };
            FlierFlyingHorizontal.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2)
                    e.code = 147;
                else
                    e.code = 148;
                e.vx = e.reverse_horizontal ? 30 : -30;
                var players = sm.e.ss.Players.get_all();
                this.checkCollisionWithPlayer(sm);
            };
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            FlierFlyingHorizontal.prototype.checkCollisionWithPlayer = function (sm) {
                var e = sm.e;
                var players = sm.e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            var dy = Math.abs(e.y - p.y); // プレイヤーとのy座標の差
                            if (p.flags["isAlive"] && dx < 30 && dy < 23) {
                                if (dx < 27 && p.vy > 0 || (p.flags["isStamping"] && p.counter["stamp_waiting"] == 5)) {
                                    e.dispatchEvent(new Game.SpriteCollisionEvent("onstamped", p));
                                    p.y = e.y - 12;
                                    p.dispatchEvent(new Game.NumberEvent("onstamp", 2));
                                    e.addOnceEventHandler("killed", function () {
                                        p.dispatchEvent(new Game.ScoreEvent("addscore", 10));
                                    });
                                }
                                else {
                                    p.dispatchEvent(new Game.PlayerMissEvent("miss", 1));
                                }
                            }
                        });
                    })(p);
                }
            };
            return FlierFlyingHorizontal;
        })(States.AbstractState);
        States.FlierFlyingHorizontal = FlierFlyingHorizontal;
        var FlierFlyingVertical = (function (_super) {
            __extends(FlierFlyingVertical, _super);
            function FlierFlyingVertical() {
                _super.apply(this, arguments);
            }
            FlierFlyingVertical.prototype.enter = function (sm) {
                var e = sm.e;
                e.vx = 0;
                e.vy = -40;
            };
            FlierFlyingVertical.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2)
                    e.code = 147;
                else
                    e.code = 148;
                if (e.y <= e.counter["y_lower"]) {
                    e.vy += 10;
                    if (e.vy > 40)
                        e.vy = 40;
                }
                else if (e.y >= e.counter["y_upper"]) {
                    e.vy -= 10;
                    if (e.vy < -40)
                        e.vy = -40;
                }
                var players = sm.e.ss.Players.get_all();
                var pt = null; // 最も近いプレイヤー
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (pt == null) {
                        pt = p;
                    }
                    else if (Math.abs(p.x - e.x) < Math.abs(pt.x - e.x)) {
                        pt = p;
                    }
                }
                if (pt != null) {
                    if (e.x + 8 >= pt.x)
                        e.reverse_horizontal = false; // 最も近いプレイヤーに合わせて反転状態を決定
                    else
                        e.reverse_horizontal = true;
                }
                this.checkCollisionWithPlayer(sm);
            };
            return FlierFlyingVertical;
        })(FlierFlyingHorizontal);
        States.FlierFlyingVertical = FlierFlyingVertical;
        var FlierStamped = (function (_super) {
            __extends(FlierStamped, _super);
            function FlierStamped() {
                _super.apply(this, arguments);
            }
            FlierStamped.prototype.enter = function (sm) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 149;
                sm.e.flags["isAlive"] = false;
            };
            FlierStamped.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 149;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] > 14) {
                    e.kill();
                }
            };
            return FlierStamped;
        })(States.AbstractState);
        States.FlierStamped = FlierStamped;
        var Generate3FlierState = (function (_super) {
            __extends(Generate3FlierState, _super);
            function Generate3FlierState() {
                _super.apply(this, arguments);
            }
            Generate3FlierState.prototype.enter = function (sm) {
            };
            Generate3FlierState.prototype.update = function (sm) {
                var e = sm.e;
                for (var i = 0; i < 3; i++) {
                    var dx = 0;
                    var dy = 0;
                    if (i == 1) {
                        dx = 80;
                        dy = -40;
                    }
                    else if (i == 2) {
                        dx = 140;
                        dy = 38;
                    }
                    var entity = new Flier(e.x + dx, e.y + dy, e.imagemanager, e.label);
                    entity.counter["viewx_activate"] -= 32 * (i + 1);
                    e.ss.add(entity);
                    entity.update();
                }
                e.kill();
            };
            return Generate3FlierState;
        })(States.AbstractState);
        States.Generate3FlierState = Generate3FlierState;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="entity.ts"/>
var Game;
(function (Game) {
    var AbstractItem = (function (_super) {
        __extends(AbstractItem, _super);
        function AbstractItem(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.z = 384;
            this.counter["ac"] = 0;
        }
        return AbstractItem;
    })(Game.AbstractEntity);
    Game.AbstractItem = AbstractItem;
    var States;
    (function (States) {
        var AbstractItemAlive = (function (_super) {
            __extends(AbstractItemAlive, _super);
            function AbstractItemAlive() {
                _super.apply(this, arguments);
            }
            AbstractItemAlive.prototype.update = function (sm) {
                this.checkCollisionWithPlayer(sm);
            };
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            AbstractItemAlive.prototype.checkCollisionWithPlayer = function (sm) {
                var _this = this;
                var e = sm.e;
                var players = sm.e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            if (p.flags["isAlive"] && dx <= 14 && e.y <= p.y + 26 && e.y + 15 >= p.y) {
                                _this.onHitWithPlayer(sm, p);
                            }
                        });
                    })(p);
                }
            };
            AbstractItemAlive.prototype.onHitWithPlayer = function (sm, p) {
            };
            return AbstractItemAlive;
        })(States.AbstractState);
        States.AbstractItemAlive = AbstractItemAlive;
    })(States = Game.States || (Game.States = {}));
    var Coin = (function (_super) {
        __extends(Coin, _super);
        function Coin(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.CoinExisting());
        }
        return Coin;
    })(AbstractItem);
    Game.Coin = Coin;
    var States;
    (function (States) {
        var CoinExisting = (function (_super) {
            __extends(CoinExisting, _super);
            function CoinExisting() {
                _super.apply(this, arguments);
            }
            CoinExisting.prototype.enter = function (sm) {
                var e = sm.e;
                e.counter["ac"] = 0;
            };
            CoinExisting.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 8;
                e.code = 90 + Math.floor(e.counter["ac"] / 2);
                this.checkCollisionWithPlayer(sm);
            };
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            CoinExisting.prototype.checkCollisionWithPlayer = function (sm) {
                var _this = this;
                var e = sm.e;
                var players = sm.e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            if (p.flags["isAlive"] && dx <= 14 && e.y <= p.y + 26 && e.y + 15 >= p.y) {
                                _this.onHitWithPlayer(sm, p);
                            }
                            if (p.flags["isAlive"] && new Game.Point(p.x + p.width / 2 - 1, p.y + p.height / 2 - 1).collision(e.getCollision())) {
                                _this.onHitWithPlayer(sm, p);
                            }
                        });
                    })(p);
                }
            };
            CoinExisting.prototype.onHitWithPlayer = function (sm, p) {
                var e = sm.e;
                p.dispatchEvent(new Game.ScoreEvent("addscore", 5));
                e.kill();
            };
            return CoinExisting;
        })(States.AbstractItemAlive);
        States.CoinExisting = CoinExisting;
    })(States = Game.States || (Game.States = {}));
    var GoalStar = (function (_super) {
        __extends(GoalStar, _super);
        function GoalStar(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.GoalStarExisting());
        }
        return GoalStar;
    })(AbstractItem);
    Game.GoalStar = GoalStar;
    var States;
    (function (States) {
        var GoalStarExisting = (function (_super) {
            __extends(GoalStarExisting, _super);
            function GoalStarExisting() {
                _super.apply(this, arguments);
            }
            GoalStarExisting.prototype.enter = function (sm) {
                var e = sm.e;
                e.counter["ac"] = 0;
            };
            GoalStarExisting.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 8;
                e.code = 94 + Math.floor(e.counter["ac"] / 4);
                this.checkCollisionWithPlayer(sm);
            };
            GoalStarExisting.prototype.checkCollisionWithPlayer = function (sm) {
                var _this = this;
                var e = sm.e;
                var players = sm.e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            if (p.flags["isAlive"] && !p.flags["isStamping"] && dx <= 14 && e.y <= p.y + 26 && e.y + 15 >= p.y) {
                                _this.onHitWithPlayer(sm, p);
                            }
                            if (p.flags["isAlive"] && !p.flags["isStamping"] && new Game.Point(p.x + p.width / 2 - 1, p.y + p.height / 2 - 1).collision(e.getCollision())) {
                                _this.onHitWithPlayer(sm, p);
                            }
                        });
                    })(p);
                }
            };
            GoalStarExisting.prototype.onHitWithPlayer = function (sm, p) {
                var e = sm.e;
                p.dispatchEvent(new Game.ScoreEvent("addscore", 100));
                p.dispatchEvent(new Game.Event("ongoal"));
                e.kill();
            };
            return GoalStarExisting;
        })(States.AbstractItemAlive);
        States.GoalStarExisting = GoalStarExisting;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="enemy.ts"/>
var Game;
(function (Game) {
    var Jumper = (function (_super) {
        __extends(Jumper, _super);
        function Jumper(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.JumperWaiting());
            //this.code = 154;
            this.addEventHandler("onstamped", this.onStamped);
            this.counter["ac"] = 0;
        }
        Jumper.prototype.move = function () {
            this.x += this.vx / 10;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            this.y += this.vy / 10;
            this.checkCollisionWithBlocksVertical(); // 接触判定
        };
        Jumper.prototype.onStamped = function (e) {
            if (this.flags["isAlive"])
                this.moving.replace(new States.JumperStamped());
            this.vx = 0;
            this.vy = 0;
        };
        Jumper.prototype.checkCollisionWithBlocksVertical = function () {
            if (this.flags["isOnGround"]) {
                this.flags["isOnGround"] = false;
                // check
                var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height + 1); // 足元+1ピクセルも含めて取得
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    var col = this.getRect();
                    if (this.vy < 0) {
                        // up
                        if (col.collision(bc) && !(new Game.Rect(this.x, this.bottom, this.width, 0).collision(bc))) {
                            this.y = b.bottom;
                            this.vy = 0;
                        }
                    }
                    else if (this.vy >= 0) {
                        // down || //
                        if (col.collision(bc) && !(new Game.Rect(this.x, this.y, this.width, 0).collision(bc))) {
                            this.dispatchEvent(new Game.Event("onground"));
                            this.bottom = b.y;
                            this.vy = 0;
                        }
                    }
                }
            }
            else {
                // ジャンプ中の判定
                var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height);
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    // 上方向
                    var col = new Game.Point(this.centerx, this.y + 6);
                    if (col.collision(bc)) {
                        this.y = b.bottom - 6;
                        this.vy = 0;
                    }
                    // 下方向
                    var col = new Game.Point(this.centerx, this.bottom);
                    if (col.collision(bc)) {
                        this.dispatchEvent(new Game.Event("onground"));
                        this.bottom = b.y;
                        this.vy = 0;
                    }
                }
            }
        };
        Jumper.prototype.checkCollisionWithBlocksHorizontal = function () {
            if (this.flags["isOnGround"]) {
                // check
                var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height);
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    var col = this.getRect();
                    if (this.vx > 0) {
                        // right
                        if (col.collision(bc)) {
                            this.right = b.x;
                            this.vx = 0;
                            this.reverse_horizontal = !this.reverse_horizontal;
                        }
                    }
                    else if (this.vx < 0) {
                        // left
                        if (col.collision(bc)) {
                            this.x = b.right;
                            this.vx = 0;
                            this.reverse_horizontal = !this.reverse_horizontal;
                        }
                    }
                }
            }
            else {
                // ジャンプ中の判定
                var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height);
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    if (this.vx > 0) {
                        // right
                        if (new Game.Point(this.right + this.vx / 10, this.bottom).collision(bc) || new Game.Point(this.right + this.vx / 10, this.y + 8).collision(bc)) {
                            this.right = b.x;
                            this.vx = 0;
                            this.reverse_horizontal = !this.reverse_horizontal;
                        }
                    }
                    else if (this.vx < 0) {
                        // left
                        if (new Game.Point(this.x + this.vx / 10, this.bottom).collision(bc) || new Game.Point(this.x + this.vx / 10, this.y + 8).collision(bc)) {
                            this.x = b.right;
                            this.vx = 0;
                            this.reverse_horizontal = !this.reverse_horizontal;
                        }
                    }
                }
            }
        };
        return Jumper;
    })(Game.AbstractEnemy);
    Game.Jumper = Jumper;
    var States;
    (function (States) {
        var JumperWaiting = (function (_super) {
            __extends(JumperWaiting, _super);
            function JumperWaiting() {
                _super.apply(this, arguments);
            }
            JumperWaiting.prototype.enter = function (sm) {
                sm.e.flags["isOnGround"] = true;
            };
            JumperWaiting.prototype.update = function (sm) {
                var e = sm.e;
                e.code = 154;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] < 25)
                    e.counter["ac"] += 1;
                else {
                    sm.replace(new JumperJumping());
                }
                this.checkCollisionWithPlayer(sm);
            };
            return JumperWaiting;
        })(States.AbstractStampableAlive);
        States.JumperWaiting = JumperWaiting;
        var JumperJumping = (function (_super) {
            __extends(JumperJumping, _super);
            function JumperJumping() {
                _super.apply(this, arguments);
            }
            JumperJumping.prototype.enter = function (sm) {
                sm.e.counter["ac"] = 0;
            };
            JumperJumping.prototype.update = function (sm) {
                var e = sm.e;
                e.vx = e.reverse_horizontal ? 50 : -50;
                if (e.counter["ac"] == 0) {
                    e.vy = -170;
                    sm.e.flags["isOnGround"] = false;
                }
                e.vy += (e.counter["ac"] % 2) ? 20 : 10;
                if (e.vy > 170)
                    e.vy = 170;
                e.counter["ac"] += 1;
                if (e.vy < 40) {
                    e.code = 155;
                }
                else {
                    e.code = 156;
                }
                if (e.flags["isOnGround"]) {
                    e.counter["ac"] = 15 - 1;
                    sm.replace(new JumperWaiting());
                    sm.update();
                }
                this.checkCollisionWithPlayer(sm);
            };
            return JumperJumping;
        })(States.AbstractStampableAlive);
        States.JumperJumping = JumperJumping;
        var JumperStamped = (function (_super) {
            __extends(JumperStamped, _super);
            function JumperStamped() {
                _super.apply(this, arguments);
            }
            JumperStamped.prototype.enter = function (sm) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 157;
                sm.e.flags["isAlive"] = false;
            };
            JumperStamped.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 157;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] > 14) {
                    e.kill();
                }
            };
            return JumperStamped;
        })(States.AbstractState);
        States.JumperStamped = JumperStamped;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="enemy.ts"/>
var Game;
(function (Game) {
    var LeafShooter = (function (_super) {
        __extends(LeafShooter, _super);
        function LeafShooter(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.LeafShooterWaiting());
            this.addEventHandler("onstamped", this.onStamped);
        }
        LeafShooter.prototype.onStamped = function (e) {
            if (this.flags["isAlive"])
                this.moving.replace(new States.LeafShooterStamped());
            this.vx = 0;
            this.vy = 0;
        };
        return LeafShooter;
    })(Game.AbstractEnemy);
    Game.LeafShooter = LeafShooter;
    var States;
    (function (States) {
        var LeafShooterWaiting = (function (_super) {
            __extends(LeafShooterWaiting, _super);
            function LeafShooterWaiting() {
                _super.apply(this, arguments);
            }
            LeafShooterWaiting.prototype.enter = function (sm) {
            };
            LeafShooterWaiting.prototype.update = function (sm) {
                var e = sm.e;
                e.vx = 0;
                e.vy = 0;
                e.code = 150;
                var players = sm.e.ss.Players.get_all();
                var pt = null; // 最も近いプレイヤー
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (pt == null) {
                        pt = p;
                    }
                    else if (Math.abs(p.x - e.x) < Math.abs(pt.x - e.x)) {
                        pt = p;
                    }
                }
                if (pt != null) {
                    if (e.x + 8 >= pt.x)
                        e.reverse_horizontal = false; // 最も近いプレイヤーに合わせて反転状態を決定
                    else
                        e.reverse_horizontal = true;
                }
                if (e.counter["ac"] > 0) {
                    e.counter["ac"] += 1;
                    if (e.counter["ac"] == 2 || e.counter["ac"] == 10 || e.counter["ac"] == 18 || e.counter["ac"] == 26) {
                        if (e.reverse_horizontal) {
                            // 右向きに発射
                            var attack = new LeafShotRight(e.x, e.y, e.imagemanager, e.label);
                        }
                        else {
                            // 左向きに発射
                            var attack = new LeafShotLeft(e.x, e.y, e.imagemanager, e.label);
                        }
                        e.ss.add(attack);
                    }
                    if (e.counter["ac"] > 86)
                        e.counter["ac"] = 0;
                }
                else {
                    var flg = false;
                    for (var i = 0; i < players.length; i++) {
                        var p = players[i];
                        if (p.x >= e.x - 256 && p.x <= e.x + 256) {
                            flg = true;
                            break;
                        }
                    }
                    if (flg) {
                        e.counter["ac"] = 1;
                    }
                }
                this.checkCollisionWithPlayer(sm);
            };
            return LeafShooterWaiting;
        })(States.AbstractStampableAlive);
        States.LeafShooterWaiting = LeafShooterWaiting;
        var LeafShooterStamped = (function (_super) {
            __extends(LeafShooterStamped, _super);
            function LeafShooterStamped() {
                _super.apply(this, arguments);
            }
            LeafShooterStamped.prototype.enter = function (sm) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 151;
                sm.e.flags["isAlive"] = false;
            };
            LeafShooterStamped.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 151;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] > 14) {
                    e.kill();
                }
            };
            return LeafShooterStamped;
        })(States.AbstractState);
        States.LeafShooterStamped = LeafShooterStamped;
    })(States = Game.States || (Game.States = {}));
    var LeafShotLeft = (function (_super) {
        __extends(LeafShotLeft, _super);
        function LeafShotLeft(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.LeafShotMoving());
            this.vx = -40 - Math.floor(Math.random() * 6) * 10; // TODO: シード付き乱数を使うようにする
            this.vy = -220;
            this.x += this.vx / 10;
            this.y += this.vy / 10;
            this.vy += 20;
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        }
        return LeafShotLeft;
    })(Game.AbstractEntity);
    Game.LeafShotLeft = LeafShotLeft;
    var LeafShotRight = (function (_super) {
        __extends(LeafShotRight, _super);
        function LeafShotRight(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.LeafShotMoving());
            this.z = 257;
            this.vx = 40 + Math.floor(Math.random() * 6) * 10; // TODO: シード付き乱数を使うようにする
            this.vy = -220;
            this.x += this.vx / 10;
            this.y += this.vy / 10;
            this.vy += 20;
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        }
        return LeafShotRight;
    })(Game.AbstractEntity);
    Game.LeafShotRight = LeafShotRight;
    var States;
    (function (States) {
        var LeafShotMoving = (function (_super) {
            __extends(LeafShotMoving, _super);
            function LeafShotMoving() {
                _super.apply(this, arguments);
            }
            LeafShotMoving.prototype.enter = function (sm) {
                var e = sm.e;
                e.counter["ac"] = 0;
                e.code = 122;
            };
            LeafShotMoving.prototype.update = function (sm) {
                var e = sm.e;
                if (!e.flags["isAlive"]) {
                    e.kill();
                    return;
                }
                e.x += Math.floor(e.vx / 10);
                e.vy += 20;
                if (e.vy > 120)
                    e.vy = 120;
                if (e.vy < -180) {
                    e.y += -18;
                }
                else {
                    e.y += Math.floor(e.vy / 10);
                }
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                e.code = 122 + e.counter["ac"];
                this.checkOutOfScreen(sm);
                if (e.flags["isAlive"])
                    this.checkCollisionWithPlayer(sm);
            };
            LeafShotMoving.prototype.checkOutOfScreen = function (sm) {
                var e = sm.e;
                // スクロール範囲外に出ていたら消失
                var players = e.ss.Players.get_all();
                var flg = false;
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (e.y < p.view_y + Game.SCREEN_HEIGHT + e.width) {
                        flg = true;
                        break;
                    }
                }
                if (!flg) {
                    e.kill();
                    return;
                }
            };
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            LeafShotMoving.prototype.checkCollisionWithPlayer = function (sm) {
                var e = sm.e;
                var players = e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            var dy = Math.abs(e.y - p.y); // プレイヤーとのy座標の差
                            if (p.flags["isAlive"] && dx <= 23 && dy <= 28) {
                                // TODO:バリア判定はここに書く
                                // プレイヤーにダメージ
                                p.dispatchEvent(new Game.PlayerMissEvent("miss", 2));
                            }
                        });
                    })(p);
                }
            };
            return LeafShotMoving;
        })(States.AbstractState);
        States.LeafShotMoving = LeafShotMoving;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="entity.ts"/>
var Game;
(function (Game) {
    var UpwardNeedle = (function (_super) {
        __extends(UpwardNeedle, _super);
        function UpwardNeedle(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.z = 511;
            this.code = 5;
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.NeedleExisting());
        }
        return UpwardNeedle;
    })(Game.AbstractEntity);
    Game.UpwardNeedle = UpwardNeedle;
    var DownwardNeedle = (function (_super) {
        __extends(DownwardNeedle, _super);
        function DownwardNeedle(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.z = 511;
            this.code = 6;
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.NeedleExisting());
        }
        return DownwardNeedle;
    })(Game.AbstractEntity);
    Game.DownwardNeedle = DownwardNeedle;
    var States;
    (function (States) {
        var NeedleExisting = (function (_super) {
            __extends(NeedleExisting, _super);
            function NeedleExisting() {
                _super.apply(this, arguments);
            }
            NeedleExisting.prototype.update = function (sm) {
                this.checkCollisionWithPlayer(sm);
            };
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            NeedleExisting.prototype.checkCollisionWithPlayer = function (sm) {
                var e = sm.e;
                var players = sm.e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            if (p.flags["isAlive"] && !p.flags["isStamping"] && new Game.Point(p.x + p.width / 2 - 1, p.y + p.height / 2 - 1).collision(e.getCollision())) {
                                p.y = Math.floor((p.y + p.width / 2 - 1) / 32) * 32;
                                p.dispatchEvent(new Game.PlayerMissEvent("miss", 2));
                            }
                        });
                    })(p);
                }
            };
            return NeedleExisting;
        })(States.AbstractState);
        States.NeedleExisting = NeedleExisting;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="entity.ts"/>
var Game;
(function (Game) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(input, x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.code = 100;
            this.gk = input;
            this.moving = new PlayerStateMachine(this);
            this.moving.setGlobalState(new States.PlayerGlobalMove());
            this.moving.push(new States.PlayerInterialMove());
            this.special = new PlayerStateMachine(this);
            this.special.push(new States.PlayerWithoutSpecialMove());
            this.counter["able2runningLeft"] = 0;
            this.counter["able2runningRight"] = 0;
            this.counter["running"] = 0;
            this.counter["jump_level"] = 0;
            this.counter["stamp_waiting"] = 0;
            this.counter["stamp_level"] = 0;
            this.counter["dying"] = 0;
            this.counter["superjump_effect"] = -1;
            this.flags["isAlive"] = true; // まだミスをしていない状態
            this.flags["isRunning"] = false; // 走っている状態
            this.flags["isWalking"] = false; // 歩いている状態
            this.flags["isJumping"] = true; // ジャンプによって空中にいる状態
            this.flags["isStamping"] = false; // 敵を踏んだ状態
            this.flags["isOnGround"] = false; // 地面の上にいる状態
            this.sjump_effects = [];
            this.reverse_horizontal = true;
            this.z = 128;
            this.addEventHandler("onground", this.onGround);
            this.addEventHandler("onstamp", this.onStamp);
            this.addEventHandler("miss", this.onMiss);
            this.view_x = 0;
            this.view_y = 0;
        }
        Object.defineProperty(Player.prototype, "alive", {
            get: function () {
                return this.flags["isAlive"];
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.onGround = function (e) {
            this.flags["isOnGround"] = true;
            this.flags["isJumping"] = false;
            this.flags["isStamping"] = false;
            this.counter["jump_level"] = 0;
            this.counter["stamp_level"] = 0;
            if (this.counter["superjump_effect"] >= 0)
                this.counter["superjump_effect"] = 100;
        };
        Player.prototype.onStamp = function (e) {
            var n = e.value;
            if (n <= 0)
                n = 1;
            this.counter["stamp_level"] = n;
            this.moving.push(new States.PlayerStamping());
        };
        Player.prototype.onMiss = function (e) {
            this.dispatchEvent(new Game.Event("onground")); // ほぼスーパージャンプのエフェクトを消すためだけ
            if (e.mode == 1) {
                this.moving.replace(new States.PlayerDyingDirect());
            }
            else if (e.mode == 2) {
                this.moving.replace(new States.PlayerDyingInDirect());
            }
        };
        Player.prototype.update = function () {
            if (this.flags["isAlive"]) {
                // 入力の更新
                this.checkInput();
                //this.externalForce();
                // 外力を受けない移動
                this.moving.update();
                this.special.update();
                // 移動の確定
                if (this.counter["stamp_waiting"] <= 0)
                    this.move();
                else
                    this.counter["stamp_waiting"] -= 1;
                this.fixPatternCode();
            }
            else {
                this.moving.update();
                this.x += Math.floor(this.vx / 10);
                this.y += this.vy > -320 ? Math.floor(this.vy / 10) : -32;
            }
            /* やめた
            // 画面外処理
            if (this.x < this.view_x - this.width / 2 + 1) {
                this.x = this.view_x - this.width / 2 + 1;
                if (this.vx < 0) this.vx = 0;
            }
            else if (this.x > this.view_x + SCREEN_WIDTH + this.width / 2) {
                this.x = this.view_x + SCREEN_WIDTH + this.width / 2;
                if (this.vx > 0) this.vx = 0;
            }*/
            if (this.flags["isAlive"] && this.y > this.view_y + Game.SCREEN_HEIGHT) {
                this.dispatchEvent(new PlayerMissEvent("miss", 2));
            }
        };
        // 速度に応じて自機の座標を移動させる
        Player.prototype.move = function () {
            var muki_x = 0;
            if (this.vx > 0)
                muki_x = 1;
            else if (this.vx < 0)
                muki_x = -1;
            this.x += Math.floor(this.vx / 10);
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            var tmp_y = this.y;
            this.y += this.vy > -320 ? Math.floor(this.vy / 10) : -32;
            this.checkCollisionWithBlocksVertical(); // 接触判定
            // 補正
            // TODO: タイル幅32が前提であるのを解消
            if (this.vy < 0) {
                if (Math.floor(tmp_y / 32) > Math.floor(this.y / 32)) {
                    if (this.gk.isDown(37)) {
                        var b1 = this.getHitBlock(this.x + this.width / 2 - 1 - 1, tmp_y);
                        var b2 = this.getHitBlock(this.x + this.width / 2 - 1 - 1, this.y);
                        if (b1 == null && b2 != null) {
                            this.y = b2.y + b2.height;
                            this.vy = 0;
                        }
                    }
                    if (this.gk.isDown(39)) {
                        var b1 = this.getHitBlock(this.x + this.width / 2 - 1 + 1, tmp_y);
                        var b2 = this.getHitBlock(this.x + this.width / 2 - 1 + 1, this.y);
                        if (b1 == null && b2 != null) {
                            this.y = b2.y + b2.height;
                            this.vy = 0;
                        }
                    }
                }
            }
            else if (this.vy > 0) {
                if (Math.floor((tmp_y + this.height - 1) / 32) < Math.floor((this.y + this.height - 1) / 32)) {
                    if (this.gk.isDown(37)) {
                        var b1 = this.getHitBlock(this.x + this.width / 2 - 1 - 1, tmp_y + this.height - 1);
                        var b2 = this.getHitBlock(this.x + this.width / 2 - 1 - 1, this.y + this.height - 1);
                        if (b1 == null && b2 != null) {
                            this.y = b2.y - b2.height;
                            this.vy = 0;
                            //this.code = 103;
                            this.x -= 1;
                            this.checkCollisionWithBlocksVertical();
                        }
                    }
                    if (this.gk.isDown(39)) {
                        var b1 = this.getHitBlock(this.x + this.width / 2 - 1 + 1, tmp_y + this.height - 1);
                        var b2 = this.getHitBlock(this.x + this.width / 2 - 1 + 1, this.y + this.height - 1);
                        if (b1 == null && b2 != null) {
                            this.y = b2.y - b2.height;
                            this.vy = 0;
                            //this.code = 103;
                            this.x += 1;
                            this.checkCollisionWithBlocksVertical();
                        }
                    }
                }
            }
            /*if (this.vy > 0) { // 下降中
                if (tmp_bottom < this.bottom) {
                    if (this.getHitBlock(this.centerx + muki_x, tmp_bottom + 1) == null) { // 移動前 自機の足元にブロックが無い
                        if (this.getHitBlock(this.centerx + muki_x, this.bottom + 1) != null) { // 移動後 自機の足元にブロックがある
                            if (this.gk.isDown(37) || this.gk.isDown(39)) {
                                //if (this.flags["isWalking"] || this.flags["isRunning"]) {
                                this.x += muki_x; // トンネルに入れるようにする
                                this.checkCollisionWithBlocksVertical();
                                this.vy = 0;
                                //_ptc = 103;
                                this.counter["running"] = 1;
                            }
                        }
                    }
                }
            }
            else if (this.vy < 0) { // 上昇中
                if (tmp_top > this.top) {
                    if (this.getHitBlock(this.centerx + muki_x, tmp_top) == null) { // 移動前 自機の頭にブロックが無い
                        if (this.getHitBlock(this.centerx + muki_x, this.top) != null) { // 移動後 自機の頭にブロックがある
                            if (this.gk.isDown(37) || this.gk.isDown(39)) {
                                //if (this.flags["isWalking"] || this.flags["isRunning"]) {
                                this.x += muki_x; // トンネルに入れるようにする
                                this.checkCollisionWithBlocksVertical();
                                this.vy = 0;
                                //_ptc = 103;
                                this.counter["running"] = 1;
                            }
                        }
                    }
                }
            }*/
        };
        Player.prototype.fixPatternCode = function () {
            if (this.flags["isStamping"]) {
                this.code = 109;
            }
            else {
                if (this.flags["isOnGround"]) {
                }
                else {
                    if (this.flags["isJumping"]) {
                        if (this.vy <= 25)
                            this.code = 101;
                        else
                            this.code = 102;
                    }
                    else {
                        if (this.vx == 0 && !this.flags["isRunning"] && !this.flags["isWalking"]) {
                            this.code = 100;
                        }
                        else if (Math.abs(this.vx) > 60) {
                            this.code = 105;
                        }
                        else {
                            this.code = 103;
                        }
                    }
                }
            }
        };
        Player.prototype.checkCollisionWithBlocksVertical = function () {
            this.flags["isOnGround"] = false;
            // check
            if (this.vy < 0) {
                var b = this.getHitBlock(this.x + this.width / 2 - 1, this.y);
                if (b != null) {
                    this.y = b.y + b.height;
                    this.vy = 0;
                }
            }
            else if (this.vy > 0) {
                var b = this.getHitBlock(this.x + this.width / 2 - 1, this.y + this.height);
                if (b != null) {
                    this.y = b.y - this.width;
                    this.vy = 0;
                }
                if (this.getHitBlock(this.x + this.width / 2 - 1, this.y + this.height + 1) != null) {
                    this.dispatchEvent(new Game.Event("onground"));
                }
            }
            else {
                if (this.getHitBlock(this.x + this.width / 2 - 1, this.y + this.height + 1) != null) {
                    this.dispatchEvent(new Game.Event("onground"));
                }
            }
            /*var blocks = this.getBlocks(this.x, this.y, this.width, this.height + 1); // 足元+1ピクセルも含めて取得
            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                //if (this.x <= b.x + b.width && this.x + this.width >= b.x &&
                //    this.y <= b.y + b.height && this.y + this.height >= b.y) {
                //    b.dispatchEvent(new SpriteCollisionEvent("onhit", this, "vertical", "center"));
                //}

                //var bc = b.getRect(); // TODO: getCollisionに書き換えても問題なく動作するように
                //var col = new Rect(this.centerx, this.y, 0, this.height);

                if (this.vy < 0) {
                    // up
                    if (b.x <= this.centerx && b.right > this.centerx && // spriteのx中心点との判定
                        b.y < this.bottom && b.bottom >= this.y) {
                        //if (((col.collision(bc, true)) || col.collision(new Rect(bc.left, bc.top, 0, bc.height)) || col.collision(new Rect(bc.left, bc.bottom, bc.width, 0))) &&
                        //    !(col.collision(new Point(bc.left, bc.top))) && !(col.collision(new Point(bc.right, bc.bottom)))) { // ブロックの右の辺と上の辺を除いた部分と判定を行う
                        this.y = b.bottom;
                        this.vy = 0;
                    }
                }
                else if (this.vy >= 0) {
                    // down || //
                    //if (((col.collision(bc, true)) || col.collision(new Rect(bc.left, bc.top, 0, bc.height)) || col.collision(new Rect(bc.left, bc.top, bc.width, 0))) &&
                    //    !(col.collision(new Point(bc.right, bc.top))) && !(col.collision(new Point(bc.left, bc.bottom)))) { // ブロックの右の辺と下の辺を除いた部分と判定を行う
                    if (b.x <= this.centerx && b.right > this.centerx && // spriteのx中心点との判定
                        b.y <= this.bottom && b.bottom > this.y) {
                        this.dispatchEvent(new Event("onground"));
                        this.bottom = b.y;
                        this.vy = 0;
                    }
                }
            }*/
        };
        Player.prototype.checkCollisionWithBlocksHorizontal = function () {
            // check
            var b1 = this.getHitBlock(this.x + this.width / 2 - 1, this.y); // (x+15,y)
            var b2 = this.getHitBlock(this.x + this.width / 2 - 1, this.y + this.height - 1); // (x+15,y+31)
            if (b1 != null || b2 != null) {
                if (b1 == null)
                    b1 = b2;
                if (this.vx > 0) {
                    this.x = b1.x - this.width / 2;
                    this.vx = 0;
                }
                else if (this.vx < 0) {
                    this.x = b1.x + this.width / 2 + 1;
                    this.vx = 0;
                }
            }
            /*var blocks = this.getBlocks(this.x, this.y, this.width, this.height);
            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                //if (this.x <= b.x + b.width && this.x + this.width >= b.x &&
                //    this.y <= b.y + b.height && this.y + this.height >= b.y) {
                //    b.dispatchEvent(new SpriteCollisionEvent("onhit", this, "horizontal", "center"));
                //}
                //var bc = b.getCollision();
                //var col = new Rect(this.centerx, this.y, 0, this.height);
                
                if (this.vx > 0) {
                    // right
                    if (b.x <= this.centerx && b.right > this.centerx && // spriteのx中心点との判定
                        b.y <= this.bottom && b.bottom > this.y) {
                        // rect:{(x,y)∈R^2:x∈[bc.left,bc.right),y∈[bc.top,bc.bottom]}の判定
                        this.centerx = b.x - 1;
                        this.vx = 0;
                    }
                }
                else if (this.vx < 0) {
                    // left
                    if (b.x <= this.centerx && b.right > this.centerx && // spriteのx中心点との判定
                        b.y <= this.bottom && b.bottom > this.y) {
                        //if (((col.collision(bc, true)) || col.collision(new Rect(bc.left, bc.top, 0, bc.height)) || col.collision(new Rect(bc.left, bc.top, bc.width, 0))) &&
                        //    !(col.collision(new Point(bc.right, bc.top))) && !(col.collision(new Point(bc.left, bc.bottom)))) { // ブロックの右の辺と下の辺を除いた部分と判定を行う
                        this.centerx = b.right;
                        this.vx = 0;
                    }
                }
            }*/
        };
        // 指定した座標地点(ピクセル座標)にブロックがある場合、そのブロックを返す。また画面外に出るのを阻止するための処理も挟む
        // そうでない場合、nullを返す。
        Player.prototype.getHitBlock = function (x, y) {
            var b = this.ss.getBlock(x, y);
            if (b)
                return b;
            if (Math.floor(x / 32) == -1)
                return new Game.AbstractBlock(-32, Math.floor(y / 32) * 32, this.imagemanager, this.label);
            if (Math.floor(x / 32) == 180)
                return new Game.AbstractBlock(32 * 180, Math.floor(y / 32) * 32, this.imagemanager, this.label);
            if (Math.floor(y / 32) == -10)
                return new Game.AbstractBlock(Math.floor(x / 32) * 32, 32 * -10, this.imagemanager, this.label);
            return null;
        };
        // SpriteSystem.getBlocks()をラップし、間に画面外に出るのを阻止するための処理を挟む
        Player.prototype.getBlocks = function (x, y, w, h) {
            var result = this.ss.getBlocks(x, y, w, h);
            var additions = new Array();
            if (x <= 0) {
                additions.push(new Game.AbstractBlock(-32, this.y - this.y % 32, this.imagemanager, this.label));
                additions.push(new Game.AbstractBlock(-32, this.y - this.y % 32 - 32, this.imagemanager, this.label));
                additions.push(new Game.AbstractBlock(-32, this.y - this.y % 32 + 32, this.imagemanager, this.label));
            }
            if (x + w >= 32 * 180) {
                additions.push(new Game.AbstractBlock(32 * 180, this.y - this.y % 32, this.imagemanager, this.label));
                additions.push(new Game.AbstractBlock(32 * 180, this.y - this.y % 32 - 32, this.imagemanager, this.label));
                additions.push(new Game.AbstractBlock(32 * 180, this.y - this.y % 32 + 32, this.imagemanager, this.label));
            }
            if (y <= -320) {
                additions.push(new Game.AbstractBlock(this.x - this.x % 32, -320 - 32, this.imagemanager, this.label));
                additions.push(new Game.AbstractBlock(this.x - this.x % 32 - 32, -320 - 32, this.imagemanager, this.label));
                additions.push(new Game.AbstractBlock(this.x - this.x % 32 + 32, -320 - 32, this.imagemanager, this.label));
            }
            result = result.concat(additions);
            return result;
        };
        Player.prototype.checkInput = function () {
            //if (this.gk.isDown(37) && this.gk.isDown(39)) { } // 左右同時に押されていたらとりあえず何もしないことに
            if (this.gk.isDown(37)) {
                if (this.gk.isOnDown(37) && this.counter["able2runningLeft"] > 0) {
                    this.moving.replace(new States.PlayerRunningLeft());
                }
                else if (!(this.moving.current_state instanceof States.PlayerRunningLeft)) {
                    this.moving.replace(new States.PlayerWalkingLeft());
                }
            }
            else if (this.gk.isDown(39)) {
                if (this.gk.isOnDown(39) && this.counter["able2runningRight"] > 0) {
                    this.moving.replace(new States.PlayerRunningRight());
                }
                else if (!(this.moving.current_state instanceof States.PlayerRunningRight)) {
                    this.moving.replace(new States.PlayerWalkingRight());
                }
            }
            if ((!this.gk.isDown(37) && !this.gk.isDown(39)) || ((this.moving.current_state instanceof States.PlayerWalkingLeft) && !this.gk.isDown(37)) || ((this.moving.current_state instanceof States.PlayerWalkingRight) && !this.gk.isDown(39)) || ((this.moving.current_state instanceof States.PlayerRunningLeft) && !this.gk.isDown(37)) || ((this.moving.current_state instanceof States.PlayerRunningRight) && !this.gk.isDown(39))) {
                this.moving.replace(new States.PlayerInterialMove());
            }
            if (this.counter["able2runningLeft"] >= 8)
                this.counter["able2runningLeft"] = 0;
            else if (this.counter["able2runningLeft"] > 0)
                this.counter["able2runningLeft"] += 1;
            if (this.counter["able2runningRight"] >= 8)
                this.counter["able2runningRight"] = 0;
            else if (this.counter["able2runningRight"] > 0)
                this.counter["able2runningRight"] += 1;
            if (this.flags["isOnGround"]) {
                if (this.gk.isDown(90) && this.gk.getCount(90) <= 5) {
                    this.moving.push(new States.PlayerJumping());
                }
            }
            if (this.gk.isOnDown(37)) {
                this.counter["able2runningLeft"] = 1;
            }
            if (this.gk.isOnDown(39)) {
                this.counter["able2runningRight"] = 1;
            }
        };
        return Player;
    })(Game.AbstractEntity);
    Game.Player = Player;
    var PlayerStateMachine = (function (_super) {
        __extends(PlayerStateMachine, _super);
        function PlayerStateMachine(e, parent) {
            if (parent === void 0) { parent = null; }
            _super.call(this, e, parent);
        }
        return PlayerStateMachine;
    })(Game.EntityStateMachine);
    Game.PlayerStateMachine = PlayerStateMachine;
    var PlayerMissEvent = (function (_super) {
        __extends(PlayerMissEvent, _super);
        function PlayerMissEvent(type, mode) {
            // mode 1:直接 2:間接
            _super.call(this, type);
            this.type = type;
            this.mode = mode;
        }
        return PlayerMissEvent;
    })(Game.Event);
    Game.PlayerMissEvent = PlayerMissEvent;
    var States;
    (function (States) {
        /*export interface IPlayerMovingState extends State { // 不要説 てか不要
            enter(sm: PlayerStateMachine);
            update(sm: PlayerStateMachine);
            exit(sm: PlayerStateMachine);
        }*/
        // 処理中にジャンプなどに一瞬だけ状態が遷移することで、脈絡なくenterが再度呼ばれる可能性があることに注意
        var PlayerGlobalMove = (function (_super) {
            __extends(PlayerGlobalMove, _super);
            function PlayerGlobalMove() {
                _super.apply(this, arguments);
            }
            PlayerGlobalMove.prototype.update = function (sm) {
                var pl = sm.e;
                if (pl.flags["isAlive"]) {
                    if (pl.flags["isOnGround"]) {
                    }
                    else {
                        if (pl.counter["stamp_waiting"] > 0) {
                        }
                        else {
                            pl.vy += 25; // 重力を受ける
                            if (pl.vy > 160)
                                pl.vy = 160;
                        }
                    }
                }
                if (pl.counter["superjump_effect"] >= 0) {
                    var del = function (s) {
                        if (s)
                            s.kill();
                    };
                    var effect = new PlayerSuperJumpEffect(pl.x, pl.y, pl.imagemanager, pl.label, pl.code, pl.reverse_horizontal);
                    pl.ss.add(effect);
                    pl.sjump_effects.push(effect);
                    del(pl.sjump_effects.shift());
                    if (pl.counter["superjump_effect"] < 9) {
                        pl.counter["superjump_effect"] += 1;
                        if (pl.vy > 0)
                            pl.counter["superjump_effect"] = 9;
                    }
                    else {
                        if (pl.counter["superjump_effect"] >= 100) {
                            pl.counter["superjump_effect"] = -1;
                            while (pl.sjump_effects.length > 0) {
                                del(pl.sjump_effects.shift());
                            }
                        }
                        else if (pl.counter["superjump_effect"] >= 9) {
                            del(pl.sjump_effects.shift());
                            if (pl.sjump_effects.length == 0) {
                                pl.counter["superjump_effect"] = 100;
                            }
                        }
                    }
                }
            };
            return PlayerGlobalMove;
        })(States.AbstractState);
        States.PlayerGlobalMove = PlayerGlobalMove;
        var PlayerWalkingLeft = (function (_super) {
            __extends(PlayerWalkingLeft, _super);
            function PlayerWalkingLeft() {
                _super.apply(this, arguments);
            }
            PlayerWalkingLeft.prototype.enter = function (sm) {
                //console.log("walk left ");
                sm.e.flags["isRunning"] = false;
                sm.e.flags["isWalking"] = true;
            };
            PlayerWalkingLeft.prototype.update = function (sm) {
                var pl = sm.e;
                if (pl.counter["stamp_waiting"] > 0) {
                    pl.vx = (pl.vx - 10 > -60) ? pl.vx - 10 : -60;
                }
                else {
                    if (pl.flags["isOnGround"]) {
                        pl.reverse_horizontal = false;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3)
                            pl.counter["running"] = 0;
                        pl.vx = (pl.vx - 15 > -60) ? pl.vx - 15 : -60;
                        if (pl.vx > 0)
                            pl.code = 108;
                        else
                            pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                    }
                    else {
                        if (pl.vx > -60)
                            pl.vx -= 10;
                    }
                }
            };
            return PlayerWalkingLeft;
        })(States.AbstractState);
        States.PlayerWalkingLeft = PlayerWalkingLeft;
        var PlayerRunningLeft = (function (_super) {
            __extends(PlayerRunningLeft, _super);
            function PlayerRunningLeft() {
                _super.apply(this, arguments);
            }
            PlayerRunningLeft.prototype.enter = function (sm) {
                //console.log("run left ");
                sm.e.flags["isRunning"] = true;
                sm.e.flags["isWalking"] = false;
            };
            PlayerRunningLeft.prototype.update = function (sm) {
                var pl = sm.e;
                if (pl.counter["stamp_waiting"] > 0) {
                    pl.vx = (pl.vx - 10 > -60) ? pl.vx - 10 : -60;
                }
                else {
                    if (pl.flags["isOnGround"]) {
                        pl.reverse_horizontal = false;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3)
                            pl.counter["running"] = 0;
                        pl.vx = (pl.vx - 15 > -120) ? pl.vx - 15 : -120;
                        if (pl.vx > 0)
                            pl.code = 108;
                        else
                            pl.code = 105 + Math.floor(pl.counter["running"] / 2);
                    }
                    else {
                        if (pl.vx > -60)
                            pl.vx -= 10;
                    }
                }
            };
            return PlayerRunningLeft;
        })(States.AbstractState);
        States.PlayerRunningLeft = PlayerRunningLeft;
        var PlayerWalkingRight = (function (_super) {
            __extends(PlayerWalkingRight, _super);
            function PlayerWalkingRight() {
                _super.apply(this, arguments);
            }
            PlayerWalkingRight.prototype.enter = function (sm) {
                //console.log("walk right ");
                sm.e.flags["isRunning"] = false;
                sm.e.flags["isWalking"] = true;
            };
            PlayerWalkingRight.prototype.update = function (sm) {
                var pl = sm.e;
                if (pl.counter["stamp_waiting"] > 0) {
                    pl.vx = (pl.vx + 10 < 60) ? pl.vx + 10 : 60;
                }
                else {
                    if (pl.flags["isOnGround"]) {
                        pl.reverse_horizontal = true;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3)
                            pl.counter["running"] = 0;
                        pl.vx = (pl.vx + 15 < 60) ? pl.vx + 15 : 60;
                        if (pl.vx < 0)
                            pl.code = 108;
                        else
                            pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                    }
                    else {
                        if (pl.vx < 60)
                            pl.vx += 10;
                    }
                }
            };
            return PlayerWalkingRight;
        })(States.AbstractState);
        States.PlayerWalkingRight = PlayerWalkingRight;
        var PlayerRunningRight = (function (_super) {
            __extends(PlayerRunningRight, _super);
            function PlayerRunningRight() {
                _super.apply(this, arguments);
            }
            PlayerRunningRight.prototype.enter = function (sm) {
                //console.log("run right ");
                sm.e.flags["isRunning"] = true;
                sm.e.flags["isWalking"] = false;
            };
            PlayerRunningRight.prototype.update = function (sm) {
                var pl = sm.e;
                if (pl.counter["stamp_waiting"] > 0) {
                    pl.vx = (pl.vx + 10 < 60) ? pl.vx + 10 : 60;
                }
                else {
                    if (pl.flags["isOnGround"]) {
                        pl.reverse_horizontal = true;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3)
                            pl.counter["running"] = 0;
                        pl.vx = (pl.vx + 15 < 120) ? pl.vx + 15 : 120;
                        if (pl.vx < 0)
                            pl.code = 108;
                        else
                            pl.code = 105 + Math.floor(pl.counter["running"] / 2);
                    }
                    else {
                        if (pl.vx < 60)
                            pl.vx += 10;
                    }
                }
            };
            return PlayerRunningRight;
        })(States.AbstractState);
        States.PlayerRunningRight = PlayerRunningRight;
        var PlayerJumping = (function (_super) {
            __extends(PlayerJumping, _super);
            function PlayerJumping() {
                _super.apply(this, arguments);
            }
            PlayerJumping.prototype.update = function (sm) {
                sm.pop(); // 即座にもとのStateに戻す
                sm.update(); // もとのStateのupdateを先に行う
                var pl = sm.e;
                pl.checkCollisionWithBlocksHorizontal();
                if (pl.counter["stamp_waiting"] > 0)
                    return; // 硬直中
                pl.flags["isJumping"] = true;
                pl.flags["isOnGround"] = false;
                var speed = Math.abs(pl.vx);
                /*// 貫通防止
                if (pl.ss.MapBlocks.getByXYReal(pl.centerx + pl.vx / 10, pl.y - 1) != null) {
                    pl.ss.MapBlocks.getByXYReal(pl.centerx + pl.vx / 10, pl.y - 1).dispatchEvent(new SpriteCollisionEvent("onhit", pl, "vertival"));
                }*/
                //if (pl.ss.MapBlocks.getByXYReal(pl.centerx + pl.vx / 10, pl.y - 1) == null || pl.ss.MapBlocks.getByXYReal(pl.centerx, pl.y - 1) == null) {
                if (pl.getHitBlock(pl.x + pl.width / 2 - 1 + pl.vx / 10, pl.y - 1) == null) {
                    if (pl.ss.MapBlocks.getByXYReal(pl.centerx + (pl.vx > 0 ? 1 : -1), pl.centery) != null) {
                        pl.vy = -150;
                        pl.counter["jump_level"] = 1;
                    }
                    else if (speed == 0) {
                        pl.vy = -150;
                        pl.counter["jump_level"] = 1;
                    }
                    else if (speed < 60) {
                        pl.vy = -230;
                        pl.counter["jump_level"] = 2;
                    }
                    else if (speed == 60) {
                        pl.vy = -260;
                        pl.counter["jump_level"] = 3;
                    }
                    else if (speed < 120) {
                        pl.vy = -290;
                        pl.counter["jump_level"] = 4;
                    }
                    else {
                        pl.vy = -340;
                        pl.counter["jump_level"] = 5;
                        pl.counter["superjump_effect"] = 1;
                        var effect = new PlayerSuperJumpEffect(pl.x, pl.y, pl.imagemanager, pl.label, 101, pl.reverse_horizontal);
                        pl.ss.add(effect);
                        if (pl.sjump_effects) {
                            for (var i = 0; i < pl.sjump_effects.length; i++) {
                                var ef = pl.sjump_effects[i];
                                if (ef)
                                    ef.kill();
                            }
                        }
                        pl.sjump_effects = [null, null, null, null, null, effect];
                    }
                }
                pl.checkCollisionWithBlocksVertical();
            };
            return PlayerJumping;
        })(States.AbstractState);
        States.PlayerJumping = PlayerJumping;
        var PlayerInterialMove = (function (_super) {
            __extends(PlayerInterialMove, _super);
            function PlayerInterialMove() {
                _super.apply(this, arguments);
            }
            PlayerInterialMove.prototype.enter = function (sm) {
                //console.log("move interial ");
            };
            PlayerInterialMove.prototype.update = function (sm) {
                var pl = sm.e;
                if (pl.flags["isOnGround"]) {
                    if (pl.vx < 0) {
                        pl.reverse_horizontal = false;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3)
                            pl.counter["running"] = 0;
                        if (pl.flags["isRunning"])
                            pl.code = 107;
                        else
                            pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                    }
                    else if (pl.vx > 0) {
                        pl.reverse_horizontal = true;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3)
                            pl.counter["running"] = 0;
                        if (pl.flags["isRunning"])
                            pl.code = 107;
                        else
                            pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                    }
                    // 摩擦を受ける
                    if (pl.vx > 0) {
                        pl.vx -= 5;
                        if (pl.vx < 0)
                            pl.vx = 0;
                    }
                    else if (pl.vx < 0) {
                        pl.vx += 5;
                        if (pl.vx > 0)
                            pl.vx = 0;
                    }
                    if (pl.vx == 0) {
                        pl.flags["isRunning"] = false;
                        pl.flags["isWalking"] = false;
                        pl.code = 100;
                    }
                }
                else {
                }
            };
            return PlayerInterialMove;
        })(States.AbstractState);
        States.PlayerInterialMove = PlayerInterialMove;
        var PlayerDyingDirect = (function (_super) {
            __extends(PlayerDyingDirect, _super);
            function PlayerDyingDirect() {
                _super.apply(this, arguments);
            }
            PlayerDyingDirect.prototype.enter = function (sm) {
                //console.log("dying");
                var pl = sm.e;
                pl.flags["isAlive"] = false;
                pl.counter["dying"] = 0;
            };
            PlayerDyingDirect.prototype.update = function (sm) {
                var pl = sm.e;
                if (pl.counter["dying"] == 0) {
                    pl.vx = 0;
                    pl.vy = -280; // 跳ね上がる
                }
                pl.vy += 25; // 重力を受ける
                if (pl.vy > 100)
                    pl.vy = 100;
                if (pl.counter["dying"] < 18)
                    pl.counter["dying"] += 1;
                pl.code = 110 + pl.counter["dying"] % 4;
                if (pl.y > pl.view_y + Game.SCREEN_HEIGHT + pl.height) {
                    pl.kill();
                    pl.dispatchEvent(new Game.Event("ondie"));
                }
            };
            return PlayerDyingDirect;
        })(States.AbstractState);
        States.PlayerDyingDirect = PlayerDyingDirect;
        var PlayerDyingInDirect = (function (_super) {
            __extends(PlayerDyingInDirect, _super);
            function PlayerDyingInDirect() {
                _super.apply(this, arguments);
            }
            PlayerDyingInDirect.prototype.enter = function (sm) {
                //console.log("dying");
                var pl = sm.e;
                pl.flags["isAlive"] = false;
                pl.counter["dying"] = 0;
            };
            PlayerDyingInDirect.prototype.update = function (sm) {
                var pl = sm.e;
                if (pl.counter["dying"] == 0) {
                    pl.vx = 0;
                }
                pl.vy = 0; // その場で回転する
                if (pl.counter["dying"] < 18)
                    pl.counter["dying"] += 1;
                pl.code = 110 + pl.counter["dying"] % 4;
                if (pl.counter["dying"] >= 18)
                    pl.vy = 80;
                if (pl.y > pl.view_y + Game.SCREEN_HEIGHT + pl.height) {
                    pl.kill();
                    pl.dispatchEvent(new Game.Event("ondie"));
                }
            };
            return PlayerDyingInDirect;
        })(States.AbstractState);
        States.PlayerDyingInDirect = PlayerDyingInDirect;
        var PlayerStamping = (function (_super) {
            __extends(PlayerStamping, _super);
            function PlayerStamping() {
                _super.apply(this, arguments);
            }
            PlayerStamping.prototype.enter = function (sm) {
                //console.log("stamping");
                var pl = sm.e;
                pl.code = 109;
                pl.flags["isStamping"] = true;
                pl.counter["stamp_waiting"] = 5;
                if (pl.counter["stamp_level"] == 1) {
                    pl.vy = -160;
                }
                else if (pl.counter["stamp_level"] == 2) {
                    pl.vy = -220;
                }
                else {
                    pl.vy = -160;
                }
                if (pl.counter["superjump_effect"] >= 0)
                    pl.counter["superjump_effect"] = 100;
                sm.pop(); // update時ではなくenter直後にもとのstateに戻す
            };
            PlayerStamping.prototype.update = function (sm) {
                /*sm.pop();
                sm.update();*/
            };
            return PlayerStamping;
        })(States.AbstractState);
        States.PlayerStamping = PlayerStamping;
        var PlayerWithoutSpecialMove = (function (_super) {
            __extends(PlayerWithoutSpecialMove, _super);
            function PlayerWithoutSpecialMove() {
                _super.apply(this, arguments);
            }
            PlayerWithoutSpecialMove.prototype.enter = function (sm) {
            };
            PlayerWithoutSpecialMove.prototype.update = function (sm) {
            };
            return PlayerWithoutSpecialMove;
        })(States.AbstractState);
        States.PlayerWithoutSpecialMove = PlayerWithoutSpecialMove;
    })(States = Game.States || (Game.States = {}));
    var PlayerSuperJumpEffect = (function (_super) {
        __extends(PlayerSuperJumpEffect, _super);
        function PlayerSuperJumpEffect(x, y, imagemanager, label, code, reverse_horizontal) {
            _super.call(this, x, y, imagemanager, label, 100, 1, 1);
            this.code = code;
            this.z = 129;
            this.reverse_horizontal = reverse_horizontal;
        }
        PlayerSuperJumpEffect.prototype.update = function () {
        };
        return PlayerSuperJumpEffect;
    })(Game.Sprite);
    Game.PlayerSuperJumpEffect = PlayerSuperJumpEffect;
})(Game || (Game = {}));
/// <reference path="enemy.ts"/>
var Game;
(function (Game) {
    var UnStampableWalker = (function (_super) {
        __extends(UnStampableWalker, _super);
        function UnStampableWalker(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.UnStampableWalkerWalking());
        }
        return UnStampableWalker;
    })(Game.AbstractEnemy);
    Game.UnStampableWalker = UnStampableWalker;
    var States;
    (function (States) {
        var UnStampableWalkerWalking = (function (_super) {
            __extends(UnStampableWalkerWalking, _super);
            function UnStampableWalkerWalking() {
                _super.apply(this, arguments);
            }
            UnStampableWalkerWalking.prototype.enter = function (sm) {
            };
            UnStampableWalkerWalking.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2)
                    e.code = 152;
                else
                    e.code = 153;
                e.vx = e.reverse_horizontal ? 40 : -40;
                if (e.ss.MapBlocks.getByXYReal((e.reverse_horizontal ? e.right : e.x) + e.vx / 10, e.y + e.height + 1) == null) {
                    e.reverse_horizontal = !e.reverse_horizontal;
                    e.x = e.ss.MapBlocks.getByXYReal(e.centerx, e.y + e.height + 1).x;
                    e.vx = 0;
                }
                this.checkCollisionWithPlayer(sm);
            };
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            UnStampableWalkerWalking.prototype.checkCollisionWithPlayer = function (sm) {
                var e = sm.e;
                var players = sm.e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            var dy = Math.abs(e.y - p.y); // プレイヤーとのy座標の差
                            if (p.flags["isAlive"] && dx < 30 && dy < 23) {
                                // プレイヤーにダメージ
                                p.dispatchEvent(new Game.PlayerMissEvent("miss", 1));
                            }
                        });
                    })(p);
                }
            };
            return UnStampableWalkerWalking;
        })(States.AbstractState);
        States.UnStampableWalkerWalking = UnStampableWalkerWalking;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="enemy.ts"/>
var Game;
(function (Game) {
    var Walker = (function (_super) {
        __extends(Walker, _super);
        function Walker(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.WalkerWalking());
            //this.code = 140;
            this.addEventHandler("onstamped", this.onStamped);
            //this.addEventHandler("onhit", this.onHit);
        }
        Walker.prototype.onStamped = function (e) {
            if (this.flags["isAlive"])
                this.moving.replace(new States.WalkerStamped());
            this.vx = 0;
            this.vy = 0;
        };
        return Walker;
    })(Game.AbstractEnemy);
    Game.Walker = Walker;
    var FallableWalker = (function (_super) {
        __extends(FallableWalker, _super);
        function FallableWalker(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label);
            this.moving.replace(new States.FallableWalkerWalking());
        }
        return FallableWalker;
    })(Walker);
    Game.FallableWalker = FallableWalker;
    var ThreeWalkerFallableGenerator = (function (_super) {
        __extends(ThreeWalkerFallableGenerator, _super);
        function ThreeWalkerFallableGenerator(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.Generate3FallableWalkerState());
        }
        return ThreeWalkerFallableGenerator;
    })(Game.AbstractEntity);
    Game.ThreeWalkerFallableGenerator = ThreeWalkerFallableGenerator;
    var States;
    (function (States) {
        var WalkerWalking = (function (_super) {
            __extends(WalkerWalking, _super);
            function WalkerWalking() {
                _super.apply(this, arguments);
            }
            WalkerWalking.prototype.enter = function (sm) {
            };
            WalkerWalking.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2)
                    e.code = 140;
                else
                    e.code = 141;
                e.vx = e.reverse_horizontal ? 30 : -30;
                if (e.ss.MapBlocks.getByXYReal((e.reverse_horizontal ? e.right : e.x) + e.vx / 10, e.y + e.height + 1) == null) {
                    e.reverse_horizontal = !e.reverse_horizontal;
                    e.x = e.ss.MapBlocks.getByXYReal(e.centerx, e.y + e.height + 1).x;
                    e.vx = 0;
                }
                this.checkCollisionWithPlayer(sm);
            };
            return WalkerWalking;
        })(States.AbstractStampableAlive);
        States.WalkerWalking = WalkerWalking;
        var FallableWalkerWalking = (function (_super) {
            __extends(FallableWalkerWalking, _super);
            function FallableWalkerWalking() {
                _super.apply(this, arguments);
            }
            FallableWalkerWalking.prototype.enter = function (sm) {
            };
            FallableWalkerWalking.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2)
                    e.code = 140;
                else
                    e.code = 141;
                e.vx = e.reverse_horizontal ? 30 : -30;
                if (e.ss.MapBlocks.getByXYReal((e.reverse_horizontal ? e.x : e.right) + e.vx / 10, e.y + e.height + 1) == null) {
                    e.x = Math.floor(((e.reverse_horizontal ? e.x : e.right) + e.vx / 10) / e.width) * e.width; // マップチップの横幅がエンティティの横幅と同じであること依存している点に注意
                    e.vx = 0;
                    sm.replace(new WalkerFalling());
                }
                this.checkCollisionWithPlayer(sm);
            };
            return FallableWalkerWalking;
        })(States.AbstractStampableAlive);
        States.FallableWalkerWalking = FallableWalkerWalking;
        var WalkerFalling = (function (_super) {
            __extends(WalkerFalling, _super);
            function WalkerFalling() {
                _super.apply(this, arguments);
            }
            WalkerFalling.prototype.enter = function (sm) {
                sm.e.flags["isOnGround"] = false;
            };
            WalkerFalling.prototype.update = function (sm) {
                var e = sm.e;
                if (e.flags["isOnGround"]) {
                    sm.replace(new FallableWalkerWalking());
                    sm.update();
                }
                else {
                    e.code = 140;
                    e.vy = 50;
                    this.checkCollisionWithPlayer(sm);
                }
            };
            return WalkerFalling;
        })(States.AbstractStampableAlive);
        States.WalkerFalling = WalkerFalling;
        var WalkerStamped = (function (_super) {
            __extends(WalkerStamped, _super);
            function WalkerStamped() {
                _super.apply(this, arguments);
            }
            WalkerStamped.prototype.enter = function (sm) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 142;
                sm.e.flags["isAlive"] = false;
            };
            WalkerStamped.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 142;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] > 14) {
                    e.kill();
                }
            };
            return WalkerStamped;
        })(States.AbstractState);
        States.WalkerStamped = WalkerStamped;
        var Generate3FallableWalkerState = (function (_super) {
            __extends(Generate3FallableWalkerState, _super);
            function Generate3FallableWalkerState() {
                _super.apply(this, arguments);
            }
            Generate3FallableWalkerState.prototype.enter = function (sm) {
            };
            Generate3FallableWalkerState.prototype.update = function (sm) {
                var e = sm.e;
                for (var i = 0; i < 3; i++) {
                    var entity = new FallableWalker(e.x + 75 * i, e.y, e.imagemanager, e.label);
                    entity.counter["viewx_activate"] -= 64 * i;
                    e.ss.add(entity);
                    entity.update();
                }
                e.kill();
            };
            return Generate3FallableWalkerState;
        })(States.AbstractState);
        States.Generate3FallableWalkerState = Generate3FallableWalkerState;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="enemy.ts"/>
var Game;
(function (Game) {
    var WaterShooter = (function (_super) {
        __extends(WaterShooter, _super);
        function WaterShooter(x, y, imagemanager, label) {
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.WaterShooterWaiting());
            this.addEventHandler("onstamped", this.onStamped);
            this.counter["x_first"] = this.x;
            this.counter["g_ac"] = 0;
        }
        WaterShooter.prototype.move = function () {
            // 接触判定を行わない
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        };
        WaterShooter.prototype.onStamped = function (e) {
            if (this.flags["isAlive"])
                this.moving.replace(new States.WaterShooterStamped());
            this.vx = 0;
            this.vy = 0;
        };
        return WaterShooter;
    })(Game.AbstractEnemy);
    Game.WaterShooter = WaterShooter;
    var States;
    (function (States) {
        var WaterShooterWaiting = (function (_super) {
            __extends(WaterShooterWaiting, _super);
            function WaterShooterWaiting() {
                _super.apply(this, arguments);
            }
            WaterShooterWaiting.prototype.enter = function (sm) {
            };
            WaterShooterWaiting.prototype.update = function (sm) {
                var e = sm.e;
                e.vx = 0;
                e.vy = 0;
                e.code = 160;
                var players = sm.e.ss.Players.get_all();
                var pt = null; // 最も近いプレイヤー
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (pt == null) {
                        pt = p;
                    }
                    else if (Math.abs(p.x - e.x) < Math.abs(pt.x - e.x)) {
                        pt = p;
                    }
                }
                if (pt != null) {
                    if (e.x + 8 >= pt.x)
                        e.reverse_horizontal = false; // 最も近いプレイヤーに合わせて反転状態を決定
                    else
                        e.reverse_horizontal = true;
                }
                if (e.counter["ac"] > 0) {
                    e.counter["ac"] += 1;
                    if (e.counter["ac"] == 2) {
                        if (e.reverse_horizontal) {
                            // 右向きに発射
                            var attack = new WaterShotRight(e.x, e.y, e.imagemanager, e.label);
                        }
                        else {
                            // 左向きに発射
                            var attack = new WaterShotLeft(e.x, e.y, e.imagemanager, e.label);
                        }
                        e.ss.add(attack);
                    }
                    if (e.counter["ac"] > 20) {
                        e.counter["ac"] = 0;
                        sm.replace(new WaterShooterWalking());
                    }
                }
                else if (e.counter["ac"] < 0) {
                    e.counter["ac"] += 1;
                }
                else {
                    var flg = false;
                    for (var i = 0; i < players.length; i++) {
                        var p = players[i];
                        if (p.x >= e.x - 240 && p.x <= e.x + 240) {
                            flg = true;
                            break;
                        }
                    }
                    if (flg) {
                        e.counter["ac"] = 1;
                    }
                }
                this.checkCollisionWithPlayer(sm);
            };
            return WaterShooterWaiting;
        })(States.AbstractStampableAlive);
        States.WaterShooterWaiting = WaterShooterWaiting;
        var WaterShooterWalking = (function (_super) {
            __extends(WaterShooterWalking, _super);
            function WaterShooterWalking() {
                _super.apply(this, arguments);
            }
            WaterShooterWalking.prototype.enter = function (sm) {
                sm.e.counter["ac"] = 0;
            };
            WaterShooterWalking.prototype.update = function (sm) {
                var e = sm.e;
                if (e.counter["ac"] <= 0) {
                    e.counter["g_ac"] = (e.counter["g_ac"] + 1) % 4;
                    e.code = 161 + Math.floor(e.counter["g_ac"] / 2);
                    e.reverse_horizontal = true;
                    e.vx = 30;
                    if (e.x + e.vx / 10 >= e.counter["x_first"] + 96) {
                        e.x = e.counter["x_first"] + 96;
                        e.vx = 0;
                        e.counter["ac"] = 10;
                    }
                    // ブロックとの当たり判定
                    var blocks = e.ss.getBlocks(e.x + e.vx / 10, e.y, e.width, e.height + 1);
                    var flg = false;
                    for (var i = 0; i < blocks.length; i++) {
                        var b = blocks[i];
                        var bc = b.getCollision();
                        if (new Game.Point(e.right - 1 + e.vx / 10, e.bottom).collision(bc)) {
                            flg = true;
                            break;
                        }
                    }
                    if (!flg) {
                        // 足元にブロックがないなら止まる
                        e.x = Math.floor((e.right - 1) / e.width - 1) * e.width;
                        e.vx = 0;
                        e.counter["ac"] = 10;
                    }
                }
                else if (e.counter["ac"] <= 35) {
                    e.counter["ac"] += 1;
                    e.code = 160;
                    var players = sm.e.ss.Players.get_all();
                    var pt = null; // 最も近いプレイヤー
                    for (var i = 0; i < players.length; i++) {
                        var p = players[i];
                        if (pt == null) {
                            pt = p;
                        }
                        else if (Math.abs(p.x - e.x) < Math.abs(pt.x - e.x)) {
                            pt = p;
                        }
                    }
                    if (pt != null) {
                        if (e.x + 8 >= pt.x)
                            e.reverse_horizontal = false; // 最も近いプレイヤーに合わせて反転状態を決定
                        else
                            e.reverse_horizontal = true;
                        if (e.counter["ac"] == 15 - 1) {
                            // 水鉄砲
                            if (e.reverse_horizontal) {
                                // 右向きに発射
                                var attack = new WaterShotRight(e.x, e.y, e.imagemanager, e.label);
                            }
                            else {
                                // 左向きに発射
                                var attack = new WaterShotLeft(e.x, e.y, e.imagemanager, e.label);
                            }
                            e.ss.add(attack);
                        }
                    }
                }
                else {
                    e.counter["g_ac"] = (e.counter["g_ac"] + 1) % 4;
                    e.code = 161 + Math.floor(e.counter["g_ac"] / 2);
                    e.reverse_horizontal = false;
                    e.vx = -30;
                    if (e.x + e.vx / 10 <= e.counter["x_first"]) {
                        e.x = e.counter["x_first"];
                        e.vx = 0;
                        e.counter["ac"] = -20;
                        sm.replace(new WaterShooterWaiting());
                    }
                    // ブロックとの当たり判定
                    var blocks = e.ss.getBlocks(e.x + e.vx / 10, e.y, e.width, e.height + 1);
                    var flg = false;
                    for (var i = 0; i < blocks.length; i++) {
                        var b = blocks[i];
                        var bc = b.getCollision();
                        if (new Game.Point(e.x + e.vx / 10, e.bottom).collision(bc)) {
                            flg = true;
                            break;
                        }
                    }
                    if (!flg) {
                        // 足元にブロックがないなら止まる
                        e.x = Math.floor((e.x) / 32 + 1) * 32;
                        e.vx = 0;
                        e.counter["ac"] = -20;
                        sm.replace(new WaterShooterWaiting());
                    }
                }
                this.checkCollisionWithPlayer(sm);
            };
            return WaterShooterWalking;
        })(States.AbstractStampableAlive);
        States.WaterShooterWalking = WaterShooterWalking;
        var WaterShooterStamped = (function (_super) {
            __extends(WaterShooterStamped, _super);
            function WaterShooterStamped() {
                _super.apply(this, arguments);
            }
            WaterShooterStamped.prototype.enter = function (sm) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 163;
                sm.e.flags["isAlive"] = false;
            };
            WaterShooterStamped.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 163;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] > 14) {
                    e.kill();
                }
            };
            return WaterShooterStamped;
        })(States.AbstractState);
        States.WaterShooterStamped = WaterShooterStamped;
    })(States = Game.States || (Game.States = {}));
    var WaterShotLeft = (function (_super) {
        __extends(WaterShotLeft, _super);
        function WaterShotLeft(x, y, imagemanager, label, target) {
            if (target === void 0) { target = null; }
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.WaterShotMoving());
            this.z = 257;
            this.vx = -80;
            this.vy = -225;
            this.x += Math.floor(this.vx / 10);
            this.y += Math.floor(this.vy / 10) > 180 ? 180 : Math.floor(this.vy / 10);
            this.code = 128;
        }
        return WaterShotLeft;
    })(Game.AbstractEntity);
    Game.WaterShotLeft = WaterShotLeft;
    var WaterShotRight = (function (_super) {
        __extends(WaterShotRight, _super);
        function WaterShotRight(x, y, imagemanager, label, target) {
            if (target === void 0) { target = null; }
            _super.call(this, x, y, imagemanager, label, 1, 1);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.WaterShotMoving());
            this.z = 257;
            this.vx = 80;
            this.vy = -225;
            this.x += Math.floor(this.vx / 10);
            this.y += Math.floor(this.vy / 10) > 180 ? 180 : Math.floor(this.vy / 10);
            this.code = 128;
        }
        return WaterShotRight;
    })(Game.AbstractEntity);
    Game.WaterShotRight = WaterShotRight;
    var States;
    (function (States) {
        var WaterShotMoving = (function (_super) {
            __extends(WaterShotMoving, _super);
            function WaterShotMoving() {
                _super.apply(this, arguments);
            }
            WaterShotMoving.prototype.enter = function (sm) {
                var e = sm.e;
                e.counter["ac"] = 0;
                e.code = 128;
            };
            WaterShotMoving.prototype.update = function (sm) {
                var e = sm.e;
                if (!e.flags["isAlive"]) {
                    e.kill();
                    return;
                }
                e.vy += 25;
                if (e.vy > 180)
                    e.vy = 180;
                e.x += Math.floor(e.vx / 10);
                e.y += Math.floor(e.vy / 10);
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                e.code = 128 + Math.floor(e.counter["ac"] / 2);
                e.reverse_horizontal = e.vx > 0;
                var blocks = e.ss.getBlocks(e.x, e.y, e.width, e.height);
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();
                    // ブロックと衝突したら消失
                    if (new Game.Point(e.centerx - 1, e.centery - 1).collision(bc) || new Game.Point(e.centerx - 1, e.centery - 1).collision(bc)) {
                        e.flags["isAlive"] = false;
                        e.kill();
                        return;
                    }
                }
                this.checkOutOfScreen(sm);
                this.checkCollisionWithPlayer(sm);
            };
            WaterShotMoving.prototype.checkOutOfScreen = function (sm) {
                var e = sm.e;
                // スクロール範囲外に出ていたら消失
                var players = e.ss.Players.get_all();
                var flg = false;
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (e.x >= p.view_x - e.width && e.x <= p.view_x + Game.SCREEN_WIDTH + e.width * 4 && e.y >= p.view_y - e.width - Game.SCREEN_HEIGHT / 2 && e.y <= p.view_y + Game.SCREEN_HEIGHT) {
                        flg = true;
                        break;
                    }
                }
                if (!flg) {
                    e.kill();
                    return;
                }
            };
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            WaterShotMoving.prototype.checkCollisionWithPlayer = function (sm) {
                var e = sm.e;
                var players = e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    (function (p) {
                        p.addOnceEventHandler("update", function () {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            var dy = Math.abs(e.y - p.y); // プレイヤーとのy座標の差
                            if (p.flags["isAlive"] && dx <= 23 && dy <= 28) {
                                // TODO:バリア判定はここに書く
                                // プレイヤーにダメージ
                                p.dispatchEvent(new Game.PlayerMissEvent("miss", 2));
                            }
                        });
                    })(p);
                }
            };
            return WaterShotMoving;
        })(States.AbstractState);
        States.WaterShotMoving = WaterShotMoving;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var SpriteCollisionEvent = (function (_super) {
        __extends(SpriteCollisionEvent, _super);
        function SpriteCollisionEvent(type, sprite, dir, mode) {
            if (dir === void 0) { dir = "none"; }
            if (mode === void 0) { mode = "edge"; }
            _super.call(this, type, sprite);
            this.type = type;
            this.sprite = sprite;
            this.dir = dir;
            this.mode = mode;
        }
        return SpriteCollisionEvent;
    })(Game.SpriteEvent);
    Game.SpriteCollisionEvent = SpriteCollisionEvent;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var ScoreEvent = (function (_super) {
        __extends(ScoreEvent, _super);
        function ScoreEvent(type, value) {
            _super.call(this, type);
            this.value = value;
        }
        return ScoreEvent;
    })(Game.Event);
    Game.ScoreEvent = ScoreEvent;
    var ScoreManager = (function (_super) {
        __extends(ScoreManager, _super);
        function ScoreManager() {
            _super.call(this);
            this._score = 0;
            this._highscore = 0;
        }
        ScoreManager.prototype.AddScore = function (value) {
            var tmp = this._score;
            var flg = false;
            this._score += value;
            if (this._score < 0)
                this._score = 0;
            if (tmp == this._score)
                return;
            if (this._score > this._highscore) {
                this._highscore = this._score;
            }
            this.dispatchEvent(new ScoreEvent("scorechanged", this._score));
            if (flg)
                this.dispatchEvent(new ScoreEvent("highscorechanged", this._highscore));
        };
        ScoreManager.prototype.SetScore = function (value) {
            var tmp = this._score;
            var flg = false;
            this._score = value;
            if (this._score < 0)
                this._score = 0;
            if (tmp == this._score)
                return;
            if (this._score > this._highscore) {
                this._highscore = this._score;
            }
            this.dispatchEvent(new ScoreEvent("scorechanged", this._score));
            if (flg)
                this.dispatchEvent(new ScoreEvent("highscorechanged", this._highscore));
        };
        ScoreManager.prototype.GetScore = function () {
            return this._score;
        };
        ScoreManager.prototype.GetHighScore = function () {
            return this._highscore;
        };
        ScoreManager.prototype.Reset = function () {
            if (this._score != 0) {
                this._score = 0;
                this.dispatchEvent(new ScoreEvent("scorechanged", this._score));
            }
            if (this._highscore != 0) {
                this._highscore = 0;
                this.dispatchEvent(new ScoreEvent("highscorechanged", this._highscore));
            }
        };
        return ScoreManager;
    })(Game.EventDispatcher);
    Game.ScoreManager = ScoreManager;
})(Game || (Game = {}));
/// <reference path="score.ts"/>
var Game;
(function (_Game) {
    var GameStateMachine = (function (_super) {
        __extends(GameStateMachine, _super);
        function GameStateMachine(game, parent) {
            if (parent === void 0) { parent = null; }
            _super.call(this, parent);
            this.game = game;
        }
        return GameStateMachine;
    })(_Game.StateMachine);
    _Game.GameStateMachine = GameStateMachine;
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(config) {
            var _this = this;
            _super.call(this, config);
            this.statemachine = new GameStateMachine(this);
            this.score = new _Game.ScoreManager();
            this.hud_score = this.score.GetScore();
            this.hud_highscore = this.score.GetHighScore();
            this.addEventHandler("update", function () {
                var ctx = _this.screen.context;
                ctx.save();
                ctx.fillStyle = "blue";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.font = "bold 14px sans-serif";
                ctx.fillText("SCORE " + _this.hud_score.toString() + "  HIGHSCORE " + _this.hud_highscore.toString(), 40, 20);
                ctx.restore();
            });
            this.score.addEventHandler("scorechanged", (function () {
                _this.hud_score = _this.score.GetScore();
            }).bind(this)); // thisでbindしておく ハイスコアの処理ははstage.tsに
        }
        return Game;
    })(_Game.Core);
    _Game.Game = Game;
})(Game || (Game = {}));
var Game;
(function (Game) {
    // ステージマップの役割を持つGroup。
    // 座標からSpriteを取得でき、かつ取得がそこそこ高速であることが期待される。
    // 座標が変化することのないSpriteが登録されるべきである。
    // TODO: 突貫工事で上と左右に番兵をつけているのをどうにかする
    var MapGroup = (function () {
        function MapGroup(screen, width, height, chipwidth, chipheight) {
            if (width === void 0) { width = 180; }
            if (height === void 0) { height = 30; }
            if (chipwidth === void 0) { chipwidth = 32; }
            if (chipheight === void 0) { chipheight = 32; }
            this.screen = screen;
            this._map = new Array();
            for (var i = 0; i < height + 12; i++) {
                this._map.push(new Array());
                for (var ii = 0; ii < width + 2; ii++) {
                    this._map[i].push(null);
                }
            }
            this._sprites = [];
            this._width = width;
            this._height = height;
            this.setChipSize(chipwidth, chipwidth); // 32*32サイズのSpriteを保管 TODO:変更可能に
        }
        Object.defineProperty(MapGroup.prototype, "chipwidth", {
            get: function () {
                return this._chipwidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapGroup.prototype, "chipheight", {
            get: function () {
                return this._chipheight;
            },
            enumerable: true,
            configurable: true
        });
        MapGroup.prototype.setChipSize = function (width, height) {
            this._chipwidth = width;
            this._chipheight = height;
        };
        MapGroup.prototype.compare = function (a, b) {
            if (a.z > b.z) {
                return -1; // ここで-1を返しているので逆順のソート
            }
            if (a.z < b.z) {
                return 1;
            }
            return 0;
        };
        MapGroup.prototype.add = function (sprite) {
            if (sprite.is_killed)
                return; // 既にkillされていた場合追加はできない
            var nx = Math.floor(sprite.x / this.chipwidth) + 1;
            var ny = Math.floor(sprite.y / this.chipheight) + 11;
            if (nx < 0 || nx >= this._width + 2 || ny < 0 || ny >= this._height + 12)
                return; // TODO:もう少しマシにする
            if (!this._map[ny] || !this._map[ny][nx]) {
                this._map[ny][nx] = sprite;
                var i = this._sprites.length - 1;
                while (i >= 0) {
                    if (this.compare(sprite, this._sprites[i]) >= 0) {
                        break;
                    }
                    i -= 1;
                }
                this._sprites.splice(i + 1, 0, sprite);
            }
            else
                throw new Error("sprite already registered");
        };
        MapGroup.prototype.getByXY = function (nx, ny) {
            if (this._map[ny + 11] && this._map[ny + 11][nx + 1])
                return this._map[ny + 11][nx + 1];
            else
                return null;
        };
        MapGroup.prototype.getByXYReal = function (x, y) {
            var nx = Math.floor(x / this.chipwidth) + 1;
            var ny = Math.floor(y / this.chipheight) + 11;
            if (this._map[ny] && this._map[ny][nx])
                return this._map[ny][nx];
            return null;
        };
        MapGroup.prototype.getByRect = function (nx, ny, nwidth, nheight) {
            var result = new Array();
            ny = ny + 11;
            nx = nx + 1;
            for (var i = ny; i < ny + nwidth; i++) {
                for (var ii = nx; ii < nx + nheight; ii++) {
                    if (this._map[i] && this._map[i][ii])
                        result.push(this._map[i][ii]);
                }
            }
            return result;
        };
        MapGroup.prototype.getByRectReal = function (x, y, width, height) {
            var result = new Array();
            var nx = Math.floor(x / this.chipwidth) + 1;
            var ny = Math.floor(y / this.chipheight) + 11;
            var nx2 = Math.ceil((x + width) / this.chipwidth) + 1;
            var ny2 = Math.ceil((y + height) / this.chipheight) + 11;
            for (var i = ny; i < ny2; i++) {
                for (var ii = nx; ii < nx2; ii++) {
                    if (this._map[i] && this._map[i][ii])
                        result.push(this._map[i][ii]);
                }
            }
            return result;
        };
        MapGroup.prototype.remove = function (sprite) {
            for (var i = 0; i < this._height + 12; i++) {
                for (var ii = 0; ii < this._width + 2; ii++) {
                    if (this._map[i][ii] == sprite) {
                        this._map[i][ii] = null;
                    }
                }
            }
        };
        MapGroup.prototype.remove_all = function () {
            for (var i = 0; i < this._height + 12; i++) {
                for (var ii = 0; ii < this._width + 2; ii++) {
                    if (this._map[i][ii])
                        this.remove(this._map[i][ii]);
                }
            }
        };
        MapGroup.prototype.get_all = function () {
            return this._sprites.slice(0);
        };
        MapGroup.prototype.sort = function () {
            this._sprites = this._sprites.sort(this.compare);
        };
        MapGroup.prototype.update = function () {
            for (var i = 0; i < this._height; i++) {
                for (var ii = 0; ii < this._width; ii++) {
                    if (this._map[i][ii])
                        this._map[i][ii].update();
                }
            }
        };
        MapGroup.prototype.draw = function () {
            for (var i = 0; i < this._height; i++) {
                for (var ii = 0; ii < this._width; ii++) {
                    if (this._map[i][ii])
                        this.screen.drawSurface(this._map[i][ii].surface, Math.round(this._map[i][ii].x), Math.round(this._map[i][ii].y));
                }
            }
        };
        return MapGroup;
    })();
    Game.MapGroup = MapGroup;
    // マップの管理
    var MapGenerator = (function () {
        function MapGenerator(ss) {
            this.setSS(ss);
            this.initLookupTable();
        }
        // to overridden
        MapGenerator.prototype.initLookupTable = function () {
            this.lookup = {};
            this.lookup["A"] = Game.Player;
            this.lookup["B"] = Game.Walker;
            this.lookup["C"] = Game.FallableWalker;
            this.lookup["D"] = Game.ThreeWalkerFallableGenerator;
            this.lookup["E"] = Game.ElectricShooter;
            this.lookup["F"] = Game.LeafShooter;
            this.lookup["G"] = Game.UnStampableWalker;
            this.lookup["H"] = Game.FlierUpDown;
            this.lookup["I"] = Game.Flier;
            this.lookup["J"] = Game.ThreeFlierGenerator;
            this.lookup["O"] = Game.Jumper;
            this.lookup["P"] = Game.FireShooter;
            this.lookup["Q"] = Game.WaterShooter;
            this.lookup["R"] = Game.BomberWithoutReturn;
            this.lookup["a"] = Game.Block1;
            this.lookup["b"] = Game.Block2;
            this.lookup["c"] = Game.Block3;
            this.lookup["d"] = Game.Block4;
            this.lookup["e"] = Game.Block5;
            this.lookup["f"] = Game.Block6;
            this.lookup["1"] = Game.CloudLeft;
            this.lookup["2"] = Game.CloudRight;
            this.lookup["3"] = Game.Grass;
            this.lookup["5"] = Game.UpwardNeedle;
            this.lookup["6"] = Game.DownwardNeedle;
            this.lookup["7"] = Game.Torch;
            this.lookup["8"] = Game.GoalStar;
            this.lookup["9"] = Game.Coin;
        };
        MapGenerator.prototype.setSS = function (ss) {
            this.ss = ss;
        };
        // SpriteSystem内にマップを生成します
        // UNDONE:unique Entity(ex:"A")
        MapGenerator.prototype.generateMap = function (map, swidth, sheight, game) {
            for (var i = 0; i < map.length; i += 1) {
                for (var ii = 0; ii < map[i].length; ii += 1) {
                    var e = this.lookup[map[i][ii]];
                    if (e != undefined) {
                        //e(this.ss,swidth,sheight);
                        //new e(this.ss, swidth * ii, sheight * i, game);
                        //console.log(e);
                        if (e != Game.Player)
                            this.ss.add(new e(swidth * ii, sheight * i, game.assets.image, "pattern"));
                        else {
                            this.player = new e(game.gamekey, swidth * ii, sheight * i, game.assets.image, "pattern");
                            this.ss.add(this.player); // この場合より右下のAがplayerとなり本家と挙動が異なる
                        }
                    }
                }
            }
        };
        MapGenerator.prototype.getEntity = function (code) {
            return this.lookup[code];
        };
        return MapGenerator;
    })();
    Game.MapGenerator = MapGenerator;
})(Game || (Game = {}));
var Game;
(function (Game) {
    // ゲーム内オブジェクトの参照・走査を一手に引き受けるクラス。
    var SpriteSystem = (function () {
        function SpriteSystem(screen) {
            this.screen = screen;
            this.AllSprites = new Game.Group(screen);
            this.Players = new Game.Group(screen);
            this.MapBlocks = new Game.MapGroup(screen, 180, 30);
            this.groups = new Array();
            this.groups.push(this.AllSprites, this.Players, this.MapBlocks);
        }
        SpriteSystem.prototype.add = function (s) {
            if (s.is_killed)
                return; // 既にkillされていた場合追加はできない
            this.AllSprites.add(s);
            if (s instanceof Game.Player) {
                this.Players.add(s);
            }
            if (s instanceof Game.AbstractBlock) {
                this.MapBlocks.add(s);
            }
            s.ss = this;
        };
        SpriteSystem.prototype.remove = function (s) {
            for (var i = 0; i < this.groups.length; i++) {
                this.groups[i].remove(s);
            }
        };
        /*public virtual Block GetBlock(int x, int y) {
            try { return BlockData[x / 32, y / 32]; }
            catch { return null; }
        }*/
        SpriteSystem.prototype.getBlock = function (x, y) {
            return this.MapBlocks.getByXY(Math.floor(x / 32), Math.floor(y / 32));
        };
        SpriteSystem.prototype.getBlocks = function (x, y, width, height) {
            return this.MapBlocks.getByRectReal(x, y, width, height);
        };
        return SpriteSystem;
    })();
    Game.SpriteSystem = SpriteSystem;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Ending = (function (_super) {
            __extends(Ending, _super);
            function Ending() {
                _super.apply(this, arguments);
            }
            Ending.prototype.enter = function (sm) {
                this.bg = sm.game.assets.image.get("ending");
                this.counter = 0;
            };
            Ending.prototype.update = function (sm) {
                sm.game.screen.context.drawImage(this.bg, 0, 0);
                if (sm.game.gamekey.isOnDown(84)) {
                    sm.pop(); // タイトルに戻る
                }
                this.counter += 1;
                if (this.counter >= 120 / 14 * 14)
                    sm.pop(); // タイトルに戻る
            };
            return Ending;
        })(States.GameState);
        States.Ending = Ending;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var GameOver = (function (_super) {
            __extends(GameOver, _super);
            function GameOver() {
                _super.apply(this, arguments);
            }
            GameOver.prototype.enter = function (sm) {
                this.bg = sm.game.assets.image.get("gameover");
                this.counter = 0;
            };
            GameOver.prototype.update = function (sm) {
                sm.game.screen.context.drawImage(this.bg, 0, 0);
                if (sm.game.gamekey.isOnDown(84)) {
                    sm.pop(); // タイトルに戻る
                }
                this.counter += 1;
                if (this.counter >= 45 / 14 * 14)
                    sm.pop(); // タイトルに戻る
            };
            return GameOver;
        })(States.GameState);
        States.GameOver = GameOver;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Pause = (function (_super) {
            __extends(Pause, _super);
            function Pause(sm) {
                _super.call(this);
                this.background = document.createElement("canvas");
                this.background.width = sm.game.screen.width;
                this.background.height = sm.game.screen.height;
            }
            Pause.prototype.enter = function (sm) {
                // 現在の画面を保存
                this.background.getContext("2d").drawImage(sm.game.screen.canvas, 0, 0);
            };
            Pause.prototype.update = function (sm) {
                sm.game.screen.context.drawImage(this.background, 0, 0);
                sm.game.screen.context.fillStyle = "rgba(0,0,0,0.2)";
                sm.game.screen.context.fillRect(0, 0, sm.game.screen.width, sm.game.screen.height);
                sm.game.screen.context.fillStyle = "black";
                sm.game.screen.context.strokeText("PAUSE", 240, 150);
                if (sm.game.gamekey.isOnDown(80)) {
                    sm.pop(); // ステージに戻る
                }
                if (sm.game.gamekey.isOnDown(84)) {
                    sm.pop();
                    sm.pop(); // タイトルに戻る
                }
            };
            return Pause;
        })(States.GameState);
        States.Pause = Pause;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Stage = (function (_super) {
            __extends(Stage, _super);
            function Stage() {
                _super.call(this);
                this._is_initialized = false;
            }
            Stage.prototype.enter = function (sm) {
                var _this = this;
                if (!this._is_initialized) {
                    this._c_gameclear = 0;
                    sm.game.score.SetScore(0);
                    sm.game.hud_highscore = sm.game.score.GetHighScore();
                    this.ss = new Game.SpriteSystem(sm.game.screen);
                    this.mm = new Game.MapGenerator(this.ss);
                    this.mm.generateMap(sm.game.config.map, 32, 32, sm.game);
                    /*for (var i: number = 0; i < 40; i++) { // TODO: もっとましにする
                        this.ss.add(new AbstractBlock(-32, -320 + i * 32, sm.game.assets.image, "pattern"));
                        this.ss.add(new AbstractBlock(32 * 180, -320 + i * 32, sm.game.assets.image, "pattern"));
                    }
                    for (var i: number = 0; i < 180; i++) { // TODO: 敵は跳ね返らずに外に出ていくようにする
                        this.ss.add(new AbstractBlock(i * 32, -320, sm.game.assets.image, "pattern"));
                    }*/
                    /*
                    for (var i: number = 0; i < 6; i++) {
                        this.ss.add(new Block1(128 + i * 32, 160, sm.game.assets.image, "pattern"));
                    }
                    this.ss.add(new Block1(128, 192, sm.game.assets.image, "pattern"));
                    this.ss.add(new Block1(128, 128, sm.game.assets.image, "pattern"));
                    for (var i: number = 0; i < 12; i++) {
                        this.ss.add(new Block1(64 + i * 32, 256, sm.game.assets.image, "pattern"));
                    }
                    for (var i: number = 0; i < 6; i++) {
                        this.ss.add(new Block1(128 + i * 32, 96, sm.game.assets.image, "pattern"));
                    }
                    for (var i: number = 0; i < 3; i++) {
                        this.ss.add(new Block1(192 + i * 32, 224, sm.game.assets.image, "pattern"));
                    }
                    this.player = new Player(sm.game.gamekey, 224, 128, sm.game.assets.image, "pattern");
                    this.ss.add(this.player);*/
                    this.player = this.mm.player;
                    this.player.addEventHandler("ondie", (function (e) {
                        sm.replace(new States.GameOver());
                    }).bind(this)); // ゲームクリア判定のほうを優先させる
                    this.player.addEventHandler("ongoal", (function (e) {
                        _this._c_gameclear = 1;
                    }).bind(this));
                    this.player.addEventHandler("addscore", function (e) {
                        sm.game.score.AddScore(e.value);
                    });
                    this.addEventHandler("onscroll", function (e) {
                        _this.player.view_x = _this.view_x;
                        _this.player.view_y = _this.view_y;
                    });
                    var scroll = (function (e) {
                        if (!_this.player.flags["isAlive"]) {
                            _this.player.removeEventHandler("update", scroll);
                            return;
                        }
                        var px = _this.player.x;
                        var py = _this.player.y;
                        var wx = px - _this.view_x;
                        var wy = py - _this.view_y;
                        if (wx < 96) {
                            _this.view_x = px - 96;
                        }
                        else if (wx > 224) {
                            _this.view_x = px - 224;
                        }
                        if (wy < 78) {
                            _this.view_y = py - 78;
                        }
                        else if (wy > 176) {
                            _this.view_y = py - 176;
                        }
                        _this.fixViewXY();
                        _this.dispatchEvent(new Game.Event("onscroll"));
                    }).bind(this);
                    this.player.addEventHandler("update", scroll);
                    this.view_x = this.player.x - 96;
                    this.view_y = this.player.y - 176;
                    this.fixViewXY();
                    this.dispatchEvent(new Game.Event("onscroll"));
                    this._is_initialized = true;
                }
            };
            Stage.prototype.update = function (sm) {
                // 背景色で埋めてみる
                sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);
                this.ss.AllSprites.update();
                this.ss.AllSprites.draw(this.view_x, this.view_y);
                if (sm.game.gamekey.isOnDown(80)) {
                    sm.push(new States.Pause(sm)); // ポーズ
                }
                if (sm.game.gamekey.isOnDown(84)) {
                    sm.pop(); // タイトルに戻る
                }
                if (this._c_gameclear > 0) {
                    this._c_gameclear += 1;
                    if (this._c_gameclear > 28) {
                        // TODO: 制限時間に応じて加点
                        // sm.game.score.AddScore(0);
                        sm.replace(new States.Ending());
                    }
                }
                console.log((this.player.y + 15) % 32);
            };
            Stage.prototype.fixViewXY = function () {
                // TODO: マップサイズ決め打ちを改善
                if (this.view_x < 0) {
                    this.view_x = 0;
                }
                else if (this.view_x > 32 * 180 - Game.SCREEN_WIDTH) {
                    this.view_x = 32 * 180 - Game.SCREEN_WIDTH;
                }
                if (this.view_y < 0) {
                    this.view_y = 0;
                }
                else if (this.view_y > 32 * 30 - Game.SCREEN_HEIGHT) {
                    this.view_y = 32 * 30 - Game.SCREEN_HEIGHT;
                }
                this.view_x = Math.round(this.view_x);
                this.view_y = Math.round(this.view_y);
            };
            return Stage;
        })(States.GameState);
        States.Stage = Stage;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Title = (function (_super) {
            __extends(Title, _super);
            function Title() {
                _super.apply(this, arguments);
            }
            Title.prototype.enter = function (sm) {
                this.titleimg = sm.game.assets.image.get("title");
            };
            Title.prototype.update = function (sm) {
                sm.game.screen.context.drawImage(this.titleimg, 0, 0);
                if (sm.game.gamekey.isOnDown(90)) {
                    sm.push(new States.Stage());
                }
            };
            return Title;
        })(States.GameState);
        States.Title = Title;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
//# sourceMappingURL=app.js.map