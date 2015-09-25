/// <reference path="enemy.ts"/>
module Game {
    export class WaterShooter extends AbstractEnemy {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.WaterShooterWaiting());
            this.addEventHandler("onstamped", this.onStamped);
            this.counter["x_first"] = this.x;
            this.counter["g_ac"] = 0;
        }
        protected move() {
            // 接触判定を行わない
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        }
        private onStamped(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) this.moving.replace(new States.WaterShooterStamped());
            this.vx = 0;
            this.vy = 0;
        }
    }
    export module States {
        export class WaterShooterWaiting extends AbstractStampableAlive {
            enter(sm: EntityStateMachine) {
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.vx = 0;
                e.vy = 0;
                e.code = 160;

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
                            var attack = new WaterShotRight(e.x, e.y, e.imagemanager, e.label);
                        }
                        else {
                            // 左向きに発射
                            var attack = new WaterShotLeft(e.x, e.y, e.imagemanager, e.label);
                        }
                        e.ss.add(attack);
                    }
                    if (e.counter["ac"] > 20) {
                        e.counter["ac"] = 0;
                        sm.replace(new WaterShooterWalking());
                    }
                }
                else {
                    var flg = false;
                    for (var i = 0; i < players.length; i++) {
                        var p = players[i];
                        if (p.x >= e.x - 240 && p.x <= e.x + 240) { // x座標の差が240以内のプレイヤーを探す
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
        export class WaterShooterWalking extends AbstractStampableAlive {
            enter(sm: EntityStateMachine) {
                sm.e.counter["ac"] = 0;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                if (e.counter["ac"] <= 0) {
                    e.counter["g_ac"] = (e.counter["g_ac"] + 1) % 4;
                    e.code = 161 + Math.floor(e.counter["g_ac"] / 2);
                    e.reverse_horizontal = true;

                    e.vx = 30;
                    if (e.x + e.vx / 10 >= e.counter["x_first"] + 96) {
                        e.x = e.counter["x_first"] + 96;
                        e.vx = 0;
                        e.counter["ac"] = 10;
                    }

                    // ブロックとの当たり判定
                    var blocks = e.ss.getBlocks(e.x + e.vx / 10, e.y, e.width, e.height + 1);
                    var flg = false;
                    for (var i = 0; i < blocks.length; i++) {
                        var b = blocks[i];
                        var bc = b.getCollision();
                        if (new Point(e.right - 1 + e.vx / 10, e.bottom).collision(bc)) {
                            flg = true;
                            break;
                        }
                    }
                    if (!flg) {
                        // 足元にブロックがないなら止まる
                        e.x = Math.floor((e.right - 1) / 32 - 1) * 32;
                        e.vx = 0;
                        e.counter["ac"] = 10;
                    }

                }
                else if (e.counter["ac"] <= 35) {
                    e.counter["ac"] += 1;
                    e.code = 160;

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
                        if (e.counter["ac"] == 15-1) {
                            // 水鉄砲
                            if (e.reverse_horizontal) {
                                // 右向きに発射
                                var attack = new WaterShotRight(e.x, e.y, e.imagemanager, e.label);
                            }
                            else {
                                // 左向きに発射
                                var attack = new WaterShotLeft(e.x, e.y, e.imagemanager, e.label);
                            }
                            e.ss.add(attack);
                        }
                    }
                }
                else {
                    e.counter["g_ac"] = (e.counter["g_ac"] + 1) % 4;
                    e.code = 161 + Math.floor(e.counter["g_ac"] / 2);
                    e.reverse_horizontal = false;

                    e.vx = -30;
                    if (e.x + e.vx / 10 <= e.counter["x_first"]) {
                        e.x = e.counter["x_first"];
                        e.vx = 0;
                        e.counter["ac"] = -20;
                        sm.replace(new WaterShooterWaiting());
                    }
                    // ブロックとの当たり判定
                    var blocks = e.ss.getBlocks(e.x + e.vx / 10, e.y, e.width, e.height + 1);
                    var flg = false;
                    for (var i = 0; i < blocks.length; i++) {
                        var b = blocks[i];
                        var bc = b.getCollision();
                        if (new Point(e.x + e.vx / 10, e.bottom).collision(bc)) {
                            flg = true;
                            break;
                        }
                    }
                    if (!flg) {
                        // 足元にブロックがないなら止まる
                        e.x = Math.floor((e.x) / 32 + 1) * 32;
                        e.vx = 0;
                        e.counter["ac"] = -20;
                        sm.replace(new WaterShooterWaiting());
                    }
                }


                this.checkCollisionWithPlayer(sm);
            }
        }
        export class WaterShooterStamped extends AbstractState {
            enter(sm: EntityStateMachine) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 163;
                sm.e.flags["isAlive"] = false;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 163;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] >= 10) {
                    e.kill();
                }
            }
        }
    }
    export class WaterShotLeft extends AbstractEntity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, target: ISprite = null) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.WaterShotMoving());

            this.z = 256; // 敵と同じだけど、どうせ敵より後に生成されるはず
            this.vx = -80;
            this.vy = -225;
            this.x += Math.floor(this.vx / 10);
            this.y += Math.floor(this.vy / 10) > 180 ? 180 : Math.floor(this.vy / 10);
            this.code = 128;
        }
    }
    export class WaterShotRight extends AbstractEntity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, target: ISprite = null) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.WaterShotMoving());

            this.z = 256; // 敵と同じだけど、どうせ敵より後に生成されるはず
            this.vx = 80;
            this.vy = -225;
            this.x += Math.floor(this.vx / 10);
            this.y += Math.floor(this.vy / 10) > 180 ? 180 : Math.floor(this.vy / 10);
            this.code = 128;
        }
    }
    export module States {
        export class WaterShotMoving extends AbstractState {
            enter(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = 0;
                e.code = 128;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                if (!e.flags["isAlive"]) {
                    e.kill();
                    return;
                }
                e.vy += 25;
                if (e.vy > 180) e.vy = 180;
                e.x += Math.floor(e.vx / 10);
                e.y += Math.floor(e.vy / 10);
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                e.code = 128 + Math.floor(e.counter["ac"] / 2);
                e.reverse_horizontal = e.vx > 0;

                var blocks = e.ss.getBlocks(e.x, e.y, e.width, e.height);
                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();

                    // ブロックと衝突したら消失
                    if (new Point(e.centerx-1, e.centery-1).collision(bc) || new Point(e.centerx-1, e.centery-1).collision(bc)) { // 中心の点で判定
                        e.flags["isAlive"] = false;
                        e.kill();
                        return;
                    }
                }
                this.checkOutOfScreen(sm);
                this.checkCollisionWithPlayer(sm);
            }
            checkOutOfScreen(sm: EntityStateMachine) {
                var e = sm.e;
                // スクロール範囲外に出ていたら消失
                var players = <Array<Player>>e.ss.Players.get_all();
                var flg = false;
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (e.x >= p.view_x - e.width && e.x <= p.view_x + SCREEN_WIDTH + e.width * 4 &&
                        e.y >= p.view_y - e.width - SCREEN_HEIGHT / 2 && e.y <= p.view_y + SCREEN_HEIGHT) {
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