module Game {
    export class Block extends Sprite {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, 21, dx, dy);
            this.z = 512;
            this.initPatternCode();
        }
        // to be overridden
        initPatternCode() {
            this.code = 20;
        }
    }
    export class Block1 extends Block {
        initPattern() { this.code = 20; }
    }
    export class Block2 extends Block {
        initPattern() { this.code = 21; }
    }
}