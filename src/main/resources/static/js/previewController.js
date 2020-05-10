var myCanvas = document.getElementById("grid_canvas");
var convertedImg = document.getElementById("previewImg");

$('#previewModal').on('shown.bs.modal', function () {
    removeGrid()
    var dataURI = myCanvas.toDataURL();
    convertedImg.src = dataURI;
    addGrid()
})

function removeGrid(){
    boundBox.set({stroke: 'transparent'});
    lineX.forEach(line => {
        line.set({stroke: 'transparent'});
    });
    lineY.forEach(line => {
        line.set({stroke: 'transparent'});
    });
    gridCanvas.renderAll();
}

function addGrid(){
    boundBox.set({stroke: '#c0c4c2'});
    lineX.forEach(line => {
        line.set({stroke: '#c0c4c2'});
    });
    lineY.forEach(line => {
        line.set({stroke: '#c0c4c2'});
    });
    gridCanvas.renderAll();
}

function saveImage(e) {
    removeGrid()
    let x = document.getElementById("grid_canvas")

    let image = x.toDataURL()

    var a = document.createElement('a');
    a.href = image;
    a.download = 'map.png';
    a.click()
    addGrid()
}

document.getElementById("save").addEventListener("click", saveImage, false)


