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
                if (e.mode == "edge") {
                    if (s.vy < 0 && e.dir != "down") {
                        // up
                        if (this.x < s.right && this.right > s.x && // spriteのx中心点との判定
                            this.y < s.bottom + 1 && this.bottom + 1 >= s.y) {
                            s.y = this.bottom + 1;
                            s.vy = 0;
                            s.dispatchEvent(new SpriteCollisionEvent("onhit", this, e.dir));
                        }
                    }
                    else if (s.vy >= 0 && e.dir != "up") {
                        // down || //
                        if (this.x < s.right && this.right > s.x && // spriteのx中心点との判定
                            this.y <= s.bottom + 1 && this.bottom + 1 > s.y) {
                            console.log("onground");
                            s.dispatchEvent(new Event("onground"));
                            s.bottom = this.y - 1;
                            s.vy = 0;
                            s.dispatchEvent(new SpriteCollisionEvent("onhit", this, e.dir));
                        }
                    }
                }
                else if (e.mode == "center") { // UNDONE
                    if (s.vy < 0 && e.dir != "down") {
                        // up
                        if (this.x <= s.centerx && this.right + 1 > s.centerx && // spriteのx中心点との判定
                            this.y < s.bottom + 1 && this.bottom + 1 >= s.y) {
                            s.y = this.bottom + 1;
                            s.vy = 0;
                            s.dispatchEvent(new SpriteCollisionEvent("onhit", this, e.dir));
                        }
                    }
                    else if (s.vy >= 0 && e.dir != "up") {
                        // down || //
                        //if (Math.floor(s.centerx / this.width) == Math.floor(this.x / this.width) && // spriteのx中心点との判定
                        //if (this.x <= s.centerx && this.right >= s.centerx && // spriteのx中心点との判定
                        if (this.x <= s.centerx && this.right + 1 > s.centerx && // spriteのx中心点との判定
                            this.y <= s.bottom + 1 && this.bottom + 1 > s.y) {
                            console.log("onground");
                            s.dispatchEvent(new Event("onground"));
                            s.bottom = this.y - 1;
                            s.vy = 0;
                            s.dispatchEvent(new SpriteCollisionEvent("onhit", this, e.dir));
                        }
                    }
                }
            }
            else if (e.dir == "horizontal" || e.dir == "left" || e.dir == "right") {
                if (e.mode == "edge") {
                    if (s.vx > 0) {
                        // right
                        if (e.dir != "left")
                            if (this.x <= s.right && this.right >= s.x &&
                                this.y <= s.bottom + 1 && this.bottom + 1 > s.y) {
                                s.right = this.x;
                                s.vx = 0;
                                s.dispatchEvent(new SpriteCollisionEvent("onhit", this, e.dir));
                            }
                    }
                    else if (s.vx < 0) {
                        // left
                        if (e.dir != "right")
                            if (this.x <= s.right && this.right >= s.x &&
                                this.y <= s.bottom + 1 && this.bottom + 1 > s.y) {
                                s.x = this.right + 1;
                                s.vx = 0;
                                s.dispatchEvent(new SpriteCollisionEvent("onhit", this, e.dir));
                            }
                    }
                    else { // UNDONE
                        if (this.x <= s.right && this.right >= s.x &&
                            this.y <= s.bottom + 1 && this.bottom + 1 > s.y) {
                            if (s.centerx < this.centerx) s.right = this.x;
                            else s.x = this.right+1;
                            s.dispatchEvent(new SpriteCollisionEvent("onhit", this, "horizontal"));
                        }
                    }
                }
                else if (e.mode == "center") {
                    if (s.vx > 0) {
                        // right
                        if (e.dir != "left")
                            if (this.x <= s.centerx && this.right + 1 > s.centerx && // spriteのx中心点との判定
                                this.y <= s.bottom + 1 && this.bottom + 1 > s.y) {
                                s.x = this.x - (s.width - 1) / 2 - 1;
                                s.vx = 0;
                                s.dispatchEvent(new SpriteCollisionEvent("onhit", this, e.dir));
                            }
                    }
                    else if (s.vx < 0) {
                        // left
                        if (e.dir != "right")
                            if (this.x <= s.centerx && this.right + 1 > s.centerx && // spriteのx中心点との判定
                                this.y <= s.bottom + 1 && this.bottom + 1 > s.y) {
                                s.x = this.right - (s.width - 1) / 2 + 1;
                                s.vx = 0;
                                s.dispatchEvent(new SpriteCollisionEvent("onhit", this, e.dir));
                            }
                    }
                    else { // UNDONE
                        if (this.x <= s.centerx && this.right + 1 > s.centerx && // spriteのx中心点との判定
                            this.y <= s.bottom + 1 && this.bottom + 1 > s.y) {
                            if (s.centerx < this.centerx) s.x = this.x - (s.width - 1) / 2 - 1;
                            else s.x = this.x + this.width - (s.width - 1) / 2 + 1;
                            s.dispatchEvent(new SpriteCollisionEvent("onhit", this, "horizontal"));
                        }
                    }
                }
            }
            else {
            }
        }
    }
    export class Block1 extends Block {
        initPatternCode() { this.code = 20; }
    }
    export class Block2 extends Block {
        initPatternCode() { this.code = 21; }
    }
    export class Block3 extends Block {
        initPatternCode() { this.code = 22; }
    }
    export class Block4 extends Block {
        initPatternCode() { this.code = 23; }
    }
    export class Block5 extends Block {
        initPatternCode() { this.code = 24; }
    }
    export class Block6 extends Block {
        initPatternCode() { this.code = 25; }
    }
}