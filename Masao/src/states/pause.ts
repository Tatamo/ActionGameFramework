module Game {
    export module States {
        export class Pause extends GameState {
            background: HTMLCanvasElement;
            constructor(sm: GameStateMachine) {
                super();
                this.background = document.createElement("canvas");
                this.background.width = sm.game.screen.width;
                this.background.height = sm.game.screen.height;
            }
            enter(sm: GameStateMachine) {
                // 現在の画面を保存
                this.background.getContext("2d").drawImage(sm.game.screen.canvas, 0, 0);
            }
            update(sm: GameStateMachine) {
                sm.game.screen.context.drawImage(this.background, 0, 0);
                sm.game.screen.context.fillStyle = "rgba(0,0,0,0.2)";
                sm.game.screen.context.fillRect(0, 0, sm.game.screen.width, sm.game.screen.height);
                sm.game.screen.context.fillStyle = "black";
                sm.game.screen.context.strokeText("PAUSE", 240, 150);
                if (sm.game.gamekey.isOnDown(80)) { // P
                    sm.pop(); // ステージに戻る
                }
                if (sm.game.gamekey.isOnDown(84)) { // T
                    sm.pop();
                    sm.pop(); // タイトルに戻る
                }
            }
        }
    }
}