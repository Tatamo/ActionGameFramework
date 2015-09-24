/// <reference path="entity.ts"/>
module Game {
    export class Player extends AbstractEntity {
        public gk: GameKey; // TODO:疎結合に
        public sjump_effects: Array<PlayerSuperJumpEffect>;
        public moving: PlayerStateMachine;
        public special: PlayerStateMachine;
        public view_x: number; // Stageのほうで勝手に数値を代入してくれることを期待している
        public view_y: number;
        constructor(input: GameKey, x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.code = 100;
            this.gk = input;
            this.moving = new PlayerStateMachine(this);
            this.moving.setGlobalState(new States.PlayerGlobalMove());
            this.moving.push(new States.PlayerInterialMove());
            this.special = new PlayerStateMachine(this);
            this.special.push(new States.PlayerWithoutSpecialMove());
            this.counter["able2runningLeft"] = 0;
            this.counter["able2runningRight"] = 0;
            this.counter["running"] = 0;
            this.counter["jump_level"] = 0;
            this.counter["stamp_waiting"] = 0;
            this.counter["stamp_level"] = 0;
            this.counter["dying"] = 0;
            this.counter["superjump_effect"] = -1;
            this.flags["isAlive"] = true; // まだミスをしていない状態
            this.flags["isRunning"] = false; // 走っている状態
            this.flags["isWalking"] = false; // 歩いている状態
            this.flags["isJumping"] = true; // ジャンプによって空中にいる状態
            this.flags["isStamping"] = false; // 敵を踏んだ状態
            this.flags["isOnGround"] = false; // 地面の上にいる状態
            this.sjump_effects = [];
            this.reverse_horizontal = true;
            this.z = 128;
            this.addEventHandler("onground", this.onGround);
            this.addEventHandler("onstamp", this.onStamp);
            this.addEventHandler("miss", this.onMiss);
            this.view_x = 0;
            this.view_y = 0;
        }
        public get alive(): boolean {
            return this.flags["isAlive"];
        }
        private onGround(e: Event) {
            this.flags["isOnGround"] = true;
            this.flags["isJumping"] = false;
            this.flags["isStamping"] = false;
            this.counter["jump_level"] = 0;
            this.counter["stamp_level"] = 0;
            if (this.counter["superjump_effect"] >= 0) this.counter["superjump_effect"] = 100;
        }
        private onStamp(e: NumberEvent) {
            var n = e.value;
            if (n <= 0) n = 1;
            this.counter["stamp_level"] = n;
            this.moving.push(new States.PlayerStamping());
        }
        private onMiss(e: PlayerMissEvent) {
            this.dispatchEvent(new Event("onground")); // ほぼスーパージャンプのエフェクトを消すためだけ
            if (e.mode == 1) {
                this.moving.replace(new States.PlayerDyingDirect());
            }
            else if (e.mode == 2) {
                this.moving.replace(new States.PlayerDyingInDirect());
            }
        }
        update() {
            if (this.flags["isAlive"]) {
                // 入力の更新
                this.checkInput();
                //this.externalForce();

                // 外力を受けない移動
                this.moving.update();
                this.special.update();
                // 移動の確定
                if (this.counter["stamp_waiting"] <= 0) this.move();
                else this.counter["stamp_waiting"] -= 1;

                this.fixPatternCode();
                //this.x = Math.floor(this.x);
                //this.y = Math.floor(this.y);
            }
            else {
                this.moving.update();
                this.x += Math.floor(this.vx / 10);
                this.y += this.vy > -320 ? Math.floor(this.vy / 10) : -32;
            }
            /* やめた
            // 画面外処理
            if (this.x < this.view_x - this.width / 2 + 1) {
                this.x = this.view_x - this.width / 2 + 1;
                if (this.vx < 0) this.vx = 0;
            }
            else if (this.x > this.view_x + SCREEN_WIDTH + this.width / 2) {
                this.x = this.view_x + SCREEN_WIDTH + this.width / 2;
                if (this.vx > 0) this.vx = 0;
            }*/
            if (this.flags["isAlive"] && this.y > this.view_y + SCREEN_HEIGHT) {
                this.dispatchEvent(new PlayerMissEvent("miss", 2));
            }
        }
        // 速度に応じて自機の座標を移動させる
        private move() {
            var muki_x = 0;
            if (this.vx > 0) muki_x = 1;
            else if (this.vx < 0) muki_x = -1;
            this.x += Math.floor(this.vx / 10);
            this.checkCollisionWithBlocksHorizontal(); // 接触判定

            var tmp_y = this.y;
            this.y += this.vy > -320 ? Math.floor(this.vy / 10) : -32;
            this.checkCollisionWithBlocksVertical(); // 接触判定

            // 補正
            // TODO: タイル幅32が前提であるのを解消
            if (this.vy < 0) {
                if (Math.floor(tmp_y / 32) > Math.floor(this.y / 32)) {
                    if (this.gk.isDown(37)) {
                        var b1 = this.getHitBlock(this.x + this.width / 2 - 1 - 1, tmp_y);
                        var b2 = this.getHitBlock(this.x + this.width / 2 - 1 - 1, this.y);
                        if (b1 == null && b2 != null) {
                            this.y = b2.y + b2.height;
                            this.vy = 0;
                        }
                    }
                    if (this.gk.isDown(39)) {
                        var b1 = this.getHitBlock(this.x + this.width / 2 - 1 + 1, tmp_y);
                        var b2 = this.getHitBlock(this.x + this.width / 2 - 1 + 1, this.y);
                        if (b1 == null && b2 != null) {
                            this.y = b2.y + b2.height;
                            this.vy = 0;
                        }
                    }
                }
            }
            else if (this.vy > 0) {
                if (Math.floor((tmp_y + this.height - 1) / 32) < Math.floor((this.y + this.height - 1) / 32)) {
                    if (this.gk.isDown(37)) {
                        var b1 = this.getHitBlock(this.x + this.width / 2 - 1 - 1, tmp_y + this.height - 1);
                        var b2 = this.getHitBlock(this.x + this.width / 2 - 1 - 1, this.y + this.height - 1);
                        if (b1 == null && b2 != null) {
                            this.y = b2.y - b2.height;
                            this.vy = 0;
                            //this.code = 103;
                            this.x -= 1;
                            this.checkCollisionWithBlocksVertical();
                        }
                    }
                    if (this.gk.isDown(39)) {
                        var b1 = this.getHitBlock(this.x + this.width / 2 - 1 + 1, tmp_y + this.height - 1);
                        var b2 = this.getHitBlock(this.x + this.width / 2 - 1 + 1, this.y + this.height - 1);
                        if (b1 == null && b2 != null) {
                            this.y = b2.y - b2.height;
                            this.vy = 0;
                            //this.code = 103;
                            this.x += 1;
                            this.checkCollisionWithBlocksVertical();
                        }
                    }
                }
            }
            /*if (this.vy > 0) { // 下降中
                if (tmp_bottom < this.bottom) {
                    if (this.getHitBlock(this.centerx + muki_x, tmp_bottom + 1) == null) { // 移動前 自機の足元にブロックが無い
                        if (this.getHitBlock(this.centerx + muki_x, this.bottom + 1) != null) { // 移動後 自機の足元にブロックがある
                            if (this.gk.isDown(37) || this.gk.isDown(39)) {
                                //if (this.flags["isWalking"] || this.flags["isRunning"]) {
                                this.x += muki_x; // トンネルに入れるようにする
                                this.checkCollisionWithBlocksVertical();
                                this.vy = 0;
                                //_ptc = 103;
                                this.counter["running"] = 1;
                            }
                        }
                    }
                }
            }
            else if (this.vy < 0) { // 上昇中
                if (tmp_top > this.top) {
                    if (this.getHitBlock(this.centerx + muki_x, tmp_top) == null) { // 移動前 自機の頭にブロックが無い
                        if (this.getHitBlock(this.centerx + muki_x, this.top) != null) { // 移動後 自機の頭にブロックがある
                            if (this.gk.isDown(37) || this.gk.isDown(39)) {
                                //if (this.flags["isWalking"] || this.flags["isRunning"]) {
                                this.x += muki_x; // トンネルに入れるようにする
                                this.checkCollisionWithBlocksVertical();
                                this.vy = 0;
                                //_ptc = 103;
                                this.counter["running"] = 1;
                            }
                        }
                    }
                }
            }*/
        }
        private fixPatternCode() {
            if (this.flags["isStamping"]) {
                this.code = 109;
            }
            else {
                if (this.flags["isOnGround"]) { // 地上にいる
                }
                else {
                    if (this.flags["isJumping"]) { // ジャンプ中のパターン画像
                        if (this.vy <= 25) this.code = 101;
                        else this.code = 102;
                    }
                    else {
                        if (this.vx == 0 && !this.flags["isRunning"] && !this.flags["isWalking"]) { // 立ち止まった状態で落下
                            this.code = 100;
                        }
                        else if (Math.abs(this.vx) > 60) {
                            this.code = 105;
                        }
                        else {
                            this.code = 103;
                        }
                    }
                }
            }
        }
        checkCollisionWithBlocksVertical() {
            this.flags["isOnGround"] = false;
            // check
            if (this.vy < 0) {
                var b = this.getHitBlock(this.x + this.width / 2 - 1, this.y);
                if (b != null) {
                    this.y = b.y + b.height;
                    this.vy = 0;
                    // TODO: ここに叩けるブロックに頭をぶつけたときの処理を書く
                }
            }
            else if (this.vy > 0) {
                var b = this.getHitBlock(this.x + this.width / 2 - 1, this.y + this.height);
                if (b != null) {
                    this.y = b.y - this.width;
                    this.vy = 0;
                }
                if (this.getHitBlock(this.x + this.width / 2 - 1, this.y + this.height + 1) != null) {
                    this.dispatchEvent(new Event("onground"));
                }
            }
            else {
                if (this.getHitBlock(this.x + this.width / 2 - 1, this.y + this.height + 1) != null) {
                    this.dispatchEvent(new Event("onground"));
                }
            }

            /*var blocks = this.getBlocks(this.x, this.y, this.width, this.height + 1); // 足元+1ピクセルも含めて取得
            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                //if (this.x <= b.x + b.width && this.x + this.width >= b.x &&
                //    this.y <= b.y + b.height && this.y + this.height >= b.y) {
                //    b.dispatchEvent(new SpriteCollisionEvent("onhit", this, "vertical", "center"));
                //}

                //var bc = b.getRect(); // TODO: getCollisionに書き換えても問題なく動作するように
                //var col = new Rect(this.centerx, this.y, 0, this.height);

                if (this.vy < 0) {
                    // up
                    if (b.x <= this.centerx && b.right > this.centerx && // spriteのx中心点との判定
                        b.y < this.bottom && b.bottom >= this.y) {
                        //if (((col.collision(bc, true)) || col.collision(new Rect(bc.left, bc.top, 0, bc.height)) || col.collision(new Rect(bc.left, bc.bottom, bc.width, 0))) &&
                        //    !(col.collision(new Point(bc.left, bc.top))) && !(col.collision(new Point(bc.right, bc.bottom)))) { // ブロックの右の辺と上の辺を除いた部分と判定を行う
                        this.y = b.bottom;
                        this.vy = 0;
                    }
                }
                else if (this.vy >= 0) {
                    // down || //
                    //if (((col.collision(bc, true)) || col.collision(new Rect(bc.left, bc.top, 0, bc.height)) || col.collision(new Rect(bc.left, bc.top, bc.width, 0))) &&
                    //    !(col.collision(new Point(bc.right, bc.top))) && !(col.collision(new Point(bc.left, bc.bottom)))) { // ブロックの右の辺と下の辺を除いた部分と判定を行う
                    if (b.x <= this.centerx && b.right > this.centerx && // spriteのx中心点との判定
                        b.y <= this.bottom && b.bottom > this.y) {
                        this.dispatchEvent(new Event("onground"));
                        this.bottom = b.y;
                        this.vy = 0;
                    }
                }
            }*/
        }
        checkCollisionWithBlocksHorizontal() {
            // check
            var b1 = this.getHitBlock(this.x + this.width / 2 - 1, this.y); // (x+15,y)
            var b2 = this.getHitBlock(this.x + this.width / 2 - 1, this.y + this.height - 1); // (x+15,y+31)
            if (b1 != null || b2 != null) {
                if (b1 == null) b1 = b2;
                if (this.vx > 0) {
                    this.x = b1.x - this.width / 2;
                    this.vx = 0;
                }
                else if (this.vx < 0) {
                    this.x = b1.x + this.width / 2 + 1;
                    this.vx = 0;
                }
            }

            /*var blocks = this.getBlocks(this.x, this.y, this.width, this.height);
            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                //if (this.x <= b.x + b.width && this.x + this.width >= b.x &&
                //    this.y <= b.y + b.height && this.y + this.height >= b.y) {
                //    b.dispatchEvent(new SpriteCollisionEvent("onhit", this, "horizontal", "center"));
                //}
                //var bc = b.getCollision();
                //var col = new Rect(this.centerx, this.y, 0, this.height);
                
                if (this.vx > 0) {
                    // right
                    if (b.x <= this.centerx && b.right > this.centerx && // spriteのx中心点との判定
                        b.y <= this.bottom && b.bottom > this.y) {
                        // rect:{(x,y)∈R^2:x∈[bc.left,bc.right),y∈[bc.top,bc.bottom]}の判定
                        this.centerx = b.x - 1;
                        this.vx = 0;
                    }
                }
                else if (this.vx < 0) {
                    // left
                    if (b.x <= this.centerx && b.right > this.centerx && // spriteのx中心点との判定
                        b.y <= this.bottom && b.bottom > this.y) {
                        //if (((col.collision(bc, true)) || col.collision(new Rect(bc.left, bc.top, 0, bc.height)) || col.collision(new Rect(bc.left, bc.top, bc.width, 0))) &&
                        //    !(col.collision(new Point(bc.right, bc.top))) && !(col.collision(new Point(bc.left, bc.bottom)))) { // ブロックの右の辺と下の辺を除いた部分と判定を行う
                        this.centerx = b.right;
                        this.vx = 0;
                    }
                }
            }*/
        }
        // 指定した座標地点(ピクセル座標)にブロックがある場合、そのブロックを返す。また画面外に出るのを阻止するための処理も挟む
        // そうでない場合、nullを返す。
        getHitBlock(x: number, y: number): ISprite {
            var b: ISprite = this.ss.getBlock(x, y);
            if (b) return b;
            if (Math.floor(x / 32) == -1) return new AbstractBlock(-32, Math.floor(y / 32) * 32, this.imagemanager, this.label);
            if (Math.floor(x / 32) == 180) return new AbstractBlock(32 * 180, Math.floor(y / 32) * 32, this.imagemanager, this.label);
            if (Math.floor(y / 32) == -10) return new AbstractBlock(Math.floor(x / 32) * 32, 32 * -10, this.imagemanager, this.label);
            return null;
        }
        // SpriteSystem.getBlocks()をラップし、間に画面外に出るのを阻止するための処理を挟む
        getBlocks(x: number, y: number, w: number, h: number): Array<ISprite> {
            var result = this.ss.getBlocks(x, y, w, h);
            var additions = new Array<ISprite>();
            if (x <= 0) { // TODO: マップサイズのハードコーディング解消
                additions.push(new AbstractBlock(-32, this.y - this.y % 32, this.imagemanager, this.label));
                additions.push(new AbstractBlock(-32, this.y - this.y % 32 - 32, this.imagemanager, this.label));
                additions.push(new AbstractBlock(-32, this.y - this.y % 32 + 32, this.imagemanager, this.label));
            }
            if (x + w >= 32 * 180) {
                additions.push(new AbstractBlock(32 * 180, this.y - this.y % 32, this.imagemanager, this.label));
                additions.push(new AbstractBlock(32 * 180, this.y - this.y % 32 - 32, this.imagemanager, this.label));
                additions.push(new AbstractBlock(32 * 180, this.y - this.y % 32 + 32, this.imagemanager, this.label));
            }
            if (y <= -320) {
                additions.push(new AbstractBlock(this.x - this.x % 32, -320 - 32, this.imagemanager, this.label));
                additions.push(new AbstractBlock(this.x - this.x % 32 - 32, -320 - 32, this.imagemanager, this.label));
                additions.push(new AbstractBlock(this.x - this.x % 32 + 32, -320 - 32, this.imagemanager, this.label));
            }
            result = result.concat(additions);
            return result;

        }
        checkInput() {
            //if (this.gk.isDown(37) && this.gk.isDown(39)) { } // 左右同時に押されていたらとりあえず何もしないことに
            if (this.gk.isDown(37)) {
                if (this.gk.isOnDown(37) && this.counter["able2runningLeft"] > 0) {
                    this.moving.replace(new States.PlayerRunningLeft());
                    //this.flags["isRunning"] = true;
                }
                else if (!(this.moving.current_state instanceof States.PlayerRunningLeft)) {
                    this.moving.replace(new States.PlayerWalkingLeft());
                }
            }
            else if (this.gk.isDown(39)) {
                if (this.gk.isOnDown(39) && this.counter["able2runningRight"] > 0) {
                    this.moving.replace(new States.PlayerRunningRight());
                }
                else if (!(this.moving.current_state instanceof States.PlayerRunningRight)) {
                    this.moving.replace(new States.PlayerWalkingRight());
                }
            }
            if ((!this.gk.isDown(37) && !this.gk.isDown(39)) ||
                ((this.moving.current_state instanceof States.PlayerWalkingLeft) && !this.gk.isDown(37)) ||
                ((this.moving.current_state instanceof States.PlayerWalkingRight) && !this.gk.isDown(39)) ||
                ((this.moving.current_state instanceof States.PlayerRunningLeft) && !this.gk.isDown(37)) ||
                ((this.moving.current_state instanceof States.PlayerRunningRight) && !this.gk.isDown(39))) {
                this.moving.replace(new States.PlayerInterialMove());
            }

            if (this.counter["able2runningLeft"] >= 8) this.counter["able2runningLeft"] = 0;
            else if (this.counter["able2runningLeft"] > 0) this.counter["able2runningLeft"] += 1;

            if (this.counter["able2runningRight"] >= 8) this.counter["able2runningRight"] = 0;
            else if (this.counter["able2runningRight"] > 0) this.counter["able2runningRight"] += 1;

            if (this.flags["isOnGround"]) { // 地上にいる
                if (this.gk.isDown(90) && this.gk.getCount(90) <= 5) { // ジャンプ判定
                    this.moving.push(new States.PlayerJumping());
                }
            }

            if (this.gk.isOnDown(37)) { // ステート遷移判定より後で処理
                this.counter["able2runningLeft"] = 1;
            }
            if (this.gk.isOnDown(39)) {
                this.counter["able2runningRight"] = 1;
            }
        }
    }
    export class PlayerStateMachine extends EntityStateMachine {
        public e: Player;
        constructor(e: Player, parent: any = null) {
            super(e, parent);
        }
    }
    export class PlayerMissEvent extends Event {
        constructor(public type: string, public mode: number) {
            // mode 1:直接 2:間接
            super(type);
        }
    }
    export module States {
        /*export interface IPlayerMovingState extends State { // 不要説 てか不要
            enter(sm: PlayerStateMachine);
            update(sm: PlayerStateMachine);
            exit(sm: PlayerStateMachine);
        }*/
        // 処理中にジャンプなどに一瞬だけ状態が遷移することで、脈絡なくenterが再度呼ばれる可能性があることに注意
        export class PlayerGlobalMove extends AbstractState {
            update(sm: PlayerStateMachine) {
                var pl = sm.e;
                if (pl.flags["isAlive"]) {
                    if (pl.flags["isOnGround"]) { // 地上にいる
                    }
                    else { // 地上にいない
                        if (pl.counter["stamp_waiting"] > 0) { // 硬直中
                        }
                        else {
                            pl.vy += 25; // 重力を受ける
                            if (pl.vy > 160) pl.vy = 160;
                        }
                    }
                }
                if (pl.counter["superjump_effect"] >= 0) {
                    var del = (s: PlayerSuperJumpEffect) => { if (s) s.kill(); };
                    var effect = new PlayerSuperJumpEffect(pl.x, pl.y, pl.imagemanager, pl.label, pl.code, pl.reverse_horizontal);
                    pl.ss.add(effect);
                    pl.sjump_effects.push(effect);
                    del(pl.sjump_effects.shift());
                    if (pl.counter["superjump_effect"] < 9) {
                        pl.counter["superjump_effect"] += 1;
                        if (pl.vy > 0) pl.counter["superjump_effect"] = 9;
                    }
                    else {
                        if (pl.counter["superjump_effect"] >= 100) {
                            pl.counter["superjump_effect"] = -1;
                            while (pl.sjump_effects.length > 0) {
                                del(pl.sjump_effects.shift());
                            }
                        }
                        else if (pl.counter["superjump_effect"] >= 9) {
                            del(pl.sjump_effects.shift());
                            if (pl.sjump_effects.length == 0) {
                                pl.counter["superjump_effect"] = 100;
                            }
                        }
                    }
                }
            }
        }
        export class PlayerWalkingLeft extends AbstractState {
            enter(sm: PlayerStateMachine) {
                //console.log("walk left ");
                sm.e.flags["isRunning"] = false;
                sm.e.flags["isWalking"] = true;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.e;
                if (pl.counter["stamp_waiting"] > 0) { // 硬直中
                    pl.vx = (pl.vx - 10 > -60) ? pl.vx - 10 : -60;
                }
                else {
                    if (pl.flags["isOnGround"]) { // 地上にいる
                        pl.reverse_horizontal = false;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        pl.vx = (pl.vx - 15 > -60) ? pl.vx - 15 : -60;
                        if (pl.vx > 0) pl.code = 108;
                        else pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                    }
                    else { // 地上にいない
                        if (pl.vx > -60) pl.vx -= 10;
                    }
                }
            }
        }
        export class PlayerRunningLeft extends AbstractState {
            enter(sm: PlayerStateMachine) {
                //console.log("run left ");
                sm.e.flags["isRunning"] = true;
                sm.e.flags["isWalking"] = false;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.e;
                if (pl.counter["stamp_waiting"] > 0) { // 硬直中
                    pl.vx = (pl.vx - 10 > -60) ? pl.vx - 10 : -60;
                }
                else {
                    if (pl.flags["isOnGround"]) { // 地上にいる
                        pl.reverse_horizontal = false;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        pl.vx = (pl.vx - 15 > -120) ? pl.vx - 15 : -120;
                        if (pl.vx > 0) pl.code = 108;
                        else pl.code = 105 + Math.floor(pl.counter["running"] / 2);
                    }
                    else { // 地上にいない
                        if (pl.vx > -60) pl.vx -= 10;
                    }
                }
            }
        }
        export class PlayerWalkingRight extends AbstractState {
            enter(sm: PlayerStateMachine) {
                //console.log("walk right ");
                sm.e.flags["isRunning"] = false;
                sm.e.flags["isWalking"] = true;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.e;
                if (pl.counter["stamp_waiting"] > 0) { // 硬直中
                    pl.vx = (pl.vx + 10 < 60) ? pl.vx + 10 : 60;
                }
                else {
                    if (pl.flags["isOnGround"]) { // 地上にいる
                        pl.reverse_horizontal = true;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        pl.vx = (pl.vx + 15 < 60) ? pl.vx + 15 : 60;
                        if (pl.vx < 0) pl.code = 108;
                        else pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                    }
                    else { // 地上にいない
                        if (pl.vx < 60) pl.vx += 10;
                    }
                }
            }
        }
        export class PlayerRunningRight extends AbstractState {
            enter(sm: PlayerStateMachine) {
                //console.log("run right ");
                sm.e.flags["isRunning"] = true;
                sm.e.flags["isWalking"] = false;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.e;
                if (pl.counter["stamp_waiting"] > 0) { // 硬直中
                    pl.vx = (pl.vx + 10 < 60) ? pl.vx + 10 : 60;
                }
                else {
                    if (pl.flags["isOnGround"]) { // 地上にいる
                        pl.reverse_horizontal = true;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        pl.vx = (pl.vx + 15 < 120) ? pl.vx + 15 : 120;
                        if (pl.vx < 0) pl.code = 108;
                        else pl.code = 105 + Math.floor(pl.counter["running"] / 2);
                    }
                    else { // 地上にいない
                        if (pl.vx < 60) pl.vx += 10;
                    }
                }
            }
        }
        export class PlayerJumping extends AbstractState {
            update(sm: PlayerStateMachine) {
                sm.pop(); // 即座にもとのStateに戻す
                sm.update(); // もとのStateのupdateを先に行う
                var pl = sm.e;
                pl.checkCollisionWithBlocksHorizontal();
                if (pl.counter["stamp_waiting"] > 0) return; // 硬直中
                pl.flags["isJumping"] = true;
                pl.flags["isOnGround"] = false;
                var speed = Math.abs(pl.vx);
                /*// 貫通防止
                if (pl.ss.MapBlocks.getByXYReal(pl.centerx + pl.vx / 10, pl.y - 1) != null) {
                    pl.ss.MapBlocks.getByXYReal(pl.centerx + pl.vx / 10, pl.y - 1).dispatchEvent(new SpriteCollisionEvent("onhit", pl, "vertival"));
                }*/
                //if (pl.ss.MapBlocks.getByXYReal(pl.centerx + pl.vx / 10, pl.y - 1) == null || pl.ss.MapBlocks.getByXYReal(pl.centerx, pl.y - 1) == null) {
                if (pl.getHitBlock(pl.x + pl.width / 2 - 1 + pl.vx / 10, pl.y - 1) == null) {
                    if (pl.ss.MapBlocks.getByXYReal(pl.centerx + (pl.vx > 0 ? 1 : -1), pl.centery) != null) { // ブロックにぶつかっている(斜め床の場合、これでは不十分)
                        pl.vy = -150;
                        pl.counter["jump_level"] = 1;
                    }
                    else if (speed == 0) {
                        pl.vy = -150;
                        pl.counter["jump_level"] = 1;
                    }
                    else if (speed < 60) {
                        pl.vy = -230;
                        pl.counter["jump_level"] = 2;
                    }
                    else if (speed == 60) {
                        pl.vy = -260;
                        pl.counter["jump_level"] = 3;
                    }
                    else if (speed < 120) {
                        pl.vy = -290;
                        pl.counter["jump_level"] = 4;
                    }
                    else {
                        pl.vy = -340;
                        pl.counter["jump_level"] = 5;
                        pl.counter["superjump_effect"] = 1;
                        var effect = new PlayerSuperJumpEffect(pl.x, pl.y, pl.imagemanager, pl.label, 101, pl.reverse_horizontal);
                        pl.ss.add(effect);
                        if (pl.sjump_effects) {
                            for (var i = 0; i < pl.sjump_effects.length; i++) {
                                var ef = pl.sjump_effects[i];
                                if (ef) ef.kill();
                            }
                        }
                        pl.sjump_effects = [null, null, null, null, null, effect];
                    }
                }
                pl.checkCollisionWithBlocksVertical();
            }
        }
        export class PlayerInterialMove extends AbstractState {
            enter(sm: PlayerStateMachine) {
                //console.log("move interial ");
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.e;
                if (pl.flags["isOnGround"]) { // 地上にいる
                    if (pl.vx < 0) {
                        pl.reverse_horizontal = false;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        if (pl.flags["isRunning"]) pl.code = 107;
                        else pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                        //muki_x = false;
                    }
                    else if (pl.vx > 0) {
                        pl.reverse_horizontal = true;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        if (pl.flags["isRunning"]) pl.code = 107;
                        else pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                        //muki_x = true;
                    }

                    // 摩擦を受ける
                    if (pl.vx > 0) {
                        pl.vx -= 5;
                        if (pl.vx < 0) pl.vx = 0;
                    }
                    else if (pl.vx < 0) {
                        pl.vx += 5;
                        if (pl.vx > 0) pl.vx = 0;
                    }

                    if (pl.vx == 0) {
                        pl.flags["isRunning"] = false;
                        pl.flags["isWalking"] = false;
                        pl.code = 100;
                    }
                }
                else { // 地上にいない
                }
            }
        }
        export class PlayerDyingDirect extends AbstractState {
            enter(sm: PlayerStateMachine) {
                //console.log("dying");
                var pl = sm.e;
                pl.flags["isAlive"] = false;
                pl.counter["dying"] = 0;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.e;
                if (pl.counter["dying"] == 0) {
                    pl.vx = 0;
                    pl.vy = -280; // 跳ね上がる
                }
                pl.vy += 25; // 重力を受ける
                if (pl.vy > 100) pl.vy = 100;
                if (pl.counter["dying"] < 18) pl.counter["dying"] += 1;
                pl.code = 110 + pl.counter["dying"] % 4;
                if (pl.y > pl.view_y + SCREEN_HEIGHT + pl.height) {
                    pl.kill();
                    pl.dispatchEvent(new Event("ondie"));
                }
            }
        }
        export class PlayerDyingInDirect extends AbstractState {
            enter(sm: PlayerStateMachine) {
                //console.log("dying");
                var pl = sm.e;
                pl.flags["isAlive"] = false;
                pl.counter["dying"] = 0;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.e;
                if (pl.counter["dying"] == 0) {
                    pl.vx = 0;
                }
                pl.vy = 0; // その場で回転する
                if (pl.counter["dying"] < 18) pl.counter["dying"] += 1;
                pl.code = 110 + pl.counter["dying"] % 4;
                if (pl.counter["dying"] >= 18) pl.vy = 80;
                if (pl.y > pl.view_y + SCREEN_HEIGHT + pl.height) {
                    pl.kill();
                    pl.dispatchEvent(new Event("ondie"));
                }
            }
        }
        export class PlayerStamping extends AbstractState {
            private wait: number;
            enter(sm: PlayerStateMachine) {
                //console.log("stamping");
                var pl = sm.e;
                pl.code = 109;
                pl.flags["isStamping"] = true;
                pl.counter["stamp_waiting"] = 5;
                if (pl.counter["stamp_level"] == 1) {
                    pl.vy = -160;
                }
                else if (pl.counter["stamp_level"] == 2) {
                    pl.vy = -220;
                }
                else {
                    pl.vy = -160;
                }
                if (pl.counter["superjump_effect"] >= 0) pl.counter["superjump_effect"] = 100;
                sm.pop(); // update時ではなくenter直後にもとのstateに戻す
            }
            update(sm: PlayerStateMachine) {
                /*sm.pop();
                sm.update();*/
            }
        }
        export class PlayerWithoutSpecialMove extends AbstractState {
            enter(sm: PlayerStateMachine) {
            }
            update(sm: PlayerStateMachine) {
            }
        }
    }
    export class PlayerSuperJumpEffect extends Sprite {
        public ss: SpriteSystem;
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, code: number, reverse_horizontal: boolean) {
            super(x, y, imagemanager, label, 100, 1, 1);
            this.code = code;
            this.z = 129;
            this.reverse_horizontal = reverse_horizontal;
        }
        update() {
        }
    }
}