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
            if (e.dir == "vertical" || e.dir == "up" || e.dir == "down") {
                // up
                if (s.vy < 0 && e.dir != "down") {
                    if (this.x <= s.centerx && this.x + this.width > s.centerx && this.y < s.y + s.height && this.y + this.height >= s.y) {
                        s.y = this.bottom + 1;
                        s.vy = 0;
                    }
                }
                else if (s.vy >= 0 && e.dir != "up") {
                    // down || //
                    //if (Math.floor(s.centerx / this.width) == Math.floor(this.x / this.width) && // spriteのx中心点との判定
                    //if (this.x <= s.centerx && this.right >= s.centerx && // spriteのx中心点との判定
                    if (this.x <= s.centerx && this.x + this.width > s.centerx && this.y <= s.y + s.height && this.y + this.height > s.y) {
                        console.log("onground");
                        s.dispatchEvent(new Game.Event("onground"));
                        s.bottom = this.y - 1;
                        s.vy = 0;
                    }
                }
            }
            else if (e.dir == "horizontal" || e.dir == "left" || e.dir == "right") {
                if (s.vx > 0) {
                    // right
                    if (e.dir != "left")
                        if (this.x <= s.centerx && this.x + this.width > s.centerx && this.y <= s.y + s.height && this.y + this.height > s.y) {
                            s.x = this.x - (s.width - 1) / 2 - 1;
                            s.vx = 0;
                        }
                }
                else if (s.vx < 0) {
                    // left
                    if (e.dir != "right")
                        if (this.x <= s.centerx && this.x + this.width > s.centerx && this.y <= s.y + s.height && this.y + this.height > s.y) {
                            s.x = this.right - (s.width - 1) / 2 + 1;
                            s.vx = 0;
                        }
                }
                else {
                    if (this.x <= s.centerx && this.x + this.width > s.centerx && this.y <= s.y + s.height && this.y + this.height > s.y) {
                        if (s.centerx < this.centerx)
                            s.x = this.x - (s.width - 1) / 2 - 1;
                        else
                            s.x = this.x + this.width - (s.width - 1) / 2 + 1;
                    }
                }
            }
            else {
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
            this.z = 256;
        }
        return Entity;
    })(Game.Sprite);
    Game.Entity = Entity;
    var Kame = (function (_super) {
        __extends(Kame, _super);
        function Kame(x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, dx, dy);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.KameWalking());
            this.code = 140;
            this.counter["ac"] = 0;
        }
        Kame.prototype.update = function () {
            this.moving.update();
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        };
        return Kame;
    })(Entity);
    Game.Kame = Kame;
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
                if (!e.reverse_horizontal) {
                    e.vx = -40;
                }
                else {
                    e.vx = 40;
                }
                if (e.ss.MapBlocks.getByXYReal(e.centerx + e.vx / 10, e.y + e.height + 1) == null) {
                    e.reverse_horizontal = !e.reverse_horizontal;
                }
            };
            return KameWalking;
        })(States.AbstractState);
        States.KameWalking = KameWalking;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var SpriteCollisionEvent = (function (_super) {
        __extends(SpriteCollisionEvent, _super);
        function SpriteCollisionEvent(type, sprite, dir) {
            if (dir === void 0) { dir = "none"; }
            _super.call(this, type, sprite);
            this.type = type;
            this.sprite = sprite;
            this.dir = dir;
        }
        return SpriteCollisionEvent;
    })(Game.SpriteEvent);
    Game.SpriteCollisionEvent = SpriteCollisionEvent;
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
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(input, x, y, imagemanager, label, dx, dy) {
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, 100, dx, dy);
            this.gk = input;
            this.moving = new PlayerStateMachine(this);
            this.moving.setGlobalState(new States.PlayerGlobalMove());
            this.moving.push(new States.PlayerInterialMove());
            this.counter = {};
            this.counter["able2runningLeft"] = 0;
            this.counter["able2runningRight"] = 0;
            this.counter["running"] = 0;
            this.counter["jump_level"] = 0;
            this.flags = {};
            this.flags["isRunning"] = false;
            this.flags["isWalking"] = false;
            this.flags["isJumping"] = false;
            this.flags["isOnGround"] = false;
            this.z = 128;
            this.addEventHandler("onground", this.onGround);
        }
        Player.prototype.onGround = function (e) {
            this.flags["isOnGround"] = true;
            this.flags["isJumping"] = false;
            this.counter["jump_level"] = 0;
        };
        Player.prototype.update = function () {
            // 入力の更新
            this.checkInput();
            //this.externalForce();
            // 外力を受けない移動
            this.moving.update();
            if (this.flags["isOnGround"]) {
                if (this.gk.isDown(90) && this.gk.getCount(90) < 5) {
                    this.moving.push(new States.PlayerJumping());
                }
            }
            this.x += this.vx / 10;
            var muki_x = 0;
            if (this.vx > 0)
                muki_x = 1;
            else if (this.vx < 0)
                muki_x = -1;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            var tmp_bottom = this.bottom;
            var tmp_top = this.top;
            this.y += this.vy / 10;
            this.checkCollisionWithBlocksVertical(); // 接触判定
            // 補正
            if (this.vy > 0) {
                if (tmp_bottom < this.bottom) {
                    if (this.getHitBlock(this.centerx + muki_x, tmp_bottom + 1) == null) {
                        if (this.getHitBlock(this.centerx + muki_x, this.bottom + 1) != null) {
                            this.x += muki_x;
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
                            this.x += muki_x;
                            this.checkCollisionWithBlocksVertical();
                            this.vy = 0;
                            //_ptc = 103;
                            this.counter["running"] = 1;
                        }
                    }
                }
            }
            this.fixPatternCode();
            //this.x = Math.floor(this.x);
            //this.y = Math.floor(this.y);
        };
        Player.prototype.fixPatternCode = function () {
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
                        this.code = 0;
                    }
                    else if (Math.abs(this.vx) > 60) {
                        this.code = 105;
                    }
                    else {
                        this.code = 103;
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
                if (this.x <= b.x + b.width && this.x + this.width >= b.x && this.y <= b.y + b.height && this.y + this.height >= b.y) {
                    b.dispatchEvent(new Game.SpriteCollisionEvent("onhit", this, "vertical"));
                }
            }
        };
        Player.prototype.checkCollisionWithBlocksHorizontal = function () {
            // check
            var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height);
            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                if (this.x <= b.x + b.width && this.x + this.width >= b.x && this.y <= b.y + b.height && this.y + this.height >= b.y) {
                    b.dispatchEvent(new Game.SpriteCollisionEvent("onhit", this, "horizontal"));
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
            if (this.gk.isOnDown(37)) {
                this.counter["able2runningLeft"] = 1;
            }
            if (this.gk.isOnDown(39)) {
                this.counter["able2runningRight"] = 1;
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
        var PlayerGlobalMove = (function (_super) {
            __extends(PlayerGlobalMove, _super);
            function PlayerGlobalMove() {
                _super.apply(this, arguments);
            }
            PlayerGlobalMove.prototype.update = function (sm) {
                var pl = sm.pl;
                if (pl.flags["isOnGround"]) {
                }
                else {
                    pl.vy += 25; // 重力を受ける
                    if (pl.vy > 160)
                        pl.vy = 160;
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
                console.log("walk left ");
                sm.pl.flags["isRunning"] = false;
                sm.pl.flags["isWalking"] = true;
            };
            PlayerWalkingLeft.prototype.update = function (sm) {
                var pl = sm.pl;
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
                sm.pl.flags["isWalking"] = false;
            };
            PlayerRunningLeft.prototype.update = function (sm) {
                var pl = sm.pl;
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
                sm.pl.flags["isWalking"] = true;
            };
            PlayerWalkingRight.prototype.update = function (sm) {
                var pl = sm.pl;
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
                sm.pl.flags["isWalking"] = false;
            };
            PlayerRunningRight.prototype.update = function (sm) {
                var pl = sm.pl;
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
            };
            return PlayerRunningRight;
        })(States.AbstractState);
        States.PlayerRunningRight = PlayerRunningRight;
        var PlayerJumping = (function (_super) {
            __extends(PlayerJumping, _super);
            function PlayerJumping() {
                _super.apply(this, arguments);
            }
            PlayerJumping.prototype.enter = function (sm) {
                var pl = sm.pl;
                pl.flags["isJumping"] = true;
                pl.flags["isOnGround"] = false;
                var speed = Math.abs(pl.vx);
                // 貫通防止
                /*if (pl.ss.MapBlocks.getByXYReal(pl.x + pl.width / 2, pl.y - 1) != null) {
                    pl.ss.MapBlocks.getByXYReal(pl.x + pl.width / 2, pl.y - 1).dispatchEvent(new SpriteCollisionEvent("onhit", pl, "vertical"));
                }
                else */ if (pl.ss.MapBlocks.getByXYReal(pl.x + pl.width / 2 + pl.vx / 10, pl.y - 1) != null) {
                    pl.ss.MapBlocks.getByXYReal(pl.x + pl.width / 2 + pl.vx / 10, pl.y - 1).dispatchEvent(new Game.SpriteCollisionEvent("onhit", pl, "vertival"));
                }
                else {
                    if (speed == 0) {
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
                    }
                }
                pl.checkCollisionWithBlocksVertical();
                sm.pop(); // 即座にもとのStateに戻す
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
                console.log("move interial ");
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
                if (!this.is_initialized) {
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
                    this.view_x = 0;
                    this.view_y = 0;
                    this.is_initialized = true;
                }
            };
            Stage.prototype.update = function (sm) {
                // 背景色で埋めてみる
                sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);
                this.ss.AllSprites.update();
                this.view_x = Math.round(this.player.x - 160);
                this.view_y = Math.round(this.player.y - 64);
                this.ss.AllSprites.draw(this.view_x, this.view_y);
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