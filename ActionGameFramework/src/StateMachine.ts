/// <reference path="state.ts"/>
module Game {
    export class StateMachine {
        private current_state: State;
        private global_state: State;
        private root_state: State;
        /*private is_started: boolean;*/
        private _states: Array<State>;
        public game: Game;
        public parent: any;

        constructor(game: Game, parent: any = null) {
            this.current_state = null;
            this.global_state = null;
            this.root_state = null;
            /*this.is_started = false;*/
            this._states = new Array<State>();

            this.game = game;
            this.parent = parent;
        }
        update() {
            /*if (this.is_started) {*/
            // グローバルステートが存在すれば実行
            if (this.global_state) this.global_state.update();
            // 現在のステートの処理
            if (this.current_state) this.current_state.update();
            /*}*/
        }/*
        start(state: string) {
            this.is_started = true;
        }
        regist(state: State) {
            this._states.set(state.name, state);
        }*/
        // スタックに新しいStateを積み、そのStateに遷移する
        // UNDONE:戻り値未定義
        push(state: State) {
            // スタックに何もないならば、与えられたステートをrootとする
            if (this._states.length == 0) this.root_state = state;

            if (this.current_state) this.current_state.exit();
            this._states.push(state);
            this.current_state = state;
            this.current_state.enter();
        }
        // 現在のステートを終了し、前のステートに遷移する
        // UNDONE:戻り値未定義
        pop() {
            /*// rootならばpopはできない
            if (this.current_state == this.root_state) return;*/

            this._states.pop().exit();
            console.log(this._states);
            this.current_state = this._states[this._states.length - 1];
            if (this.current_state) this.current_state.enter();
        }
        // 現在のステートを新しいステートに入れ替え、遷移処理を行う
        replace(state: State) {
            // 現在のステートがrootならば、新しいステートをrootとする
            if (this.root_state = this.current_state) this.root_state = state;
            this._states.pop().exit();
            this._states.push(state);
            this.current_state = state;
            this.current_state.enter();
        }
        // 初期化用
        setGlobalState(state: State) { this.global_state = state; this.global_state.enter() }

        // アクセサ
        CurrentState(): State { return this.current_state; }
        RootState(): State { return this.root_state; }
        GlobalState(): State { return this.global_state; }
    }
}