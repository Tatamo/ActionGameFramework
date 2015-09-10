/// <reference path="enemy.ts"/>
module Game {
    export class Kame extends Enemy {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.KameWalking());
            //this.code = 140;
            this.addEventHandler("onstamped", this.onStamped);
            //this.addEventHandler("onhit", this.onHit);
        }
        private onStamped(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) this.moving.replace(new States.KameStamped());
            this.vx = 0;
            this.vy = 0;
        }
        /*private onHit(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) {
                if (e.dir == "horizontal") {
                    this.reverse_horizontal = !this.reverse_horizontal;
                }
                if (e.dir == "vertical") {
                    this.flags["isOnGround"] = true;
                }
            }
        }*/
    }
    export class KameFallable extends Kame {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.moving.replace(new States.KameWalkingFallable());
        }
    }
    export module States {
        export class KameWalking extends AbstractStampableAlive {
            enter(sm: EntityStateMachine) {
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2) e.code = 140;
                else e.code = 141;

                e.vx = e.reverse_horizontal ? 30 : -30;

                if (e.ss.MapBlocks.getByXYReal((e.reverse_horizontal ? e.right : e.x) + e.vx / 10, e.y + e.height + 1) == null) {
                    e.reverse_horizontal = !e.reverse_horizontal;
                    e.x = e.ss.MapBlocks.getByXYReal(e.centerx, e.y + e.height + 1).x;
                    e.vx = 0;
                }
                this.checkCollisionWithPlayer(sm);
            }
        }
        export class KameWalkingFallable extends AbstractStampableAlive {
            enter(sm: EntityStateMachine) {
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2) e.code = 140;
                else e.code = 141;

                e.vx = e.reverse_horizontal ? 30 : -30;

                if (e.ss.MapBlocks.getByXYReal((e.reverse_horizontal ? e.x : e.right) + e.vx / 10, e.y + e.height + 1) == null) {
                    e.x = Math.floor(((e.reverse_horizontal ? e.x : e.right) + e.vx / 10) / e.width) * e.width; // マップチップの横幅がエンティティの横幅と同じであること依存している点に注意
                    e.vx = 0;
                    sm.replace(new KameFalling());
                }
                this.checkCollisionWithPlayer(sm);
            }
        }
        export class KameFalling extends AbstractStampableAlive {
            enter(sm: EntityStateMachine) {
                sm.e.flags["isOnGround"] = false;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                if (e.flags["isOnGround"]) {
                    sm.replace(new KameWalkingFallable());
                    sm.update();
                }
                else {
                    e.code = 140;
                    e.vy = 50;
                    this.checkCollisionWithPlayer(sm);
                }
            }
        }
        export class KameStamped extends AbstractState {
            enter(sm: EntityStateMachine) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 142;
                sm.e.flags["isAlive"] = false;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 142;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] >= 10) {
                    e.kill();
                }
            }
        }
    }
}