module Game {
    export module Graphics {
        export class Graphics {
            private _canvas: HTMLCanvasElement;
            private _context: CanvasRenderingContext2D;
            get canvas(): HTMLCanvasElement {
                return this._canvas;
            }
            get context(): CanvasRenderingContext2D {
                return this._context;
            }
            constructor();
            constructor(a: number, b: number);
            constructor(a: Graphics);
            constructor(a: HTMLElement)
            constructor(a?: any, b?: number) {
                this._canvas = document.createElement("canvas");
                this._context = this.canvas.getContext("2d");
                if (a == null || a == undefined) { }
                else if (typeof a == "number") {
                    this.canvas.width = a;
                    this.canvas.height = b;
                }
                else {
                    if (a instanceof Graphics) {
                        this.canvas.width = a.canvas.width;
                        this.canvas.height = a.canvas.height;
                        this.canvas.getContext("2d").drawImage(a.canvas, 0, 0);
                    }
                    else {
                        this.canvas.width = a.width;
                        this.canvas.height = a.height;
                        this.canvas.getContext("2d").drawImage(a, 0, 0);
                    }
                }
            }
            drawRect(color: string, x: number, y: number, w: number, h: number) {
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
            drawImage(image:HTMLElement, x:number, y:number) {
                var ctx = this.context;
                ctx.drawImage(image, x, y);
                return this;
            }
        }
    }
}