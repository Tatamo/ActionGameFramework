/// <reference path="surface.ts"/>
/// <reference path="sprite.ts"/>
/// <reference path="input.ts"/>
/// <reference path="assets.ts"/>
/// <reference path="statemachine.ts"/>
/// <reference path="state.ts"/>
module Game {
    var SCREEN_WIDTH = 512;
    var SCREEN_HEIGHT = 320;
    export class Game {
        element: HTMLElement;
        screen: Surface;
        statemachine: StateMachine;
        gamekey: GameKey;
        assets: AssetsManagerManager;
        //config:Config;

        private timerToken: number;

        constructor() {
            this.screen = new Surface(SCREEN_WIDTH, SCREEN_HEIGHT);
            this.statemachine = new StateMachine(this);
            this.gamekey = new GameKey();
            this.assets = new AssetsManagerManager();
            //this.config = new Config(map, image, config);
        }
        // 指定した要素の子要素としてゲーム画面を追加します
        public setparent(el: HTMLElement) {
            this.element = el;
            this.element.innerHTML += "test"; // DEBUG
            this.element.appendChild(this.screen.container);
            this.screen.container.tabIndex = 1; // ゲーム画面をフォーカス可能にする
            this.gamekey.setEvent(this.screen.container);　// 画面に対してキー入力を受け付けるように
        }
        // ゲームループの開始
        public start(state?:State) {
            console.log("app start"); // DEBUG
            // this.statemachine.push(最初のState);
            /*if(!this.statemachine.CurrentState()) this.statemachine.push(new States.Preload("preload", this.statemachine));*/
            if(!this.statemachine.CurrentState()) this.statemachine.push(state); // TODO:state==null時などの考慮

            this.timerToken = setInterval(() => this.loop(), 100);
        }
        // 使うの?
        public stop() {
            clearTimeout(this.timerToken);
        }
        // ゲームループ
        // UNDONE: イベントハンドラ扱いにしたい
        loop() {
            this.gamekey.update(); // まずキー入力情報を更新
            this.statemachine.update(); // ステートマシンを動かす
            //this.screen.canvas.getContext("2d").fillRect(this.counter, this.counter, this.counter, this.counter); //DEBUG
        }
    }
}