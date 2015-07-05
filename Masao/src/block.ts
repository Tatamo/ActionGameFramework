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
        onHit(e: SpriteEvent) {
            var s = e.sprite;
            console.log(this);
            //if (this.x <= s.x + s.width / 2 && this.x + this.width >= s.x + s.width / 2 && // spriteのx中心点との判定
            if (this.x <= s.x + s.width && this.x + this.width >= s.x && // spriteのx中心点との判定
                this.y <= s.y + s.height && this.y + this.height >= s.y) {
                console.log("onground");
                s.dispatchEvent(new Event("onground"));
                s.y = this.y - s.height;
                s.vy = 0;
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