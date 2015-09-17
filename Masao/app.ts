﻿/// <reference path="./out.d.ts"/>
/// <reference path="./src/states/preload.ts"/>

var game: Game.Game;
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
        "a...aa.aaa.....................99...........................",
        "aa.aaa.......................................aa.............",
        "a...6..a.a...................................a..............",
        "a..5........................................................",
        "a.aaaaa.aaa.........12.....9.9...aaa.....aa.aaaaaaaa...12...",
        "a....aa.a....B............aaaaa..............9.aaaaa........",
        "aaaa.a..aaaaaa......aa..................B...aaaaaaaa........",
        "8......aa...........a...............aaaaa...9.9aa999........",
        "..aaaaaa7......E....................9.9.9...aaaaaaaa........",
        "...........aaaaaa..aaaaaa....................9.aaaaa........",
        ".A.33.....aaaaaaa..aaaaaa............D......aaaaaaaa........",
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
    var images: { [key: string]: any; } = { // TODO: preload.tsで定義しているのにどうしてここで同じことを書かないといけないの？
        "gameover": "gameover.gif",
        "ending": "ending.gif",
        "title": "title.gif",
        "pattern": "pattern.gif"
    };
    game = new Game.Game({map:map,images:images});
    game.setparent(el);
    game.start(new Game.States.Preload());
};