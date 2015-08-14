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
    }
    export class Kame extends Entity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.KameWalking());
            this.code = 140;
            this.counter["ac"] = 0;
            this.addEventHandler("onstamped", this.onStamped);
        }
        update() {
            this.moving.update();
            this.x += this.vx/10;
            this.y += this.vy/10;
        }
        private onStamped(e: SpriteCollisionEvent) {
            this.moving.replace(new States.KameStamped());
        }
    }
    export class EntityStateMachine extends StateMachine {
        public e: Entity;
        constructor(e: Entity, parent: any = null) {
            super(parent);
            this.e = e;
        }
    }
    export module States {
        export class KameWalking extends AbstractState {
            enter(sm: EntityStateMachine) {
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2) e.code = 140;
                else e.code = 141;

                e.vx = e.reverse_horizontal ? 30 : -30;

                // TODO: 反転時に本家と座標がずれるのを修正
                if (e.ss.MapBlocks.getByXYReal((e.reverse_horizontal?e.right:e.x) + e.vx / 10, e.y + e.height + 1) == null) {
                    e.reverse_horizontal = !e.reverse_horizontal;
                    //e.x = e.ss.MapBlocks.getByXYReal(e.centerx, e.y + e.height + 1).x;
                    e.vx = e.reverse_horizontal ? 30 : -30;
                }
                this.checkCollisionWithPlayer(sm);
            }
            // プレイヤーとの当たり判定
            checkCollisionWithPlayer(sm: EntityStateMachine) {
                var e = sm.e;
                var players = <Array<Player>>sm.e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (p.flags["isAlive"] && e.x < p.right && e.right > p.x &&
                        e.y < p.bottom && e.bottom > p.y) { // プレイヤーと接触した
                        /*if (p.vy <= 0 ||
                            (!(e.x < p.right - p.vx / 10 && e.right > p.x - p.vx / 10) &&
                                e.y < p.bottom - p.vy / 10 && e.bottom > p.y - p.vy / 10)) { // プレイヤーにダメージ
                            p.dispatchEvent(new PlayerMissEvent("miss", 1));
                        }*/
                        if (p.vy <= 0) { // プレイヤーにダメージ
                            p.dispatchEvent(new PlayerMissEvent("miss", 1));
                        }
                        else { // 踏まれる
                            e.dispatchEvent(new SpriteCollisionEvent("onstamped", p));
                            p.y = e.y - p.height + 32 - 12;
                            p.dispatchEvent(new Event("onstamp"));
                        }
                    }
                }
            }
        }
        export class KameStamped extends AbstractState {
            enter(sm: EntityStateMachine) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 142;
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