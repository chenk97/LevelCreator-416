// $(document).ready(function(){
var boundBox;
// var square;
var lineX = [];
var lineY = [];
var lineXN = [];
var lineYN = [];
var gridCanvas;
var groupSelection = false;

function drawGrids(){
    let map = JSON.parse(localStorage.getItem('map'));
    let tileW = map.tileWidth;
    let tileH = map.tileHeight;
    gridCanvas = new fabric.Canvas('grid_canvas',{
        width: window.outerWidth,
        height: window.outerHeight,
    });
    // console.log(gridCanvas);
    boundBox = new fabric.Rect({
        width: map.width * map.tileWidth,
        height: map.height *map.tileHeight,
        fill: "transparent",
        stroke: "#EAEAEA",
        hasBorders: false,
        selectable: false,
        hasControl: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
    });

    gridCanvas.add(boundBox);

    gridCanvas.centerObject(boundBox);

    // square = new fabric.Rect({
    //     top: boundBox.top,
    //     left: boundBox.left,
    //     width: tileW,
    //     height: tileH,
    //     fill:'red',
    // });
    //
    // gridCanvas.add(square);

    //vertical lines
    for(let i = 0; i < map.width; i++){
        let l = boundBox.left + ((map.tileWidth) * i);
        let t = boundBox.top;
        let b = boundBox.top + boundBox.height;

        lineY.push(new fabric.Line([l,t,l, b],{
            stroke: "#EAEAEA",
            hasBorders: false,
            selectable: false,
            hasControl: false,
            lockMovementX: true,
            lockMovementY: true,
        }));

        lineXN.push(l);//all left value
    }

//add horizontal lines to canvas
    lineY.forEach((line)=>{
        gridCanvas.add(line);
    });

//horizontal lines
    for(let i = 0; i < map.height; i++){
        let t = boundBox.top + ((map.tileHeight) * i);
        let l = boundBox.left;
        let r = boundBox.left + boundBox.width;

        lineX.push(new fabric.Line([l,t,r,t],{
            stroke: "#EAEAEA",
            hasBorders: false,
            selectable: false,
            hasControl: false,
        }));

        lineYN.push(t);//all top value
    }

//add horizontal lines to canvas
    lineX.forEach((line)=>{
        gridCanvas.add(line);
    });

}




function loadMap(){
    let map = JSON.parse(localStorage.getItem("map"));
    gridCanvas.loadFromJSON(map.canvas, ()=>{
        gridCanvas.renderAll();
    });
}


// });


// function addLayer(){
//
//
// }


drawGrids();
// loadLayer();
loadMap();

