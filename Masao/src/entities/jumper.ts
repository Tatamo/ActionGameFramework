/// <reference path="enemy.ts"/>
module Game {
    export class Jumper extends AbstractEnemy {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.JumperWaiting());
            //this.code = 154;
            this.addEventHandler("onstamped", this.onStamped);
            this.counter["ac"] = 0;
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
        checkCollisionWithBlocksVertical() {
            if (this.flags["isOnGround"]) {
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
            else {
                // ジャンプ中の判定
                var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height);

                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();

                    // 上方向
                    var col = new Point(this.centerx, this.y + 6);
                    if (col.collision(bc)) {
                        this.y = b.bottom - 6;
                        this.vy = 0;
                    }

                    // 下方向
                    var col = new Point(this.centerx, this.bottom);
                    if (col.collision(bc)) {
                        this.dispatchEvent(new Event("onground"));
                        this.bottom = b.y;
                        this.vy = 0;
                    }
                }
            }
        }
        checkCollisionWithBlocksHorizontal() {
            if (this.flags["isOnGround"]) {
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
            else {
                // ジャンプ中の判定
                var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height);

                for (var i = 0; i < blocks.length; i++) {
                    var b = blocks[i];
                    var bc = b.getCollision();

                    if (this.vx > 0) {
                        // right
                        if (new Point(this.right + this.vx / 10, this.bottom).collision(bc) || new Point(this.right + this.vx / 10, this.y + 8).collision(bc)) {
                            this.right = b.x;
                            this.vx = 0;
                            this.reverse_horizontal = !this.reverse_horizontal;
                        }
                    }
                    else if (this.vx < 0) {
                        // left
                        if (new Point(this.x + this.vx / 10, this.bottom).collision(bc) || new Point(this.x + this.vx / 10, this.y + 8).collision(bc)) {
                            this.x = b.right;
                            this.vx = 0;
                            this.reverse_horizontal = !this.reverse_horizontal;
                        }
                    }
                }
            }
        }
    }

    export module States {
        export class JumperWaiting extends AbstractStampableAlive {
            enter(sm: EntityStateMachine) {
                sm.e.flags["isOnGround"] = true;
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

                if (e.flags["isOnGround"]) {
                    e.counter["ac"] = 15-1;
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