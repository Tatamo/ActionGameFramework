/// <reference path="enemy.ts"/>
module Game {
    export class FlierUpDown extends AbstractEnemy {
        public y_upper;
        public y_lower;
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.FlierFlyingVertical());
            this.addEventHandler("onstamped", this.onStamped);
            this.counter["y_lower"] = this.y - 52;
            this.counter["y_upper"] = this.y - 12;
            this.vy = -40;
        }
        protected move() {
            // 接触判定は行わない
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        }
        private onStamped(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) this.moving.replace(new States.FlierStamped());
            this.vx = 0;
            this.vy = 0;
        }
    }
    export module States {
        export class FlierFlyingVertical extends AbstractState {
            enter(sm: EntityStateMachine) {
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2) e.code = 147;
                else e.code = 148;

                if (e.y <= e.counter["y_lower"]) {
                    e.vy += 10;
                    if (e.vy > 40) e.vy = 40;
                }
                else if (e.y >= e.counter["y_upper"]) {
                    e.vy -= 10;
                    if (e.vy < -40) e.vy = -40;
                }

                var players = <Array<Player>>sm.e.ss.Players.get_all();

                var pt: Player = null; // 最も近いプレイヤー
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (pt == null) {
                        pt = p;
                    }
                    else if (Math.abs(p.x - e.x) < Math.abs(pt.x - e.x)) { // よりx座標が近いなら
                        pt = p;
                    }
                }
                if (pt != null) {
                    if (e.x + 8 >= pt.x) e.reverse_horizontal = false; // 最も近いプレイヤーに合わせて反転状態を決定
                    else e.reverse_horizontal = true;
                }

                this.checkCollisionWithPlayer(sm);
            }
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
                                    p.dispatchEvent(new NumberEvent("onstamp",2));
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
        export class FlierStamped extends AbstractState {
            enter(sm: EntityStateMachine) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 149;
                sm.e.flags["isAlive"] = false;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 149;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] >= 10) {
                    e.kill();
                }
            }
        }
    }
}