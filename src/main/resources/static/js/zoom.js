var box = document.getElementById('canvasStorage').getElementsByTagName('canvas');
var canvas = document.getElementById('canvas');

var scale = 1;

function zoom(e){
    e.preventDefault();
    var wheeldir = (e.deltaY > 0) ? -0.1: 0.1;
    scale += wheeldir;
    for (var i = 0; i< box.length; i++) {
        box[i].style.transform = 'scale(' + scale + ')';
    }
}

/////need to implement a better function to pan the zoomed map/////
function move(e){
    canvas.style.position = 'absolute';
    canvas.style.top = e.clientY + 'px';
    canvas.style.left = e.clientX + 'px';
}

function mouseDown(e){
    window.addEventListener('mousemove',move);
}

function mouseUp(e){
    window.removeEventListener('mousemove',move);
}

function addListeners(){
    canvas.addEventListener('wheel',zoom);
    canvas.addEventListener('mousedown',mouseDown);
    window.addEventListener('mouseup',mouseUp);

}

window.onload = addListeners;