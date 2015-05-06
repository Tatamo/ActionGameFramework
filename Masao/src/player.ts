module Game {
    export class Player extends Sprite {
        private gk: GameKey;
        private counter: {};
        private code: number;
        private vx: number;
        private vy: number;
        constructor(input: GameKey, x: number, y: number, imagemanager: ImageManager, label: string, code: number = 0, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, code, dx, dy);
            this.gk = input;
        }
        update() {
            // うごく
            if (this.gk.isDown(39)) {
                this.x += 8;
            }
            if (this.gk.isDown(37)) {
                this.x -= 8;
            }

        }
        ExternalForce() {
            var cnt = this.counter;
            // 歩き,走り判定
            if (this.gk.isDown(37)) {
                cnt["running"]++;
                if (cnt["running"] > 3) cnt["running"] = 0;
                if (isRunning) {
                    this.vx = (this.vx - 15 > -120) ? this.vx - 15 : -120;
                    if (this.vx > 0) this.code = 108;
                    else this.code = 105 + cnt["running"] / 2;
                }
                else {
                    this.vx = (this.vx - 15 > -60) ? this.vx - 15 : -60;
                    if (this.vx > 0) this.code = 108;
                    else this.code = 103 + cnt["running"] / 2;
                }
                //muki_x = false;
            }
            else if (this.gk.isDown(39)) {
                cnt["running"]++;
                if (cnt["running"] > 3) cnt["running"] = 0;
                if (isRunning) {
                    this.vx = (this.vx + 15 < 120) ? this.vx + 15 : 120;
                    if (this.vx < 0) this.code = 108;
                    else this.code = 105 + cnt["running"] / 2;
                }
                else {
                    this.vx = (this.vx + 15 < 60) ? this.vx + 15 : 60;
                    if (this.vx < 0) this.code = 108;
                    else this.code = 103 + cnt["running"] / 2;
                }
                //muki_x = true;
            }
            else if (this.vx < 0) {
                cnt["running"]++;
                if (cnt["running"] > 3) cnt["running"] = 0;
                if (isRunning) this.code = 107;
                else this.code = 103 + cnt["running"] / 2;
                //muki_x = false;
            }
            else if (this.vx > 0) {
                cnt["running"]++;
                if (cnt["running"] > 3) cnt["running"] = 0;
                if (isRunning) this.code = 107;
                else this.code = 103 + cnt["running"] / 2;
                //muki_x = true;
            }

            // 左右キー入力なし・地上
            if (!this.gk.isDown(39) && !this.gk.isDown(37)) { // 摩擦を受ける
                if (this.vx > 0) {
                    this.vx -= 5;
                    if (this.vx < 0) this.vx = 0;
                }
                else if (this.vx < 0) {
                    this.vx += 5;
                    if (this.vx > 0) this.vx = 0;
                }
            }
        }
        }
    }
} 