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
    game = new Game.Game();
    game.setparent(el);
    game.start(new Game.States.Preload());
};
var Game;
(function (Game) {
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, 21, dx, dy);
            this.z = 512;
            this.initPatternCode();
            this.addEventHandler("onhit", this.onHit);
        }
        // to be overridden
        Block.prototype.initPatternCode = function () {
            this.code = 20;
        };
        Block.prototype.onHit = function (e) {
            var s = e.sprite;
            if (this.x <= s.x + s.width / 2 && this.x + this.width >= s.x + s.width / 2 && this.y <= s.y + s.height && this.y + this.height >= s.y) {
                console.log("onground");
                s.dispatchEvent(new Game.Event("onground"));
                s.y = this.y - s.height;
                s.vy = 0;
            }
        };
        return Block;
    })(Game.Sprite);
    Game.Block = Block;
    var Block1 = (function (_super) {
        __extends(Block1, _super);
        function Block1() {
            _super.apply(this, arguments);
        }
        Block1.prototype.initPattern = function () {
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
        Block2.prototype.initPattern = function () {
            this.code = 21;
        };
        return Block2;
    })(Block);
    Game.Block2 = Block2;
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
        MapGroup.prototype.add = function (sprite) {
            var nx = Math.floor(sprite.x / this.chipwidth);
            var ny = Math.floor(sprite.y / this.chipheight);
            if (!this._map[ny] || !this._map[ny][nx])
                this._map[ny][nx] = sprite;
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
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(input, x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, 100, dx, dy);
            this.gk = input;
            this.moving = new PlayerStateMachine(this);
            this.moving.push(new States.PlayerInterialMoveOnGround());
            this.counter = {};
            this.counter["able2runningLeft"] = 0;
            this.counter["able2runningRight"] = 0;
            this.counter["running"] = 0;
            this.flags = {};
            this.flags["isRunning"] = false;
            this.flags["isOnGround"] = false;
            this.z = 128;
            this.addEventHandler("onground", this.onGround);
        }
        Player.prototype.onGround = function (e) {
            this.flags["isOnGround"] = true;
        };
        Player.prototype.update = function () {
            // 入力の更新
            this.checkInput();
            //this.externalForce();
            // 外力を受けない移動
            this.moving.update();
            this.x += this.vx / 10;
            this.y += this.vy / 10;
            // 接触判定
            this.checkOnGround();
        };
        Player.prototype.checkOnGround = function () {
            this.flags["isOnGround"] = false;
            // check
            var blocks = this.ss.GetBlocks(this.x, this.y, this.width, this.height + 1); // 足元+1ピクセルも含めて取得
            console.log(blocks);
            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                if (this.x <= b.x + b.width && this.x + this.width >= b.x && this.y <= b.y + b.height && this.y + this.height >= b.y) {
                    b.dispatchEvent(new Game.SpriteEvent("onhit", this));
                }
            }
        };
        Player.prototype.checkInput = function () {
            if (this.flags["isOnGround"]) {
                //if (this.gk.isDown(37) && this.gk.isDown(39)) { } // 左右同時に押されていたらとりあえず何もしないことに
                if (this.gk.isOnDown(37)) {
                    if (this.counter["able2runningLeft"] > 0) {
                        this.moving.replace(new States.PlayerRunningLeft());
                    }
                    else if (!(this.moving.CurrentState() instanceof States.PlayerRunningLeft)) {
                        this.moving.replace(new States.PlayerWalkingLeft());
                    }
                }
                else if (this.gk.isOnDown(39)) {
                    if (this.counter["able2runningRight"] > 0) {
                        this.moving.replace(new States.PlayerRunningRight());
                    }
                    else if (!(this.moving.CurrentState() instanceof States.PlayerRunningRight)) {
                        this.moving.replace(new States.PlayerWalkingRight());
                    }
                }
                if ((!this.gk.isDown(37) && !this.gk.isDown(39)) || ((this.moving.CurrentState() instanceof States.PlayerWalkingLeft) && !this.gk.isDown(37)) || ((this.moving.CurrentState() instanceof States.PlayerWalkingRight) && !this.gk.isDown(39)) || ((this.moving.CurrentState() instanceof States.PlayerRunningLeft) && !this.gk.isDown(37)) || ((this.moving.CurrentState() instanceof States.PlayerRunningRight) && !this.gk.isDown(39))) {
                    this.moving.replace(new States.PlayerInterialMoveOnGround());
                }
                if (this.counter["able2runningLeft"] >= 8)
                    this.counter["able2runningLeft"] = 0;
                else if (this.counter["able2runningLeft"] > 0)
                    this.counter["able2runningLeft"] += 1;
                if (this.counter["able2runningRight"] >= 8)
                    this.counter["able2runningRight"] = 0;
                else if (this.counter["able2runningRight"] > 0)
                    this.counter["able2runningRight"] += 1;
                if (this.gk.isOnDown(37)) {
                    this.counter["able2runningLeft"] = 1;
                }
                if (this.gk.isOnDown(39)) {
                    this.counter["able2runningRight"] = 1;
                }
            }
            else {
                this.vy += 25; // 重力を受ける
                if (this.vy > 160)
                    this.vy = 160;
            }
        };
        return Player;
    })(Game.Sprite);
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
    var States;
    (function (States) {
        /*export interface IPlayerMovingState extends State { // 不要説 てか不要
            enter(sm: PlayerStateMachine);
            update(sm: PlayerStateMachine);
            exit(sm: PlayerStateMachine);
        }*/
        // 地上での処理が前提
        // TODO:空中
        var PlayerWalkingLeft = (function (_super) {
            __extends(PlayerWalkingLeft, _super);
            function PlayerWalkingLeft() {
                _super.apply(this, arguments);
            }
            PlayerWalkingLeft.prototype.enter = function (sm) {
                console.log("walk left ");
                sm.pl.flags["isRunning"] = false;
            };
            PlayerWalkingLeft.prototype.update = function (sm) {
                var pl = sm.pl;
                pl.surface.reverse_horizontal = false;
                pl.counter["running"]++;
                if (pl.counter["running"] > 3)
                    pl.counter["running"] = 0;
                pl.vx = (pl.vx - 15 > -60) ? pl.vx - 15 : -60;
                if (pl.vx > 0)
                    pl.code = 108;
                else
                    pl.code = 103 + Math.floor(pl.counter["running"] / 2);
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
                console.log("run left ");
                sm.pl.flags["isRunning"] = true;
            };
            PlayerRunningLeft.prototype.update = function (sm) {
                var pl = sm.pl;
                pl.surface.reverse_horizontal = false;
                pl.counter["running"]++;
                if (pl.counter["running"] > 3)
                    pl.counter["running"] = 0;
                pl.vx = (pl.vx - 15 > -120) ? pl.vx - 15 : -120;
                if (pl.vx > 0)
                    pl.code = 108;
                else
                    pl.code = 105 + Math.floor(pl.counter["running"] / 2);
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
                console.log("walk right ");
                sm.pl.flags["isRunning"] = false;
            };
            PlayerWalkingRight.prototype.update = function (sm) {
                var pl = sm.pl;
                pl.surface.reverse_horizontal = true;
                pl.counter["running"]++;
                if (pl.counter["running"] > 3)
                    pl.counter["running"] = 0;
                pl.vx = (pl.vx + 15 < 60) ? pl.vx + 15 : 60;
                if (pl.vx < 0)
                    pl.code = 108;
                else
                    pl.code = 103 + Math.floor(pl.counter["running"] / 2);
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
                console.log("run right ");
                sm.pl.flags["isRunning"] = true;
            };
            PlayerRunningRight.prototype.update = function (sm) {
                var pl = sm.pl;
                pl.surface.reverse_horizontal = true;
                pl.counter["running"]++;
                if (pl.counter["running"] > 3)
                    pl.counter["running"] = 0;
                pl.vx = (pl.vx + 15 < 120) ? pl.vx + 15 : 120;
                if (pl.vx < 0)
                    pl.code = 108;
                else
                    pl.code = 105 + Math.floor(pl.counter["running"] / 2);
            };
            return PlayerRunningRight;
        })(States.AbstractState);
        States.PlayerRunningRight = PlayerRunningRight;
        var PlayerInterialMoveOnGround = (function (_super) {
            __extends(PlayerInterialMoveOnGround, _super);
            function PlayerInterialMoveOnGround() {
                _super.apply(this, arguments);
            }
            PlayerInterialMoveOnGround.prototype.enter = function (sm) {
                console.log("move interial ");
            };
            PlayerInterialMoveOnGround.prototype.update = function (sm) {
                var pl = sm.pl;
                if (pl.vx < 0) {
                    pl.surface.reverse_horizontal = false;
                    pl.counter["running"]++;
                    if (pl.counter["running"] > 3)
                        pl.counter["running"] = 0;
                    if (pl.flags["isRunning"])
                        pl.code = 107;
                    else
                        pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                }
                else if (pl.vx > 0) {
                    pl.surface.reverse_horizontal = true;
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
                    pl.code = 100;
                }
            };
            return PlayerInterialMoveOnGround;
        })(States.AbstractState);
        States.PlayerInterialMoveOnGround = PlayerInterialMoveOnGround;
    })(States = Game.States || (Game.States = {}));
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
        SpriteSystem.prototype.GetBlocks = function (x, y, width, height) {
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
            }
            Stage.prototype.enter = function (sm) {
                this.ss = new Game.SpriteSystem(sm.game.screen);
                this.player = new Game.Player(sm.game.gamekey, 224, 128, sm.game.assets.image, "pattern");
                this.ss.add(this.player);
                for (var i = 0; i < 8; i++) {
                    this.ss.add(new Game.Block1(128 + i * 32, 160, sm.game.assets.image, "pattern"));
                }
            };
            Stage.prototype.update = function (sm) {
                // 背景色で埋めてみる
                sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);
                this.ss.AllSprites.update();
                this.ss.AllSprites.draw();
                if (sm.game.gamekey.isOnDown(80)) {
                    sm.push(new States.Pause(sm)); // ポーズ
                }
                if (sm.game.gamekey.isOnDown(84)) {
                    sm.pop(); // タイトルに戻る
                }
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