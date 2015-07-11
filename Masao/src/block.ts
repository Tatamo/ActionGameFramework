module Game {
    export class Block extends Sprite {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, 21, dx, dy);
            this.z = 512;
            this.initPatternCode();
            this.addEventHandler("onhit", this.onHit);
        }
        // to be overridden
        initPatternCode() {
            this.code = 20;
        }
        onHit(e: SpriteCollisionEvent) {
            var s = e.sprite;
            if (e.dir == "vertical" || e.dir == "up" || e.dir == "down") {
                // up
                if (s.vy < 0 && e.dir != "down") {
                    if (this.x <= s.x + s.width / 2 && this.x + this.width >= s.x + s.width / 2 && // spriteのx中心点との判定
                        this.y < s.y + s.height && this.y + this.height >= s.y) {
                        s.y = this.y + this.height;
                        s.vy = 0;
                    }
                }
                else if (s.vy >= 0 && e.dir != "up") {
                    // down || //
                    if (this.x <= s.x + s.width / 2 && this.x + this.width >= s.x + s.width / 2 && // spriteのx中心点との判定
                        this.y <= s.y + s.height && this.y + this.height >= s.y) {
                        console.log("onground");
                        s.dispatchEvent(new Event("onground"));
                        s.y = this.y - s.height;
                        s.vy = 0;
                    }
                }
            }
            else if (e.dir == "horizontal" || e.dir == "left" || e.dir == "right") {
                if (s.vx > 0 && e.dir != "left") {
                    // right
                    if (this.x <= s.x + s.width / 2 && this.x + this.width >= s.x + s.width / 2 && // spriteのx中心点との判定
                        this.y <= s.y + s.height && this.y + this.height >= s.y) {
                        s.x = this.x - s.width / 2 - 1;
                        s.vx = 0;
                    }
                }
                else if (s.vx < 0 && e.dir != "right") {
                    // left
                    if (this.x <= s.x + s.width / 2 && this.x + this.width >= s.x + s.width / 2 && // spriteのx中心点との判定
                        this.y <= s.y + s.height && this.y + this.height >= s.y) {
                        s.x = this.x + this.width - s.width / 2 + 1;
                        s.vx = 0;
                    }
                }
            }
            else {
            }
        }
    }
    export class Block1 extends Block {
        initPattern() { this.code = 20; }
    }
    export class Block2 extends Block {
        initPattern() { this.code = 21; }
    }
}