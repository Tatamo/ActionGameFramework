/// <reference path="entity.ts"/>
module Game {
    export class Decoration extends AbstractEntity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.z = 512;
            this.initPatternCode();
            //this.addEventHandler("onhit", this.onHit);
        }
        // to be overridden
        initPatternCode() {
            this.code = 20;
        }
    }
    export class CloudLeft extends Decoration {
        initPatternCode() { this.code = 1; }
    }
    export class CloudRight extends Decoration {
        initPatternCode() { this.code = 2; }
    }
    export class Grass extends Decoration {
        initPatternCode() { this.code = 3; }
    }
    export class Torch extends Decoration {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.TorchMoving());
        }
        initPatternCode() { this.code = 96; }
    }
    export module States {
        export class TorchMoving extends AbstractState {
            enter(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = 0;

            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2) e.code = 96;
                else e.code = 97;
            }
        }
    }
}