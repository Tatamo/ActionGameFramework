/// <reference path="entity.ts"/>
module Game {
    export class Enemy extends Entity {
        public moving: EntityStateMachine;
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.z = 256;
            this.counter["ac"] = 0;
            this.flags["isAlive"] = true;
            this.flags["isActivated"] = false;
            this.flags["isOnGround"] = false;
            this.counter["viewx_activate"] = Math.floor(x / this.width) * this.width - SCREEN_WIDTH - this.width;
            this.addEventHandler("onground", this.onGround);
        }
        private onGround(e: Event) {
            this.flags["isOnGround"] = true;
        }
        update() {
            var players = <Array<Player>>this.ss.Players.get_all();
            if (!this.flags["isActivated"]) {
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (Math.round(p.x - 160) >= this.counter["viewx_activate"]) { // 待機状態から脱する
                        this.flags["isActivated"] = true;
                        break;
                    }
                }
                return;
            }

            // プレイヤーより大幅に左側にいる場合、処理を行わない
            var flg = false;
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                if (this.x >= Math.round(p.x - 160) - SCREEN_WIDTH) {
                    flg = true;
                    break;
                }
            }
            if (!flg) return;
            this.moving.update();
            this.move();
        }
        protected move() {
            this.x += this.vx / 10;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            this.y += this.vy / 10;
            this.checkCollisionWithBlocksVertical(); // 接触判定
        }
        checkCollisionWithBlocksVertical() {
            this.flags["isOnGround"] = false;
            // check
            var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height + 1); // 足元+1ピクセルも含めて取得

            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                var bc = b.getCollision();
                var col = this.getRect();

                if (this.vy < 0) {
                    // up
                    if (col.collision(bc) && !(new Rect(this.x, this.bottom, this.width, 0).collision(bc))) { // 一番下のラインとの判定のみ除外
                        this.y = b.bottom;
                        this.vy = 0;
                    }
                }
                else if (this.vy >= 0) {
                    // down || //
                    if (col.collision(bc) && !(new Rect(this.x, this.y, this.width, 0).collision(bc))) { // 一番上のラインとの判定のみ除外
                        this.dispatchEvent(new Event("onground"));
                        this.bottom = b.y;
                        this.vy = 0;
                    }
                }
            }
        }
        checkCollisionWithBlocksHorizontal() {
            // check
            var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height);

            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                var bc = b.getCollision();
                var col = this.getRect();

                if (this.vx > 0) {
                    // right
                    if (col.collision(bc)) {
                        this.right = b.x;
                        this.vx = 0;
                        this.reverse_horizontal = !this.reverse_horizontal;
                    }
                }
                else if (this.vx < 0) {
                    // left
                    if (col.collision(bc)) {
                        this.x = b.right;
                        this.vx = 0;
                        this.reverse_horizontal = !this.reverse_horizontal;
                    }
                }
            }
        }
    }
    export module States {
        export class AbstractStampableAlive extends AbstractState {
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
    }
}