module Game {
    export enum PreloadStates {
        UNLOAD = 0,
        LOADING = 1,
        LOADED = 2,
    }
    // UNDONE:画像以外のロード
    export class Loader {
        private _unloadeds: Array<{ label: string; path: string; callback?: (img: HTMLImageElement, label: string) => void;}>; // ロードするべきリソース
        // private _asset: Array<{ label: string; type: string; file: any; }>; // ロードされたリソースの保管 UNDONE:現在type="image"のみ
        private _asset: Assets;
        private _isloading: boolean;
        // get state() { return this._state; }
        get state() {
            if (this._unloadeds == null || this._unloadeds.length == 0) { // unloadedsに何も入ってない
                if (this._asset == null || this._asset.length == 0) { // assetに何も入ってない
                    return PreloadStates.UNLOAD;
                }
                return PreloadStates.LOADED;
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
        get count_loadedimgs() {
            if (this.state == PreloadStates.UNLOAD) return 0;
            else if (this.state == PreloadStates.LOADING) return this.count - this._unloadeds.length;
            else return this.count;
        }
        constructor() {
            this._unloadeds = [];
            this._asset = new Assets();
            this._isloading = false;

        }
        // 画像の名前とパスをキューに追加します
        // push(label,path,callback?)
        push(l: string, p: string, cb?: (img: HTMLImageElement, label: string) => void) {
            // UNDONE:重複keyの検出
            //if(this.has(key)) throw new Error("\"" + key + "\"is already defined.");
            this._unloadeds.push({ label: l, path: p, callback: cb });

        }
        // キューに追加された画像をすべて読み込みます
        public load() {
            if (this.state == PreloadStates.LOADING) throw new Error("loading is now processing");
            this._count = this._unloadeds.length;
            this._isloading = true;
            this._load();
		}
        // 再帰的 そとからよぶな ぶちころがすぞ
        private _load() {
            var tmp = this._unloadeds.shift();
            var img = new Image();
            img.onload = () => {
                this._asset.add(tmp.label, img, ResourceType.IMAGE);
                if (tmp.callback) tmp.callback(img, tmp.label);
                if (this._unloadeds.length > 0) {
                    this._load();
                }
                else {
                    // 読み込み完了
                    this._isloading = true;
                }
            }
        }
        // 読み込んだリソースの取得
        public getAsset(label: string, type: ResourceType = ResourceType.ANY) {
        }
    }
    export enum ResourceType {
        ANY = 0,
        IMAGE = 1,
        AUDIO = 2,
    }
    // ロードしたデータの保持
    class Assets {
        private _assets: Array<{ label: string; type: ResourceType; file: any; }>; // ロードされたリソースの保管 UNDONE:現在type="image"のみ
        constructor() {
            this._assets = new Array();
        }
        public get length() {
            return this._assets.length;
        }
        // リソースを追加します
        public add(l: string, f: any, t: ResourceType = ResourceType.ANY) {
            if (this.check(l)) throw new Error("resource name \"" + l + "\" is already registered");
            this._assets.push({ label: l, type: t, file: f });
        }
        // ラベル(とファイルタイプ)を指定してデータ取得
        public get(label: string, type: ResourceType = ResourceType.ANY) {
            var f = (type != ResourceType.ANY); // ANY以外ならTrue
            for (var i = 0; i < this._assets.length; i++) {
                if (f || this._assets[i].type != type) continue;
                if (this._assets[i].label == label) {
                    return this._assets[i].file;
                }
            }
            return null
        }
        // 指定したリソースが登録されているかどうかの判別
        public check(label: string, type: ResourceType = ResourceType.ANY):boolean {
            return this.get(label,type)!=null;
        }
    }
}