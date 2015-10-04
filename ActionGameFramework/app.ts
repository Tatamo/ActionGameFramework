
window.onload = () => {
    var el = document.getElementById('content');
    var s = new Game.Surface(512, 320);
    el.appendChild(s.container);
    
    s.drawArc("black", 32, 32, 16, 0, Math.PI*1.5, 1);
    s.drawCircle("red", 256, 128, 32);
    s.drawEllipse("purple", 64, 128, 96, 64);
    s.drawEllipse("black", 64+16, 128+16, 96, 64, 1);
    s.drawLine("green", 384, 64, 480, 96);
    s.drawLines("green", [32, 32, 64, 32, 64, 64, 48, 96, 32, 64], 3);
    s.drawRect("blue", 128, 128, 64, 32);
    s.drawPolygon("rgba(0,255,0,0.5)", [128, 64, 256, 64, 128, 160]);
    s.drawCircle("yellow", 256 + 32, 128, 32 - 8, 16);
    s.rotate(30 * Math.PI / 360)
        .flip(true, false)
        .scale(0.8, 1.2);
    s.drawRect("black", 32, 32, 320, 256, 2);
};