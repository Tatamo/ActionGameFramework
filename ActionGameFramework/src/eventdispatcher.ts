﻿module Game {
    export interface IEventDispatcher {
        addEventHandler(type: string, handler: (e: Event) => void);
        addOnceEventHandler(type: string, handler: (e: Event) => void);
        removeEventHandler(type: string, handler: (e: Event) => void);
        clearEventHandler(type: string);
        dispatchEvent(e: Event);
    }

    // TODO:thisのバインド関係の改善
    export class EventDispatcher implements IEventDispatcher {
        private _handlers: { [key: string]: Array<(e: Event) => void> };
        private _oncehandlers: { [key: string]: Array<(e: Event) => void> };
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
        // 一度呼ばれると消えるイベントハンドラの追加
        addOnceEventHandler(type: string, handler: (e: Event) => void) {
            if (!this._oncehandlers[type]) {
                this._oncehandlers[type] = [handler.bind(this)];
            }
            else {
                this._oncehandlers[type].push(handler.bind(this));
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
            for (var i = this._oncehandlers[type].length; i >= 0; i--) {
                if (this._oncehandlers[type][i] == handler) {
                    this._oncehandlers[type].splice(i, 1);
                }
            }
        }
        // すべてのイベントハンドラを削除
        clearEventHandler(type: string) {
            this._handlers[type] = [];
            this._oncehandlers[type] = [];
        }
        // イベントの発火 ちなみに揮発性のイベントのほうが後に呼ばれる
        dispatchEvent(e: Event) {
            if (!this._handlers[e.type]) return;
            for (var i = 0; i < this._handlers[e.type].length; i++) {
                var e: Event;
                this._handlers[e.type][i](e);
            }
            for (var i = 0; i < this._oncehandlers[e.type].length; i++) {
                var e: Event;
                this._oncehandlers[e.type][i](e);
            }
        }
    }
    export class Event{
        constructor(public type: string) {
        }
    }
}