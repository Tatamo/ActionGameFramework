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
    class Config {
        rawmap: Array<string>;
        map: Array<string>;
        image: {
            [key: string]: any;
        };
        config: {
            [key: string]: any;
        };
        constructor(map: Array<string>, image: {
            [key: string]: any;
        }, config?: {
            [key: string]: any;
        });
        initconfig(): void;
        initmap(map: Array<string>): void;
    }
}
declare module Game {
    class Circle extends AbstractShape {
        x: number;
        y: number;
        r: number;
        width: number;
        height: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
        centerx: number;
        centery: number;
        constructor(x: number, y: number, r: number, base?: Circle);
        getParams(): Array<number>;
    }
}
declare module Game {
    class Collision {
        constructor();
        collision(target: IShape, base?: IShape): boolean;
        protected colPointWithPoint(p1: Point, p2: Point): boolean;
        protected colPointWithRect(p: Point, r: Rect): boolean;
        protected colPointWithCircle(p: Point, c: Circle): boolean;
        protected colRectWithRect(r1: Rect, r2: Rect): boolean;
        protected colRectWithCircle(r: Rect, c: Circle): boolean;
        protected colCircleWithCircle(c1: Circle, c2: Circle): boolean;
    }
}
declare module Game {
    class Point extends AbstractShape {
        x: number;
        y: number;
        width: number;
        height: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
        centerx: number;
        centery: number;
        constructor(x: number, y: number, base?: Point);
        getParams(): Array<number>;
    }
}
declare module Game {
    class Rect extends AbstractShape {
        x: number;
        y: number;
        width: number;
        height: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
        centerx: number;
        centery: number;
        constructor(x: number, y: number, w: number, h: number, base?: Rect);
        getParams(): Array<number>;
    }
}
declare module Game {
    interface IShape {
        left: number;
        right: number;
        top: number;
        bottom: number;
        centerx: number;
        centery: number;
        width: number;
        height: number;
        getParams(): any;
        collision(target: IShape, base?: IShape): any;
    }
    class AbstractShape extends Collision implements IShape {
        left: number;
        right: number;
        top: number;
        bottom: number;
        centerx: number;
        centery: number;
        width: number;
        height: number;
        constructor();
        getParams(): void;
    }
}
declare module Game {
    interface IEventDispatcher {
        addEventHandler(type: string, handler: (e: Event) => void): any;
        addOnceEventHandler(type: string, handler: (e: Event) => void): any;
        removeEventHandler(type: string, handler: (e: Event) => void): any;
        clearEventHandler(type: string): any;
        dispatchEvent(e: Event): any;
    }
    class EventDispatcher implements IEventDispatcher {
        private _handlers;
        private _oncehandlers;
        constructor();
        addEventHandler(type: string, handler: (e: Event) => void): void;
        addOnceEventHandler(type: string, handler: (e: Event) => void): void;
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
        private reverseVertical();
        private reverseHorizontal();
    }
}
declare module Game {
    interface ISprite extends IEventDispatcher {
        x: number;
        y: number;
        z: number;
        vx: number;
        vy: number;
        width: number;
        height: number;
        code: number;
        reverse_horizontal: boolean;
        reverse_vertical: boolean;
        left: number;
        right: number;
        top: number;
        bottom: number;
        centerx: number;
        centery: number;
        ss: ISpriteSystem;
        surface: Surface;
        update(): any;
        kill(): any;
        getRect(): Rect;
    }
    class Sprite extends EventDispatcher implements ISprite {
        x: number;
        y: number;
        z: number;
        vx: number;
        vy: number;
        private _ss;
        ss: ISpriteSystem;
        surface: PatternSurface;
        width: number;
        height: number;
        code: number;
        reverse_horizontal: boolean;
        reverse_vertical: boolean;
        left: number;
        right: number;
        top: number;
        bottom: number;
        centerx: number;
        centery: number;
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, code?: number, dx?: number, dy?: number);
        update(): void;
        kill(): void;
        getRect(): Rect;
    }
    class SpriteEvent extends Event {
        type: string;
        sprite: ISprite;
        constructor(type: string, sprite: ISprite);
    }
    interface IGroup {
        screen: Surface;
        add(sprite: ISprite): any;
        remove(sprite: ISprite): any;
        remove_all(): any;
        sort(): any;
        compare(a: ISprite, b: ISprite): any;
        get_all(): Array<ISprite>;
        update(): any;
        draw(): any;
    }
    class Group implements IGroup {
        screen: Surface;
        private _sprites;
        constructor(screen: Surface);
        compare(a: ISprite, b: ISprite): number;
        add(sprite: ISprite): void;
        remove(sprite: ISprite): void;
        remove_all(): void;
        get_all(): Array<ISprite>;
        sort(): void;
        update(): void;
        draw(view_x?: number, view_y?: number): void;
    }
}
declare module Game {
    interface IState {
        parent: IState;
        enter(sm: StateMachine): any;
        update(sm: StateMachine): any;
        exit(sm: StateMachine): any;
    }
    module States {
        class AbstractState implements IState {
            parent: IState;
            constructor();
            enter(sm: StateMachine): void;
            update(sm: StateMachine): void;
            exit(sm: StateMachine): void;
        }
    }
}
declare module Game {
    interface IStateMachine {
        parent: any;
        update(): any;
        push(state: IState): any;
        pop(): any;
        replace(state: IState): any;
        setGlobalState(state: IState): any;
        current_state: IState;
        root_state: IState;
        global_state: IState;
    }
    class StateMachine implements IStateMachine {
        private _current_state;
        private _global_state;
        private _root_state;
        private _states;
        parent: any;
        constructor(parent?: any);
        update(): void;
        push(state: IState): void;
        pop(): void;
        replace(state: IState): void;
        setGlobalState(state: IState): void;
        current_state: IState;
        root_state: IState;
        global_state: IState;
    }
}
declare module Game {
    var SCREEN_WIDTH: number;
    var SCREEN_HEIGHT: number;
    class Core extends EventDispatcher {
        element: HTMLElement;
        screen: Surface;
        statemachine: IStateMachine;
        gamekey: GameKey;
        assets: AssetsManagerManager;
        config: Config;
        private timerToken;
        constructor(config: any);
        setparent(el: HTMLElement): void;
        start(state?: IState): void;
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
