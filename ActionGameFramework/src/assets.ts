/// <reference path="datadictionary.ts"/>
module Game {
    // アセットの取り扱いと重い依存性を一手に引き受けるクラス
    export class AssetsManagerManager {
        public loader: Loader;
        public image: ImageManager;
        constructor() {
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
        public load() {
            this.loader.load();
        }
    }

    export enum PreloadStates {
        UNLOAD = 0,
        LOADING = 1,
        NOTHING2LOAD = 2,
    }
    export interface ILoader{
        state: PreloadStates;
        count: number;
        count_loadeds: number;
        load(cb?: () => void);
    }
    // 複数のLoaderを束ねたかのように振舞うローダー ただしアセットの登録は行えない
    // Loaderインターフェースに定義されたメソッドのみを持つ
    export class Loader implements ILoader{
        private loaders: Array<ILoader>;
        constructor(list: Array<ILoader>) {
            this.loaders = list;
        }
        get state() {
            var f = false;
            for (var i = 0; i < this.loaders.length; i++) {
                if (this.loaders[i].state == PreloadStates.LOADING) return PreloadStates.LOADING;
                if (this.loaders[i].state == PreloadStates.UNLOAD) f = true;
            }
            if (f) return PreloadStates.UNLOAD;
            else return PreloadStates.NOTHING2LOAD;
        }
        get count() {
            var c = 0;
            for (var i = 0; i < this.loaders.length; i++) {
                c += this.loaders[i].count;
            }
            return c;
        }
        get count_loadeds() {
            var c = 0;
            for (var i = 0; i < this.loaders.length; i++) {
                c += this.loaders[i].count_loadeds;
            }
            return c;
        }
        load(cb?: () => void) {
            if (this.state == PreloadStates.NOTHING2LOAD) {
                cb();
                return;
            }
            if (this.state == PreloadStates.LOADING) throw new Error("loading is now processing");
            var i = 0;
            var callback = () => {
                if (++i < this.loaders.length) { // 一つのローダーがすべての読み込みを完了したら、次のローダーの読み込みを行う
                    this.loaders[i].load(callback);
                }
                else { // すべての読み込みが終わるとコールバックを実行する
                    cb();
                }
            }
            if (i < this.loaders.length) {
                this.loaders[i].load(callback);
            }
            else cb();
        }
    }
    // UNDONE:画像以外のロード
    export class AbstractLoader implements ILoader {
        protected _unloadeds: Array<{ label: string; path: string; callback?: (file: any, label: string) => void; }>; // ロードするべきリソース
        protected _isloading: boolean;
        get state() {
            if (this._unloadeds.length == 0) { // unloadedsに何も入ってない
                return PreloadStates.NOTHING2LOAD;
            }
            if (this._isloading) return PreloadStates.LOADING;
            return PreloadStates.UNLOAD;
        }
        private _count: number;
        // ロードするべき総数
        get count() {
            if (this.state == PreloadStates.UNLOAD) return this._unloadeds.length;
            else return this._count;
        }
        // いくつロード完了しているか
        get count_loadeds() {
            if (this.state == PreloadStates.UNLOAD) return 0;
            else if (this.state == PreloadStates.LOADING) return this.count - this._unloadeds.length;
            else return this.count;
        }
        constructor() {
            this._unloadeds = [];
            this._isloading = false;
            this._count = 0;

        }
        // 画像の名前とパスをキューに追加します
        // push(label,path,callback?)
        push(l: string, p: string, cb?: (file: any, label: string) => void) {
            //push(l: string, p: string) {
            // UNDONE:重複keyの検出
            //if(this.has(key)) throw new Error("\"" + key + "\"is already defined.");
            this._unloadeds.push({ label: l, path: p, callback: cb });

        }
        // TODO: 1-(unloadeds.length/count)の取得

        
        // キューに追加された画像をすべて読み込みます
        public load(cb?: () => void) {
            //if (this.state == PreloadStates.NOTHING2LOAD) throw new Error("there is nothing to load");
            if (this.state == PreloadStates.NOTHING2LOAD) {
                cb();
                return;
            }
            if (this.state == PreloadStates.LOADING) throw new Error("loading is now processing");
            this._count = this._unloadeds.length;
            this._isloading = true;
            this.__load(cb);
        }

        // 再帰的 そとからよぶな ぶちころがすぞ
        protected __load(cb: () => void) {
            if (this._unloadeds.length > 0) {
                this._load();
            }
            else {
                // 読み込み完了
                this._isloading = false;
                if (cb) cb();
            }
        }
        // 再帰的 そとからよぶな ぶちころがすぞ
        // to be overridden
        // 処理終了時にthis.__load(cb)を呼ぶこと
        protected _load(cb?: () => void) {
            /*var tmp = this._unloadeds.shift();

            var img = new Image();
            img.onload = () => {
                console.log(img);
                //this._asset.add(tmp.label, img, ResourceType.IMAGE); 下のコールバックで追加させる
                this.__load(cb);
            }
            img.src = tmp.path;*/
        }
    }
    export class ImageLoader extends AbstractLoader {
        _load(cb?) {
            var tmp = this._unloadeds.shift();

            var img = new Image();
            img.onload = () => {
                console.log(img);
                //this._asset.add(tmp.label, img, ResourceType.IMAGE); 下のコールバックで追加させる
                if (tmp.callback) tmp.callback(img, tmp.label);
                this.__load(cb);
            }
            img.src = tmp.path;
        }
    }
    // ロードした画像の取得
    // TODO:良い名前に変える
    // TODO:切り出した画像のキャッシュ
    export class ImageManager {
        private images: Registrar<PatternImageGenerator>;
        public loader: ILoader; // 外側にはLoaderインターフェースのみを出す
        private _loader: ImageLoader;
        constructor() {
            this.images = new Registrar<PatternImageGenerator>();
            this._loader = new ImageLoader();
            this.loader = this._loader;
        }
        get(name: string);
        get(name: string, x: number, y: number);
        get(name: string, code: number);
        get(name: string, a?: number, b?: number): HTMLCanvasElement {
            var generator = this.images.get(name);
            if (generator == undefined) throw new Error("no image with such a name");
            if (a == undefined) a = 0; // 引数1つ
            if (b == undefined) { // 引数2つ code
                return generator.get(a);
            }
            else {
                // (x,y)を取得する
                return generator.get(a, b);
            }
        }
        // 複数枚同時取得
        getwide(name: string, x: number, y: number, wx: number, wy: number);
        getwide(name: string, code: number, wx: number, wy: number);
        getwide(name: string, a: number, b: number, c: number, d?: number) {
            var generator = this.images.get(name);
            if (d == undefined) { // 引数3つ
                // code
                return generator.getwide(a, b, c);
            }
            else { // 引数4つ
                // (x,y)
                return generator.getwide(a, b, c, d);
            }
        }
        private set(name: string, img: HTMLImageElement, chipwidth: number= 0, chipheight: number= 0) {
            var generator = new PatternImageGenerator(img, chipwidth, chipheight);
            this.images.set(name, generator);
        }
        // ロードする画像の登録
        regist_image(label: string, path: string) {
            var cb = (file: HTMLImageElement, label: string) => {
                this.set(label, file, file.width, file.height);
            };
            this._loader.push(label, path, cb);
        }
        // ロードするパターン画像の登録
        regist_pattern(label: string, path: string,c_width:number,c_height:number) {
            var cb = (file: HTMLImageElement, label: string) => {
                this.set(label, file, c_width, c_height);
            };
            this._loader.push(label, path, cb);
        }
        load() {
            this._loader.load();
        }
    }
    // 一つの元画像を持ち、そこから画像を切り出して取得できる
    class PatternImageGenerator {
        private baseimg: HTMLImageElement;
        get chipwidth() { return this._chipwidth; }
        get chipheight() { return this._chipheight }
        private _countx: number;
        private _county: number;
        get countx() { return this._countx; }
        get county() { return this._county; }
        constructor(img: HTMLImageElement, private _chipwidth: number= 0, private _chipheight: number= 0) {
            this.baseimg = img;
            if (_chipwidth > 0 && _chipheight > 0) {
                // 分割画像
                this._countx = Math.ceil(img.width / _chipwidth) // 端数切り上げ
				this._county = Math.ceil(img.height / _chipheight) // 端数切り上げ
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
        // (x,y)→code
        private xy2code(x: number, y: number): number {
            return this._countx * y + x;
        }
        get();
        get(x: number, y: number);
        get(code: number);
        get(a?: number, b?: number): HTMLCanvasElement {
            if (a == undefined) return this.get(0); // 引数なし→0
            else if (b != undefined) return this.get(this.xy2code(a, b)); // 引数2つ (x,y)→code
            else {
                return this.getwide(a, 1, 1);
            }
        }
        getwide(x: number, y: number, w: number, h: number);
        getwide(code: number, w: number, h: number);
        getwide(a: number, b: number, c: number, d?: number): HTMLCanvasElement {
            if (d != undefined) return this.getwide(this.xy2code(a, b), c, d); // 引数4つ (x,y)→code
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
        }
    }
}