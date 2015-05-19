module Game {
    export class Player extends Sprite {
        public gk: GameKey;
        public counter: {};
        public flags: {};
        public code: number;
        public vx: number;
        public vy: number;
        public moving: PlayerStateMachine;
        constructor(input: GameKey, x: number, y: number, imagemanager: ImageManager, label: string, code: number = 0, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, code, dx, dy);
            this.gk = input;
            this.moving = new PlayerStateMachine(this);
            this.moving.push(new States.PlayerInterialMove(this.moving));
            this.counter = {};
            this.counter["running"] = 0;
            this.flags = {};
            this.flags["isRunning"] = false;
            this.vx = 0;
            this.vy = 0;
        }
        update() {
            this.checkInput();
            //this.externalForce();
            this.moving.update();
            this.x += this.vx/10;
            this.y += this.vy/10;
        }
        checkInput() {
            if (this.gk.isDown(37) && this.gk.isDown(39)) { } // 左右同時に押されていたらとりあえず何もしないことに
            else if (this.gk.isDown(37)) {
                if (this.gk.releasedkeys[37] <= 8) {
                    this.moving.replace(new States.PlayerRunningLeft(this.moving));
                    //this.flags["isRunning"] = true;
                }
                else if(!(this.moving.CurrentState() instanceof States.PlayerRunningLeft)) {
                    this.moving.replace(new States.PlayerWalkingLeft(this.moving));
                }
            }
            else if (this.gk.isDown(39)) {
                if (this.gk.releasedkeys[39] <= 8) {
                    this.moving.replace(new States.PlayerRunningRight(this.moving));
                }
                else if (!(this.moving.CurrentState() instanceof States.PlayerRunningRight)) {
                    this.moving.replace(new States.PlayerWalkingRight(this.moving));
                }
            }
            else {
                this.moving.replace(new States.PlayerInterialMove(this.moving));
            }
        }
        externalForce() {
            var cnt = this.counter;
            var flg = this.flags;
            // 歩き,走り判定
            if (this.gk.isDown(37)) {
                cnt["running"]++;
                if (cnt["running"] > 3) cnt["running"] = 0;
                if (flg["isRunning"]) {
                    this.vx = (this.vx - 15 > -120) ? this.vx - 15 : -120;
                    if (this.vx > 0) this.code = 108;
                    else this.code = 105 + cnt["running"] / 2;
                }
                else {
                    this.vx = (this.vx - 15 > -60) ? this.vx - 15 : -60;
                    if (this.vx > 0) this.code = 108;
                    else this.code = 103 + cnt["running"] / 2;
                }
                //muki_x = false;
            }
            else if (this.gk.isDown(39)) {
                cnt["running"]++;
                if (cnt["running"] > 3) cnt["running"] = 0;
                if (flg["isRunning"]) {
                    this.vx = (this.vx + 15 < 120) ? this.vx + 15 : 120;
                    if (this.vx < 0) this.code = 108;
                    else this.code = 105 + cnt["running"] / 2;
                }
                else {
                    this.vx = (this.vx + 15 < 60) ? this.vx + 15 : 60;
                    if (this.vx < 0) this.code = 108;
                    else this.code = 103 + cnt["running"] / 2;
                }
                //muki_x = true;
            }
            else if (this.vx < 0) {
                cnt["running"]++;
                if (cnt["running"] > 3) cnt["running"] = 0;
                if (flg["isRunning"]) this.code = 107;
                else this.code = 103 + cnt["running"] / 2;
                //muki_x = false;
            }
            else if (this.vx > 0) {
                cnt["running"]++;
                if (cnt["running"] > 3) cnt["running"] = 0;
                if (flg["isRunning"]) this.code = 107;
                else this.code = 103 + cnt["running"] / 2;
                //muki_x = true;
            }

            // 左右キー入力なし・地上
            if (!this.gk.isDown(39) && !this.gk.isDown(37)) { // 摩擦を受ける
                if (this.vx > 0) {
                    this.vx -= 5;
                    if (this.vx < 0) this.vx = 0;
                }
                else if (this.vx < 0) {
                    this.vx += 5;
                    if (this.vx > 0) this.vx = 0;
                }
            }
        }
        hoge() { }
    }
    export class PlayerStateMachine extends StateMachine {
        public pl: Player;
        constructor(pl: Player, parent: any = null) {
            super(parent);
            this.pl = pl;
        }
    }
    export module States {
        export class PlayerMovingState extends AbstractState {
            sm: PlayerStateMachine;
            constructor(sm: PlayerStateMachine) {
                super(sm);
            }
        }
        // 地上での処理が前提
        // TODO:空中
        export class PlayerWalkingLeft extends PlayerMovingState {
            enter() {
                console.log("walk left ");
            }
            update() {
                var pl = this.sm.pl;
                pl.counter["running"]++;
                if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                pl.vx = (pl.vx - 15 > -60) ? pl.vx - 15 : -60;
                if (pl.vx > 0) pl.code = 108;
                else pl.code = 103 + pl.counter["running"] / 2;
            }
        }
        export class PlayerRunningLeft extends PlayerMovingState {
            enter() {
                console.log("run left ");
            }
            update() {
                var pl = this.sm.pl;
                pl.counter["running"]++;
                if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                pl.vx = (pl.vx - 15 > -120) ? pl.vx - 15 : -120;
                if (pl.vx > 0) pl.code = 108;
                else pl.code = 105 + pl.counter["running"] / 2;
            }
        }
        export class PlayerWalkingRight extends PlayerMovingState {
            enter() {
                console.log("walk right ");
            }
            update() {
                var pl = this.sm.pl;
                pl.counter["running"]++;
                if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                pl.vx = (pl.vx + 15 < 60) ? pl.vx + 15 : 60;
                if (pl.vx > 0) pl.code = 108;
                else pl.code = 103 + pl.counter["running"] / 2;
            }
        }
        export class PlayerRunningRight extends PlayerMovingState {
            enter() {
                console.log("run right ");
            }
            update() {
                var pl = this.sm.pl;
                pl.counter["running"]++;
                if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                pl.vx = (pl.vx + 15 < 120) ? pl.vx + 15 : 120;
                if (pl.vx > 0) pl.code = 108;
                else pl.code = 103 + pl.counter["running"] / 2;
            }
        }
        export class PlayerInterialMove extends PlayerMovingState {
            enter() {
                console.log("move interial ");
            }
            update() {
                var pl = this.sm.pl;
                if (pl.vx < 0) {
                    pl.counter["running"]++;
                    if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                    if (pl.flags["isRunning"]) pl.code = 107;
                    else pl.code = 103 + pl.counter["running"] / 2;
                    //muki_x = false;
                }
                else if (pl.vx > 0) {
                    pl.counter["running"]++;
                    if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                    if (pl.flags["isRunning"]) pl.code = 107;
                    else pl.code = 103 + pl.counter["running"] / 2;
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
            }
            /*checkInput() {
                var pl = this.sm.pl;
                if (pl.gk.isDown(37) && pl.gk.isDown(39)) { } // 左右同時に押されていたらとりあえず何もしないことに
                else if (pl.gk.isDown(37)) {
                    if (pl.gk.releasedkeys[37] == 1 && pl.gk.releasedkeys[37] <= 8) {
                        pl.moving.replace(new States.PlayerRunningLeft(pl.moving));
                    }
                    else {
                        pl.moving.replace(new States.PlayerWalkingLeft(pl.moving));
                    }
                }
                else if (pl.gk.isDown(39)) {
                    if (pl.gk.releasedkeys[39] == 1 && pl.gk.releasedkeys[39] <= 8) {
                        pl.moving.replace(new States.PlayerRunningRight(pl.moving));
                    }
                    else {
                        pl.moving.replace(new States.PlayerWalkingRight(pl.moving));
                    }
                }
                else {
                    pl.moving.replace(new States.PlayerInterialMove(pl.moving));
                }
            }*/
        }
    }
}