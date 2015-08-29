module Game {
    export class Kame extends Entity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.KameWalking());
            this.code = 140;
            this.counter["ac"] = 0;
            this.flags["isAlive"] = true;
            this.flags["isOnGround"] = false;
            this.addEventHandler("onstamped", this.onStamped);
            this.addEventHandler("onhit", this.onHit);
        }
        update() {
            this.moving.update();
            this.move();
        }
        private move() {
            this.x += this.vx / 10;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            this.y += this.vy / 10;
            this.checkCollisionWithBlocksVertical(); // 接触判定
        }
        private onStamped(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) this.moving.replace(new States.KameStamped());
            this.vx = 0;
            this.vy = 0;
        }
        private onHit(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) {
                if (e.dir == "horizontal") {
                    this.reverse_horizontal = !this.reverse_horizontal;
                }
                if (e.dir == "vertical") {
                    this.flags["isOnGround"] = true;
                }
            }
        }
    }
    export class KameFallable extends Kame {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.moving.replace(new States.KameWalkingFallable());
        }
    }
    export module States {
        export class AbstractKameAlive extends AbstractState {
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            checkCollisionWithPlayer(sm: EntityStateMachine) {
                var e = sm.e;
                var players = <Array<Player>>sm.e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    ((p: Player) => {
                        p.addOnceEventHandler("update",() => {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            var dy = Math.abs(e.y - p.y); // プレイヤーとのy座標の差
                            if (p.flags["isAlive"] && dx < 30 && dy < 23) { // プレイヤーと接触した

                                if (dx < 27 && p.vy > 0 || (p.flags["isStamping"] && p.counter["stamp_waiting"] == 5)) { // 踏まれる
                                    e.dispatchEvent(new SpriteCollisionEvent("onstamped", p));
                                    p.y = e.y - 12;
                                    p.dispatchEvent(new Event("onstamp"));
                                    e.addOnceEventHandler("killed",() => {
                                        p.dispatchEvent(new ScoreEvent("addscore", 10));
                                    });
                                }
                                // TODO:バリア判定はここに書く
                                else { // プレイヤーにダメージ
                                    p.dispatchEvent(new PlayerMissEvent("miss", 1));
                                }
                            }
                        });
                    })(p);
                }
            }
        }
        export class KameWalking extends AbstractKameAlive {
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
        export class KameWalkingFallable extends AbstractKameAlive {
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
        export class KameFalling extends AbstractKameAlive {
            enter(sm: EntityStateMachine) {
                sm.e.flags["isOnGround"] = false;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                if (e.flags["isOnGround"] == true) {
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