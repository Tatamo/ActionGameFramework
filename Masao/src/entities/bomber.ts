/// <reference path="enemy.ts"/>
module Game {
    export class Bomber extends AbstractEnemy {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.FlierFlyingHorizontal());
            this.addEventHandler("onstamped", this.onStamped);
        }
        private onStamped(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) this.moving.replace(new States.BomberStamped());
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
    export class BomberWithoutReturn extends Bomber {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.BomberFlyingWithoutReturn());
        }
        protected move() {
            // 接触判定を行わない
            this.x += this.vx / 10;
            this.y += this.vy / 10;
        }
    }
    export module States {
        export class BomberFlyingWithoutReturn extends AbstractState {
            enter(sm: EntityStateMachine) {
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.code = 164;

                if (e.counter["ac"] >= 0) {
                    e.vx = -40;
                    e.counter["ac"] += 1;
                    if (e.counter["ac"] == 1) {
                        // 爆撃
                        var attack = new BombLeft(e.x, e.y + 19, e.imagemanager, e.label);
                        e.ss.add(attack);
                    }
                    else if (e.counter["ac"] > 26) {
                        e.counter["ac"] = 0;
                    }
                }

                var blocks = e.ss.getBlocks(e.x + e.vx / 10, e.y, e.width, e.height);

                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();

                    if (new Point(e.x + e.vx / 10, e.bottom - 1).collision(bc)) {
                        e.x = b.right;
                        e.vx = 0;
                        e.counter["ac"] = -1; // 停止
                    }
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
        export class BomberStamped extends AbstractState {
            enter(sm: EntityStateMachine) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 165;
                sm.e.flags["isAlive"] = false;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 165;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] >= 10) {
                    e.kill();
                }
            }
        }
    }
    export class BombLeft extends AbstractEntity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.BombMoving());

            this.vx = -40;
            this.vy = 0;
        }
    }
    export class BombRight extends AbstractEntity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.BombMoving());

            this.vx = 40;
            this.vy = 0;
            this.reverse_horizontal = true;
        }
    }
    export module States {
        export class BombMoving extends AbstractState {
            enter(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = 0;
                e.code = 171;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                if (!e.flags["isAlive"]) {
                    e.kill();
                    return;
                }

                if (e.vx > 0) {
                    e.vx -= 2;
                }
                else if (e.vx < 0) {
                    e.vx += 2;
                }
                e.vy += 8;
                if (e.vy > 200) {
                    e.vy = 200;
                }
                e.x += Math.floor(e.vx / 10);
                e.y += Math.floor(e.vy / 10);
                if (Math.abs(e.vx) > 28) {
                    e.code = 171;
                }
                else {
                    e.code = 170;
                    e.reverse_horizontal = false;
                }

                var blocks = e.ss.getBlocks(e.x, e.y, e.width, e.height);

                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();

                    if (new Point(e.centerx - 1, e.centery - 1).collision(bc)) {
                        e.y = Math.floor((e.centery - 1) / e.height) * e.height - Math.floor(e.height / 2);
                        sm.replace(new BombExploding());
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
        export class BombExploding extends BombMoving {
            enter(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = 0;
                e.code = 172;
                e.vx = 0;
                e.vy = 0;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] += 1;
                if (e.counter["ac"] <= 3) {
                    e.code = 172;
                }
                else if (e.counter["ac"] <= 6) {
                    e.code = 173;
                }
                else if (e.counter["ac"] <= 9) {
                    e.code = 174;
                }
                else {
                    e.kill();
                    return;
                }
                if (e.flags["isAlive"]) this.checkCollisionWithPlayer(sm);
            }
        }
    }
}