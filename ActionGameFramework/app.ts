
window.onload = () => {
    var el = document.getElementById('content');
    var g = new Game.Graphics.Graphics(512, 320);
    el.appendChild(g.canvas);
    
    g.drawArc("black", 32, 32, 16, 0, Math.PI*1.5, 1);
    g.drawCircle("red", 256, 128, 32);
    g.drawEllipse("purple", 64, 128, 96, 64);
    g.drawEllipse("black", 64+16, 128+16, 96, 64, 1);
    g.drawLine("green", 384, 64, 480, 96);
    g.drawLines("green", [32, 32, 64, 32, 64, 64, 48, 96, 32, 64], 3);
    g.drawRect("blue", 128, 128, 64, 32);
    g.drawPolygon("rgba(0,255,0,0.5)", [128, 64, 256, 64, 128, 160]);
    g.drawCircle("yellow", 256+32, 128, 32 - 8, 16);
    
};