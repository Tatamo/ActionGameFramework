/// <reference path="./out.d.ts"/>
/// <reference path="./src/states/preload.ts"/>

var game: Game.Game;
window.onload = () => {
    var el = document.getElementById('content');
    game = new Game.Game();
    game.setparent(el);
    game.start(new Game.States.Preload());
};