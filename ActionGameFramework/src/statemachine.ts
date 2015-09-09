/// <reference path="state.ts"/>
module Game {
    export interface IStateMachine {
        parent: any;
        update();
        push(state: IState);
        pop();
        replace(state: IState);
        setGlobalState(state: IState);
        
        // getter
        current_state: IState;
        root_state: IState;
        global_state: IState;
    }
    export class StateMachine implements IStateMachine{
        private _current_state: IState;
        private _global_state: IState;
        private _root_state: IState;
        private _states: Array<IState>;
        public parent: any;

        constructor(parent: any = null) {
            this._current_state = null;
            this._global_state = null;
            this._root_state = null;
            /*this.is_started = false;*/
            this._states = new Array<IState>();

            this.parent = parent;
        }
        update() {
            // グローバルステートが存在すれば実行
            if (this._global_state) this._global_state.update(this);
            // 現在のステートの処理
            if (this._current_state) this._current_state.update(this);
        }
        // スタックに新しいStateを積み、そのStateに遷移する
        // UNDONE:戻り値未定義
        push(state: IState) {
            // スタックに何もないならば、与えられたステートをrootとする
            if (this._states.length == 0) this._root_state = state;

            if (this._current_state) this._current_state.exit(this);
            this._states.push(state);
            this._current_state = state;
            this._current_state.enter(this);
        }
        // 現在のステートを終了し、前のステートに遷移する
        // UNDONE:戻り値未定義
        pop() {
            /*// rootならばpopはできない
            if (this.current_state == this.root_state) return;*/

            this._states.pop().exit(this);
            this._current_state = this._states[this._states.length - 1];
            if (this._current_state) this._current_state.enter(this);
        }
        // 現在のステートを新しいステートに入れ替え、遷移処理を行う
        replace(state: IState) {
            // 現在のステートがrootならば、新しいステートをrootとする
            if (this._root_state = this._current_state) this._root_state = state;
            this._states.pop().exit(this);
            this._states.push(state);
            this._current_state = state;
            this._current_state.enter(this);
        }
        // 初期化用
        setGlobalState(state: IState) {
            if (this._global_state) this._global_state.exit(this);
            this._global_state = state;
            this._global_state.enter(this);
        }

        // アクセサ
        get current_state(): IState { return this._current_state; }
        get root_state(): IState { return this._root_state; }
        get global_state(): IState { return this._global_state; }
    }
}