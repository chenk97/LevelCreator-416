// $(document).ready(function(){
var boundBox;
//var canvas = document.getElementById("grid_canvas");
var parentw = document.getElementById("canvasStorage").clientWidth;
var parenth = document.getElementById("canvasStorage").clientHeight;

// var square;
var lineX = [];
var lineY = [];
var lineXN = [];
var lineYN = [];
var gridCanvas;

function createMap() {
    var mapOrientation = document.getElementById("orientation").value;
    var mapWidth = Number(document.getElementById("mapWidth").value);
    var mapHeight = Number(document.getElementById("mapHeight").value);
    var tileWidth = Number(document.getElementById("tileWidth").value);
    var tileHeight = Number(document.getElementById("tileHeight").value);

    var map = {
        orientation: mapOrientation,
        width: mapWidth,
        height: mapHeight,
        tileWidth: tileWidth,
        tileHeight: tileHeight,
        nextLayerid: 2,
        nextObjectId: 1,
        gidCnt:1,
        canvas: null,
        layers: [
            {
                type: "tile",
                id: 1,
                name: "Tile Layer1",
                properties: [],
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
    gridCanvas = new fabric.Canvas('grid_canvas');
    gridCanvas.preserveObjectStacking = true;
    gridCanvas.setWidth(parentw);
    gridCanvas.setHeight(parenth);
    // console.log(gridCanvas);
    boundBox = new fabric.Rect({
        width: map.width * map.tileWidth,
        height: map.height *map.tileHeight,
        fill: "transparent",
        stroke: "#c0c4c2",
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
            stroke: "#c0c4c2",
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
            stroke: "#c0c4c2",
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
var zoomhandler = function(event) {
    if (event.e.ctrlKey) {
        event.e.preventDefault();
        event.e.stopPropagation();
        var delta = event.e.deltaY;
        var zoom = gridCanvas.getZoom();
        //greater the divisor the smoother zoom based on mousescroll is
        zoom = zoom + delta / 200;
        //zooms in up to 10 times(1000%)
        if (zoom > 10) zoom = 10;
        //zooms out up to 10%
        if (zoom < 0.10) zoom = 0.10;
        gridCanvas.zoomToPoint({x: event.e.offsetX, y: event.e.offsetY}, zoom);
        var vpt = gridCanvas.viewportTransform;
        //if zoomed out all the way
        if (zoom < 400 / gridCanvas.width) {
            //return the grid to the center of the canvas
            gridCanvas.viewportTransform[4] =  (gridCanvas.width/2) - gridCanvas.width * zoom / 2;
            gridCanvas.viewportTransform[5] = (gridCanvas.height/2) - gridCanvas.height * zoom / 2;
        } else {
            //panning left and right
            if (vpt[4] >= 0) {
                //going left
                gridCanvas.viewportTransform[4] = 0;
            } else if (vpt[4] < gridCanvas.width - gridCanvas.width * zoom) {
                gridCanvas.viewportTransform[4] = gridCanvas.width - (gridCanvas.width * zoom);
            }
            //panning up and down
            if (vpt[5] >= 0) {
                //going up
                gridCanvas.viewportTransform[5] = 0;
            } else if (vpt[5] < gridCanvas.height - gridCanvas.height * zoom) {
                gridCanvas.viewportTransform[5] = gridCanvas.height- (gridCanvas.height * zoom);
            }

        }
    }
};

function loadMap(){
    let map = JSON.parse(localStorage.getItem("map"));
    gridCanvas.loadFromJSON(map.canvas, ()=>{
        gridCanvas.renderAll();
    });
}

drawGrids();
loadMap();
gridCanvas.on('mouse:wheel', zoomhandler);

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
