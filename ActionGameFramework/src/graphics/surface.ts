module Game {
    export interface ISurface {
    }
    // TODO:
    // Surfaceのサブクラスとして、メインスクリーン専用のDisplayクラスの追加を検討
    // ダブルバッファリング等々の機能追加
    // 今はSurface#containerを対象にとっているが、display#containerをGameKeyのイベントハンドラ登録対象に限定してもよいと思われる
    export class Surface {
        container: HTMLDivElement;
        private _canvas: HTMLCanvasElement;
        private _context: CanvasRenderingContext2D;
        get canvas(): HTMLCanvasElement {
            return this._canvas;
        }
        get context(): CanvasRenderingContext2D {
            return this._context;
        }
        get width(): number {
            return this.canvas.width;
        }
        get height(): number {
            return this.canvas.height;
        }
        //is_use_buffer: boolean;
        // TODO:
        // getおよびsetを利用してcenterx/yなどを実装
        // TODO:
        // ラベルを渡すことでロードした画像を持つSurfaceを生成
        constructor(width: number, height: number);
        constructor(surface: Surface);
        constructor(image: HTMLElement)
        constructor(a: any, b?: number) {
            // 要素作成
            this.container = document.createElement("div");
            this._canvas = document.createElement("canvas");
            this._context = this.canvas.getContext("2d");
            if (a == null || a == undefined) { }
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
        protected copy(share_canvas: boolean = false) {
            // TODO: share_canvas=trueのときの処理を実装
            if (share_canvas) { // 未実装
                //return new Surface(this);
            }
            else {
                return (new Surface(this.width, this.height)).drawImage(this.canvas, 0, 0);
            }
        }
        clear() {
            var ctx = this.context;
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.restore();
            return this;
        }
        crop(x: number, y: number, width: number, height: number) {
            var ctx = this.context;
            var result = new Surface(this.width, this.height);
            result.context.drawImage(this.canvas, x, y, width, height, 0, 0, width, height);
            return result;
        }
        setGlobalCompositeOperation(blend: string = "source-over") {
            this.context.globalCompositeOperation = blend;
            return this;
        }
        setGlobalAlpha(a: number = 1) {
            this.context.globalAlpha = a;
            return this;
        }
        rotate(angle: number, rotate_center_x: number = 0, rotate_center_y: number = 0, resize: boolean = false) {
            var tmp = new Surface(this); // 処理前の現在の画像を退避させておく
            var ctx = this.context;
            ctx.clearRect(0, 0, this.width, this.height);
            if (resize) { // TODO: 変換後のサイズを計算してcanvasのサイズを変更
                // 未実装
            }
            ctx.save();
            ctx.translate(rotate_center_x, rotate_center_y);
            ctx.rotate(angle);
            ctx.drawImage(tmp.canvas, 0, 0);
            ctx.restore();
            return this;
        }
        scale(x: number, y: number, resize: boolean = false) {
            var tmp = new Surface(this); // 処理前の現在の画像を退避させておく
            var ctx = this.context;
            ctx.clearRect(0, 0, this.width, this.height);
            if (resize) { // 変換後のサイズを計算してcanvasのサイズを変更
                this.canvas.width *= x;
                this.canvas.height *= y;
            }
            ctx.save();
            ctx.scale(x, y);
            ctx.drawImage(tmp.canvas, 0, 0);
            ctx.restore();
            return this;
        }
        // 上下左右を反転する
        flip(xbool: boolean, ybool: boolean) {
            var tmp = new Surface(this); // 処理前の現在の画像を退避させておく
            var ctx = this.context;
            ctx.save();
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.translate(this.width, 0);
            ctx.scale(xbool ? -1 : 1, ybool ? -1 : 1);
            ctx.drawImage(tmp.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
            ctx.restore();
            return this;
        }
        // 色を反転する
        invertColor() {
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
        }
        // RGBそれぞれの色の描画輝度を変更した新しいSurfaceを得る (r,g,b∈[0,255])
        changeRGBBrightness(r: number = 255, g: number = 255, b: number = 255, destructive: boolean = true) {
            if (destructive) var result = this;
            else var result = new Surface(this);
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
        }
        drawSurface(source: Surface, dest_x: number = 0, dest_y: number = 0) {
            this.context.drawImage(source.canvas, dest_x, dest_y);
            return this;
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


        drawRect(color: string, x: number, y: number, w: number, h: number, width: number = 0) {
            if (width != 0) return this.drawLines(color, [x, y, x + w, y, x + w, y + h, x, y + h, x, y], width);
            var ctx = this.context;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
            ctx.restore();
            return this;
        }
        drawCircle(color: string, x: number, y: number, r: number, width: number = 0) {
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
        }
        drawEllipse(color: string, x: number, y: number, w: number, h: number, width: number = 0) {
            var ctx = this.context;
            ctx.save();
            ctx.beginPath();
            if (width == 0) {
                ctx.fillStyle = color;
                (<any>ctx).ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            else {
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                (<any>ctx).ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
            return this;
        }
        drawArc(color: string, x: number, y: number, r: number, startangle: number, endangle: number, width: number = 0) {
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
        }
        drawPolygon(color: string, p: Array<number>) {
            var ctx = this.context;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = color;
            var i = 0;
            while (i < p.length) {
                if (i + 1 >= p.length) break;
                if (i == 0) ctx.moveTo(p[i], p[i + 1]);
                else ctx.lineTo(p[i], p[i + 1]);
                i += 2;
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            return this;
        }
        drawLine(color: string, x1: number, y1: number, x2: number, y2: number, width: number = 1) {
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
        }
        drawLines(color: string, p: Array<number>, width: number = 1) {
            var ctx = this.context;
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            var i = 0;
            while (i < p.length) {
                if (i + 1 >= p.length) break;
                if (i == 0) ctx.moveTo(p[i], p[i + 1]);
                else ctx.lineTo(p[i], p[i + 1]);
                i += 2;
            }
            ctx.stroke();
            ctx.restore();
            return this;
        }
        drawImage(image: HTMLElement, x: number, y: number) {
            var ctx = this.context;
            ctx.drawImage(image, x, y);
            return this;
        }
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