/// <reference path="graphics.ts"/>
module Game {
    export interface ISurface {
    }
    // TODO:
    // Surfaceのサブクラスとして、メインスクリーン専用のDisplayクラスの追加を検討
    // ダブルバッファリング等々の機能追加
    // 今はSurface#containerを対象にとっているが、display#containerをGameKeyのイベントハンドラ登録対象に限定してもよいと思われる
    export class Surface {
        container: HTMLDivElement;
        private _graphics: Graphics.Graphics;
        get graphics(): Graphics.Graphics {
            return this._graphics;
        }
        get canvas(): HTMLCanvasElement {
            return this.graphics.canvas;
        }
        get context(): CanvasRenderingContext2D {
            return this.graphics.context;
        }
        //is_use_buffer: boolean;
        width: number;
        height: number;
        // TODO:
        // getおよびsetを利用してcenterx/yなどを実装
        // TODO:
        // ラベルを渡すことでロードした画像を持つSurfaceを生成
        constructor(graphics: Graphics.Graphics);
        constructor(Image: HTMLElement);
        constructor(width: number, height: number)
        constructor(a: any, height?: number) {
            this.width = a; this.height = height;
            //this.is_use_buffer = is_use_buffer;
            // 要素作成
            this.container = document.createElement("div");
            //this.canvas = document.createElement("canvas");
            //this.context = this.canvas.getContext("2d");
            if (typeof a == "number") {
                this._graphics = new Graphics.Graphics(a, height);
            }
            else {
                this._graphics = new Graphics.Graphics(a);
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
        drawSurface(source: Surface, dest_x: number, dest_y: number) {
            this.context.drawImage(source.canvas, dest_x, dest_y);
        }
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
    }
    export class PatternSurface extends Surface {
        private _im: ImageManager;
        private _i: HTMLCanvasElement;
        private _label: string;
        private _code: number;
        private _dx: number; // パターンチップ何枚分か x方向
        private _dy: number; // パターンチップ何枚分か y方向
        get code(): number {
            return this._code;
        }
        set code(c: number) {
            this._code = c;
            this._i = this._im.getwide(this._label, this._code, this._dx, this._dy);
            this.context.clearRect(0, 0, this.width, this.height);
            this.context.drawImage(this._i, 0, 0, this._i.width, this._i.height, 0, 0, this._i.width, this._i.height);
            if (this.reverse_horizontal) this.reverseHorizontal();
            if (this.reverse_vertical) this.reverseVertical();
        }
        private _reverse_vertical: boolean;
        private _reverse_horizontal: boolean;
        get reverse_vertical(): boolean {
            return this._reverse_vertical;
        }
        set reverse_vertical(flag: boolean) {
            if (flag == this._reverse_vertical) return;
            else {
                this._reverse_vertical = !this._reverse_vertical;
                if (this._reverse_vertical) this.reverseVertical();
                else {
                    this.context.clearRect(0, 0, this.width, this.height);
                    this.context.drawImage(this._i, 0, 0, this._i.width, this._i.height, 0, 0, this._i.width, this._i.height);
                }
            }
        }
        get reverse_horizontal(): boolean {
            return this._reverse_horizontal;
        }
        set reverse_horizontal(flag: boolean) {
            if (flag == this._reverse_horizontal) return;
            else {
                this._reverse_horizontal = !this._reverse_horizontal;
                if (this._reverse_horizontal) this.reverseHorizontal();
                else {
                    this.context.clearRect(0, 0, this.width, this.height);
                    this.context.drawImage(this._i, 0, 0, this._i.width, this._i.height, 0, 0, this._i.width, this._i.height);
                }
            }
        }
        constructor(imagemanager: ImageManager, label: string, code: number = 0, dx: number = 1, dy: number = 1) {
            this._im = imagemanager;
            this._label = label;
            this._code = code;
            this._dx = dx;
            this._dy = dy;
            this._reverse_horizontal = false;
            this._reverse_vertical = false;
            var i = this._im.getwide(label, code, dx, dy);
            this._i = i;
            super(i.width, i.height);
            this.context.drawImage(i, 0, 0, i.width, i.height, 0, 0, i.width, i.height);
        }
        // 上下反転状態にする(反転状態を逆の反転状態に切り替えるわけではないことに注意)
        private reverseVertical() {
            this.context.save();
            this.context.clearRect(0, 0, this.width, this.height);
            this.context.translate(0, this.height)
            this.context.scale(1, -1);
            this.context.drawImage(this._i, 0, 0, this._i.width, this._i.height, 0, 0, this._i.width, this._i.height);
            this.context.restore();
        }
        // 左右反転状態にする(反転状態を逆の反転状態に切り替えるわけではないことに注意)
        private reverseHorizontal() {
            this.context.save();
            this.context.clearRect(0, 0, this.width, this.height);
            this.context.translate(this.width, 0);
            this.context.scale(-1, 1);
            this.context.drawImage(this._i, 0, 0, this._i.width, this._i.height, 0, 0, this._i.width, this._i.height);
            this.context.restore();
        }
    }
}