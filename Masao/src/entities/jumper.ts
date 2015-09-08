module Game {
    export class Jumper extends Enemy {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.JumperWaiting());
            //this.code = 154;
            this.addEventHandler("onstamped", this.onStamped);
            this.addEventHandler("onhit", this.onHit);
        }
        protected move() {
            this.x += this.vx / 10;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            this.y += this.vy / 10;
            this.checkCollisionWithBlocksVertical(); // 接触判定
        }
        private onStamped(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) this.moving.replace(new States.JumperStamped());
            this.vx = 0;
            this.vy = 0;
        }
        private onHit(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) {
                if (e.dir == "horizontal") {
                    this.reverse_horizontal = !this.reverse_horizontal;
                }
                if (e.dir == "vertical" && e.sprite.y > this.y) {
                    this.flags["isOnGround"] = true;
                }
            }
        }
    }

    export module States {
        export class JumperWaiting extends AbstractStampableAlive {
            enter(sm: EntityStateMachine) {
                sm.e.counter["ac"] = 0;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.code = 154;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] < 25) e.counter["ac"] += 1;
                else {
                    sm.replace(new JumperJumping());
                }

                this.checkCollisionWithPlayer(sm);
            }
        }
        export class JumperJumping extends AbstractStampableAlive {
            enter(sm: EntityStateMachine) {
                sm.e.counter["ac"] = 0;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.vx = e.reverse_horizontal ? 50 : -50;
                if (e.counter["ac"] == 0) {
                    e.vy = -170;
                    sm.e.flags["isOnGround"] = false;
                }
                e.vy += (e.counter["ac"] % 2) ? 20 : 10;
                if (e.vy > 170) e.vy = 170;

                e.counter["ac"] += 1;

                if (e.vy < 40) {
                    e.code = 155;
                }
                else {
                    e.code = 156;
                }
                console.log(e.vy);

                if (e.flags["isOnGround"]) {
                    sm.replace(new JumperWaiting());
                    sm.update();
                }

                this.checkCollisionWithPlayer(sm);
            }
        }
        export class JumperStamped extends AbstractState {
            enter(sm: EntityStateMachine) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 157;
                sm.e.flags["isAlive"] = false;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 157;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] >= 10) {
                    e.kill();
                }
            }
        }
    }
}