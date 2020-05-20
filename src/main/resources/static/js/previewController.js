var myCanvas = document.getElementById("grid_canvas");
var convertedImg = document.getElementById("previewImg");

$('#previewModal').on('shown.bs.modal', function () {
    gridCanvas.discardActiveObject();
    gridCanvas.setViewportTransform([1,0,0,1,0,0]);
    removeGrid()

    var dataURI = myCanvas.toDataURL();
    convertedImg.src = dataURI;
    addGrid()

})

function removeGrid(){
    let map = JSON.parse(localStorage.getItem("map"));
    boundBox.set({stroke: 'transparent'});
    if(map.orientation === "Orthogonal"){
        lineX.forEach(line => {
            line.set({stroke: 'transparent'});
        });
        lineY.forEach(line => {
            line.set({stroke: 'transparent'});
        });
    }else if(map.orientation === "Isometric"){
        isoLines.forEach(line => {
            line.set({stroke: 'transparent'});
        });
    }
    gridCanvas.renderAll();
}

function addGrid(){
    let map = JSON.parse(localStorage.getItem("map"));
    boundBox.set({stroke: '#c0c4c2'});
    if(map.orientation === "Orthogonal"){
        lineX.forEach(line => {
            line.set({stroke: '#c0c4c2'});
        });
        lineY.forEach(line => {
            line.set({stroke: '#c0c4c2'});
        });
    }else if(map.orientation === "Isometric"){
        isoLines.forEach(line => {
            line.set({stroke: '#c0c4c2'});
        });
    }
    gridCanvas.renderAll();
}


function saveImage(e) {
    gridCanvas.discardActiveObject();
    gridCanvas.setViewportTransform([1,0,0,1,0,0]);
    removeGrid()
    let x = document.getElementById("grid_canvas")

    let image = x.toDataURL()

    var a = document.createElement('a');
    a.href = image;
    a.download = 'map.png';
    a.click()
    addGrid()
}
/*
function exportMap(){
    var mapJson = localStorage.getItem('map');
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mapJson));
    console.log(dataStr);
    var a = document.createElement('a');
    a.href = 'data:' + dataStr;
    a.download = 'map.json';
    a.click()
}*/

document.getElementById("save").addEventListener("click", saveImage, false);
//document.getElementById("download").addEventListener("click", exportMap);


