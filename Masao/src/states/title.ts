module Game {
    export module States {
        export class Title extends GameState {
            titleimg: HTMLCanvasElement;
            enter(sm: GameStateMachine) {
                this.titleimg = sm.game.assets.image.get("title");
            }
            update(sm: GameStateMachine) {
                sm.game.screen.context.drawImage(this.titleimg, 0, 0);
                if (sm.game.gamekey.isOnDown(90)) { // Z
                    sm.push(new Stage());
                }
            }
        }
    }
}