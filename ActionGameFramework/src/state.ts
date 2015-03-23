module Game {

    export module States {
        export class Preload implements State {
            parent: State;
            name: string;
            sm: StateMachine;
            constructor(name: string, sm: StateMachine) {
                this.name = name;
                this.sm = sm;
            }
            enter() {
                var loader = this.sm.game.loader;

                loader.push("title", "/title.gif");
                loader.load();

            }
            update() {
                var loader = this.sm.game.loader;
                if (loader.state == PreloadStates.LOADED) {
                    this.sm.push(new Title("title", this.sm));
                }
            }
            exit() { }
        }
        export class Title implements State {
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
                this.titleimg = this.sm.game.loader.getAsset("title");
            }
            update() {
                this.sm.game.screen.context.drawImage(this.titleimg, 0, 0);
                if (this.sm.game.gamekey.isOnDown(90)) { // Z
                    //this.sm.push(new State());
                }
                //console.log("title");
            }
            exit() { }
        }
    }
}