// $(document).ready(function(){
var boundBox;
// var square;
var lineX = [];
var lineY = [];
var lineXN = [];
var lineYN = [];
var gridCanvas;
var groupSelection = false;

function createMap() {
    var mapOrientation = document.getElementById("orientation").value
    var mapWidth = Number(document.getElementById("mapWidth").value)
    var mapHeight = Number(document.getElementById("mapHeight").value)
    var tileWidth = Number(document.getElementById("tileWidth").value)
    var tileHeight = Number(document.getElementById("tileHeight").value)

    var map = {
        orientation: mapOrientation,
        width: mapWidth,
        height: mapHeight,
        tileWidth: tileWidth,
        tileHeight: tileHeight,
        nextTiledLayerid: 2,
        nextObjectId: 1,
        gidCnt:1,
        canvas: null,
        layers: [
            {
                type: "tile",
                id: 1,
                name: "Tile Layer",
                properties: [],
                position: 1,//larger position index on top
                visibility: true,
                locked: false,
                height: mapHeight,
                width: mapWidth,
                x: 0,
                y: 0,
            }
        ],
        tilesets: [
        ]
    };

    localStorage.setItem('map', JSON.stringify(map));

}


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

/////////////// zoom and panning function start from here //////////////////////
var zoomhandler = function(event){
    if(event.e.ctrlKey) {
        event.e.preventDefault();
        event.e.stopPropagation();
        var delta = event.e.deltaY;
        var zoom = gridCanvas.getZoom();
        //greater the divisor the smoother zoom based on mousescroll is
        zoom = zoom + delta / 300;
        //zooms in up to 10 times(1000%)
        if (zoom > 10) zoom = 10;
        //zooms out up to 10%
        if (zoom < 0.10) zoom = 0.10;
        gridCanvas.zoomToPoint({x: event.e.offsetX, y: event.e.offsetY}, zoom);
    }
}


function loadMap(){
    let map = JSON.parse(localStorage.getItem("map"));
    gridCanvas.loadFromJSON(map.canvas, ()=>{
        gridCanvas.renderAll();
    });
}

drawGrids();
loadMap();
gridCanvas.on('mouse:wheel', zoomhandler);