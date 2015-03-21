module Game {
    // TODO:
    // Surfaceのサブクラスとして、メインスクリーン専用のDisplayクラスの追加を検討
    // ダブルバッファリング等々の機能追加
    // 今はSurface#containerを対象にとっているが、display#containerをGameKeyのイベントハンドラ登録対象に限定してもよいと思われる
	export class Surface {
		container: HTMLDivElement;
		canvas: HTMLCanvasElement;
		context: CanvasRenderingContext2D;
		parent: Surface;
		//is_use_buffer: boolean;
		x: number;
		y: number;
		width: number;
        height: number;
        // TODO:
        // getおよびsetを利用してcenterx/y,top/bottom,left/rightなどを実装
        // TODO:
        // ラベルを渡すことでロードした画像を持つSurfaceを生成
		constructor(width: number, height: number, parent: Surface= null) {
			this.x = 0; this.y = 0; this.width = width; this.height = height;
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
		setX(x: number) {
			this.x = x;
		}
		// Y座標を変更
		setY(y: number) {
			this.y = y;
		}
		// X,Y座標を変更
		setPosition(x: number, y: number) {
			this.x = x;
			this.y = y;
		}
		setWidth(width: number) {
			this.canvas.width = width;
			//this.canvas_buffer.width = width;
		}
		setHeight(height: number) {
			this.canvas.height = height;
			//this.canvas_buffer.height = height;
		}
		// 対象のSurfaceに自身を描画する
		Draw2Sufrace(target: Surface, x: number, y: number) {
			target.context.drawImage(this.canvas, x, y);
		}

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
	}/*
	export class ImageManager {
		private images: Registrar<PatternImageGenerator>;
		constructor() {
			this.images = new Registrar<PatternImageGenerator>();
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
		set(name: string, img: HTMLImageElement, chipwidth: number= 0, chipheight: number= 0) {
			var generator = new PatternImageGenerator(img, chipwidth, chipheight);
			this.images.set(name, generator);
		}
	}
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