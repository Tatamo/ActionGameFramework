﻿/// <reference path="./out.d.ts"/>
/// <reference path="./src/states/preload.ts"/>

var game: Game.Core;
window.onload = () => {
    var el = document.getElementById('content');

    var map = [
        "aa..........................................................",
        "a...........................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................999.............",
        "............................................999.............",
        "............................................................",
        "............................................aaa.............",
        "............................................................",
        "............................................................",
        "...............................99...........................",
        "............................................................",
        "............................................................",
        ".....A.......B..............................................",
        "...12aa....BaaB.....12.....9.9...aaa.....aa.aaaaaaaa...12...",
        "..........Baaaa...........aaaaa..............9.aaaaa........",
        ".........aaaaa..........................B...aaaaaaaa........",
        "....9.9.............................aaaaa...9.9aa999........",
        "....aaa...............B.............9.9.9...aaaaaaaa........",
        "...........aaaaaa..aaaaaa....................9.aaaaa........",
        "..........aaaaaaa..aaaaaa............D......aaaaaaaa........",
        "bbbbbbbbbbbbbbbbb..bbbbbb.bbbbbbbbbbbbbbbbbbbbbbbbbb5bbbbbb.",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "...12....12.....12.....12....12....12.......................",
        "............................................................",
        "............................................................",
        "...................O........................................",
        ".................aaaa...................feef................",
        ".............aaaaaaaaaaa................e..e..............E.",
        "..........O..aaaaaaaaaaa.O.....O........feefeef..feeeefeeeef",
        "..bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.......e..e..e..e....e....e",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "............................................................",
        "........................................................8...",
        "..................99........12.....12....12....12.......a...",
        "..................dd...................................aaa..",
        "..e.ef...................9.9.9.9......................aaaaa.",
        "..e..e.............................................F.aaaaaaa",
        "..e..e.......E..............................aaaaaaaaaaaaaaaa",
        "..e..e.feeefeeef..99...................F....aaaaaaaaaaaaaaaa",
        "..feef.e...e...e..dd...aaaaaaaaaaaaaaaaaaa..aaaaaaaaaaaaaaaa"
    ]
    var images: { [key: string]: any; } = {
        "gameover": "gameover.gif",
        "title": "title.gif",
        "pattern": "pattern.gif"
    };
    game = new Game.Game({map:map,images:images});
    game.setparent(el);
    game.start(new Game.States.Preload());
};