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
        "............................................................",
        "a...aa.aaa.....................99...........................",
        "aa..........................................................",
        "a...aa.a.a..................................................",
        "a...........................................A...............",
        "a.aaaaa.aaa.........12.....9.9...aaa.....aa.aaaaaaaa...12...",
        "a....aa.a....B............aaaaa..............9.aaaaa........",
        "aaaa.a..aaaaaa..........................B...aaaaaaaa........",
        ".......aa...........................aaaaa...9.9aa999........",
        "..aaaaaa..............B.............9.9.9...aaaaaaaa........",
        "...........aaaaaa..aaaaaa....................9.aaaaa........",
        "..........aaaaaaa..aaaaaa............D......aaaaaaaa........",
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
        "..........O..aaaaaaaaaaa.O.....O........feefeef..feeeefeeeef",
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
        "title": "title.gif",
        "pattern": "pattern.gif"
    };
    game = new Game.Game({ map: map, images: images });
    game.setparent(el);
    game.start(new Game.States.Preload());
};
var Game;
(function (Game) {
    var Entity = (function (_super) {
        __extends(Entity, _super);
        function Entity(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, 0, dx, dy);
            this.counter = {};
            this.flags = {};
        }
        return Entity;
    })(Game.Sprite);
    Game.Entity = Entity;
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
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, dx, dy);
            this.z = 512;
            this.initPatternCode();
            //this.addEventHandler("onhit", this.onHit);
        }
        // to be overridden
        Block.prototype.initPatternCode = function () {
            this.code = 20;
        };
        return Block;
    })(Game.Entity);
    Game.Block = Block;
    var Block1 = (function (_super) {
        __extends(Block1, _super);
        function Block1() {
            _super.apply(this, arguments);
        }
        Block1.prototype.initPatternCode = function () {
            this.code = 20;
        };
        return Block1;
    })(Block);
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
    })(Block);
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
    })(Block);
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
    })(Block);
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
    })(Block);
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
    })(Block);
    Game.Block6 = Block6;
})(Game || (Game = {}));
/// <reference path="entity.ts"/>
var Game;
(function (Game) {
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, dx, dy);
            this.z = 256;
            this.counter["ac"] = 0;
            this.flags["isAlive"] = true;
            this.flags["isActivated"] = false;
            this.flags["isOnGround"] = false;
            this.counter["viewx_activate"] = Math.floor(x / this.width) * this.width - Game.SCREEN_WIDTH - this.width;
            this.addEventHandler("onground", this.onGround);
        }
        Enemy.prototype.onGround = function (e) {
            this.flags["isOnGround"] = true;
        };
        Enemy.prototype.update = function () {
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
            }
            this.moving.update();
            this.move();
        };
        Enemy.prototype.move = function () {
            this.x += this.vx / 10;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            this.y += this.vy / 10;
            this.checkCollisionWithBlocksVertical(); // 接触判定
        };
        Enemy.prototype.checkCollisionWithBlocksVertical = function () {
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
        Enemy.prototype.checkCollisionWithBlocksHorizontal = function () {
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
        return Enemy;
    })(Game.Entity);
    Game.Enemy = Enemy;
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
                                    p.dispatchEvent(new Game.Event("onstamp"));
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
/// <reference path="entity.ts"/>
var Game;
(function (Game) {
    var Jumper = (function (_super) {
        __extends(Jumper, _super);
        function Jumper(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, dx, dy);
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
    })(Game.Enemy);
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
                if (e.counter["ac"] >= 10) {
                    e.kill();
                }
            };
            return JumperStamped;
        })(States.AbstractState);
        States.JumperStamped = JumperStamped;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="entity.ts"/>
var Game;
(function (Game) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(input, x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, dx, dy);
            this.imagemanager = imagemanager;
            this.label = label;
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
            if (this.counter["superjump_effect"] >= 0)
                this.counter["superjump_effect"] = 100;
        };
        Player.prototype.onStamp = function (e) {
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
                this.x += this.vx / 10;
                this.y += this.vy > -320 ? this.vy / 10 : -32;
            }
        };
        // 速度に応じて自機の座標を移動させる
        Player.prototype.move = function () {
            var muki_x = 0;
            if (this.vx > 0)
                muki_x = 1;
            else if (this.vx < 0)
                muki_x = -1;
            this.x += this.vx / 10;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            var tmp_bottom = this.bottom;
            var tmp_top = this.top;
            this.y += this.vy > -320 ? this.vy / 10 : -32;
            this.checkCollisionWithBlocksVertical(); // 接触判定
            // 補正
            if (this.vy > 0) {
                if (tmp_bottom < this.bottom) {
                    if (this.getHitBlock(this.centerx + muki_x, tmp_bottom + 1) == null) {
                        if (this.getHitBlock(this.centerx + muki_x, this.bottom + 1) != null) {
                            if (this.flags["isWalking"] || this.flags["isRunning"])
                                this.x += muki_x; // トンネルに入れるようにする
                            this.checkCollisionWithBlocksVertical();
                            this.vy = 0;
                            //_ptc = 103;
                            this.counter["running"] = 1;
                        }
                    }
                }
            }
            else if (this.vy < 0) {
                if (tmp_top > this.top) {
                    if (this.getHitBlock(this.centerx + muki_x, tmp_top) == null) {
                        if (this.getHitBlock(this.centerx + muki_x, this.top) != null) {
                            if (this.flags["isWalking"] || this.flags["isRunning"])
                                this.x += muki_x; // トンネルに入れるようにする
                            this.checkCollisionWithBlocksVertical();
                            this.vy = 0;
                            //_ptc = 103;
                            this.counter["running"] = 1;
                        }
                    }
                }
            }
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
            var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height + 1); // 足元+1ピクセルも含めて取得
            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                /*if (this.x <= b.x + b.width && this.x + this.width >= b.x &&
                    this.y <= b.y + b.height && this.y + this.height >= b.y) {
                    b.dispatchEvent(new SpriteCollisionEvent("onhit", this, "vertical", "center"));
                }*/
                //var bc = b.getRect(); // TODO: getCollisionに書き換えても問題なく動作するように
                //var col = new Rect(this.centerx, this.y, 0, this.height);
                if (this.vy < 0) {
                    // up
                    if (b.x <= this.centerx && b.right > this.centerx && b.y < this.bottom && b.bottom >= this.y) {
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
                    if (b.x <= this.centerx && b.right > this.centerx && b.y <= this.bottom && b.bottom > this.y) {
                        this.dispatchEvent(new Game.Event("onground"));
                        this.bottom = b.y;
                        this.vy = 0;
                    }
                }
            }
        };
        Player.prototype.checkCollisionWithBlocksHorizontal = function () {
            // check
            var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height);
            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                /*if (this.x <= b.x + b.width && this.x + this.width >= b.x &&
                    this.y <= b.y + b.height && this.y + this.height >= b.y) {
                    b.dispatchEvent(new SpriteCollisionEvent("onhit", this, "horizontal", "center"));
                }*/
                //var bc = b.getCollision();
                //var col = new Rect(this.centerx, this.y, 0, this.height);
                if (this.vx > 0) {
                    // right
                    if (b.x <= this.centerx && b.right > this.centerx && b.y <= this.bottom && b.bottom > this.y) {
                        // rect:{(x,y)∈R^2:x∈[bc.left,bc.right),y∈[bc.top,bc.bottom]}の判定
                        this.centerx = b.x - 1;
                        this.vx = 0;
                    }
                }
                else if (this.vx < 0) {
                    // left
                    if (b.x <= this.centerx && b.right > this.centerx && b.y <= this.bottom && b.bottom > this.y) {
                        //if (((col.collision(bc, true)) || col.collision(new Rect(bc.left, bc.top, 0, bc.height)) || col.collision(new Rect(bc.left, bc.top, bc.width, 0))) &&
                        //    !(col.collision(new Point(bc.right, bc.top))) && !(col.collision(new Point(bc.left, bc.bottom)))) { // ブロックの右の辺と下の辺を除いた部分と判定を行う
                        this.centerx = b.right;
                        this.vx = 0;
                    }
                }
            }
        };
        // 指定した座標地点にブロックがある場合、そのブロックを返す。
        // そうでない場合、nullを返す。
        Player.prototype.getHitBlock = function (x, y) {
            var b = this.ss.getBlock(x, y);
            if (b)
                return b;
            return null;
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
                if (this.gk.isDown(90) && this.gk.getCount(90) < 5) {
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
    })(Game.Entity);
    Game.Player = Player;
    var PlayerStateMachine = (function (_super) {
        __extends(PlayerStateMachine, _super);
        function PlayerStateMachine(pl, parent) {
            if (parent === void 0) { parent = null; }
            _super.call(this, parent);
            this.pl = pl;
        }
        return PlayerStateMachine;
    })(Game.StateMachine);
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
                var pl = sm.pl;
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
                    var effect = new PlayerSuperJumpEffect(pl.x, pl.y, pl.imagemanager, pl.label, 1, 1, pl.code, pl.reverse_horizontal);
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
                sm.pl.flags["isRunning"] = false;
                sm.pl.flags["isWalking"] = true;
            };
            PlayerWalkingLeft.prototype.update = function (sm) {
                var pl = sm.pl;
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
                sm.pl.flags["isRunning"] = true;
                sm.pl.flags["isWalking"] = false;
            };
            PlayerRunningLeft.prototype.update = function (sm) {
                var pl = sm.pl;
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
                sm.pl.flags["isRunning"] = false;
                sm.pl.flags["isWalking"] = true;
            };
            PlayerWalkingRight.prototype.update = function (sm) {
                var pl = sm.pl;
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
                sm.pl.flags["isRunning"] = true;
                sm.pl.flags["isWalking"] = false;
            };
            PlayerRunningRight.prototype.update = function (sm) {
                var pl = sm.pl;
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
                var pl = sm.pl;
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
                if (pl.ss.MapBlocks.getByXYReal(pl.centerx + pl.vx / 10, pl.y - 1) == null || pl.ss.MapBlocks.getByXYReal(pl.centerx, pl.y - 1) == null) {
                    if (speed == 0) {
                        pl.vy = -150;
                        pl.counter["jump_level"] = 1;
                    }
                    else if (speed < 60) {
                        if (pl.ss.MapBlocks.getByXYReal(pl.centerx + (pl.vx > 0 ? 1 : -1), pl.centery) != null) {
                            pl.vy = -150;
                            pl.counter["jump_level"] = 1;
                        }
                        else {
                            pl.vy = -230;
                            pl.counter["jump_level"] = 2;
                        }
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
                        var effect = new PlayerSuperJumpEffect(pl.x, pl.y, pl.imagemanager, pl.label, 1, 1, 101, pl.reverse_horizontal);
                        pl.ss.add(effect);
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
                var pl = sm.pl;
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
                        sm.pl.flags["isRunning"] = false;
                        sm.pl.flags["isWalking"] = false;
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
                var pl = sm.pl;
                pl.flags["isAlive"] = false;
                pl.counter["dying"] = 0;
            };
            PlayerDyingDirect.prototype.update = function (sm) {
                var pl = sm.pl;
                if (pl.counter["dying"] == 0) {
                    pl.vx = 0;
                    pl.vy = -250; // 跳ね上がる
                }
                pl.vy += 25; // 重力を受ける
                if (pl.vy > 80)
                    pl.vy = 80;
                pl.counter["dying"] += 1;
                pl.code = 110 + pl.counter["dying"] % 4;
                if (pl.y > 320 * 3) {
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
                var pl = sm.pl;
                pl.flags["isAlive"] = false;
                pl.counter["dying"] = 0;
            };
            PlayerDyingInDirect.prototype.update = function (sm) {
                var pl = sm.pl;
                if (pl.counter["dying"] == 0) {
                    pl.vx = 0;
                }
                pl.vy = 0; // その場で回転する
                pl.counter["dying"] += 1;
                pl.code = 110 + pl.counter["dying"] % 4;
                if (pl.counter["dying"] >= 16)
                    pl.vy = 80;
                if (pl.y > 320 * 3) {
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
                sm.pl.code = 109;
                sm.pl.flags["isStamping"] = true;
                sm.pl.counter["stamp_waiting"] = 5;
                sm.pl.vy = -160;
                //sm.pl.vy = -220;
                if (sm.pl.counter["superjump_effect"] >= 0)
                    sm.pl.counter["superjump_effect"] = 100;
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
        function PlayerSuperJumpEffect(x, y, imagemanager, label, dx, dy, code, reverse_horizontal) {
            _super.call(this, x, y, imagemanager, label, 100, dx, dy);
            this.label = label;
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
/// <reference path="entity.ts"/>
var Game;
(function (Game) {
    var Kame = (function (_super) {
        __extends(Kame, _super);
        function Kame(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, dx, dy);
            this.moving = new Game.EntityStateMachine(this);
            this.moving.push(new States.KameWalking());
            //this.code = 140;
            this.addEventHandler("onstamped", this.onStamped);
            //this.addEventHandler("onhit", this.onHit);
        }
        Kame.prototype.onStamped = function (e) {
            if (this.flags["isAlive"])
                this.moving.replace(new States.KameStamped());
            this.vx = 0;
            this.vy = 0;
        };
        return Kame;
    })(Game.Enemy);
    Game.Kame = Kame;
    var KameFallable = (function (_super) {
        __extends(KameFallable, _super);
        function KameFallable(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, dx, dy);
            this.moving.replace(new States.KameWalkingFallable());
        }
        return KameFallable;
    })(Kame);
    Game.KameFallable = KameFallable;
    var States;
    (function (States) {
        var KameWalking = (function (_super) {
            __extends(KameWalking, _super);
            function KameWalking() {
                _super.apply(this, arguments);
            }
            KameWalking.prototype.enter = function (sm) {
            };
            KameWalking.prototype.update = function (sm) {
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
            return KameWalking;
        })(States.AbstractStampableAlive);
        States.KameWalking = KameWalking;
        var KameWalkingFallable = (function (_super) {
            __extends(KameWalkingFallable, _super);
            function KameWalkingFallable() {
                _super.apply(this, arguments);
            }
            KameWalkingFallable.prototype.enter = function (sm) {
            };
            KameWalkingFallable.prototype.update = function (sm) {
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
                    sm.replace(new KameFalling());
                }
                this.checkCollisionWithPlayer(sm);
            };
            return KameWalkingFallable;
        })(States.AbstractStampableAlive);
        States.KameWalkingFallable = KameWalkingFallable;
        var KameFalling = (function (_super) {
            __extends(KameFalling, _super);
            function KameFalling() {
                _super.apply(this, arguments);
            }
            KameFalling.prototype.enter = function (sm) {
                sm.e.flags["isOnGround"] = false;
            };
            KameFalling.prototype.update = function (sm) {
                var e = sm.e;
                if (e.flags["isOnGround"]) {
                    sm.replace(new KameWalkingFallable());
                    sm.update();
                }
                else {
                    e.code = 140;
                    e.vy = 50;
                    this.checkCollisionWithPlayer(sm);
                }
            };
            return KameFalling;
        })(States.AbstractStampableAlive);
        States.KameFalling = KameFalling;
        var KameStamped = (function (_super) {
            __extends(KameStamped, _super);
            function KameStamped() {
                _super.apply(this, arguments);
            }
            KameStamped.prototype.enter = function (sm) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 142;
                sm.e.flags["isAlive"] = false;
            };
            KameStamped.prototype.update = function (sm) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 142;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] >= 10) {
                    e.kill();
                }
            };
            return KameStamped;
        })(States.AbstractState);
        States.KameStamped = KameStamped;
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
    var MapGroup = (function () {
        function MapGroup(screen, width, height, chipwidth, chipheight) {
            if (width === void 0) { width = 180; }
            if (height === void 0) { height = 30; }
            if (chipwidth === void 0) { chipwidth = 32; }
            if (chipheight === void 0) { chipheight = 32; }
            this.screen = screen;
            this._map = new Array();
            for (var i = 0; i < height; i++) {
                this._map.push(new Array());
                for (var ii = 0; ii < width; ii++) {
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
            var nx = Math.floor(sprite.x / this.chipwidth);
            var ny = Math.floor(sprite.y / this.chipheight);
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
            if (this._map[ny] && this._map[ny][nx])
                return this._map[ny][nx];
            else
                return null;
        };
        MapGroup.prototype.getByXYReal = function (x, y) {
            var nx = Math.floor(x / this.chipwidth);
            var ny = Math.floor(y / this.chipheight);
            if (this._map[ny] && this._map[ny][nx])
                return this._map[ny][nx];
            return null;
        };
        MapGroup.prototype.getByRect = function (nx, ny, nwidth, nheight) {
            var result = new Array();
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
            var nx = Math.floor(x / this.chipwidth);
            var ny = Math.floor(y / this.chipheight);
            var nx2 = Math.ceil((x + width) / this.chipwidth);
            var ny2 = Math.ceil((y + height) / this.chipheight);
            for (var i = ny; i < ny2; i++) {
                for (var ii = nx; ii < nx2; ii++) {
                    if (this._map[i] && this._map[i][ii])
                        result.push(this._map[i][ii]);
                }
            }
            return result;
        };
        MapGroup.prototype.remove = function (sprite) {
            for (var i = 0; i < this._height; i++) {
                for (var ii = 0; ii < this._width; ii++) {
                    if (this._map[i][ii] == sprite) {
                        this._map[i][ii] = null;
                    }
                }
            }
        };
        MapGroup.prototype.remove_all = function () {
            for (var i = 0; i < this._height; i++) {
                for (var ii = 0; ii < this._width; ii++) {
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
            this.lookup["B"] = Game.Kame;
            this.lookup["C"] = Game.KameFallable;
            this.lookup["O"] = Game.Jumper;
            this.lookup["a"] = Game.Block1;
            this.lookup["b"] = Game.Block2;
            this.lookup["c"] = Game.Block3;
            this.lookup["d"] = Game.Block4;
            this.lookup["e"] = Game.Block5;
            this.lookup["f"] = Game.Block6;
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
            this.AllSprites.add(s);
            if (s instanceof Game.Player) {
                this.Players.add(s);
            }
            if (s instanceof Game.Block) {
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
                if (this.counter >= 14 * 10)
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
                this.is_initialized = false;
            }
            Stage.prototype.enter = function (sm) {
                var _this = this;
                if (!this.is_initialized) {
                    sm.game.score.SetScore(0);
                    sm.game.hud_highscore = sm.game.score.GetHighScore();
                    this.ss = new Game.SpriteSystem(sm.game.screen);
                    this.mm = new Game.MapGenerator(this.ss);
                    this.mm.generateMap(sm.game.config.map, 32, 32, sm.game);
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
                    this.player.addEventHandler("ondie", function (e) {
                        sm.replace(new States.GameOver());
                    });
                    this.player.addEventHandler("addscore", function (e) {
                        sm.game.score.AddScore(e.value);
                    });
                    this.addEventHandler("onscroll", function (e) {
                        _this.player.view_x = _this.view_x;
                        _this.player.view_y = _this.view_y;
                    });
                    this.player.addEventHandler("update", (function (e) {
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
                    }).bind(this));
                    this.view_x = this.player.x - 96;
                    this.view_y = this.player.y - 176;
                    this.fixViewXY();
                    this.dispatchEvent(new Game.Event("onscroll"));
                    this.is_initialized = true;
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
            };
            Stage.prototype.fixViewXY = function () {
                /* マップサイズ決め打ちのため要改善 */
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