var box = document.getElementById('canvasStorage').getElementsByTagName('canvas');
var myCanvas = document.getElementById('grid_canvas');

var scale = 1;
function zoom(e){
    e.preventDefault();
    var wheeldir = (e.deltaY > 0) ? -0.1 : 0.1;
    scale += wheeldir;
    for (var i = 0; i < box.length; i++) {
        box[i].style.transform = 'scale(' + scale + ')';
    }
}

function addListener() {
    myCanvas.addEventListener('wheel', zoom);
}

window.onload = addListener;



gridCanvas.on('mouse:down', function(event) {
    if (event.e.altKey) {
        var evt = event.e;
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
    }
});
gridCanvas.on('mouse:move', function(event) {
    if (this.isDragging) {
        var evt = event.e;
        this.viewportTransform[4] += evt.clientX - this.lastPosX;
        this.viewportTransform[5] += evt.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
    }
});
gridCanvas.on('mouse:up', function(event) {
    this.isDragging = false;
    this.selection = true;
});
