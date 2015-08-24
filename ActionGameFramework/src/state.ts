
module Game {
    export interface IState {
        parent: IState;
        //name: string;
        enter(sm: StateMachine);
        update(sm: StateMachine);
        exit(sm: StateMachine);
    }

    export module States {
        export class AbstractState implements IState {
            parent: IState;
            //name: string;
            //constructor(name: string, sm: GameStateMachine) {
            constructor() {
                //this.name = name;
            }
            enter(sm: StateMachine) { }
            update(sm: StateMachine) { }
            exit(sm: StateMachine) { }
        }
    }
}