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
        var Preload = (function (_super) {
            __extends(Preload, _super);
            function Preload() {
                _super.apply(this, arguments);
            }
            Preload.prototype.enter = function () {
                console.log(this.name);
                var assets = this.sm.game.assets;
                assets.image.regist_image("title", "title.gif");
                assets.image.regist_pattern("pattern", "pattern.gif", 32, 32);
                assets.load();
            };
            Preload.prototype.update = function () {
                var loader = this.sm.game.assets.loader;
                if (loader.state == 2 /* NOTHING2LOAD */) {
                    this.sm.replace(new States.Title("title", this.sm));
                }
            };
            return Preload;
        })(States.AbstractState);
        States.Preload = Preload;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="../ActionGameFramework/out.d.ts"/>
/// <reference path="./src/states/preload.ts"/>
var game;
window.onload = function () {
    var el = document.getElementById('content');
    game = new Game.Game();
    game.setparent(el);
    game.start(new Game.States.Preload("preload", game.statemachine));
};
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Pause = (function (_super) {
            __extends(Pause, _super);
            function Pause(name, sm) {
                _super.call(this, name, sm);
                this.background = document.createElement("canvas");
                this.background.width = this.sm.game.screen.width;
                this.background.height = this.sm.game.screen.height;
            }
            Pause.prototype.enter = function () {
                console.log(this.name);
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
        })(States.AbstractState);
        States.Pause = Pause;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(input, x, y, imagemanager, label, code, dx, dy) {
                if (code === void 0) { code = 0; }
                if (dx === void 0) { dx = 1; }
                if (dy === void 0) { dy = 1; }
                _super.call(this, x, y, imagemanager, label, code, dx, dy);
                this.gk = input;
            }
            Player.prototype.update = function () {
                // うごく
                if (this.gk.isDown(39)) {
                    this.x += 8;
                }
                if (this.gk.isDown(37)) {
                    this.x -= 8;
                }
            };
            return Player;
        })(Game.Sprite);
        States.Player = Player;
        var Stage = (function (_super) {
            __extends(Stage, _super);
            function Stage(name, sm) {
                _super.call(this, name, sm);
                this.gk = this.sm.game.gamekey;
                this.player = new Player(this.gk, 224, 120, this.sm.game.assets.image, "pattern", 100);
                this.sprites = new Game.Group(this.sm.game.screen);
                this.sprites.add(this.player);
            }
            Stage.prototype.enter = function () {
                console.log(this.name);
            };
            Stage.prototype.update = function () {
                // 背景色で埋めてみる
                this.sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                this.sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);
                this.sprites.update();
                this.sprites.draw();
                if (this.gk.isOnDown(80)) {
                    this.sm.push(new States.Pause(this.name + "-pause", this.sm)); // ポーズ
                }
                if (this.gk.isOnDown(84)) {
                    this.sm.pop(); // タイトルに戻る
                }
            };
            return Stage;
        })(States.AbstractState);
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
                console.log(this.name);
                this.titleimg = this.sm.game.assets.image.get("title");
            };
            Title.prototype.update = function () {
                this.sm.game.screen.context.drawImage(this.titleimg, 0, 0);
                if (this.sm.game.gamekey.isOnDown(90)) {
                    this.sm.push(new States.Stage("stage", this.sm));
                }
            };
            return Title;
        })(States.AbstractState);
        States.Title = Title;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
//# sourceMappingURL=app.js.map