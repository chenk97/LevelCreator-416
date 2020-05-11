var box = document.getElementById('canvasStorage');
var x = document.getElementById('testGirdy');

var scale = 1;
function zoom(e) {

    if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        var wheeldir = (e.deltaY > 0) ? -0.1 : 0.1;
        scale += wheeldir;
        x.style.transform = 'scale(' + scale + ')';

    }
}

box.addEventListener('wheel', zoom);
