module Game {
    export class Entity extends Sprite {
        public moving: EntityStateMachine;
        public counter: { [key: string]: number; };
        public flags: { [key: string]: boolean; };
        public ss: SpriteSystem;
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, 0, dx, dy);
            this.counter = {};
            this.flags = {};
            this.z = 256;
        }
        checkCollisionWithBlocksVertical() {
            this.flags["isOnGround"] = false;
            // check
            var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height + 1); // 足元+1ピクセルも含めて取得

            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                if (this.x <= b.x + b.width && this.x + this.width >= b.x &&
                    this.y <= b.y + b.height && this.y + this.height >= b.y) {
                    b.dispatchEvent(new SpriteCollisionEvent("onhit", this, "vertical", "edge"));
                }
            }
        }
        checkCollisionWithBlocksHorizontal() {
            // check
            var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height);

            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                if (this.x <= b.x + b.width && this.x + this.width >= b.x &&
                    this.y <= b.y + b.height && this.y + this.height >= b.y) {
                    b.dispatchEvent(new SpriteCollisionEvent("onhit", this, "horizontal", "edge"));
                }
            }
        }
    }
    export class EntityStateMachine extends StateMachine {
        public e: Entity;
        constructor(e: Entity, parent: any = null) {
            super(parent);
            this.e = e;
        }
    }
}