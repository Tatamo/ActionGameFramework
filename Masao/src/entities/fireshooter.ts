/// <reference path="enemy.ts"/>
module Game {
    export class FireShooter extends AbstractEnemy {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.FireShooterWaiting());
            this.addEventHandler("onstamped", this.onStamped);
        }
        private onStamped(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) this.moving.replace(new States.FireShooterStamped());
            this.vx = 0;
            this.vy = 0;
        }
    }
    export module States {
        export class FireShooterWaiting extends AbstractStampableAlive {
            enter(sm: EntityStateMachine) {
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.vx = 0;
                e.vy = 0;
                e.code = 158;

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


                if (e.counter["ac"] > 0) { // カウンターが0より大きいときはカウントアップし続ける
                    e.counter["ac"] += 1;
                    if (e.counter["ac"] == 2) {
                        if (e.reverse_horizontal) {
                            // 右向きに発射
                            var attack = new FireShotRight(e.x, e.y, e.imagemanager, e.label);
                        }
                        else {
                            // 左向きに発射
                            var attack = new FireShotLeft(e.x, e.y, e.imagemanager, e.label);
                        }
                        e.ss.add(attack);
                    }
                    if (e.counter["ac"] > 40) e.counter["ac"] = 0;
                }
                else {
                    var flg = false;
                    for (var i = 0; i < players.length; i++) {
                        var p = players[i];
                        if (p.x >= e.x - 256 && p.x <= e.x + 192 && Math.abs(p.x - e.x) >= 96) { // x座標の差が一定の範囲内のプレイヤーを探す
                            flg = true;
                            break;
                        }
                    }
                    if (flg) {
                        e.counter["ac"] = 1;
                    }
                }
                this.checkCollisionWithPlayer(sm);
            }
        }
        export class FireShooterStamped extends AbstractState {
            enter(sm: EntityStateMachine) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 159;
                sm.e.flags["isAlive"] = false;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 159;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] >= 10) {
                    e.kill();
                }
            }
        }
    }
    export class FireShotLeft extends AbstractEntity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.FireShotMoving());

            this.vx = -120;
            this.vy = 0;
            this.x += this.vx / 10;
            this.y += this.vy / 10;
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        }
    }
    export class FireShotRight extends AbstractEntity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.FireShotMoving());

            this.vx = 120;
            this.vy = 0;
            this.x += this.vx / 10;
            this.y += this.vy / 10;
            this.x += this.vx / 10;
            this.y += this.vy / 10;
            this.reverse_horizontal = this.vx > 0;
        }
    }
    export module States {
        export class FireShotMoving extends AbstractState {
            enter(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = 0;
                e.code = 126;

            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                if (!e.flags["isAlive"]) {
                    e.kill();
                    return;
                }

                e.x += e.vx / 10;
                e.y += e.vy / 10;

                e.code = 126 + e.counter["ac"];
                e.counter["ac"] = (e.counter["ac"] + 1) % 2;

                var blocks = e.ss.getBlocks(e.x, e.y, e.width, e.height);

                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();

                    if (new Point(e.centerx - e.width / 4, e.centery - 1).collision(bc) || new Point(e.centerx + e.width / 4 - 1, e.centery - 1).collision(bc)) {
                        e.kill();
                        return;
                    }
                }
                this.checkOutOfScreen(sm);
                if (e.flags["isAlive"]) this.checkCollisionWithPlayer(sm);
            }
            checkOutOfScreen(sm: EntityStateMachine) {
                var e = sm.e;
                // スクロール範囲外に出ていたら消失
                var players = <Array<Player>>e.ss.Players.get_all();
                var flg = false;
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (e.y < p.view_y + SCREEN_HEIGHT + e.width) {
                        flg = true;
                        break;
                    }
                }
                if (!flg) {
                    e.kill();
                    return;
                }
            }
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            checkCollisionWithPlayer(sm: EntityStateMachine) {
                var e = sm.e;
                var players = <Array<Player>>e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    ((p: Player) => {
                        p.addOnceEventHandler("update",() => {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            var dy = Math.abs(e.y - p.y); // プレイヤーとのy座標の差
                            if (p.flags["isAlive"] && dx <= 23 && dy <= 28) { // プレイヤーと接触した
                                // TODO:バリア判定はここに書く
                                // プレイヤーにダメージ
                                p.dispatchEvent(new PlayerMissEvent("miss", 2));
                                //this.kill();
                            }
                        });
                    })(p);
                }
            }
        }
    }
}