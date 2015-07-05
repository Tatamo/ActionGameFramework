module Game {
    export interface IEventDispatcher {
        addEventHandler(type: string, handler: (e: Event) => void);
        removeEventHandler(type: string, handler: (e: Event) => void);
        clearEventHandler(type: string);
        dispatchEvent(e: Event);
    }

    export class EventDispatcher implements IEventDispatcher {
        private _handlers: { [key: string]: Array<(e: Event) => void> };
        constructor() {
            this._handlers = {};
        }
        // イベントハンドラの追加
        addEventHandler(type: string, handler: (e: Event) => void) {
            if (!this._handlers[type]) {
                this._handlers[type] = [handler.bind(this)];
            }
            else {
                this._handlers[type].push(handler.bind(this));
            }
        }
        // イベントハンドラの削除
        removeEventHandler(type: string, handler: (e: Event) => void) {
            if (!this._handlers[type]) {
                return;
            }
            for (var i = this._handlers[type].length; i >= 0; i--) {
                if (this._handlers[type][i] == handler) {
                    this._handlers[type].splice(i, 1);
                }
            }
        }
        // すべてのイベントハンドラを削除
        clearEventHandler(type: string) {
            this._handlers[type] = [];
        }
        // イベントの発火
        dispatchEvent(e: Event) {
            if (!this._handlers[e.type]) return;
            for (var i = 0; i < this._handlers[e.type].length; i++) {
                var e: Event;
                this._handlers[e.type][i](e);
            }
        }
    }
    export class Event{
        constructor(public type: string) {
        }
    }
}