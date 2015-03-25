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
                var assets = this.sm.game.assets;

                assets.image.regist_image("title", "title.gif");
                assets.load();

            }
            update() {
                var loader = this.sm.game.assets.loader;
                if (loader.state == PreloadStates.NOTHING2LOAD) {
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
            }
            enter() {
                this.titleimg = this.sm.game.assets.image.get("title");
            }
            update() {
                this.sm.game.screen.context.drawImage(this.titleimg, 0, 0);
                if (this.sm.game.gamekey.isOnDown(90)) { // Z
                    this.sm.push(new Stage("stage",this.sm));
                }
            }
            exit() { }
        }

        export class Stage implements State {
            parent: State;
            name: string;
            sm: StateMachine;
            titleimg: HTMLCanvasElement;
            constructor(name: string, sm: StateMachine) {
                this.name = name;
                this.sm = sm;
            }
            enter() {
                this.titleimg = this.sm.game.assets.image.get("title");
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