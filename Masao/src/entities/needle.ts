/// <reference path="entity.ts"/>
module Game {
    export class UpwardNeedle extends AbstractEntity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.z = 256;
            this.code = 5;
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.NeedleExisting());
        }
    }
    export class DownwardNeedle extends AbstractEntity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.z = 256;
            this.code = 6;
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.NeedleExisting());
        }
    }
    export module States {
        export class NeedleExisting extends AbstractState {
            update(sm: EntityStateMachine) {
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
                            if (p.flags["isAlive"] && new Point(p.x + p.width/2 - 1, p.y + p.height/2 - 1).collision(e.getCollision())) { // プレイヤーと接触した
                                p.y = Math.floor((p.y + p.width / 2 - 1) / 32) * 32;
                                p.dispatchEvent(new PlayerMissEvent("miss", 2));
                            }
                        });
                    })(p);
                }
            }
        }
    }
}