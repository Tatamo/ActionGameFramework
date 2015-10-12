window.onload = function () {
    var el = document.getElementById('content');
    var s = new Game.Surface(512, 320);
    el.appendChild(s.container);
    s.drawArc("black", 32, 32, 16, 0, Math.PI * 1.5, 1);
    s.drawCircle("red", 256, 128, 32);
    s.drawEllipse("purple", 64, 128, 96, 64);
    s.drawEllipse("black", 64 + 16, 128 + 16, 96, 64, 1);
    s.drawLine("green", 384, 64, 480, 96);
    s.drawLines("green", [32, 32, 64, 32, 64, 64, 48, 96, 32, 64], 3);
    s.drawRect("blue", 128, 128, 64, 32);
    //s.drawPolygon("rgba(0,255,0,0.5)", [128, 64, 256, 64, 128, 160]);
    s.drawCircle("yellow", 256 + 32, 128, 32 - 8, 16);
    s.flip(true, false).scale(0.8, 1.2).rotate(30 * Math.PI / 360);
    s.drawRect("black", 32, 32, 320, 256, 2);
    s.drawImage(s.crop(256, 128, 128, 128), 128, 64);
    var tmp = new Game.Surface(s);
    //s.invertColor();
    //s.invertColor().setGlobalCompositeOperation("lighter").drawSurface(tmp).setGlobalCompositeOperation();
    s.drawImage(s.changeRGBBrightness(127, 255, 255), 128, 64);
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
                //console.log(img);
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
                this._handlers[type] = [handler];
            }
            else {
                this._handlers[type].push(handler);
            }
        };
        // 一度呼ばれると消えるイベントハンドラの追加
        EventDispatcher.prototype.addOnceEventHandler = function (type, handler) {
            if (!this._oncehandlers[type]) {
                this._oncehandlers[type] = [handler];
            }
            else {
                this._oncehandlers[type].push(handler);
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
                    this._handlers[e.type][i].bind(this)(e);
                }
            }
            // イベントハンドラを呼ぶのと同時に破棄することで、2度以上呼ばれることを防ぐ
            if (this._oncehandlers[e.type]) {
                while (this._oncehandlers[e.type].length > 0) {
                    this._oncehandlers[e.type].shift().bind(this)(e);
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
    var NumberEvent = (function (_super) {
        __extends(NumberEvent, _super);
        function NumberEvent(type, value) {
            if (value === void 0) { value = 0; }
            _super.call(this, type);
            this.type = type;
            this.value = value;
        }
        return NumberEvent;
    })(Event);
    Game.NumberEvent = NumberEvent;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var colorkeywords = {
        "aliceblue": 0xf0f8ff,
        "antiquewhite": 0xfaebd7,
        "aqua": 0x00ffff,
        "aquamarine": 0x7fffd4,
        "azure": 0xf0ffff,
        "beige": 0xf5f5dc,
        "bisque": 0xffe4c4,
        "black": 0x000000,
        "blanchedalmond": 0xffebcd,
        "blue": 0x0000ff,
        "blueviolet": 0x8a2be2,
        "brown": 0xa52a2a,
        "burlywood": 0xdeb887,
        "cadetblue": 0x5f9ea0,
        "chartreuse": 0x7fff00,
        "chocolate": 0xd2691e,
        "coral": 0xff7f50,
        "cornflowerblue": 0x6495ed,
        "cornsilk": 0xfff8dc,
        "crimson": 0xdc143c,
        "cyan": 0x00ffff,
        "darkblue": 0x00008b,
        "darkcyan": 0x008b8b,
        "darkgoldenrod": 0xb8860b,
        "darkgray": 0xa9a9a9,
        "darkgreen": 0x006400,
        "darkgrey": 0xa9a9a9,
        "darkkhaki": 0xbdb76b,
        "darkmagenta": 0x8b008b,
        "darkolivegreen": 0x556b2f,
        "darkorange": 0xff8c00,
        "darkorchid": 0x9932cc,
        "darkred": 0x8b0000,
        "darksalmon": 0xe9967a,
        "darkseagreen": 0x8fbc8f,
        "darkslateblue": 0x483d8b,
        "darkslategray": 0x2f4f4f,
        "darkslategrey": 0x2f4f4f,
        "darkturquoise": 0x00ced1,
        "darkviolet": 0x9400d3,
        "deeppink": 0xff1493,
        "deepskyblue": 0x00bfff,
        "dimgray": 0x696969,
        "dimgrey": 0x696969,
        "dodgerblue": 0x1e90ff,
        "firebrick": 0xb22222,
        "floralwhite": 0xfffaf0,
        "forestgreen": 0x228b22,
        "fuchsia": 0xff00ff,
        "gainsboro": 0xdcdcdc,
        "ghostwhite": 0xf8f8ff,
        "gold": 0xffd700,
        "goldenrod": 0xdaa520,
        "gray": 0x808080,
        "green": 0x008000,
        "greenyellow": 0xadff2f,
        "grey": 0x808080,
        "honeydew": 0xf0fff0,
        "hotpink": 0xff69b4,
        "indianred": 0xcd5c5c,
        "indigo": 0x4b0082,
        "ivory": 0xfffff0,
        "khaki": 0xf0e68c,
        "lavender": 0xe6e6fa,
        "lavenderblush": 0xfff0f5,
        "lawngreen": 0x7cfc00,
        "lemonchiffon": 0xfffacd,
        "lightblue": 0xadd8e6,
        "lightcoral": 0xf08080,
        "lightcyan": 0xe0ffff,
        "lightgoldenrodyellow": 0xfafad2,
        "lightgray": 0xd3d3d3,
        "lightgreen": 0x90ee90,
        "lightgrey": 0xd3d3d3,
        "lightpink": 0xffb6c1,
        "lightsalmon": 0xffa07a,
        "lightseagreen": 0x20b2aa,
        "lightskyblue": 0x87cefa,
        "lightslategray": 0x778899,
        "lightslategrey": 0x778899,
        "lightsteelblue": 0xb0c4de,
        "lightyellow": 0xffffe0,
        "lime": 0x00ff00,
        "limegreen": 0x32cd32,
        "linen": 0xfaf0e6,
        "magenta": 0xff00ff,
        "maroon": 0x800000,
        "mediumaquamarine": 0x66cdaa,
        "mediumblue": 0x0000cd,
        "mediumorchid": 0xba55d3,
        "mediumpurple": 0x9370db,
        "mediumseagreen": 0x3cb371,
        "mediumslateblue": 0x7b68ee,
        "mediumspringgreen": 0x00fa9a,
        "mediumturquoise": 0x48d1cc,
        "mediumvioletred": 0xc71585,
        "midnightblue": 0x191970,
        "mintcream": 0xf5fffa,
        "mistyrose": 0xffe4e1,
        "moccasin": 0xffe4b5,
        "navajowhite": 0xffdead,
        "navy": 0x000080,
        "oldlace": 0xfdf5e6,
        "olive": 0x808000,
        "olivedrab": 0x6b8e23,
        "orange": 0xffa500,
        "orangered": 0xff4500,
        "orchid": 0xda70d6,
        "palegoldenrod": 0xeee8aa,
        "palegreen": 0x98fb98,
        "paleturquoise": 0xafeeee,
        "palevioletred": 0xdb7093,
        "papayawhip": 0xffefd5,
        "peachpuff": 0xffdab9,
        "peru": 0xcd853f,
        "pink": 0xffc0cb,
        "plum": 0xdda0dd,
        "powderblue": 0xb0e0e6,
        "purple": 0x800080,
        "red": 0xff0000,
        "rosybrown": 0xbc8f8f,
        "royalblue": 0x4169e1,
        "saddlebrown": 0x8b4513,
        "salmon": 0xfa8072,
        "sandybrown": 0xf4a460,
        "seagreen": 0x2e8b57,
        "seashell": 0xfff5ee,
        "sienna": 0xa0522d,
        "silver": 0xc0c0c0,
        "skyblue": 0x87ceeb,
        "slateblue": 0x6a5acd,
        "slategray": 0x708090,
        "slategrey": 0x708090,
        "snow": 0xfffafa,
        "springgreen": 0x00ff7f,
        "steelblue": 0x4682b4,
        "tan": 0xd2b48c,
        "teal": 0x008080,
        "thistle": 0xd8bfd8,
        "tomato": 0xff6347,
        "turquoise": 0x40e0d0,
        "violet": 0xee82ee,
        "wheat": 0xf5deb3,
        "white": 0xffffff,
        "whitesmoke": 0xf5f5f5,
        "yellowgreen": 0x9acd32
    };
    var Color = (function () {
        function Color(a, b, c, d, e) {
            if (b !== undefined) {
                a = a.trim().toLowerCase();
                if (a == "rgba") {
                    if (Array.isArray(b))
                        this.setRGBA.apply(this, b);
                    else
                        this.setRGBA(b, c, d, e);
                }
                else if (a == "rgb") {
                    if (Array.isArray(b))
                        this.setRGB.apply(this, b);
                    else
                        this.setRGB(b, c, d);
                }
                else if (a == "hsla") {
                    if (Array.isArray(b))
                        this.setHSLA.apply(this, b);
                    else
                        this.setHSLA(b, c, d, e);
                }
                else if (a == "hsl") {
                    if (Array.isArray(b))
                        this.setHSL.apply(this, b);
                    else
                        this.setHSL(b, c, d);
                }
                else {
                    throw new Error("undefined notation \"" + a + "\"");
                }
            }
            else {
                if (typeof a == "number") {
                    this.setNumber(a);
                }
                else if (typeof a == "string") {
                    this.setColorByString(a);
                }
                else {
                    throw new Error("invalid arugment");
                }
            }
        }
        Color.prototype.setKeyword = function (color) {
            this.setRGB.apply(this, Color.Number2RGB(colorkeywords[color]));
        };
        // value:[0x000000,0xffffff]
        Color.prototype.setNumber = function (value) {
            this.setRGB.apply(this, Color.Number2RGB(value));
        };
        // #000000 .. #ffffff または #000 .. #fff
        Color.prototype.setHex = function (color) {
            this.setRGB.apply(this, Color.Hex2RGB(color));
        };
        // r,g,b,a:[0,255]
        Color.prototype.setRGBA = function (r, g, b, a) {
            this.r = Color.limit(Math.round(r), 0, 255);
            this.g = Color.limit(Math.round(g), 0, 255);
            this.b = Color.limit(Math.round(b), 0, 255);
            this.a = Color.limit(a, 0, 1);
        };
        // r,g,b:[0,255]
        Color.prototype.setRGB = function (r, g, b) {
            this.setRGBA(r, g, b, 1);
        };
        // h∈[0,360), s,l∈[0,1]
        Color.prototype.setHSLA = function (h, s, l, a) {
            this.setRGBA.apply(this, Color.HSL2RGB(h, s, l).concat(a));
        };
        // h∈[0,360), s,l∈[0,1]
        Color.prototype.setHSL = function (h, s, l) {
            this.setHSLA(h, s, l, 1);
        };
        Color.prototype.setColorByString = function (color) {
            color = color.trim().toLowerCase();
            var mode = Color.getNotationMode(color);
            if (mode == "hex") {
                this.setHex(color);
            }
            else if (mode == "keyword") {
                this.setKeyword(color);
            }
            else if (mode == "rgb") {
                this.setRGB.apply(this, Color.getRGBColorByFunctionalNotation(color));
            }
            else if (mode == "rgba") {
                this.setRGBA.apply(this, Color.getRGBAColorByFunctionalNotation(color));
            }
            else if (mode == "hsl") {
                this.setHSL.apply(this, Color.getHSLColorByFunctionalNotation(color));
            }
            else if (mode == "hsla") {
                this.setHSLA.apply(this, Color.getHSLAColorByFunctionalNotation(color));
            }
        };
        // [R,G,B]
        Color.prototype.getRGB = function () {
            return [this.r, this.g, this.b];
        };
        // [R,G,B,A]
        Color.prototype.getRGBA = function () {
            return [this.r, this.g, this.b, this.a];
        };
        Color.prototype.getHSL = function () {
            return Color.RGB2HSL(this.r, this.g, this.b);
        };
        Color.prototype.getHSLA = function () {
            return Color.RGB2HSL(this.r, this.g, this.b).concat([this.a]);
        };
        Color.prototype.getNumber = function () {
            return Color.RGB2Number(this.r, this.g, this.b);
        };
        Color.prototype.getHex = function () {
            return Color.RGB2Hex(this.r, this.g, this.b);
        };
        // h∈[0,360), s,l∈[0,1]
        Color.HSL2RGB = function (h, s, l) {
            // hsl値の正規化
            h = h % 360 >= 0 ? h % 360 : h % 360 + 360; // [0,360)に正規化する
            s = Color.limit(s, 0, 1); // [0,1]
            l = Color.limit(l, 0, 1); // [0,1]
            var result = [0, 0, 0];
            var C = (1 - Math.abs(l * 2 - 1)) * s; // chroma
            var H_ = h / 60;
            var X = C * (1 - Math.abs(H_ % 2 - 1));
            var rgb_ = [0, 0, 0];
            if (0 <= H_ && H_ < 1)
                rgb_ = [C, X, 0];
            else if (1 <= H_ && H_ < 2)
                rgb_ = [X, C, 0];
            else if (2 <= H_ && H_ < 3)
                rgb_ = [0, C, X];
            else if (3 <= H_ && H_ < 4)
                rgb_ = [0, X, C];
            else if (4 <= H_ && H_ < 5)
                rgb_ = [X, 0, C];
            else if (5 <= H_ && H_ < 6)
                rgb_ = [C, 0, X];
            var m = l - C / 2;
            result[0] = Color.limit(Math.round((rgb_[0] + m) * 255), 0, 255);
            result[1] = Color.limit(Math.round((rgb_[1] + m) * 255), 0, 255);
            result[2] = Color.limit(Math.round((rgb_[2] + m) * 255), 0, 255);
            return result;
        };
        // r,g,b:[0,255]
        Color.RGB2HSL = function (r, g, b) {
            var result = [0, 0, 0];
            // rgb値を[0,1]に正規化する
            r = Color.limit(r / 255, 0, 1);
            g = Color.limit(g / 255, 0, 1);
            b = Color.limit(b / 255, 0, 1);
            var Cmax = Math.max(r, g, b);
            var Cmin = Math.min(r, g, b);
            var D = Cmax - Cmin;
            var h;
            if (D == 0)
                h = 0;
            else if (Cmax == r)
                h = ((g - b) / D % 6) * 60;
            else if (Cmax == g)
                h = ((b - r) / D + 2) * 60;
            else if (Cmax == b)
                h = ((r - g) / D + 4) * 60;
            h = h % 360 >= 0 ? h % 360 : h % 360 + 360; // [0,360)に正規化する
            var l;
            l = (Cmax + Cmin) / 2;
            var s;
            if (D == 0)
                s = 0;
            else
                s = D / (1 - Math.abs(l * 2 - 1));
            result[0] = h;
            result[1] = s;
            result[2] = l;
            return result;
        };
        // 数値からそれに対応するRGB値へ変換
        Color.Number2RGB = function (color) {
            if (color < 0 || color > 0xffffff) {
                throw new Error("invalid color value");
                return null;
            }
            var r = (color >> 16) & 0xff;
            var g = (color >> 8) & 0xff;
            var b = color & 0xff;
            // return "#" + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2); // これはhex表記
            return [r, g, b];
        };
        // r,g,b:[0,255]
        Color.RGB2Number = function (r, g, b) {
            return ((r << 16) + (g << 8) + b);
        };
        // #000000 .. #ffffff または #000 .. #fff
        Color.Hex2RGB = function (color) {
            color = color.trim().toLowerCase();
            if (color.search(/^#[a-fA-F0-9]{3,6}$/g) == -1) {
                throw new Error("incorrect HEX notation");
                return null;
            }
            if (color.length == 6 + 1) {
                return Color.Number2RGB(Number("0x" + color.slice(1)));
            }
            else if (color.length == 3 + 1) {
                var tmp = color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
                return Color.Number2RGB(Number("0x" + tmp));
            }
            throw new Error("incorrect digit");
            return null;
        };
        // r,g,b:[0,255]
        Color.RGB2Hex = function (r, g, b) {
            return "#" + Color.RGB2Number(r, g, b).toString(16);
        };
        // 色の表記方法の判別
        Color.getNotationMode = function (color) {
            color = color.trim().toLowerCase();
            if (color.search(/^#[a-fA-F0-9]{3,6}$/g) != -1) {
                return "hex";
            }
            else if (colorkeywords[color] !== undefined) {
                return "keyword";
            }
            else {
                return Color.getFunctionalNotationMode(color);
            }
        };
        // どの方式の関数表記かを判別する
        Color.getFunctionalNotationMode = function (color) {
            color = color.trim().toLowerCase();
            var left = color.slice(0, 5);
            var right = color.slice(-1);
            if (left.slice(0, 4) == "rgb(" && right == ")") {
                return "rgb";
            }
            else if (left.slice(0, 4) == "hsl(" && right == ")") {
                return "hsl";
            }
            else if (left == "rgba(" && right == ")") {
                return "rgba";
            }
            else if (left == "hsla(" && right == ")") {
                return "hsla";
            }
            return null;
        };
        Color.getRGBColorByFunctionalNotation = function (color) {
            var color = color.trim().toLowerCase();
            if (Color.getFunctionalNotationMode(color) != "rgb") {
                throw new Error("incorrect RGB notation");
                return null;
            }
            color = color.slice(4).slice(0, -1).trim();
            var tmp = color.split(/\s*,\s*/g);
            if (tmp.length != 3) {
                throw new Error("incorrect RGB notation");
                return null;
            }
            var result = [0, 0, 0];
            var flag_percent = tmp[0].slice(-1) == "%";
            for (var i = 0; i < tmp.length; i++) {
                var x = 0;
                if (tmp[i].slice(-1) == "%") {
                    if (!flag_percent) {
                        throw new Error("incorrect RGB notation");
                        return null;
                    }
                    x = Color.limit(Math.floor(Number(tmp[i].slice(0, -1)) * 255 / 100), 0, 255);
                }
                else if (tmp[i].search(/\./) == -1 && Number(tmp[i]) != NaN) {
                    if (flag_percent) {
                        throw new Error("incorrect RGB notation");
                        return null;
                    }
                    x = Color.limit(Number(tmp[i]), 0, 255);
                }
                else {
                    throw new Error("incorrect RGB notation");
                    return null;
                }
                result[i] = x;
            }
            return result;
        };
        Color.getRGBAColorByFunctionalNotation = function (color) {
            var color = color.trim().toLowerCase();
            if (Color.getFunctionalNotationMode(color) != "rgba") {
                throw new Error("incorrect RGBA notation");
                return null;
            }
            color = color.slice(5).slice(0, -1).trim();
            var tmp = color.split(/\s*,\s*/g);
            if (tmp.length != 4) {
                throw new Error("incorrect RGBA notation");
                return null;
            }
            var result = [0, 0, 0, 0];
            var flag_percent = tmp[0].slice(-1) == "%";
            for (var i = 0; i < tmp.length; i++) {
                var x = 0;
                if (i == 3) {
                    x = 1;
                    if (Number(tmp[i]) == NaN) {
                        throw new Error("incorrect RGBA notation");
                        return null;
                    }
                    x = Color.limit(Number(tmp[i]), 0, 1);
                }
                else {
                    if (tmp[i].slice(-1) == "%") {
                        if (!flag_percent) {
                            throw new Error("incorrect RGBA notation");
                            return null;
                        }
                        x = Color.limit(Math.floor(Number(tmp[i].slice(0, -1)) * 255 / 100), 0, 255);
                    }
                    else if (tmp[i].search(/\./) == -1 && Number(tmp[i]) != NaN) {
                        if (flag_percent) {
                            throw new Error("incorrect RGBA notation");
                            return null;
                        }
                        x = Color.limit(Number(tmp[i]), 0, 255);
                    }
                    else {
                        throw new Error("incorrect RGBA notation");
                        return null;
                    }
                }
                result[i] = x;
            }
            return result;
        };
        Color.getHSLColorByFunctionalNotation = function (color) {
            var color = color.trim().toLowerCase();
            if (Color.getFunctionalNotationMode(color) != "hsl") {
                throw new Error("incorrect HSL notation");
                return null;
            }
            color = color.slice(4).slice(0, -1).trim();
            var tmp = color.split(/\s*,\s*/g);
            if (tmp.length != 3) {
                throw new Error("incorrect HSL notation");
                return null;
            }
            var result = [0, 0, 0];
            for (var i = 0; i < tmp.length; i++) {
                var x = 255;
                if ((i == 1 || i == 2) && tmp[i].slice(-1) == "%") {
                    x = Color.limit(Number(tmp[i].slice(0, -1)) / 100, 0, 1); // [0,1]に正規化する
                }
                else if (i == 0 && Number(tmp[i]) != NaN) {
                    x = Color.limit(Number(tmp[i]), 0, 360);
                }
                else {
                    throw new Error("incorrect HSL notation");
                    return null;
                }
                result[i] = x;
            }
            return result;
        };
        Color.getHSLAColorByFunctionalNotation = function (color) {
            var color = color.trim().toLowerCase();
            if (Color.getFunctionalNotationMode(color) != "hsla") {
                throw new Error("incorrect HSLA notation");
                return null;
            }
            color = color.slice(5).slice(0, -1).trim();
            var tmp = color.split(/\s*,\s*/g);
            if (tmp.length != 4) {
                throw new Error("incorrect HSLA notation");
                return null;
            }
            var result = [0, 0, 0, 0];
            for (var i = 0; i < tmp.length; i++) {
                var x = 255;
                if (i == 3) {
                    x = 1;
                    if (Number(tmp[i]) == NaN) {
                        throw new Error("incorrect HSLA notation");
                        return null;
                    }
                    x = Color.limit(Number(tmp[i]), 0, 1);
                }
                else if ((i == 1 || i == 2) && tmp[i].slice(-1) == "%") {
                    x = Color.limit(Number(tmp[i].slice(0, -1)) / 100, 0, 1); // [0,1]に正規化する
                }
                else if (i == 0 && Number(tmp[i]) != NaN) {
                    x = Color.limit(Number(tmp[i]), 0, 360);
                }
                else {
                    throw new Error("incorrect HSLA notation");
                    return null;
                }
                result[i] = x;
            }
            return result;
        };
        Color.limit = function (x, min, max) {
            return Math.max(min, Math.min(max, x));
        };
        return Color;
    })();
    Game.Color = Color;
})(Game || (Game = {}));
/// <reference path="color.ts"/>
var Game;
(function (Game) {
    // TODO:
    // Surfaceのサブクラスとして、メインスクリーン専用のDisplayクラスの追加を検討
    // ダブルバッファリング等々の機能追加
    // 今はSurface#containerを対象にとっているが、display#containerをGameKeyのイベントハンドラ登録対象に限定してもよいと思われる
    var Surface = (function () {
        function Surface(a, b) {
            // 要素作成
            this.container = document.createElement("div");
            this._canvas = document.createElement("canvas");
            this._context = this.canvas.getContext("2d");
            if (a == null || a == undefined) {
            }
            //this.is_use_buffer = is_use_buffer;
            if (typeof a == "number") {
                this.canvas.width = a;
                this.canvas.height = b;
            }
            else {
                this.canvas.width = a.width;
                this.canvas.height = a.height;
                if (a instanceof Surface) {
                    this.canvas.getContext("2d").drawImage(a.canvas, 0, 0);
                }
                else {
                    this.canvas.getContext("2d").drawImage(a, 0, 0);
                }
            }
            //this.canvas_buffer = document.createElement("canvas");
            // this.container.appendChild(this.canvas_buffer);
            this.container.appendChild(this.canvas);
            this.canvas.style.position = "absolute";
            this.canvas.style.left = "0";
            this.canvas.style.top = "0";
            /*this.canvas_buffer.style.position = "absolute";
            this.canvas_buffer.style.left = "0";
            this.canvas_buffer.style.top = "0";*/
        }
        Object.defineProperty(Surface.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Surface.prototype, "context", {
            get: function () {
                return this._context;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Surface.prototype, "width", {
            get: function () {
                return this.canvas.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Surface.prototype, "height", {
            get: function () {
                return this.canvas.height;
            },
            enumerable: true,
            configurable: true
        });
        Surface.prototype.copy = function (share_canvas) {
            if (share_canvas === void 0) { share_canvas = false; }
            // TODO: share_canvas=trueのときの処理を実装
            if (share_canvas) {
            }
            else {
                return (new Surface(this.width, this.height)).drawImage(this.canvas, 0, 0);
            }
        };
        Surface.prototype.clear = function () {
            var ctx = this.context;
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.restore();
            return this;
        };
        Surface.prototype.crop = function (x, y, width, height) {
            var ctx = this.context;
            var result = new Surface(this.width, this.height);
            result.context.drawImage(this.canvas, x, y, width, height, 0, 0, width, height);
            return result;
        };
        Surface.prototype.setGlobalCompositeOperation = function (blend) {
            if (blend === void 0) { blend = "source-over"; }
            this.context.globalCompositeOperation = blend;
            return this;
        };
        Surface.prototype.setGlobalAlpha = function (a) {
            if (a === void 0) { a = 1; }
            this.context.globalAlpha = a;
            return this;
        };
        Surface.prototype.rotate = function (angle, rotate_center_x, rotate_center_y, resize) {
            if (rotate_center_x === void 0) { rotate_center_x = 0; }
            if (rotate_center_y === void 0) { rotate_center_y = 0; }
            if (resize === void 0) { resize = false; }
            var tmp = new Surface(this); // 処理前の現在の画像を退避させておく
            var ctx = this.context;
            ctx.clearRect(0, 0, this.width, this.height);
            if (resize) {
            }
            ctx.save();
            ctx.translate(rotate_center_x, rotate_center_y);
            ctx.rotate(angle);
            ctx.drawImage(tmp.canvas, 0, 0);
            ctx.restore();
            return this;
        };
        Surface.prototype.scale = function (x, y, resize) {
            if (resize === void 0) { resize = false; }
            var tmp = new Surface(this); // 処理前の現在の画像を退避させておく
            var ctx = this.context;
            ctx.clearRect(0, 0, this.width, this.height);
            if (resize) {
                this.canvas.width *= x;
                this.canvas.height *= y;
            }
            ctx.save();
            ctx.scale(x, y);
            ctx.drawImage(tmp.canvas, 0, 0);
            ctx.restore();
            return this;
        };
        // 上下左右を反転する
        Surface.prototype.flip = function (xbool, ybool) {
            var tmp = new Surface(this); // 処理前の現在の画像を退避させておく
            var ctx = this.context;
            ctx.save();
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.translate(this.width, 0);
            ctx.scale(xbool ? -1 : 1, ybool ? -1 : 1);
            ctx.drawImage(tmp.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
            ctx.restore();
            return this;
        };
        // 色を反転する
        Surface.prototype.invertColor = function () {
            var ctx = this.context;
            var tmp = ctx.getImageData(0, 0, this.width, this.height);
            var data = tmp.data;
            for (var i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            ctx.putImageData(tmp, 0, 0);
            return this;
        };
        // RGBそれぞれの色の描画輝度を変更する (r,g,b∈[0,255])
        Surface.prototype.changeRGBBrightness = function (r, g, b, destructive) {
            if (r === void 0) { r = 255; }
            if (g === void 0) { g = 255; }
            if (b === void 0) { b = 255; }
            if (destructive === void 0) { destructive = true; }
            if (destructive)
                var result = this;
            else
                var result = new Surface(this);
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
            var ctx = result.context;
            var tmp = ctx.getImageData(0, 0, result.width, result.height);
            var data = tmp.data;
            for (var i = 0; i < data.length; i += 4) {
                data[i] = Math.floor(data[i] * r / 255);
                data[i + 1] = Math.floor(data[i + 1] * g / 255);
                data[i + 2] = Math.floor(data[i + 2] * b / 255);
            }
            ctx.putImageData(tmp, 0, 0);
            return result;
        };
        // h:[0,360) s,l:[0,1]
        // 値を変更しないときは必ずnullを明示的に渡します
        Surface.prototype.changeHSL = function (h, s, l, destructive) {
            if (destructive === void 0) { destructive = true; }
            if (destructive)
                var result = this;
            else
                var result = new Surface(this);
            var ctx = result.context;
            var tmp = ctx.getImageData(0, 0, result.width, result.height);
            var data = tmp.data;
            for (var i = 0; i < data.length; i += 4) {
                var hsl = Game.Color.RGB2HSL(data[i], data[i + 1], data[i + 2]);
                if (h !== null)
                    hsl[0] = h;
                if (s !== null)
                    hsl[1] = s;
                if (l !== null)
                    hsl[2] = l;
                var new_rgb = Game.Color.HSL2RGB(hsl[0], hsl[1], hsl[2]);
                data[i] = new_rgb[0];
                data[i + 1] = new_rgb[1];
                data[i + 2] = new_rgb[2];
            }
            ctx.putImageData(tmp, 0, 0);
            return result;
        };
        // h:[0,360) s,l:[0,1]
        // H値を与えられた値だけずらします
        // 値を変更しないときは必ずnullを明示的に渡します
        Surface.prototype.shiftHSL = function (h, s, l, destructive) {
            if (destructive === void 0) { destructive = true; }
            if (destructive)
                var result = this;
            else
                var result = new Surface(this);
            var ctx = result.context;
            var tmp = ctx.getImageData(0, 0, result.width, result.height);
            var data = tmp.data;
            for (var i = 0; i < data.length; i += 4) {
                var hsl = Game.Color.RGB2HSL(data[i], data[i + 1], data[i + 2]);
                if (h !== null)
                    hsl[0] = hsl[0] + h;
                if (s !== null)
                    hsl[1] = s;
                if (l !== null)
                    hsl[2] = l;
                var new_rgb = Game.Color.HSL2RGB(hsl[0], hsl[1], hsl[2]);
                data[i] = new_rgb[0];
                data[i + 1] = new_rgb[1];
                data[i + 2] = new_rgb[2];
            }
            ctx.putImageData(tmp, 0, 0);
            return result;
        };
        /*// 対象のSurfaceに自身を描画する
        Draw2Sufrace(target: Surface, x: number, y: number) {
            target.context.drawImage(this.canvas, x, y);
        }*/
        // 表面canvasと裏面canvasを入れ替える
        /*flipBuffer() {
            if (this.is_use_buffer) {
                var temp = this.canvas;
                this.canvas = this.canvas_buffer;
                this.canvas.style.visibility = "visible";
                this.canvas_buffer = temp;
                this.canvas_buffer.style.visibility = "hidden";
            }
        }*/
        Surface.prototype.drawRect = function (color, x, y, w, h, width) {
            if (width === void 0) { width = 0; }
            if (width != 0)
                return this.drawLines(color, [x, y, x + w, y, x + w, y + h, x, y + h, x, y], width);
            var ctx = this.context;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
            ctx.restore();
            return this;
        };
        Surface.prototype.drawCircle = function (color, x, y, r, width) {
            if (width === void 0) { width = 0; }
            var ctx = this.context;
            ctx.save();
            ctx.beginPath();
            if (width == 0) {
                ctx.fillStyle = color;
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            else {
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
            return this;
        };
        Surface.prototype.drawEllipse = function (color, x, y, w, h, width) {
            if (width === void 0) { width = 0; }
            var ctx = this.context;
            ctx.save();
            ctx.beginPath();
            if (width == 0) {
                ctx.fillStyle = color;
                ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            else {
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
            return this;
        };
        Surface.prototype.drawArc = function (color, x, y, r, startangle, endangle, width) {
            if (width === void 0) { width = 0; }
            var ctx = this.context;
            ctx.save();
            ctx.beginPath();
            if (width == 0) {
                ctx.fillStyle = color;
                ctx.arc(x, y, r, startangle, endangle);
                ctx.fill();
            }
            else {
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.arc(x, y, r, startangle, endangle);
                ctx.stroke();
            }
            ctx.restore();
            return this;
        };
        Surface.prototype.drawPolygon = function (color, p) {
            var ctx = this.context;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = color;
            var i = 0;
            while (i < p.length) {
                if (i + 1 >= p.length)
                    break;
                if (i == 0)
                    ctx.moveTo(p[i], p[i + 1]);
                else
                    ctx.lineTo(p[i], p[i + 1]);
                i += 2;
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            return this;
        };
        Surface.prototype.drawLine = function (color, x1, y1, x2, y2, width) {
            if (width === void 0) { width = 1; }
            var ctx = this.context;
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore();
            return this;
        };
        Surface.prototype.drawLines = function (color, p, width) {
            if (width === void 0) { width = 1; }
            var ctx = this.context;
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            var i = 0;
            while (i < p.length) {
                if (i + 1 >= p.length)
                    break;
                if (i == 0)
                    ctx.moveTo(p[i], p[i + 1]);
                else
                    ctx.lineTo(p[i], p[i + 1]);
                i += 2;
            }
            ctx.stroke();
            ctx.restore();
            return this;
        };
        Surface.prototype.drawImage = function (image, dest_x, dest_y) {
            if (image instanceof Surface)
                image = image.canvas;
            var ctx = this.context;
            ctx.drawImage(image, dest_x, dest_y);
            return this;
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
            //console.log(el);
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
            //console.log(key);
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
/// <reference path="graphics/surface.ts"/>
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
            this.imagemanager = imagemanager;
            this.label = label;
            this.addEventHandler("update", this.update);
            this.x = x;
            this.y = y;
            this.z = 0;
            this.vx = 0;
            this.vy = 0;
            this.ss = null;
            this.surface = new Game.PatternSurface(imagemanager, label, code, dx, dy);
            this._killed = false;
        }
        Object.defineProperty(Sprite.prototype, "ss", {
            get: function () {
                return this._ss;
            },
            set: function (ss) {
                if (!this.is_killed)
                    this._ss = ss;
                else {
                    ss.remove(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "is_killed", {
            get: function () {
                return this._killed;
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
                return this.x + this.width;
            },
            set: function (v) {
                this.x = v - this.width;
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
                return this.y + this.height;
            },
            set: function (v) {
                this.y = v - this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "centerx", {
            get: function () {
                return this.x + this.width / 2;
            },
            set: function (v) {
                this.x = v - this.width / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "centery", {
            get: function () {
                return this.y + this.height / 2;
            },
            set: function (v) {
                this.y = v - this.height / 2;
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
            this.dispatchEvent(new Game.Event("killed")); // TODO: 既にkillされた後にkill()が呼ばれたときにイベントが発火するのが正しい動作なのかどうか考える
            if (this.ss)
                this.ss.remove(this);
            this._killed = true;
        };
        Sprite.prototype.getRect = function () {
            return new Game.Rect(this.x, this.y, this.width, this.height);
        };
        Sprite.prototype.getCollision = function () {
            return this.getRect();
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
            if (sprite.is_killed)
                return; // 既にkillされていた場合追加はできない
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
                //for (var i = sps.length-1; i >= 0; i--) {
                sps[i].dispatchEvent(new Game.Event("update"));
            }
        };
        Group.prototype.draw = function (view_x, view_y) {
            if (view_x === void 0) { view_x = 0; }
            if (view_y === void 0) { view_y = 0; }
            for (var i = 0; i < this._sprites.length; i++) {
                this.screen.drawImage(this._sprites[i].surface, Math.round(this._sprites[i].x) - view_x, Math.round(this._sprites[i].y - view_y));
            }
        };
        return Group;
    })();
    Game.Group = Group;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var StateMachine = (function () {
        function StateMachine(parent) {
            if (parent === void 0) { parent = null; }
            this._current_state = null;
            this._global_state = null;
            this._root_state = null;
            /*this.is_started = false;*/
            this._states = new Array();
            this.parent = parent;
        }
        StateMachine.prototype.update = function () {
            // グローバルステートが存在すれば実行
            if (this._global_state)
                this._global_state.update(this);
            // 現在のステートの処理
            if (this._current_state)
                this._current_state.update(this);
        };
        // スタックに新しいStateを積み、そのStateに遷移する
        // UNDONE:戻り値未定義
        StateMachine.prototype.push = function (state) {
            // スタックに何もないならば、与えられたステートをrootとする
            if (this._states.length == 0)
                this._root_state = state;
            if (this._current_state)
                this._current_state.exit(this);
            this._states.push(state);
            this._current_state = state;
            this._current_state.enter(this);
        };
        // 現在のステートを終了し、前のステートに遷移する
        // UNDONE:戻り値未定義
        StateMachine.prototype.pop = function () {
            /*// rootならばpopはできない
            if (this.current_state == this.root_state) return;*/
            this._states.pop().exit(this);
            this._current_state = this._states[this._states.length - 1];
            if (this._current_state)
                this._current_state.enter(this);
        };
        // 現在のステートを新しいステートに入れ替え、遷移処理を行う
        StateMachine.prototype.replace = function (state) {
            // 現在のステートがrootならば、新しいステートをrootとする
            if (this._root_state = this._current_state)
                this._root_state = state;
            this._states.pop().exit(this);
            this._states.push(state);
            this._current_state = state;
            this._current_state.enter(this);
        };
        // 初期化用
        StateMachine.prototype.setGlobalState = function (state) {
            if (this._global_state)
                this._global_state.exit(this);
            this._global_state = state;
            this._global_state.enter(this);
        };
        Object.defineProperty(StateMachine.prototype, "current_state", {
            // アクセサ
            get: function () {
                return this._current_state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateMachine.prototype, "root_state", {
            get: function () {
                return this._root_state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateMachine.prototype, "global_state", {
            get: function () {
                return this._global_state;
            },
            enumerable: true,
            configurable: true
        });
        return StateMachine;
    })();
    Game.StateMachine = StateMachine;
    var States;
    (function (States) {
        var AbstractState = (function (_super) {
            __extends(AbstractState, _super);
            //name: string;
            //constructor(name: string, sm: GameStateMachine) {
            function AbstractState() {
                _super.call(this);
                //this.name = name;
            }
            AbstractState.prototype.enter = function (sm) {
            };
            AbstractState.prototype.update = function (sm) {
            };
            AbstractState.prototype.exit = function (sm) {
            };
            return AbstractState;
        })(Game.EventDispatcher);
        States.AbstractState = AbstractState;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
/// <reference path="graphics/surface.ts"/>
/// <reference path="sprite.ts"/>
/// <reference path="input.ts"/>
/// <reference path="assets.ts"/>
/// <reference path="statemachine.ts"/>
var Game;
(function (Game) {
    Game.SCREEN_WIDTH = 512;
    Game.SCREEN_HEIGHT = 320;
    var Core = (function (_super) {
        __extends(Core, _super);
        function Core(config) {
            _super.call(this);
            this.screen = new Game.Surface(Game.SCREEN_WIDTH, Game.SCREEN_HEIGHT);
            //this.statemachine = new GameStateMachine(this);
            this.gamekey = new Game.GameKey();
            this.assets = new Game.AssetsManagerManager();
            this.config = new Game.Config(config.map, config.images, {});
            this.addEventHandler("update", this.loop);
        }
        // 指定した要素の子要素としてゲーム画面を追加します
        Core.prototype.setparent = function (el) {
            this.element = el;
            this.element.innerHTML += "test"; // DEBUG
            this.element.appendChild(this.screen.container);
            this.screen.container.tabIndex = 1; // ゲーム画面をフォーカス可能にする
            this.gamekey.setEvent(this.screen.container); // 画面に対してキー入力を受け付けるように
        };
        // ゲームループの開始
        Core.prototype.start = function (state) {
            var _this = this;
            //console.log("app start"); // DEBUG
            // this.statemachine.push(最初のState);
            /*if(!this.statemachine.CurrentState()) this.statemachine.push(new States.Preload("preload", this.statemachine));*/
            if (!this.statemachine.current_state)
                this.statemachine.push(state); // TODO:state==null時などの考慮
            this.timerToken = setInterval(function () {
                _this.dispatchEvent(new Game.Event("update"));
            }, 70);
        };
        // 使うの?
        Core.prototype.stop = function () {
            clearTimeout(this.timerToken);
        };
        // ゲームループ
        // UNDONE: イベントハンドラ扱いにしたい
        Core.prototype.loop = function () {
            this.gamekey.update(); // まずキー入力情報を更新
            this.statemachine.update(); // ステートマシンを動かす
            //this.screen.canvas.getContext("2d").fillRect(this.counter, this.counter, this.counter, this.counter); //DEBUG
        };
        return Core;
    })(Game.EventDispatcher);
    Game.Core = Core;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Collision = (function () {
        function Collision() {
        }
        Collision.prototype.collision = function (target, exclude_bounds) {
            if (exclude_bounds === void 0) { exclude_bounds = false; }
            var base = this; // 自身がShapeクラスに継承されていることを前提とする
            var flag_failed = false;
            if (base instanceof Game.Point) {
                if (target instanceof Game.Point) {
                    return this.colPointWithPoint(base, target, exclude_bounds);
                }
                else if (target instanceof Game.Rect) {
                    return this.colPointWithRect(base, target, exclude_bounds);
                }
                else if (target instanceof Game.Circle) {
                    return this.colPointWithCircle(base, target, exclude_bounds);
                }
                else {
                    flag_failed = true;
                }
            }
            else if (base instanceof Game.Rect) {
                if (target instanceof Game.Point) {
                    return this.colPointWithRect(target, base, exclude_bounds);
                }
                else if (target instanceof Game.Rect) {
                    return this.colRectWithRect(base, target, exclude_bounds);
                }
                else if (target instanceof Game.Circle) {
                    return this.colRectWithCircle(base, target, exclude_bounds);
                }
                else {
                    flag_failed = true;
                }
            }
            else if (base instanceof Game.Circle) {
                if (target instanceof Game.Point) {
                    return this.colPointWithCircle(target, base, exclude_bounds);
                }
                else if (target instanceof Game.Rect) {
                    return this.colRectWithCircle(target, base, exclude_bounds);
                }
                else if (target instanceof Game.Circle) {
                    return this.colCircleWithCircle(base, target, exclude_bounds);
                }
                else {
                    flag_failed = true;
                }
            }
            else {
                flag_failed = true;
            }
            if (flag_failed)
                throw new Error("incorrect or not supported collision type");
            return false;
        };
        Collision.prototype.colPointWithPoint = function (p1, p2, exclude_bounds) {
            if (exclude_bounds === void 0) { exclude_bounds = false; }
            if (exclude_bounds) {
                if (p1.x == p2.x && p1.y == p2.y) {
                    return true;
                }
            }
            else {
                if (p1.x == p2.x && p1.y == p2.y) {
                    return true;
                }
            }
            return false;
        };
        Collision.prototype.colPointWithRect = function (p, r, exclude_bounds) {
            if (exclude_bounds === void 0) { exclude_bounds = false; }
            if (exclude_bounds) {
                if (r.left < p.x && p.x < r.right && r.top < p.y && p.y < r.bottom) {
                    return true;
                }
            }
            else {
                if (r.left <= p.x && p.x <= r.right && r.top <= p.y && p.y <= r.bottom) {
                    return true;
                }
            }
            return false;
        };
        Collision.prototype.colPointWithCircle = function (p, c, exclude_bounds) {
            if (exclude_bounds === void 0) { exclude_bounds = false; }
            if (exclude_bounds) {
                if ((p.x - c.x) * (p.x - c.x) + (p.y - c.y) * (p.y - c.y) < c.r * c.r) {
                    return true;
                }
            }
            else {
                if ((p.x - c.x) * (p.x - c.x) + (p.y - c.y) * (p.y - c.y) <= c.r * c.r) {
                    return true;
                }
            }
            return false;
        };
        Collision.prototype.colRectWithRect = function (r1, r2, exclude_bounds) {
            if (exclude_bounds === void 0) { exclude_bounds = false; }
            if (exclude_bounds) {
                if (r1.left < r2.right && r2.left < r1.right && r1.top < r2.bottom && r2.top < r1.bottom) {
                    return true;
                }
            }
            else {
                if (r1.left <= r2.right && r2.left <= r1.right && r1.top <= r2.bottom && r2.top <= r1.bottom) {
                    return true;
                }
            }
            return false;
        };
        Collision.prototype.colRectWithCircle = function (r, c, exclude_bounds) {
            if (exclude_bounds === void 0) { exclude_bounds = false; }
            if (exclude_bounds) {
            }
            else {
            }
            return false;
        };
        Collision.prototype.colCircleWithCircle = function (c1, c2, exclude_bounds) {
            if (exclude_bounds === void 0) { exclude_bounds = false; }
            if (exclude_bounds) {
                if ((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y) < (c1.r + c2.r) * (c1.r + c2.r)) {
                    return false;
                }
            }
            else {
                if ((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y) <= (c1.r + c2.r) * (c1.r + c2.r)) {
                    return false;
                }
            }
            return false;
        };
        return Collision;
    })();
    Game.Collision = Collision;
})(Game || (Game = {}));
/// <reference path="collision.ts"/>
var Game;
(function (Game) {
    var AbstractShape = (function (_super) {
        __extends(AbstractShape, _super);
        function AbstractShape() {
            _super.call(this);
        }
        AbstractShape.prototype.getParams = function () {
        };
        return AbstractShape;
    })(Game.Collision);
    Game.AbstractShape = AbstractShape;
})(Game || (Game = {}));
/// <reference path="shape.ts"/>
var Game;
(function (Game) {
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(x, y, r, base) {
            if (base === void 0) { base = null; }
            _super.call(this);
            this.x = x;
            this.y = y;
            this.r = r;
            if (base) {
                this.x += base.x;
                this.y += base.y;
                this.r += base.r;
            }
        }
        Object.defineProperty(Circle.prototype, "width", {
            get: function () {
                return this.r * 2;
            },
            set: function (v) {
                this.r = v / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "height", {
            get: function () {
                return this.r * 2;
            },
            set: function (v) {
                this.r = v / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "left", {
            get: function () {
                return this.x - this.r;
            },
            set: function (v) {
                this.x = v + this.r;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "right", {
            get: function () {
                return this.x + this.r;
            },
            set: function (v) {
                this.x = v - this.r;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "top", {
            get: function () {
                return this.y - this.r;
            },
            set: function (v) {
                this.y = v + this.r;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "bottom", {
            get: function () {
                return this.y + this.r;
            },
            set: function (v) {
                this.y = v - this.r;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "centerx", {
            get: function () {
                return this.x;
            },
            set: function (v) {
                this.x = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "centery", {
            get: function () {
                return this.y;
            },
            set: function (v) {
                this.y = v;
            },
            enumerable: true,
            configurable: true
        });
        Circle.prototype.getParams = function () {
            return [this.x, this.y, this.r];
        };
        return Circle;
    })(Game.AbstractShape);
    Game.Circle = Circle;
})(Game || (Game = {}));
/// <reference path="shape.ts"/>
var Game;
(function (Game) {
    var Point = (function (_super) {
        __extends(Point, _super);
        function Point(x, y, base) {
            if (base === void 0) { base = null; }
            _super.call(this);
            this.x = x;
            this.y = y;
            if (base) {
                this.x += base.x;
                this.y += base.y;
            }
        }
        Object.defineProperty(Point.prototype, "width", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "height", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "left", {
            get: function () {
                return this.x;
            },
            set: function (v) {
                this.x = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "right", {
            get: function () {
                return this.x;
            },
            set: function (v) {
                this.x = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "top", {
            get: function () {
                return this.y;
            },
            set: function (v) {
                this.y = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "bottom", {
            get: function () {
                return this.y;
            },
            set: function (v) {
                this.y = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "centerx", {
            get: function () {
                return this.x;
            },
            set: function (v) {
                this.x = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "centery", {
            get: function () {
                return this.y;
            },
            set: function (v) {
                this.y = v;
            },
            enumerable: true,
            configurable: true
        });
        Point.prototype.getParams = function () {
            return [this.x, this.y];
        };
        return Point;
    })(Game.AbstractShape);
    Game.Point = Point;
})(Game || (Game = {}));
/// <reference path="shape.ts"/>
var Game;
(function (Game) {
    var Rect = (function (_super) {
        __extends(Rect, _super);
        function Rect(x, y, w, h, base) {
            if (base === void 0) { base = null; }
            _super.call(this);
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            if (base) {
                this.x += base.x;
                this.y += base.y;
                this.width += base.width;
                this.height += base.height;
            }
        }
        Object.defineProperty(Rect.prototype, "left", {
            get: function () {
                return this.x;
            },
            set: function (v) {
                this.x = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "right", {
            get: function () {
                return this.x + this.width;
            },
            set: function (v) {
                this.x = v - this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "top", {
            get: function () {
                return this.y;
            },
            set: function (v) {
                this.y = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "bottom", {
            get: function () {
                return this.y + this.height;
            },
            set: function (v) {
                this.y = v - this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "centerx", {
            get: function () {
                return this.x + this.width / 2;
            },
            set: function (v) {
                this.x = v - this.width / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "centery", {
            get: function () {
                return this.y + this.height / 2;
            },
            set: function (v) {
                this.y = v - this.height / 2;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.getParams = function () {
            return [this.x, this.y, this.width, this.height];
        };
        return Rect;
    })(Game.AbstractShape);
    Game.Rect = Rect;
})(Game || (Game = {}));
//# sourceMappingURL=out.js.map