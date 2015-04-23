﻿/// <reference path="sprite.ts"/>
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
        export class Player extends Sprite {
            private gk: GameKey;
            private vx: number;
            constructor(gamekey:GameKey,x: number, y: number, imagemanager: ImageManager, label: string, code: number = 0, dx: number = 1, dy: number = 1) {
                super(x, y, imagemanager, label, code, dx, dy);
                this.gk = gamekey;
                this.vx = 0;
            }
            update() {
                // うごく
                if (this.gk.isDown(39)) {
                    this.vx = this.vx + 2 < 15 ? this.vx + 2 : 15;
                }
                if (this.gk.isDown(37)) {
                    this.vx = this.vx - 2 > -15 ? this.vx - 2 : -15;
                }
                if (!this.gk.isDown(39) && !this.gk.isDown(37)) {
                    if (this.vx > 0) this.vx = this.vx - 1 > 0 ? this.vx - 1 : 0;
                    if (this.vx < 0) this.vx = this.vx + 1 < 0 ? this.vx + 1 : 0;
                }
                this.x += this.vx;
            }
        }
        export class Block extends Sprite {
            constructor(x: number, y: number, imagemanager: ImageManager) {
                super(x, y, imagemanager, "pattern", 20);
            }
        }
        export class Stage extends AbstractState {
            player: Player;
            sprites: Group;
            x: number = 0;
            constructor(name: string, sm: StateMachine) {
                super(name, sm);
                this.sprites = new Group(this.sm.game.screen);
                Sprite.setDefaultGroups([this.sprites]);
                this.player = new Player(this.sm.game.gamekey, 224,128,this.sm.game.assets.image,"pattern",100);
                new Block(256, 160,this.sm.game.assets.image);
            }
            enter() {
                console.log(this.name);
            }
            update() {
                // 背景色で埋めてみる
                this.sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                this.sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);

                this.sprites.update();
                this.sprites.draw();

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