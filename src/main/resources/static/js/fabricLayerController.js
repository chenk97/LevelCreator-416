// $(document).ready(function(){
var boundBox;
// var square;
var lineX = [];
var lineY = [];
var lineXN = [];
var lineYN = [];
var gridCanvas;
var curLayerSelected;
var firstLoad = true;
var justAddedNewLayer = false;



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



function loadLayer() {
    clearLayerPanel()
    //Get the object from local storage
    let map = JSON.parse(localStorage.getItem('map'));
    let mapLayers = map.layers

    for (let i = 0; i < mapLayers.length; i++) {
        //Creates a li for a layer
        let theLayer = createLayer(mapLayers[i].id, mapLayers[i].type, mapLayers[i].name, mapLayers[i].visibility, mapLayers[i].locked)

        //Adds a eventlistener for the li when clicked
        theLayer.addEventListener("click", function () {
            setCurrentSelectedLayer(mapLayers[i].id);
        });

        //Appends the li to the ul
        appendLayer(theLayer)

        //Checks if a new layers has been added or if the map was loaded for the first time
        //If so we set the first layers to be the current selected one
        if (justAddedNewLayer == true || firstLoad == true) {
            setCurrentSelectedLayer(mapLayers[0].id);
            justAddedNewLayer = false;
            firstLoad = false;
        }
    }
}


//Function for removing all layers from layer panel
function clearLayerPanel() {
    document.getElementById("layerList").innerHTML = ""
}


//SetCurrentSelectedLayer loops through all Li elements and checks if li.id equals the layer.id in database. If so change the background of that li and set curLayerSelected to the layerId.
function setCurrentSelectedLayer(layerId) {
    let layerList = document.getElementById("layerList")
    let layer = layerList.getElementsByTagName("li")

    for (let i = 0; i < layer.length; i++) {
        layer[i].id != layerId ? layer[i].style.backgroundColor = "white" : layer[i].style.backgroundColor = "#a8d1ff"
    }

    console.log("Layer selected with layer Id: " + layerId)
    curLayerSelected = layerId
}


//Creates a layer to be added to layer panel
function createLayer(theLayerId, type, name, visibility, locked) {

    // Change Icon Base On Visibility
    let visIcon = document.createElement("i")
    visibility == true ? visIcon.setAttribute("class", "fas fa-eye liItems") : visIcon.setAttribute("class", "fas fa-eye-slash liItems")

    visIcon.addEventListener("click", function () {
        changeVisbility(theLayerId)
    })

    // Change Icon Base on Layer or Object Layer
    let typeIcon = document.createElement("i")
    type == "tile" ? typeIcon.setAttribute("class", "fas fa-th typeIcon") : typeIcon.setAttribute("class", "fas fa-cubes typeIcon")

    // Add Lock Icon
    let lockIcon = document.createElement("i")
    locked == false ? lockIcon.setAttribute("class", "fas fa-lock-open liItems") : lockIcon.setAttribute("class", "fas fa-lock liItems")
    lockIcon.addEventListener("click", function () {
        changeLockStatus(theLayerId)
    })

    //Create Li Element
    let li = document.createElement("li");
    li.setAttribute("class", "list-group-item liTag")
    li.setAttribute("id", theLayerId)


    // Create Input Element
    let x = document.createElement("INPUT")
    x.setAttribute("type", "text")
    x.setAttribute("value", name)
    x.setAttribute("class", "liInputTag")

    //Event Listener for changing layer name
    x.addEventListener("input", function () {
        changeLayerName(theLayerId)
    })

    li.appendChild(typeIcon)
    li.appendChild(x)
    li.appendChild(visIcon)
    li.appendChild(lockIcon)

    return li
}

//Helps append layer to layer panel
function appendLayer(layer) {
    let layerList = document.getElementById("layerList")
    layerList.appendChild(layer)
}


//Function for removing everything that is on the canvas
function clearCanvas() {
    let x = document.getElementById("canvas")
    let context = x.getContext('2d');
    context.clearRect(0, 0, x.width, x.height)
}



//Adds a new tile layer to layer panel
function newTileLayer() {
    let map = JSON.parse(localStorage.getItem('map'));
    var dataArray = new Array(map.width * map.height).fill(0)
    let newTileLayer = {
        type: "tile",
        id: map.nextTiledLayerid,
        name: "Tile Layer",
        data: dataArray,
        properties: [],
        visibility: true,
        locked: false,
        height: map.height,
        width: map.width,
        x: 0,
        y: 0,
    };

    map.nextTiledLayerid += 1;
    map.layers.unshift(newTileLayer);
    localStorage.setItem('map', JSON.stringify(map));
    justAddedNewLayer = true;
    loadLayer()
}

//Adds a new object layer to layer panel
function newObjectLayer() {
    let map = JSON.parse(localStorage.getItem('map'));
    let newObjectLayer = {
        type: "object",
        id: map.nextTiledLayerid,
        name: "Object Layer",
        objects: [],
        visibility: true,
        locked: false,
        x: 0,
        y: 0,
    };
    map.nextTiledLayerid += 1;
    map.layers.unshift(newObjectLayer);
    localStorage.setItem('map', JSON.stringify(map));
    justAddedNewLayer = true;
    loadLayer()
}


//Delete the current that is selected base on the global variable curLayerSelected
function deleteLayer() {

    if (curLayerSelected == undefined) {
        console.log("No layer was selected")
        return
    }

    let map = JSON.parse(localStorage.getItem('map'));
    let mapLayers = map.layers

    for (let y = 0; y < mapLayers.length; y++) {

        if (mapLayers[y].id == curLayerSelected) {
            mapLayers.splice(y, 1)
            console.log("Layer deleted sucessfully!")
        }
    }
    map.layers = mapLayers
    localStorage.setItem('map', JSON.stringify(map));
    loadLayer()
}


//Change the name of layer
function changeLayerName(theLayerId) {

    let map = JSON.parse(localStorage.getItem('map'));
    let mapLayers = map.layers
    for (let x = 0; x < mapLayers.length; x++) {
        if (mapLayers[x].id == theLayerId) {
            console.log("hi")
            mapLayers[x].name = event.target.value
        }
    }
    map.layers = mapLayers
    localStorage.setItem('map', JSON.stringify(map));
}

//Change layer visibility status
function changeVisbility(layerId) {
    let map = JSON.parse(localStorage.getItem('map'));
    let mapLayers = map.layers

    for (let x = 0; x < mapLayers.length; x++) {
        if (mapLayers[x].id == layerId) {
            mapLayers[x].visibility = (mapLayers[x].visibility == true) ? false : true
        }
    }
    map.layers = mapLayers
    localStorage.setItem('map', JSON.stringify(map));
    loadLayer()
    createMap()
}

//Change layer lock status
function changeLockStatus(layerId) {
    let map = JSON.parse(localStorage.getItem('map'));
    let mapLayers = map.layers

    for (let x = 0; x < mapLayers.length; x++) {
        if (mapLayers[x].id == layerId) {
            mapLayers[x].locked = (mapLayers[x].locked == false) ? true : false
        }
    }
    map.layers = mapLayers
    localStorage.setItem('map', JSON.stringify(map));
    loadLayer()
}


function loadMap(){
    let map = JSON.parse(localStorage.getItem("map"));
    for(let i = 0; i< map.layers.length; i++){
        let layer = map.layers[i];
        for(let j = 0; j<layer.data.length; j++){
            let obj = layer.data[j];
            new fabric.Image.fromURL(obj.src, function(im) {
                im.scaleToWidth(tileW);
                im.scaleToHeight(tileH);
                gridCanvas.add(im);
                im.set({
                    top: obj.top,
                    left: obj.left,
                    selectable: true,
                    hasControls: false,
                });
                im.lockScalingX = true;
                im.lockScalingY = true;
                im.setCoords();

            });
        }
    }
}


// });


// function addLayer(){
//
//
// }


drawGrids();
loadLayer();
loadMap();

