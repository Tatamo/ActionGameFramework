/// <reference path="enemy.ts"/>
module Game {
    export class Walker extends AbstractEnemy {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.WalkerWalking());
            //this.code = 140;
            this.addEventHandler("onstamped", this.onStamped);
            //this.addEventHandler("onhit", this.onHit);
        }
        private onStamped(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) this.moving.replace(new States.WalkerStamped());
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
    export class FallableWalker extends Walker {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label);
            this.moving.replace(new States.FallableWalkerWalking());
        }
    }
    export class ThreeWalkerFallableGenerator extends AbstractEntity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.Generate3FallableWalkerState());
        }
    }
    export module States {
        export class WalkerWalking extends AbstractStampableAlive {
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
        export class FallableWalkerWalking extends AbstractStampableAlive {
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
                    sm.replace(new WalkerFalling());
                }
                this.checkCollisionWithPlayer(sm);
            }
        }
        export class WalkerFalling extends AbstractStampableAlive {
            enter(sm: EntityStateMachine) {
                sm.e.flags["isOnGround"] = false;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                if (e.flags["isOnGround"]) {
                    sm.replace(new FallableWalkerWalking());
                    sm.update();
                }
                else {
                    e.code = 140;
                    e.vy = 50;
                    this.checkCollisionWithPlayer(sm);
                }
            }
        }
        export class WalkerStamped extends AbstractState {
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
                if (e.counter["ac"] > 14) {
                    e.kill();
                }
            }
        }
        export class Generate3FallableWalkerState extends AbstractState {
            enter(sm: EntityStateMachine) {
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                for (var i = 0; i < 3; i++) {
                    var entity = new FallableWalker(e.x + 75 * i, e.y, e.imagemanager, e.label);
                    entity.counter["viewx_activate"] -= 64 * i;
                    e.ss.add(entity);
                    entity.update();
                }
                e.kill();
            }
        }
    }
}