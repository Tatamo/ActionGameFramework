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
        }/*
        export class Stage extends AbstractState {
            image: HTMLCanvasElement;
            x: number = 0;
            enter() {
                console.log(this.name);
                this.image = this.sm.game.assets.image.get("pattern", 100);
            }
            update() {
                // 背景色で埋めてみる
                this.sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                this.sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);

                this.sm.game.screen.context.drawImage(this.image, 224+this.x, 128);


                // うごく
                if (this.sm.game.gamekey.isDown(39)) {
                    this.x += 8;
                }
                if (this.sm.game.gamekey.isDown(37)) {
                    this.x -= 8;
                }

                if (this.sm.game.gamekey.isOnDown(80)) { // Pキー
                    this.sm.push(new Pause(this.name+"-pause", this.sm)); // ポーズ
                }
                if (this.sm.game.gamekey.isOnDown(84)) { // T
                    this.sm.pop(); // タイトルに戻る
                }
            }
        }*/
        export class Stage extends AbstractState {
            player: Sprite;
            sprites: Group;
            x: number = 0;
            constructor(name: string, sm: StateMachine) {
                super(name, sm);
                this.player = new Sprite(224,120,this.sm.game.assets.image,"pattern",100);
                this.sprites = new Group(this.sm.game.screen);
                this.sprites.add(this.player);
            }
            enter() {
                console.log(this.name);
            }
            update() {
                // 背景色で埋めてみる
                this.sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                this.sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);

                this.sprites.draw();

                // うごく
                if (this.sm.game.gamekey.isDown(39)) {
                    this.player.x += 8;
                }
                if (this.sm.game.gamekey.isDown(37)) {
                    this.player.x -= 8;
                }

                if (this.sm.game.gamekey.isOnDown(80)) { // Pキー
                    this.sm.push(new Pause(this.name + "-pause", this.sm)); // ポーズ
                }
                if (this.sm.game.gamekey.isOnDown(84)) { // T
                    this.sm.pop(); // タイトルに戻る
                }
            }
        }
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