module Game {
	export class GameKey {
		public keys: { [key: number]: number; };
		public releasedkeys: { [key: number]: number; };
		private keepreleasedtime: number;
		constructor() {
			this.keepreleasedtime = 64;
			this.init();
        }
        // キー入力を受け付けるイベントハンドラを登録する
		setEvent(el: HTMLElement) {
			console.log(el);
			el.addEventListener("keydown", (e: KeyboardEvent) => { this.KeyDown(e.keyCode); });
			el.addEventListener("keyup", (e: KeyboardEvent) => { this.KeyUp(e.keyCode); });
		}
		init() {
			this.keys = {};
			this.releasedkeys = {};
		}
		update() {
			for (var key in this.keys) {
				this.keys[key] += 1;
			}
			var rks: { [key: number]: number; } = {};
			for (var key in this.releasedkeys) {
				if (this.releasedkeys[key] + 1 <= this.keepreleasedtime) {
					rks[key] = this.releasedkeys[key] + 1;
				}
			}
			this.releasedkeys = rks;
		}
		KeyDown(key: number) {
			console.log(key);
			if (!(key in this.keys)) {
				this.keys[key] = 0;
			}
		}
		KeyUp(key: number) {
			if (key in this.keys) {
				delete this.keys[key];
			}
			this.releasedkeys[key] = 0;
		}
		// 押されているかどうかの判定をします
		isDown(key: number): boolean {
			if (key in this.keys) return true;
			return false;
		}
		// 押された瞬間かどうかの判定をします
		isOnDown(key: number): boolean {
			if (key in this.keys && this.keys[key] == 1) return true;
			return false
		}
		// 押された時間を取得します 押されていない場合は-1
		getCount(key: number): number {
			if (key in this.keys) {
				return this.keys[key];
			}
			return -1;
		}
	}
}