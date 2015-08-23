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
        this.timerToken = setInterval(function () { return _this.span.innerHTML = new Date().toUTCString(); }, 500);
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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    // WeakMap同様の操作が可能で、numberとstringのキーを持つデータ構造です
    var Dictionary = (function () {
        function Dictionary() {
            this.datalist = {};
        }
        // 中身を初期化しますよ
        Dictionary.prototype.clear = function () {
            this.datalist = {};
        };
        Dictionary.prototype.set = function (key, value) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.checkType(key);
            /*if (this.datalist[key] != undefined) {
                throw new Error("State \"" + key + "\"is already defined.");
            }*/
            this.datalist[key] = value;
            return this;
        };
        Dictionary.prototype.delete = function (key) {
            this.checkType(key);
            return delete this.datalist[key];
        };
        Dictionary.prototype.get = function (key) {
            this.checkType(key);
            return this.datalist[key];
        };
        // オブジェクトが存在する場合、登録されているキーを返します
        Dictionary.prototype.getkey = function (value) {
            var result;
            for (var key in this.datalist) {
                if (this.datalist[key] == value) {
                    result = key;
                    break;
                }
            }
            return result;
        };
        Dictionary.prototype.has = function (key) {
            this.checkType(key);
            if (this.datalist[key] != undefined)
                return true;
            else
                return false;
        };
        Dictionary.prototype.checkType = function (key) {
            if (typeof key != "number" && typeof key != "string") {
                throw new Error("key is neither string nor number");
            }
        };
        return Dictionary;
    })();
    Game.Dictionary = Dictionary;
    // 一度登録すると値を変えられないDictionaryです(削除は可能)
    var Registrar = (function (_super) {
        __extends(Registrar, _super);
        function Registrar() {
            _super.apply(this, arguments);
        }
        Registrar.prototype.set = function (key, value) {
            if (this.has(key)) {
                throw new Error("\"" + key + "\"is already defined.");
            }
            _super.prototype.set.call(this, key, value);
        };
        return Registrar;
    })(Dictionary);
    Game.Registrar = Registrar;
    // 順番を持つデータ構造です
    var AbstractDataGroup = (function () {
        function AbstractDataGroup() {
            this.datalist = new Array();
        }
        // 中身を初期化しますよ
        AbstractDataGroup.prototype.clear = function () {
            this.datalist = new Array();
        };
        // 登録されているSpriteのリストを得ます
        AbstractDataGroup.prototype.getArray = function () {
            return this.datalist.slice(0);
        };
        // Spriteの個数を取得します
        AbstractDataGroup.prototype.getCount = function () {
            return this.datalist.length;
        };
        // Spriteを新しく追加します
        AbstractDataGroup.prototype.add = function (value) {
            this.datalist.push(value);
            this.sort();
        };
        // Spriteを並び替えます
        AbstractDataGroup.prototype.sort = function () {
            if (this.sortmethod)
                this.datalist.sort(this.sortmethod);
        };
        // Spriteを消去します
        AbstractDataGroup.prototype.del = function (value) {
            var index = 0;
            var flag = false;
            for (index = 0; index < this.datalist.length; index += 1) {
                if (this.datalist[index] == value) {
                    break;
                }
            }
            if (!flag)
                throw new Error("the object to be deleted not found.");
            this.datalist.splice(index, 1);
        };
        return AbstractDataGroup;
    })();
    Game.AbstractDataGroup = AbstractDataGroup;
})(Game || (Game = {}));
/// <reference path="datadictionary.ts"/>
var Game;
(function (Game) {
    // アセットの取り扱いと重い依存性を一手に引き受けるクラス
    var AssetsManagerManager = (function () {
        function AssetsManagerManager() {
            this.image = new ImageManager();
            this.loader = new Loader([this.image.loader]);
        }
        /*// ロードする画像の登録
        public regist_image(label: string, path: string) {
            this.image.regist_image(label, path);
        }
        // ロードするパターン画像の登録
        public regist_pattern(label: string, path: string, c_width: number, c_height: number) {
            this.image.regist_pattern(label, path,c_width,c_height);
        }*/
        // すべてロードする
        // 撤廃してloader.load()を呼ばせればいいか?
        AssetsManagerManager.prototype.load = function () {
            this.loader.load();
        };
        return AssetsManagerManager;
    })();
    Game.AssetsManagerManager = AssetsManagerManager;
    (function (PreloadStates) {
        PreloadStates[PreloadStates["UNLOAD"] = 0] = "UNLOAD";
        PreloadStates[PreloadStates["LOADING"] = 1] = "LOADING";
        PreloadStates[PreloadStates["NOTHING2LOAD"] = 2] = "NOTHING2LOAD";
    })(Game.PreloadStates || (Game.PreloadStates = {}));
    var PreloadStates = Game.PreloadStates;
    // 複数のLoaderを束ねたかのように振舞うローダー ただしアセットの登録は行えない
    // Loaderインターフェースに定義されたメソッドのみを持つ
    var Loader = (function () {
        function Loader(list) {
            this.loaders = list;
        }
        Object.defineProperty(Loader.prototype, "state", {
            get: function () {
                var f = false;
                for (var i = 0; i < this.loaders.length; i++) {
                    if (this.loaders[i].state == 1 /* LOADING */)
                        return 1 /* LOADING */;
                    if (this.loaders[i].state == 0 /* UNLOAD */)
                        f = true;
                }
                if (f)
                    return 0 /* UNLOAD */;
                else
                    return 2 /* NOTHING2LOAD */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "count", {
            get: function () {
                var c = 0;
                for (var i = 0; i < this.loaders.length; i++) {
                    c += this.loaders[i].count;
                }
                return c;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "count_loadeds", {
            get: function () {
                var c = 0;
                for (var i = 0; i < this.loaders.length; i++) {
                    c += this.loaders[i].count_loadeds;
                }
                return c;
            },
            enumerable: true,
            configurable: true
        });
        Loader.prototype.load = function (cb) {
            var _this = this;
            if (this.state == 2 /* NOTHING2LOAD */) {
                cb();
                return;
            }
            if (this.state == 1 /* LOADING */)
                throw new Error("loading is now processing");
            var i = 0;
            var callback = function () {
                if (++i < _this.loaders.length) {
                    _this.loaders[i].load(callback);
                }
                else {
                    cb();
                }
            };
            if (i < this.loaders.length) {
                this.loaders[i].load(callback);
            }
            else
                cb();
        };
        return Loader;
    })();
    Game.Loader = Loader;
    // UNDONE:画像以外のロード
    var AbstractLoader = (function () {
        function AbstractLoader() {
            this._unloadeds = [];
            this._isloading = false;
            this._count = 0;
        }
        Object.defineProperty(AbstractLoader.prototype, "state", {
            get: function () {
                if (this._unloadeds.length == 0) {
                    return 2 /* NOTHING2LOAD */;
                }
                if (this._isloading)
                    return 1 /* LOADING */;
                return 0 /* UNLOAD */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractLoader.prototype, "count", {
            // ロードするべき総数
            get: function () {
                if (this.state == 0 /* UNLOAD */)
                    return this._unloadeds.length;
                else
                    return this._count;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractLoader.prototype, "count_loadeds", {
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
        AbstractLoader.prototype.push = function (l, p, cb) {
            //push(l: string, p: string) {
            // UNDONE:重複keyの検出
            //if(this.has(key)) throw new Error("\"" + key + "\"is already defined.");
            this._unloadeds.push({ label: l, path: p, callback: cb });
        };
        // TODO: 1-(unloadeds.length/count)の取得
        // キューに追加された画像をすべて読み込みます
        AbstractLoader.prototype.load = function (cb) {
            //if (this.state == PreloadStates.NOTHING2LOAD) throw new Error("there is nothing to load");
            if (this.state == 2 /* NOTHING2LOAD */) {
                cb();
                return;
            }
            if (this.state == 1 /* LOADING */)
                throw new Error("loading is now processing");
            this._count = this._unloadeds.length;
            this._isloading = true;
            this.__load(cb);
        };
        // 再帰的 そとからよぶな ぶちころがすぞ
        AbstractLoader.prototype.__load = function (cb) {
            if (this._unloadeds.length > 0) {
                this._load();
            }
            else {
                // 読み込み完了
                this._isloading = false;
                if (cb)
                    cb();
            }
        };
        // 再帰的 そとからよぶな ぶちころがすぞ
        // to be overridden
        // 処理終了時にthis.__load(cb)を呼ぶこと
        AbstractLoader.prototype._load = function (cb) {
            /*var tmp = this._unloadeds.shift();

            var img = new Image();
            img.onload = () => {
                console.log(img);
                //this._asset.add(tmp.label, img, ResourceType.IMAGE); 下のコールバックで追加させる
                this.__load(cb);
            }
            img.src = tmp.path;*/
        };
        return AbstractLoader;
    })();
    Game.AbstractLoader = AbstractLoader;
    var ImageLoader = (function (_super) {
        __extends(ImageLoader, _super);
        function ImageLoader() {
            _super.apply(this, arguments);
        }
        ImageLoader.prototype._load = function (cb) {
            var _this = this;
            var tmp = this._unloadeds.shift();
            var img = new Image();
            img.onload = function () {
                console.log(img);
                //this._asset.add(tmp.label, img, ResourceType.IMAGE); 下のコールバックで追加させる
                if (tmp.callback)
                    tmp.callback(img, tmp.label);
                _this.__load(cb);
            };
            img.src = tmp.path;
        };
        return ImageLoader;
    })(AbstractLoader);
    Game.ImageLoader = ImageLoader;
    // ロードした画像の取得
    // TODO:良い名前に変える
    // TODO:切り出した画像のキャッシュ
    var ImageManager = (function () {
        function ImageManager() {
            this.images = new Game.Registrar();
            this._loader = new ImageLoader();
            this.loader = this._loader;
        }
        ImageManager.prototype.get = function (name, a, b) {
            var generator = this.images.get(name);
            if (generator == undefined)
                throw new Error("no image with such a name");
            if (a == undefined)
                a = 0; // 引数1つ
            if (b == undefined) {
                return generator.get(a);
            }
            else {
                // (x,y)を取得する
                return generator.get(a, b);
            }
        };
        ImageManager.prototype.getwide = function (name, a, b, c, d) {
            var generator = this.images.get(name);
            if (d == undefined) {
                // code
                return generator.getwide(a, b, c);
            }
            else {
                // (x,y)
                return generator.getwide(a, b, c, d);
            }
        };
        ImageManager.prototype.set = function (name, img, chipwidth, chipheight) {
            if (chipwidth === void 0) { chipwidth = 0; }
            if (chipheight === void 0) { chipheight = 0; }
            var generator = new PatternImageGenerator(img, chipwidth, chipheight);
            this.images.set(name, generator);
        };
        // ロードする画像の登録
        ImageManager.prototype.regist_image = function (label, path) {
            var _this = this;
            var cb = function (file, label) {
                _this.set(label, file, file.width, file.height);
            };
            this._loader.push(label, path, cb);
        };
        // ロードするパターン画像の登録
        ImageManager.prototype.regist_pattern = function (label, path, c_width, c_height) {
            var _this = this;
            var cb = function (file, label) {
                _this.set(label, file, c_width, c_height);
            };
            this._loader.push(label, path, cb);
        };
        ImageManager.prototype.load = function () {
            this._loader.load();
        };
        return ImageManager;
    })();
    Game.ImageManager = ImageManager;
    // 一つの元画像を持ち、そこから画像を切り出して取得できる
    var PatternImageGenerator = (function () {
        function PatternImageGenerator(img, _chipwidth, _chipheight) {
            if (_chipwidth === void 0) { _chipwidth = 0; }
            if (_chipheight === void 0) { _chipheight = 0; }
            this._chipwidth = _chipwidth;
            this._chipheight = _chipheight;
            this.baseimg = img;
            if (_chipwidth > 0 && _chipheight > 0) {
                // 分割画像
                this._countx = Math.ceil(img.width / _chipwidth); // 端数切り上げ
                this._county = Math.ceil(img.height / _chipheight); // 端数切り上げ
            }
            else {
                // 第二または第三引数が0以下ならば一枚画像である
                // 一枚画像
                this._countx = 1;
                this._county = 1;
                this._chipwidth = img.width;
                this._chipheight = img.height;
            }
        }
        Object.defineProperty(PatternImageGenerator.prototype, "chipwidth", {
            get: function () {
                return this._chipwidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PatternImageGenerator.prototype, "chipheight", {
            get: function () {
                return this._chipheight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PatternImageGenerator.prototype, "countx", {
            get: function () {
                return this._countx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PatternImageGenerator.prototype, "county", {
            get: function () {
                return this._county;
            },
            enumerable: true,
            configurable: true
        });
        // (x,y)→code
        PatternImageGenerator.prototype.xy2code = function (x, y) {
            return this._countx * y + x;
        };
        PatternImageGenerator.prototype.get = function (a, b) {
            if (a == undefined)
                return this.get(0); // 引数なし→0
            else if (b != undefined)
                return this.get(this.xy2code(a, b)); // 引数2つ (x,y)→code
            else {
                return this.getwide(a, 1, 1);
            }
        };
        PatternImageGenerator.prototype.getwide = function (a, b, c, d) {
            if (d != undefined)
                return this.getwide(this.xy2code(a, b), c, d); // 引数4つ (x,y)→code
            else {
                // 新しいcanvasを作ってそこに切り出された画像を描画
                // TODO:canvasではなくimageに
                // TODO:一度生成したものを保持して使いまわし可能に
                var canvas = document.createElement("canvas");
                canvas.width = this.chipwidth * b;
                canvas.height = this.chipheight * c;
                var sx = (a % this.countx) * this.chipwidth;
                var sy = Math.floor(a / this.countx) * this.chipheight;
                canvas.getContext("2d").drawImage(this.baseimg, sx, sy, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                return canvas;
            }
        };
        return PatternImageGenerator;
    })();
})(Game || (Game = {}));
var Game;
(function (Game) {
    // 読み込まれたマップの管理
    var Config = (function () {
        function Config(map, image, config) {
            if (config === void 0) { config = {}; }
            this.initconfig();
            this.initmap(map);
            this.image = image;
            this.config = config;
        }
        Config.prototype.initconfig = function () {
            this.config = {};
            this.config["screen_width"] = 512;
            this.config["screen_height"] = 320;
            this.config["mapchip_width"] = 32;
            this.config["mapchip_height"] = 32;
            this.config["map_width"] = 180;
            this.config["map_height"] = 30;
        };
        Config.prototype.initmap = function (map) {
            this.rawmap = map;
            this.map = [];
            for (var i = 0; i < map.length; i += 1) {
                if (i < this.config["map_height"]) {
                    this.map[i] = map[i];
                }
                else {
                    this.map[i % this.config["map_height"]] += map[i];
                }
            }
        };
        return Config;
    })();
    Game.Config = Config;
})(Game || (Game = {}));
var Game;
(function (Game) {
    // TODO:thisのバインド関係の改善
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this._handlers = {};
            this._oncehandlers = {};
        }
        // イベントハンドラの追加
        EventDispatcher.prototype.addEventHandler = function (type, handler) {
            if (!this._handlers[type]) {
                this._handlers[type] = [handler.bind(this)];
            }
            else {
                this._handlers[type].push(handler.bind(this));
            }
        };
        // 一度呼ばれると消えるイベントハンドラの追加
        EventDispatcher.prototype.addOnceEventHandler = function (type, handler) {
            if (!this._oncehandlers[type]) {
                this._oncehandlers[type] = [handler.bind(this)];
            }
            else {
                this._oncehandlers[type].push(handler.bind(this));
            }
        };
        // イベントハンドラの削除
        EventDispatcher.prototype.removeEventHandler = function (type, handler) {
            if (!this._handlers[type] && !this._oncehandlers[type]) {
                return;
            }
            if (this._handlers[type]) {
                for (var i = this._handlers[type].length; i >= 0; i--) {
                    if (this._handlers[type][i] == handler) {
                        this._handlers[type].splice(i, 1);
                    }
                }
            }
            if (this._oncehandlers[type]) {
                for (var i = this._oncehandlers[type].length; i >= 0; i--) {
                    if (this._oncehandlers[type][i] == handler) {
                        this._oncehandlers[type].splice(i, 1);
                    }
                }
            }
        };
        // すべてのイベントハンドラを削除
        EventDispatcher.prototype.clearEventHandler = function (type) {
            this._handlers[type] = [];
            this._oncehandlers[type] = [];
        };
        // イベントの発火 ちなみに揮発性のイベントのほうが後に呼ばれる
        EventDispatcher.prototype.dispatchEvent = function (e) {
            if (!this._handlers[e.type] && !this._oncehandlers[e.type])
                return;
            if (this._handlers[e.type]) {
                for (var i = 0; i < this._handlers[e.type].length; i++) {
                    var e;
                    this._handlers[e.type][i](e);
                }
            }
            if (this._oncehandlers[e.type]) {
                for (var i = 0; i < this._oncehandlers[e.type].length; i++) {
                    var e;
                    this._oncehandlers[e.type][i](e);
                }
            }
        };
        return EventDispatcher;
    })();
    Game.EventDispatcher = EventDispatcher;
    var Event = (function () {
        function Event(type) {
            this.type = type;
        }
        return Event;
    })();
    Game.Event = Event;
})(Game || (Game = {}));
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
    // TODO:
    // Surfaceのサブクラスとして、メインスクリーン専用のDisplayクラスの追加を検討
    // ダブルバッファリング等々の機能追加
    // 今はSurface#containerを対象にとっているが、display#containerをGameKeyのイベントハンドラ登録対象に限定してもよいと思われる
    var Surface = (function () {
        // TODO:
        // getおよびsetを利用してcenterx/yなどを実装
        // TODO:
        // ラベルを渡すことでロードした画像を持つSurfaceを生成
        function Surface(width, height) {
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
        Surface.prototype.setWidth = function (width) {
            this.canvas.width = width;
            //this.canvas_buffer.width = width;
        };
        Surface.prototype.setHeight = function (height) {
            this.canvas.height = height;
            //this.canvas_buffer.height = height;
        };
        Surface.prototype.drawSurface = function (source, dest_x, dest_y) {
            this.context.drawImage(source.canvas, dest_x, dest_y);
        };
        return Surface;
    })();
    Game.Surface = Surface;
    var PatternSurface = (function (_super) {
        __extends(PatternSurface, _super);
        function PatternSurface(imagemanager, label, code, dx, dy) {
            if (code === void 0) { code = 0; }
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            this._im = imagemanager;
            this._label = label;
            this._code = code;
            this._dx = dx;
            this._dy = dy;
            this._reverse_horizontal = false;
            this._reverse_vertical = false;
            var i = this._im.getwide(label, code, dx, dy);
            this._i = i;
            _super.call(this, i.width, i.height);
            this.context.drawImage(i, 0, 0, i.width, i.height, 0, 0, i.width, i.height);
        }
        Object.defineProperty(PatternSurface.prototype, "code", {
            get: function () {
                return this._code;
            },
            set: function (c) {
                this._code = c;
                this._i = this._im.getwide(this._label, this._code, this._dx, this._dy);
                this.context.clearRect(0, 0, this.width, this.height);
                this.context.drawImage(this._i, 0, 0, this._i.width, this._i.height, 0, 0, this._i.width, this._i.height);
                if (this.reverse_horizontal)
                    this.reverseHorizontal();
                if (this.reverse_vertical)
                    this.reverseVertical();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PatternSurface.prototype, "reverse_vertical", {
            get: function () {
                return this._reverse_vertical;
            },
            set: function (flag) {
                if (flag == this._reverse_vertical)
                    return;
                else {
                    this._reverse_vertical = !this._reverse_vertical;
                    if (this._reverse_vertical)
                        this.reverseVertical();
                    else {
                        this.context.clearRect(0, 0, this.width, this.height);
                        this.context.drawImage(this._i, 0, 0, this._i.width, this._i.height, 0, 0, this._i.width, this._i.height);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PatternSurface.prototype, "reverse_horizontal", {
            get: function () {
                return this._reverse_horizontal;
            },
            set: function (flag) {
                if (flag == this._reverse_horizontal)
                    return;
                else {
                    this._reverse_horizontal = !this._reverse_horizontal;
                    if (this._reverse_horizontal)
                        this.reverseHorizontal();
                    else {
                        this.context.clearRect(0, 0, this.width, this.height);
                        this.context.drawImage(this._i, 0, 0, this._i.width, this._i.height, 0, 0, this._i.width, this._i.height);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        // 上下反転状態にする(反転状態を逆の反転状態に切り替えるわけではないことに注意)
        PatternSurface.prototype.reverseVertical = function () {
            this.context.save();
            this.context.clearRect(0, 0, this.width, this.height);
            this.context.translate(0, this.height);
            this.context.scale(1, -1);
            this.context.drawImage(this._i, 0, 0, this._i.width, this._i.height, 0, 0, this._i.width, this._i.height);
            this.context.restore();
        };
        // 左右反転状態にする(反転状態を逆の反転状態に切り替えるわけではないことに注意)
        PatternSurface.prototype.reverseHorizontal = function () {
            this.context.save();
            this.context.clearRect(0, 0, this.width, this.height);
            this.context.translate(this.width, 0);
            this.context.scale(-1, 1);
            this.context.drawImage(this._i, 0, 0, this._i.width, this._i.height, 0, 0, this._i.width, this._i.height);
            this.context.restore();
        };
        return PatternSurface;
    })(Surface);
    Game.PatternSurface = PatternSurface;
})(Game || (Game = {}));
/// <reference path="surface.ts"/>
var Game;
(function (Game) {
    // UNDONE: 自分の所属しているgroup名の取得
    // パターン画像を使用するスプライト
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(x, y, imagemanager, label, code, dx, dy) {
            if (code === void 0) { code = 0; }
            if (dx === void 0) { dx = 1; }
            if (dy === void 0) { dy = 1; }
            _super.call(this);
            this.x = x;
            this.y = y;
            this.z = 0;
            this.vx = 0;
            this.vy = 0;
            this.ss = null;
            this.surface = new Game.PatternSurface(imagemanager, label, code, dx, dy);
        }
        Object.defineProperty(Sprite.prototype, "ss", {
            get: function () {
                return this._ss;
            },
            set: function (ss) {
                this._ss = ss;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "width", {
            get: function () {
                return this.surface.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "height", {
            get: function () {
                return this.surface.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "code", {
            get: function () {
                return this.surface.code;
            },
            set: function (c) {
                this.surface.code = c;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "reverse_horizontal", {
            get: function () {
                return this.surface.reverse_horizontal;
            },
            set: function (f) {
                this.surface.reverse_horizontal = f;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "reverse_vertical", {
            get: function () {
                return this.surface.reverse_vertical;
            },
            set: function (f) {
                this.surface.reverse_vertical = f;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "left", {
            get: function () {
                return this.x;
            },
            set: function (v) {
                this.x = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "right", {
            get: function () {
                return this.x + this.width - 1;
            },
            set: function (v) {
                this.x = v - this.width + 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "top", {
            get: function () {
                return this.y;
            },
            set: function (v) {
                this.y = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "bottom", {
            get: function () {
                return this.y + this.height - 1;
            },
            set: function (v) {
                this.y = v - this.height + 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "centerx", {
            get: function () {
                return this.x + (this.width - 1) / 2;
            },
            set: function (v) {
                this.x = v - (this.width + 1) / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "centery", {
            get: function () {
                return this.y + (this.height - 1) / 2;
            },
            set: function (v) {
                this.y = v - (this.height + 1) / 2;
            },
            enumerable: true,
            configurable: true
        });
        /*// Surfaceの初期化
        setsurface(screen: Surface) {
        }*/
        /*// 自身をグループに追加する
        add(group: IGroup) {
            // グループへの追加はSpriteSystemを経由して行う
            //this.ss.regist(group, this);
            this._groups.push(group);
        }
        remove(group: IGroup) {
            var f: boolean = false;
            for (var i = this._groups.length - 1; i >= 0; i--) {
                if (this._groups[i] == group) {
                    this._groups.splice(i, 1);
                    f = true;
                }
            }
            if (f) group.remove(this); // 相互に参照を破棄
        }*/
        Sprite.prototype.update = function () {
        };
        Sprite.prototype.kill = function () {
            this.ss.remove(this);
        };
        return Sprite;
    })(Game.EventDispatcher);
    Game.Sprite = Sprite;
    var SpriteEvent = (function (_super) {
        __extends(SpriteEvent, _super);
        function SpriteEvent(type, sprite) {
            _super.call(this, type);
            this.type = type;
            this.sprite = sprite;
        }
        return SpriteEvent;
    })(Game.Event);
    Game.SpriteEvent = SpriteEvent;
    // TODO: sort
    var Group = (function () {
        function Group(screen) {
            this._sprites = new Array();
            this.screen = screen;
        }
        Group.prototype.compare = function (a, b) {
            if (a.z > b.z) {
                return -1; // ここで-1を返しているので逆順のソート
            }
            if (a.z < b.z) {
                return 1;
            }
            return 0;
        };
        Group.prototype.add = function (sprite) {
            var i = this._sprites.length - 1;
            while (i >= 0) {
                if (this.compare(sprite, this._sprites[i]) >= 0) {
                    break;
                }
                i -= 1;
            }
            this._sprites.splice(i + 1, 0, sprite);
        };
        Group.prototype.remove = function (sprite) {
            for (var i = this._sprites.length - 1; i >= 0; i--) {
                if (this._sprites[i] == sprite) {
                    this._sprites.splice(i, 1);
                }
            }
        };
        Group.prototype.remove_all = function () {
            for (var i = this._sprites.length - 1; i >= 0; i--) {
                this.remove(this._sprites[i]);
            }
        };
        Group.prototype.get_all = function () {
            return this._sprites.slice(0);
        };
        Group.prototype.sort = function () {
            this._sprites = this._sprites.sort(this.compare);
        };
        Group.prototype.update = function () {
            // 処理中にthis._spritesの要素が変化する可能性があるため、配列のコピーを回す
            var sps = this._sprites.slice(0);
            for (var i = 0; i < sps.length; i++) {
                sps[i].update();
            }
        };
        Group.prototype.draw = function (view_x, view_y) {
            if (view_x === void 0) { view_x = 0; }
            if (view_y === void 0) { view_y = 0; }
            // 補正 ハードコーディング
            if (view_x < 0)
                view_x = 0;
            if (view_y < 0)
                view_y = 0;
            if (view_x > 32 * 180 - 512)
                view_x = 32 * 180 - 512;
            if (view_y > 32 * 30 - 320)
                view_y = 32 * 30 - 320;
            for (var i = 0; i < this._sprites.length; i++) {
                this.screen.drawSurface(this._sprites[i].surface, Math.round(this._sprites[i].x) - view_x, Math.round(this._sprites[i].y - view_y));
            }
        };
        return Group;
    })();
    Game.Group = Group;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var AbstractState = (function () {
            //name: string;
            //constructor(name: string, sm: GameStateMachine) {
            function AbstractState() {
                //this.name = name;
            }
            AbstractState.prototype.enter = function (sm) {
            };
            AbstractState.prototype.update = function (sm) {
            };
            AbstractState.prototype.exit = function (sm) {
            };
            return AbstractState;
        })();
        States.AbstractState = AbstractState;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="state.ts"/>
var Game;
(function (Game) {
    var StateMachine = (function () {
        function StateMachine(parent) {
            if (parent === void 0) { parent = null; }
            this.current_state = null;
            this.global_state = null;
            this.root_state = null;
            /*this.is_started = false;*/
            this._states = new Array();
            this.parent = parent;
        }
        StateMachine.prototype.update = function () {
            // グローバルステートが存在すれば実行
            if (this.global_state)
                this.global_state.update(this);
            // 現在のステートの処理
            if (this.current_state)
                this.current_state.update(this);
        };
        // スタックに新しいStateを積み、そのStateに遷移する
        // UNDONE:戻り値未定義
        StateMachine.prototype.push = function (state) {
            // スタックに何もないならば、与えられたステートをrootとする
            if (this._states.length == 0)
                this.root_state = state;
            if (this.current_state)
                this.current_state.exit(this);
            this._states.push(state);
            this.current_state = state;
            this.current_state.enter(this);
        };
        // 現在のステートを終了し、前のステートに遷移する
        // UNDONE:戻り値未定義
        StateMachine.prototype.pop = function () {
            /*// rootならばpopはできない
            if (this.current_state == this.root_state) return;*/
            this._states.pop().exit(this);
            console.log(this._states);
            this.current_state = this._states[this._states.length - 1];
            if (this.current_state)
                this.current_state.enter(this);
        };
        // 現在のステートを新しいステートに入れ替え、遷移処理を行う
        StateMachine.prototype.replace = function (state) {
            // 現在のステートがrootならば、新しいステートをrootとする
            if (this.root_state = this.current_state)
                this.root_state = state;
            this._states.pop().exit(this);
            this._states.push(state);
            this.current_state = state;
            this.current_state.enter(this);
        };
        // 初期化用
        StateMachine.prototype.setGlobalState = function (state) {
            if (this.global_state)
                this.global_state.exit(this);
            this.global_state = state;
            this.global_state.enter(this);
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
    var GameStateMachine = (function (_super) {
        __extends(GameStateMachine, _super);
        function GameStateMachine(game, parent) {
            if (parent === void 0) { parent = null; }
            _super.call(this, parent);
            this.game = game;
        }
        return GameStateMachine;
    })(StateMachine);
    Game.GameStateMachine = GameStateMachine;
})(Game || (Game = {}));
/// <reference path="surface.ts"/>
/// <reference path="sprite.ts"/>
/// <reference path="input.ts"/>
/// <reference path="assets.ts"/>
/// <reference path="statemachine.ts"/>
/// <reference path="state.ts"/>
var Game;
(function (_Game) {
    _Game.SCREEN_WIDTH = 512;
    _Game.SCREEN_HEIGHT = 320;
    var Game = (function () {
        function Game() {
            this.screen = new _Game.Surface(_Game.SCREEN_WIDTH, _Game.SCREEN_HEIGHT);
            this.statemachine = new _Game.GameStateMachine(this);
            this.gamekey = new _Game.GameKey();
            this.assets = new _Game.AssetsManagerManager();
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
                "...............................99...........................",
                "............................................................",
                "............................................................",
                ".....A.......B..............................................",
                "...12aa....BaaB.....12.....9.9...aaa.....aa.aaaaaaaa...12...",
                "..........Baaaa...........aaaaa..............9.aaaaa........",
                ".........aaaaa..........................B...aaaaaaaa........",
                "....9.9.............................aaaaa...9.9aa999........",
                "....aaa...............B.............9.9.9...aaaaaaaa........",
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
            var image = {
                "gameover": "gameover.gif",
                "title": "title.gif",
                "pattern": "pattern.gif"
            };
            this.config = new _Game.Config(map, image, {});
        }
        // 指定した要素の子要素としてゲーム画面を追加します
        Game.prototype.setparent = function (el) {
            this.element = el;
            this.element.innerHTML += "test"; // DEBUG
            this.element.appendChild(this.screen.container);
            this.screen.container.tabIndex = 1; // ゲーム画面をフォーカス可能にする
            this.gamekey.setEvent(this.screen.container); // 画面に対してキー入力を受け付けるように
        };
        // ゲームループの開始
        Game.prototype.start = function (state) {
            var _this = this;
            console.log("app start"); // DEBUG
            // this.statemachine.push(最初のState);
            /*if(!this.statemachine.CurrentState()) this.statemachine.push(new States.Preload("preload", this.statemachine));*/
            if (!this.statemachine.CurrentState())
                this.statemachine.push(state); // TODO:state==null時などの考慮
            this.timerToken = setInterval(function () { return _this.loop(); }, 70);
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