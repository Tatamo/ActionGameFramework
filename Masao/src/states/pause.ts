module Game {
    export module States {
        export class Pause extends AbstractState {
            background: HTMLCanvasElement;
            constructor(name: string, sm: StateMachine) {
                super(name, sm);
                this.background = document.createElement("canvas");
                this.background.width = this.sm.game.screen.width;
                this.background.height = this.sm.game.screen.height;
            }
            enter() {
                console.log(this.name);
                // 現在の画面を保存
                this.background.getContext("2d").drawImage(this.sm.game.screen.canvas, 0, 0);
            }
            update() {
                this.sm.game.screen.context.drawImage(this.background, 0, 0);
                this.sm.game.screen.context.fillStyle = "rgba(0,0,0,0.2)";
                this.sm.game.screen.context.fillRect(0, 0, this.sm.game.screen.width, this.sm.game.screen.height);
                this.sm.game.screen.context.fillStyle = "black";
                this.sm.game.screen.context.strokeText("PAUSE", 240, 150);
                if (this.sm.game.gamekey.isOnDown(80)) { // P
                    this.sm.pop(); // ステージに戻る
                }
                if (this.sm.game.gamekey.isOnDown(84)) { // T
                    this.sm.pop();
                    this.sm.pop(); // タイトルに戻る
                }
            }
        }
    }
}