/// <reference path="entity.ts"/>
module Game {
    export class AbstractItem extends AbstractEntity {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.z = 256;
            this.counter["ac"] = 0;
        }
    }
    export module States {
        export class AbstractItemAlive extends AbstractState {
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
                            if (p.flags["isAlive"] && dx <= 14 && e.y <= p.y + 26 && e.y + 15 >= p.y) { // プレイヤーと接触した
                                this.onHitWithPlayer(sm, p);
                            }
                        });
                    })(p);
                }
            }
            onHitWithPlayer(sm: EntityStateMachine, p: Player) {
            }
        }
    }
    export class Coin extends AbstractItem {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.CoinExisting());
        }
    }
    export module States {
        export class CoinExisting extends AbstractItemAlive {
            enter(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = 0;

            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 8;
                e.code = 90 + Math.floor(e.counter["ac"]/2);

                this.checkCollisionWithPlayer(sm);
            }
            onHitWithPlayer(sm: EntityStateMachine, p: Player) {
                var e = sm.e;
                p.dispatchEvent(new ScoreEvent("addscore", 5));
                e.kill();
            }
        }
    }
}