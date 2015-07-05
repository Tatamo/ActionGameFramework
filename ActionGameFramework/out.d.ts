declare class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;
    constructor(element: HTMLElement);
    start(): void;
    stop(): void;
}
declare var game: Game.Game;
declare module Game {
    class Dictionary<T> implements WeakMap<any, T> {
        private datalist;
        constructor();
        clear(): void;
        set(key: number, value: T): any;
        set(key: string, value: T): any;
        delete(key: string): boolean;
        delete(key: number): boolean;
        get(key: string): T;
        get(key: number): T;
        getkey(value: T): string;
        has(key: string): boolean;
        has(key: number): boolean;
        private checkType(key);
    }
    class Registrar<T> extends Dictionary<T> {
        set(key: string, value: T): any;
        set(key: number, value: T): any;
    }
    class AbstractDataGroup<T> {
        private datalist;
        sortmethod: (x: T, y: T) => number;
        constructor();
        clear(): void;
        getArray(): T[];
        getCount(): number;
        add(value: T): void;
        sort(): void;
        del(value: T): void;
    }
}
declare module Game {
    class AssetsManagerManager {
        loader: Loader;
        image: ImageManager;
        constructor();
        load(): void;
    }
    enum PreloadStates {
        UNLOAD = 0,
        LOADING = 1,
        NOTHING2LOAD = 2,
    }
    interface ILoader {
        state: PreloadStates;
        count: number;
        count_loadeds: number;
        load(cb?: () => void): any;
    }
    class Loader implements ILoader {
        private loaders;
        constructor(list: Array<ILoader>);
        state: PreloadStates;
        count: number;
        count_loadeds: number;
        load(cb?: () => void): void;
    }
    class AbstractLoader implements ILoader {
        protected _unloadeds: Array<{
            label: string;
            path: string;
            callback?: (file: any, label: string) => void;
        }>;
        protected _isloading: boolean;
        state: PreloadStates;
        private _count;
        count: number;
        count_loadeds: number;
        constructor();
        push(l: string, p: string, cb?: (file: any, label: string) => void): void;
        load(cb?: () => void): void;
        protected __load(cb: () => void): void;
        protected _load(cb?: () => void): void;
    }
    class ImageLoader extends AbstractLoader {
        _load(cb?: any): void;
    }
    class ImageManager {
        private images;
        loader: ILoader;
        private _loader;
        constructor();
        get(name: string): any;
        get(name: string, x: number, y: number): any;
        get(name: string, code: number): any;
        getwide(name: string, x: number, y: number, wx: number, wy: number): any;
        getwide(name: string, code: number, wx: number, wy: number): any;
        private set(name, img, chipwidth?, chipheight?);
        regist_image(label: string, path: string): void;
        regist_pattern(label: string, path: string, c_width: number, c_height: number): void;
        load(): void;
    }
}
declare module Game {
    interface IEventDispatcher {
        addEventHandler(type: string, handler: (e: Event) => void): any;
        removeEventHandler(type: string, handler: (e: Event) => void): any;
        clearEventHandler(type: string): any;
        dispatchEvent(e: Event): any;
    }
    class EventDispatcher implements IEventDispatcher {
        private _handlers;
        constructor();
        addEventHandler(type: string, handler: (e: Event) => void): void;
        removeEventHandler(type: string, handler: (e: Event) => void): void;
        clearEventHandler(type: string): void;
        dispatchEvent(e: Event): void;
    }
    class Event {
        type: string;
        constructor(type: string);
    }
}
declare module Game {
    class GameKey {
        keys: {
            [key: number]: number;
        };
        releasedkeys: {
            [key: number]: number;
        };
        private keepreleasedtime;
        constructor();
        setEvent(el: HTMLElement): void;
        init(): void;
        update(): void;
        KeyDown(key: number): void;
        KeyUp(key: number): void;
        isDown(key: number): boolean;
        isOnDown(key: number): boolean;
        getCount(key: number): number;
    }
}
declare module Game {
    interface ISurface {
    }
    class Surface {
        container: HTMLDivElement;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        width: number;
        height: number;
        constructor(width: number, height: number);
        setWidth(width: number): void;
        setHeight(height: number): void;
        drawSurface(source: Surface, dest_x: number, dest_y: number): void;
    }
    class PatternSurface extends Surface {
        private _im;
        private _i;
        private _label;
        private _code;
        private _dx;
        private _dy;
        code: number;
        private _reverse_vertical;
        private _reverse_horizontal;
        reverse_vertical: boolean;
        reverse_horizontal: boolean;
        constructor(imagemanager: ImageManager, label: string, code?: number, dx?: number, dy?: number);
        reverseVertical(): void;
        reverseHorizontal(): void;
    }
}
declare module Game {
    interface ISprite extends IEventDispatcher {
        x: number;
        y: number;
        z: number;
        ss: ISpriteSystem;
        surface: Surface;
        update(): any;
        kill(): any;
    }
    class Sprite extends EventDispatcher implements ISprite {
        x: number;
        y: number;
        z: number;
        private _ss;
        ss: ISpriteSystem;
        surface: PatternSurface;
        private _groups;
        width: number;
        height: number;
        code: number;
        private static default_groups;
        static getDefaultGroups(): IGroup[];
        static setDefaultGroups(groups: Array<IGroup>): void;
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, code?: number, dx?: number, dy?: number);
        update(): void;
        kill(): void;
    }
    interface IGroup {
        screen: Surface;
        add(sprite: ISprite): any;
        remove(sprite: ISprite): any;
        remove_all(): any;
        update(): any;
        draw(): any;
    }
    class Group implements IGroup {
        screen: Surface;
        private _sprites;
        constructor(screen: Surface);
        add(sprite: ISprite): void;
        remove(sprite: ISprite): void;
        remove_all(): void;
        update(): void;
        draw(): void;
    }
}
declare module Game {
    interface State {
        parent: State;
        enter(sm: StateMachine): any;
        update(sm: StateMachine): any;
        exit(sm: StateMachine): any;
    }
    module States {
        class AbstractState implements State {
            parent: State;
            constructor();
            enter(sm: StateMachine): void;
            update(sm: StateMachine): void;
            exit(sm: StateMachine): void;
        }
    }
}
declare module Game {
    class StateMachine {
        private current_state;
        private global_state;
        private root_state;
        private _states;
        parent: any;
        constructor(parent?: any);
        update(): void;
        push(state: State): void;
        pop(): void;
        replace(state: State): void;
        setGlobalState(state: State): void;
        CurrentState(): State;
        RootState(): State;
        GlobalState(): State;
    }
    class GameStateMachine extends StateMachine {
        game: Game;
        constructor(game: Game, parent?: any);
    }
}
declare module Game {
    var SCREEN_WIDTH: number;
    var SCREEN_HEIGHT: number;
    class Game {
        element: HTMLElement;
        screen: Surface;
        statemachine: GameStateMachine;
        gamekey: GameKey;
        assets: AssetsManagerManager;
        private timerToken;
        constructor();
        setparent(el: HTMLElement): void;
        start(state?: State): void;
        stop(): void;
        loop(): void;
    }
}
declare module Game {
    interface ISpriteSystem {
        AllSprites: IGroup;
        add(s: ISprite): any;
        remove(s: ISprite): any;
    }
}
