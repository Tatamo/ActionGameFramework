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
		width: number;
        height: number;
        // TODO:
        // getおよびsetを利用してcenterx/yなどを実装
        // TODO:
        // ラベルを渡すことでロードした画像を持つSurfaceを生成
		constructor(width: number, height: number, parent: Surface= null) {
			this.width = width; this.height = height;
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
		setWidth(width: number) {
			this.canvas.width = width;
			//this.canvas_buffer.width = width;
		}
		setHeight(height: number) {
			this.canvas.height = height;
			//this.canvas_buffer.height = height;
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
}