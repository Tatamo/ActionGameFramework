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
            Preload.prototype.enter = function () {
                var assets = this.sm.game.assets;
                assets.image.regist_image("title", "title.gif");
                assets.image.regist_pattern("pattern", "pattern.gif", 32, 32);
                assets.load();
            };
            Preload.prototype.update = function () {
                var loader = this.sm.game.assets.loader;
                if (loader.state == 2 /* NOTHING2LOAD */) {
                    this.sm.replace(new States.Title(this.sm));
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
    game.start(new Game.States.Preload(game.statemachine));
};
var Game;
(function (Game) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(input, x, y, imagemanager, label, code, dx, dy) {
            if (code === void 0) { code = 0; }
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this, x, y, imagemanager, label, code, dx, dy);
            this.gk = input;
            this.moving = new PlayerStateMachine(this);
            this.moving.push(new States.PlayerInterialMove(this.moving));
            this.counter = {};
            this.counter["running"] = 0;
            this.flags = {};
            this.flags["isRunning"] = false;
            this.vx = 0;
            this.vy = 0;
        }
        Player.prototype.update = function () {
            this.checkInput();
            //this.externalForce();
            this.moving.update();
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        };
        Player.prototype.checkInput = function () {
            if (this.gk.isDown(37) && this.gk.isDown(39)) {
            }
            else if (this.gk.isDown(37)) {
                if (this.gk.releasedkeys[37] <= 8) {
                    this.moving.replace(new States.PlayerRunningLeft(this.moving));
                }
                else if (!(this.moving.CurrentState() instanceof States.PlayerRunningLeft)) {
                    this.moving.replace(new States.PlayerWalkingLeft(this.moving));
                }
            }
            else if (this.gk.isDown(39)) {
                if (this.gk.releasedkeys[39] <= 8) {
                    this.moving.replace(new States.PlayerRunningRight(this.moving));
                }
                else if (!(this.moving.CurrentState() instanceof States.PlayerRunningRight)) {
                    this.moving.replace(new States.PlayerWalkingRight(this.moving));
                }
            }
            else {
                this.moving.replace(new States.PlayerInterialMove(this.moving));
            }
        };
        Player.prototype.externalForce = function () {
            var cnt = this.counter;
            var flg = this.flags;
            // 歩き,走り判定
            if (this.gk.isDown(37)) {
                cnt["running"]++;
                if (cnt["running"] > 3)
                    cnt["running"] = 0;
                if (flg["isRunning"]) {
                    this.vx = (this.vx - 15 > -120) ? this.vx - 15 : -120;
                    if (this.vx > 0)
                        this.code = 108;
                    else
                        this.code = 105 + cnt["running"] / 2;
                }
                else {
                    this.vx = (this.vx - 15 > -60) ? this.vx - 15 : -60;
                    if (this.vx > 0)
                        this.code = 108;
                    else
                        this.code = 103 + cnt["running"] / 2;
                }
            }
            else if (this.gk.isDown(39)) {
                cnt["running"]++;
                if (cnt["running"] > 3)
                    cnt["running"] = 0;
                if (flg["isRunning"]) {
                    this.vx = (this.vx + 15 < 120) ? this.vx + 15 : 120;
                    if (this.vx < 0)
                        this.code = 108;
                    else
                        this.code = 105 + cnt["running"] / 2;
                }
                else {
                    this.vx = (this.vx + 15 < 60) ? this.vx + 15 : 60;
                    if (this.vx < 0)
                        this.code = 108;
                    else
                        this.code = 103 + cnt["running"] / 2;
                }
            }
            else if (this.vx < 0) {
                cnt["running"]++;
                if (cnt["running"] > 3)
                    cnt["running"] = 0;
                if (flg["isRunning"])
                    this.code = 107;
                else
                    this.code = 103 + cnt["running"] / 2;
            }
            else if (this.vx > 0) {
                cnt["running"]++;
                if (cnt["running"] > 3)
                    cnt["running"] = 0;
                if (flg["isRunning"])
                    this.code = 107;
                else
                    this.code = 103 + cnt["running"] / 2;
            }
            // 左右キー入力なし・地上
            if (!this.gk.isDown(39) && !this.gk.isDown(37)) {
                if (this.vx > 0) {
                    this.vx -= 5;
                    if (this.vx < 0)
                        this.vx = 0;
                }
                else if (this.vx < 0) {
                    this.vx += 5;
                    if (this.vx > 0)
                        this.vx = 0;
                }
            }
        };
        Player.prototype.hoge = function () {
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
        var PlayerMovingState = (function (_super) {
            __extends(PlayerMovingState, _super);
            function PlayerMovingState(sm) {
                _super.call(this, sm);
            }
            return PlayerMovingState;
        })(States.AbstractState);
        States.PlayerMovingState = PlayerMovingState;
        // 地上での処理が前提
        // TODO:空中
        var PlayerWalkingLeft = (function (_super) {
            __extends(PlayerWalkingLeft, _super);
            function PlayerWalkingLeft() {
                _super.apply(this, arguments);
            }
            PlayerWalkingLeft.prototype.enter = function () {
                console.log("walk left ");
            };
            PlayerWalkingLeft.prototype.update = function () {
                var pl = this.sm.pl;
                pl.counter["running"]++;
                if (pl.counter["running"] > 3)
                    pl.counter["running"] = 0;
                pl.vx = (pl.vx - 15 > -60) ? pl.vx - 15 : -60;
                if (pl.vx > 0)
                    pl.code = 108;
                else
                    pl.code = 103 + pl.counter["running"] / 2;
            };
            return PlayerWalkingLeft;
        })(PlayerMovingState);
        States.PlayerWalkingLeft = PlayerWalkingLeft;
        var PlayerRunningLeft = (function (_super) {
            __extends(PlayerRunningLeft, _super);
            function PlayerRunningLeft() {
                _super.apply(this, arguments);
            }
            PlayerRunningLeft.prototype.enter = function () {
                console.log("run left ");
            };
            PlayerRunningLeft.prototype.update = function () {
                var pl = this.sm.pl;
                pl.counter["running"]++;
                if (pl.counter["running"] > 3)
                    pl.counter["running"] = 0;
                pl.vx = (pl.vx - 15 > -120) ? pl.vx - 15 : -120;
                if (pl.vx > 0)
                    pl.code = 108;
                else
                    pl.code = 105 + pl.counter["running"] / 2;
            };
            return PlayerRunningLeft;
        })(PlayerMovingState);
        States.PlayerRunningLeft = PlayerRunningLeft;
        var PlayerWalkingRight = (function (_super) {
            __extends(PlayerWalkingRight, _super);
            function PlayerWalkingRight() {
                _super.apply(this, arguments);
            }
            PlayerWalkingRight.prototype.enter = function () {
                console.log("walk right ");
            };
            PlayerWalkingRight.prototype.update = function () {
                var pl = this.sm.pl;
                pl.counter["running"]++;
                if (pl.counter["running"] > 3)
                    pl.counter["running"] = 0;
                pl.vx = (pl.vx + 15 < 60) ? pl.vx + 15 : 60;
                if (pl.vx > 0)
                    pl.code = 108;
                else
                    pl.code = 103 + pl.counter["running"] / 2;
            };
            return PlayerWalkingRight;
        })(PlayerMovingState);
        States.PlayerWalkingRight = PlayerWalkingRight;
        var PlayerRunningRight = (function (_super) {
            __extends(PlayerRunningRight, _super);
            function PlayerRunningRight() {
                _super.apply(this, arguments);
            }
            PlayerRunningRight.prototype.enter = function () {
                console.log("run right ");
            };
            PlayerRunningRight.prototype.update = function () {
                var pl = this.sm.pl;
                pl.counter["running"]++;
                if (pl.counter["running"] > 3)
                    pl.counter["running"] = 0;
                pl.vx = (pl.vx + 15 < 120) ? pl.vx + 15 : 120;
                if (pl.vx > 0)
                    pl.code = 108;
                else
                    pl.code = 103 + pl.counter["running"] / 2;
            };
            return PlayerRunningRight;
        })(PlayerMovingState);
        States.PlayerRunningRight = PlayerRunningRight;
        var PlayerInterialMove = (function (_super) {
            __extends(PlayerInterialMove, _super);
            function PlayerInterialMove() {
                _super.apply(this, arguments);
            }
            PlayerInterialMove.prototype.enter = function () {
                console.log("move interial ");
            };
            PlayerInterialMove.prototype.update = function () {
                var pl = this.sm.pl;
                if (pl.vx < 0) {
                    pl.counter["running"]++;
                    if (pl.counter["running"] > 3)
                        pl.counter["running"] = 0;
                    if (pl.flags["isRunning"])
                        pl.code = 107;
                    else
                        pl.code = 103 + pl.counter["running"] / 2;
                }
                else if (pl.vx > 0) {
                    pl.counter["running"]++;
                    if (pl.counter["running"] > 3)
                        pl.counter["running"] = 0;
                    if (pl.flags["isRunning"])
                        pl.code = 107;
                    else
                        pl.code = 103 + pl.counter["running"] / 2;
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
            };
            return PlayerInterialMove;
        })(PlayerMovingState);
        States.PlayerInterialMove = PlayerInterialMove;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Pause = (function (_super) {
            __extends(Pause, _super);
            function Pause(sm) {
                _super.call(this, sm);
                this.background = document.createElement("canvas");
                this.background.width = this.sm.game.screen.width;
                this.background.height = this.sm.game.screen.height;
            }
            Pause.prototype.enter = function () {
                // 現在の画面を保存
                this.background.getContext("2d").drawImage(this.sm.game.screen.canvas, 0, 0);
            };
            Pause.prototype.update = function () {
                this.sm.game.screen.context.drawImage(this.background, 0, 0);
                this.sm.game.screen.context.fillStyle = "rgba(0,0,0,0.2)";
                this.sm.game.screen.context.fillRect(0, 0, this.sm.game.screen.width, this.sm.game.screen.height);
                this.sm.game.screen.context.fillStyle = "black";
                this.sm.game.screen.context.strokeText("PAUSE", 240, 150);
                if (this.sm.game.gamekey.isOnDown(80)) {
                    this.sm.pop(); // ステージに戻る
                }
                if (this.sm.game.gamekey.isOnDown(84)) {
                    this.sm.pop();
                    this.sm.pop(); // タイトルに戻る
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
            function Stage(sm) {
                _super.call(this, sm);
                this.gk = this.sm.game.gamekey;
                this.player = new Game.Player(this.gk, 224, 120, this.sm.game.assets.image, "pattern", 100);
                this.sprites = new Game.Group(this.sm.game.screen);
                this.sprites.add(this.player);
            }
            Stage.prototype.enter = function () {
            };
            Stage.prototype.update = function () {
                // 背景色で埋めてみる
                this.sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                this.sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);
                this.sprites.update();
                this.sprites.draw();
                if (this.gk.isOnDown(80)) {
                    this.sm.push(new States.Pause(this.sm)); // ポーズ
                }
                if (this.gk.isOnDown(84)) {
                    this.sm.pop(); // タイトルに戻る
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
            Title.prototype.enter = function () {
                this.titleimg = this.sm.game.assets.image.get("title");
            };
            Title.prototype.update = function () {
                this.sm.game.screen.context.drawImage(this.titleimg, 0, 0);
                if (this.sm.game.gamekey.isOnDown(90)) {
                    this.sm.push(new States.Stage(this.sm));
                }
            };
            return Title;
        })(States.GameState);
        States.Title = Title;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
//# sourceMappingURL=app.js.map