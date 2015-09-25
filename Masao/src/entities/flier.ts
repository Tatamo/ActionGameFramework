/// <reference path="enemy.ts"/>
module Game {
    export class Flier extends AbstractEnemy {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.FlierFlyingHorizontal());
            this.addEventHandler("onstamped", this.onStamped);
        }
        private onStamped(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) this.moving.replace(new States.FlierStamped());
            this.vx = 0;
            this.vy = 0;
        }
        protected move() {
            this.x += this.vx / 10;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            this.y += this.vy / 10;
        }
        checkCollisionWithBlocksHorizontal() {
            // check
            if (this.vx > 0) {
                // right
                var blocks = this.ss.getBlocks(this.x + this.width, this.y, this.width, this.height); // 右寄りに取得

                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();

                    if (new Point(this.centerx + this.width - 1, this.bottom - 1).collision(bc)) {
                        this.right = b.x - 16;
                        this.vx = 0;
                        this.reverse_horizontal = !this.reverse_horizontal;
                    }
                }
            }
            else if (this.vx < 0) {
                // left
                var blocks = this.ss.getBlocks(this.x - this.width, this.y, this.width, this.height); // 左寄りに取得

                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();

                    if (new Point(this.centerx - this.width, this.bottom - 1).collision(bc)) {
                        this.x = b.right + 16;
                        this.vx = 0;
                        this.reverse_horizontal = !this.reverse_horizontal;
                    }
                }
            }
        }
    }
    export class FlierUpDown extends Flier {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.FlierFlyingVertical());
            this.counter["y_lower"] = this.y - 52;
            this.counter["y_upper"] = this.y - 12;
        }
        protected move() {
            // 接触判定は行わない
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        }
    }
    export class ThreeFlierGenerator extends AbstractEntity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.Generate3FlierState());
        }
    }
    export module States {
        export class FlierFlyingHorizontal extends AbstractState {
            enter(sm: EntityStateMachine) {
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2) e.code = 147;
                else e.code = 148;

                e.vx = e.reverse_horizontal ? 30 : -30;

                var players = <Array<Player>>sm.e.ss.Players.get_all();

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
                                    p.dispatchEvent(new NumberEvent("onstamp", 2));
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
        export class FlierFlyingVertical extends FlierFlyingHorizontal {
            enter(sm: EntityStateMachine) {
                var e = sm.e;
                e.vx = 0;
                e.vy = -40;
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
                if (e.counter["ac"] > 14) {
                    e.kill();
                }
            }
        }
        export class Generate3FlierState extends AbstractState {
            enter(sm: EntityStateMachine) {
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                for (var i = 0; i < 3; i++) {
                    var dx = 0;
                    var dy = 0;
                    if (i == 1) {
                        dx = 80;
                        dy = -40;
                    }
                    else if (i == 2) {
                        dx = 140;
                        dy = 38;
                    }
                    var entity = new Flier(e.x + dx, e.y + dy, e.imagemanager, e.label);
                    entity.counter["viewx_activate"] -= 32 * (i + 1);
                    e.ss.add(entity);
                    entity.update();
                }
                e.kill();
            }
        }
    }
}