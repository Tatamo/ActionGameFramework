module Game {

    export module States {
        export class Title implements State {
            game: Game;
            parent: State;
            name: string;
            sm: StateMachine;
            titleimg: HTMLCanvasElement;
            constructor(name: string, sm: StateMachine) {
                this.name = name;
                this.sm = sm;
                //this.game = sm.game;
            }
            enter() {
                //this.titleimg = this.game.images.get("title");
            }
            update() {
                this.game.screen.context.drawImage(this.titleimg, 0, 0);
                if (this.game.gamekey.isOnDown(90)) { // Z
                    //this.sm.push(new State());
                }
                console.log("title");
            }
            exit() { }
        }
    }
}