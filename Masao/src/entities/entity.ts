module Game {
    export class Entity extends Sprite {
        public counter: { [key: string]: number; };
        public flags: { [key: string]: boolean; };
        public ss: SpriteSystem;
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, 0, dx, dy);
            this.counter = {};
            this.flags = {};
        }
        getCollision(): IShape { // 通常時に当たり判定に使用する図形を得る
            return this.getRect();
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