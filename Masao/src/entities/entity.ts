module Game {
    export class Entity extends Sprite {
        public counter: { [key: string]: number; };
        public flags: { [key: string]: boolean; };
        public ss: SpriteSystem;
        public moving: EntityStateMachine;
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, 0, dx, dy);
            this.counter = {};
            this.flags = {};
            this.flags["isAlive"] = true;
            this.z = 256;
        }
        update() {
            if (this.moving) this.moving.update();
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