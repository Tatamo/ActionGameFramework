module Game {
    export module States {
        export class Ending extends GameState {
            bg: HTMLCanvasElement;
            private counter: number;
            enter(sm: GameStateMachine) {
                this.bg = sm.game.assets.image.get("ending");
                this.counter = 0;
            }
            update(sm: GameStateMachine) {
                sm.game.screen.context.drawImage(this.bg, 0, 0);
                if (sm.game.gamekey.isOnDown(84)) { // T
                    sm.pop(); // タイトルに戻る
                }
                this.counter += 1;
                if (this.counter >= 120 / 14 * 14) sm.pop(); // タイトルに戻る
            }
        }
    }
}