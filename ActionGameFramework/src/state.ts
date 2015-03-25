module Game {
    export interface State {
        parent: State;
        name: string;
        sm: StateMachine;
        enter();
        update();
        exit();
    }

    export module States {
        export class AbstractState implements State {
            parent: State;
            name: string;
            sm: StateMachine;
            constructor(name: string, sm: StateMachine) {
                this.name = name;
                this.sm = sm;
            }
            enter() { }
            update() { }
            exit() { }
        }
        export class Preload extends AbstractState {
            enter() {
                console.log(this.name);
                var assets = this.sm.game.assets;

                assets.image.regist_image("title", "title.gif");
                assets.image.regist_pattern("pattern", "pattern.gif",32,32);
                assets.load();

            }
            update() {
                var loader = this.sm.game.assets.loader;
                if (loader.state == PreloadStates.NOTHING2LOAD) {
                    this.sm.replace(new Title("title", this.sm));
                }
            }
        }

        export class Title extends AbstractState {
            titleimg: HTMLCanvasElement;
            enter() {
                console.log(this.name);
                this.titleimg = this.sm.game.assets.image.get("title");
            }
            update() {
                this.sm.game.screen.context.drawImage(this.titleimg, 0, 0);
                if (this.sm.game.gamekey.isOnDown(90)) { // Z
                    this.sm.push(new Stage("stage",this.sm));
                }
            }
        }
        export class Stage extends AbstractState {
            image: HTMLCanvasElement;
            enter() {
                console.log(this.name);
                this.image = this.sm.game.assets.image.get("pattern", 100);
            }
            update() {
                this.sm.game.screen.context.drawImage(this.image, 0, 0);
                if (this.sm.game.gamekey.isOnDown(80)) { // P
                    this.sm.push(new Pause(this.name+"-pause", this.sm));
                }
            }
        }
        export class Pause extends AbstractState {
            image: HTMLCanvasElement;
            enter() {
                console.log(this.name);
                this.image = this.sm.game.assets.image.get("pattern", 110);
            }
            update() {
                this.sm.game.screen.context.drawImage(this.image, 224, 128);
                if (this.sm.game.gamekey.isOnDown(80)) { // P
                    this.sm.pop(); // ステージに戻る
                }
            }
        }
    }
}