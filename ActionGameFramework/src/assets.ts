/// <reference path="datadictionary.ts"/>
module Game {
    // アセットの取り扱いと重い依存性を一手に引き受けるクラス
    export class AssetsManagerManager {
        public loader: Loader;
        //public image: ImageManager;
        constructor() {
            //this.image = new ImageManager();
            this.loader = new Loader();
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
    export class LoadingCompleteEvent extends Event{
        constructor(type: string, item: any) {
            super(type);
        }
    }
    export interface ILoader {
        count_all: number;
        count_loadeds: number;
        push(l: string, p: string, cb?: (file: any, label: string) => void);
        load();
    }
    // UNDONE:画像以外のロード
    // TODO:新しいEventを定義して読み込んだファイルの情報を渡せるように
    export class Loader extends EventDispatcher implements ILoader {
        protected _unloadeds: Array<{ label: string; path: string; callback?: (file: any, label: string) => void; }>; // ロードするべきリソース
        private _is_load_started: boolean;
        private _is_load_completed: boolean;
        private _count: number;
        get is_load_started(): boolean {
            return this._is_load_started;
        }
        get is_load_completed(): boolean {
            return this._is_load_completed;
        }
        get is_loading(): boolean {
            return (this._is_load_started && !this._is_load_completed);
        }
        // ロードするべき総数
        get count_all() {
            if (!this.is_load_started) return this._unloadeds.length; // ロード開始前
            else return this._count; // ロード開始後
        }
        // いくつロード完了しているか
        get count_loadeds() {
            if (!this._is_load_started) return 0; // ロード前
            else if (!this.is_load_completed) return this.count_all - this._unloadeds.length; // ロード中
            else return this.count_all; // ロード後
        }
        constructor() {
            super();
            this._unloadeds = [];
            this._is_load_started = false;
            this._is_load_completed = false;
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
        public load() {
            //if (this.state == PreloadStates.NOTHING2LOAD) throw new Error("there is nothing to load");
            if (this._unloadeds.length == 0) { // 読み込むものがない
                console.log("there is nothing to load. loading cancelled.");
                return;
            }
            if (this.is_load_started) throw new Error("loading is now processing");
            this._count = this._unloadeds.length;
            this._is_load_started = true;
            this.dispatchEvent(new Event("load_start"));
            this._load();
        }

        // 再帰的 そとからよぶな ぶちころがすぞ
        protected _load() {
            if (this._unloadeds.length > 0) {
                // TODO: Image以外の場合分け
                this._loadImage();
            }
            else {
                // 読み込み完了
                this._is_load_completed = false;
                this.dispatchEvent(new Event("load_complete"));
            }
        }
        // 処理終了時にthis._load()を呼ぶこと
        protected _loadImage(cb?: () => void) {
            var tmp = this._unloadeds.shift();

            var img = new Image();
            img.onload = () => {
                //console.log(img);
                //this._asset.add(tmp.label, img, ResourceType.IMAGE); 下のコールバックで追加させる
                if (tmp.callback) tmp.callback(img, tmp.label);
                this.dispatchEvent(new Event("load_progress"));
                this._load();
            }
            img.src = tmp.path;
        }
    }

    export class ImageManager {
        getwide(a, b, c, d) {
            return document.createElement("canvas");
        }
    }
    /*
    // ロードした画像の取得
    // TODO:良い名前に変える
    // TODO:切り出した画像のキャッシュ
    export class ImageManager {
        private images: Registrar<PatternImageGenerator>;
        public loader: ILoader; // 外側にはLoaderインターフェースのみを出す
        private _loader: Loader;
        constructor() {
            this.images = new Registrar<PatternImageGenerator>();
            this._loader = new Loader();
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
    }*/
}