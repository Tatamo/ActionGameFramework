var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () {
            return _this.span.innerHTML = new Date().toUTCString();
        }, 500);
    };

    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
})();

var game;
window.onload = function () {
    var el = document.getElementById('content');

    /*var greeter = new Greeter(el);
    greeter.start();*/
    game = new Game.Game();
    game.setparent(el);
    game.start();
};
var Game;
(function (Game) {
    var GameKey = (function () {
        function GameKey() {
            this.keepreleasedtime = 64;
            this.init();
        }
        // キー入力を受け付けるイベントハンドラを登録する
        GameKey.prototype.setEvent = function (el) {
            var _this = this;
            console.log(el);
            el.addEventListener("keydown", function (e) {
                _this.KeyDown(e.keyCode);
            });
            el.addEventListener("keyup", function (e) {
                _this.KeyUp(e.keyCode);
            });
        };
        GameKey.prototype.init = function () {
            this.keys = {};
            this.releasedkeys = {};
        };
        GameKey.prototype.update = function () {
            for (var key in this.keys) {
                this.keys[key] += 1;
            }
            var rks = {};
            for (var key in this.releasedkeys) {
                if (this.releasedkeys[key] + 1 <= this.keepreleasedtime) {
                    rks[key] = this.releasedkeys[key] + 1;
                }
            }
            this.releasedkeys = rks;
        };
        GameKey.prototype.KeyDown = function (key) {
            console.log(key);
            if (!(key in this.keys)) {
                this.keys[key] = 0;
            }
        };
        GameKey.prototype.KeyUp = function (key) {
            if (key in this.keys) {
                delete this.keys[key];
            }
            this.releasedkeys[key] = 0;
        };

        // 押されているかどうかの判定をします
        GameKey.prototype.isDown = function (key) {
            if (key in this.keys)
                return true;
            return false;
        };

        // 押された瞬間かどうかの判定をします
        GameKey.prototype.isOnDown = function (key) {
            if (key in this.keys && this.keys[key] == 1)
                return true;
            return false;
        };

        // 押された時間を取得します 押されていない場合は-1
        GameKey.prototype.getCount = function (key) {
            if (key in this.keys) {
                return this.keys[key];
            }
            return -1;
        };
        return GameKey;
    })();
    Game.GameKey = GameKey;
})(Game || (Game = {}));
var Game;
(function (Game) {
    (function (PreloadStates) {
        PreloadStates[PreloadStates["UNLOAD"] = 0] = "UNLOAD";
        PreloadStates[PreloadStates["LOADING"] = 1] = "LOADING";
        PreloadStates[PreloadStates["LOADED"] = 2] = "LOADED";
    })(Game.PreloadStates || (Game.PreloadStates = {}));
    var PreloadStates = Game.PreloadStates;

    // UNDONE:画像以外のロード
    var Loader = (function () {
        function Loader() {
            this._unloadeds = [];
            this._asset = [];
            this._isloading = false;
        }
        Object.defineProperty(Loader.prototype, "state", {
            // get state() { return this._state; }
            get: function () {
                if (this._unloadeds == null || this._unloadeds.length == 0) {
                    if (this._asset == null || this._asset.length == 0) {
                        return 0 /* UNLOAD */;
                    }
                    return 2 /* LOADED */;
                }
                if (this._isloading)
                    return 1 /* LOADING */;
                return 0 /* UNLOAD */;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Loader.prototype, "count", {
            // ロードするべき画像総数
            get: function () {
                if (this.state == 0 /* UNLOAD */)
                    return this._unloadeds.length;
                else
                    return this._count;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Loader.prototype, "count_loadedimgs", {
            // いくつロード完了しているか
            get: function () {
                if (this.state == 0 /* UNLOAD */)
                    return 0;
                else if (this.state == 1 /* LOADING */)
                    return this.count - this._unloadeds.length;
                else
                    return this.count;
            },
            enumerable: true,
            configurable: true
        });

        // 画像の名前とパスをキューに追加します
        // push(label,path,callback?)
        Loader.prototype.push = function (l, p, cb) {
            // UNDONE:重複keyの検出
            //if(this.has(key)) throw new Error("\"" + key + "\"is already defined.");
            this._unloadeds.push({ label: l, path: p, callback: cb });
        };

        // 追加された画像をすべて読み込みます
        Loader.prototype.load = function () {
            if (this.state == 1 /* LOADING */)
                throw new Error("preloading is now processing");
            this._count = this._unloadeds.length;
            this._isloading = true;
            this._load();
        };

        // 再帰的 そとからよぶな ぶちころがすぞ
        Loader.prototype._load = function () {
            var _this = this;
            var tmp = this._unloadeds.shift();
            var img = new Image();
            img.onload = function () {
                _this._asset.push({ label: tmp.label, type: "image", file: img });
                if (tmp.callback)
                    tmp.callback(img, tmp.label);
                if (_this._unloadeds.length > 0) {
                    _this._load();
                } else {
                    // 読み込み完了
                    _this._isloading = true;
                }
            };
        };
        return Loader;
    })();
    Game.Loader = Loader;
})(Game || (Game = {}));
var Game;
(function (Game) {
    // TODO:
    // Surfaceのサブクラスとして、メインスクリーン専用のDisplayクラスの追加を検討
    // ダブルバッファリング等々の機能追加
    // 今はSurface#containerを対象にとっているが、display#containerをGameKeyのイベントハンドラ登録対象に限定してもよいと思われる
    var Surface = (function () {
        // TODO:
        // getおよびsetを利用してcenterx/y,top/bottom,left/rightなどを実装
        // TODO:
        // ラベルを渡すことでロードした画像を持つSurfaceを生成
        function Surface(width, height, parent) {
            if (typeof parent === "undefined") { parent = null; }
            this.x = 0;
            this.y = 0;
            this.width = width;
            this.height = height;

            //this.is_use_buffer = is_use_buffer;
            // 要素作成
            this.container = document.createElement("div");
            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext("2d");

            //this.canvas_buffer = document.createElement("canvas");
            this.container.appendChild(this.canvas);

            // this.container.appendChild(this.canvas_buffer);
            this.setWidth(width);
            this.setHeight(height);

            this.canvas.style.position = "absolute";
            this.canvas.style.left = "0";
            this.canvas.style.top = "0";
            /*this.canvas_buffer.style.position = "absolute";
            this.canvas_buffer.style.left = "0";
            this.canvas_buffer.style.top = "0";*/
        }
        // X座標を変更
        Surface.prototype.setX = function (x) {
            this.x = x;
        };

        // Y座標を変更
        Surface.prototype.setY = function (y) {
            this.y = y;
        };

        // X,Y座標を変更
        Surface.prototype.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Surface.prototype.setWidth = function (width) {
            this.canvas.width = width;
            //this.canvas_buffer.width = width;
        };
        Surface.prototype.setHeight = function (height) {
            this.canvas.height = height;
            //this.canvas_buffer.height = height;
        };

        // 対象のSurfaceに自身を描画する
        Surface.prototype.Draw2Sufrace = function (target, x, y) {
            target.context.drawImage(this.canvas, x, y);
        };
        return Surface;
    })();
    Game.Surface = Surface;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var StateMachine = (function () {
        function StateMachine() {
            this.current_state = null;
            this.global_state = null;
            this.root_state = null;
            this.is_started = false;
            this._states = new Array();
        }
        StateMachine.prototype.update = function () {
            if (this.is_started) {
                // グローバルステートが存在すれば実行
                if (this.global_state)
                    this.global_state.update();

                // 現在のステートの処理
                if (this.current_state)
                    this.current_state.update();
            }
        };
        StateMachine.prototype.start = function (state) {
            this.is_started = true;
        };

        // スタックに新しいStateを積み、そのStateに遷移する
        // UNDONE:戻り値未定義
        StateMachine.prototype.push = function (state) {
            // スタックに何もないならば、与えられたステートをrootとする
            if (this._states.length == 0)
                this.root_state = state;

            this._states.push(state);
            var prev = this.current_state;
            this.current_state = state;
            if (prev)
                prev.exit();
            this.current_state.enter();
        };

        // 現在のステートを終了し、前のステートに遷移する
        // UNDONE:戻り値未定義
        StateMachine.prototype.pop = function () {
            // rootならばpopはできない
            if (this.current_state == this.root_state)
                return;

            this._states.pop().exit();
            this.current_state = this._states[this._states.length - 2];
            this.current_state.enter();
        };

        // 初期化用
        StateMachine.prototype.setGlobalState = function (state) {
            this.global_state = state;
            this.global_state.enter();
        };

        // アクセサ
        StateMachine.prototype.CurrentState = function () {
            return this.current_state;
        };
        StateMachine.prototype.RootState = function () {
            return this.root_state;
        };
        StateMachine.prototype.GlobalState = function () {
            return this.global_state;
        };
        return StateMachine;
    })();
    Game.StateMachine = StateMachine;
})(Game || (Game = {}));
/// <reference path="surface.ts"/>
/// <reference path="input.ts"/>
/// <reference path="loader.ts"/>
/// <reference path="statemachine.ts"/>
var Game;
(function (_Game) {
    var SCREEN_WIDTH = 512;
    var SCREEN_HEIGHT = 320;
    var Game = (function () {
        function Game() {
            this.screen = new _Game.Surface(SCREEN_WIDTH, SCREEN_HEIGHT);
            this.statemachine = new _Game.StateMachine();
            this.gamekey = new _Game.GameKey();
            this.loader = new _Game.Loader();
            //this.config = new Config(map, image, config);
        }
        // 指定した要素の子要素としてゲーム画面を追加します
        Game.prototype.setparent = function (el) {
            this.element = el;
            this.element.innerHTML += "test"; // DEBUG
            this.element.appendChild(this.screen.container);
            this.screen.container.tabIndex = 1; // フォーカス可能にする
            this.gamekey.setEvent(this.screen.container); // 画面に対してキー入力を受け付けるように
        };

        // ゲームループの開始
        Game.prototype.start = function () {
            var _this = this;
            console.log("app start"); // DEBUG

            // this.statemachine.push(最初のState)
            /*this.statemachine.regist(new Preload("preload", this.statemachine));
            this.statemachine.start("preload");*/
            //this.timerToken = setInterval(() => this.statemachine.update(), 100);
            this.timerToken = setInterval(function () {
                return _this.loop();
            }, 100);
        };

        // 使うの?
        Game.prototype.stop = function () {
            clearTimeout(this.timerToken);
        };

        // ゲームループ
        // UNDONE: イベントハンドラ扱いにしたい
        Game.prototype.loop = function () {
            this.gamekey.update(); // まずキー入力情報を更新
            this.statemachine.update(); // ステートマシンを動かす
            //this.screen.canvas.getContext("2d").fillRect(this.counter, this.counter, this.counter, this.counter); //DEBUG
        };
        return Game;
    })();
    _Game.Game = Game;
})(Game || (Game = {}));
//# sourceMappingURL=out.js.map
