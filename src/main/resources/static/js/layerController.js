import {addTransactions} from "./redoAndUndo.js";

// Global variable to be used to indicate the currently selected layers id
var curLayerSelected
var firstLoad = true
var justAddedNewLayer = false

//Change the name of layer
function changeLayerName(theLayerId) {

    let project = JSON.parse(localStorage.getItem('project'));
    let projectLayers = project.layers
    for (let x = 0; x < projectLayers.length; x++) {
        if (projectLayers[x].id == theLayerId) {
            console.log("hi")
            projectLayers[x].name = event.target.value
        }
    }
    project.layers = projectLayers
    localStorage.setItem('project', JSON.stringify(project));
}

//Change layer visibility status
function changeVisbility(layerId) {
    let project = JSON.parse(localStorage.getItem('project'));
    let projectLayers = project.layers

    for (let x = 0; x < projectLayers.length; x++) {
        if (projectLayers[x].id == layerId) {
            projectLayers[x].visibility = (projectLayers[x].visibility == true) ? false : true
        }
    }
    project.layers = projectLayers
    localStorage.setItem('project', JSON.stringify(project));
    loadLayer()
}

//Change layer lock status
function changeLockStatus(layerId) {
    let project = JSON.parse(localStorage.getItem('project'));
    let projectLayers = project.layers

    for (let x = 0; x < projectLayers.length; x++) {
        if (projectLayers[x].id == layerId) {
            projectLayers[x].locked = (projectLayers[x].locked == false) ? true : false
        }
    }
    project.layers = projectLayers
    localStorage.setItem('project', JSON.stringify(project));
    loadLayer()
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

//Delete the current that is selected base on the global variable curLayerSelected
function deleteLayer() {

    if (curLayerSelected == undefined) {
        console.log("No layer was selected")
        return
    }

    let project = JSON.parse(localStorage.getItem('project'));
    let projectLayers = project.layers

    for (let y = 0; y < projectLayers.length; y++) {

        if (projectLayers[y].id == curLayerSelected) {
            projectLayers.splice(y, 1)
            console.log("Layer deleted sucessfully!")
        }
    }
    project.layers = projectLayers
    localStorage.setItem('project', JSON.stringify(project));
    addTransactions("layer")
    loadLayer()
}

//Adds a new tile layer to layer panel
function newTileLayer() {
    let project = JSON.parse(localStorage.getItem('project'));
    var dataArray = new Array(project.width * project.height).fill(0)
    let newTileLayer = {
        type: "tile",
        id: project.nextTiledLayerid,
        name: "Tile Layer",
        data: dataArray,
        properties: [],
        visibility: true,
        locked: false,
        height: project.height,
        width: project.width,
        x: 0,
        y: 0,
    }

    project.nextTiledLayerid += 1
    project.layers.unshift(newTileLayer)
    localStorage.setItem('project', JSON.stringify(project));
    justAddedNewLayer = true
    addTransactions("layer")
    loadLayer()
}

//Adds a new object layer to layer panel
function newObjectLayer() {
    let project = JSON.parse(localStorage.getItem('project'));
    let newObjectLayer = {
        type: "object",
        id: project.nextTiledLayerid,
        name: "Object Layer",
        objects: [],
        visibility: true,
        locked: false,
        x: 0,
        y: 0,
    }
    project.nextTiledLayerid += 1
    project.layers.unshift(newObjectLayer)
    localStorage.setItem('project', JSON.stringify(project));
    justAddedNewLayer = true
    addTransactions("layer")
    loadLayer()
}

//Function for removing all layers from layer panel
function clearLayerPanel() {
    document.getElementById("layerList").innerHTML = ""
}

//Function for removing everything that is on the canvas
function clearCanvas() {
    let x = document.getElementById("canvas")
    let context = x.getContext('2d');
    context.clearRect(0, 0, x.width, x.height)
}

// Load the layers that the project has
export function loadLayer() {

    clearLayerPanel()
    //Get the object from local storage
    let project = JSON.parse(localStorage.getItem('project'));
    let projectLayers = project.layers

    for (let i = 0; i < projectLayers.length; i++) {
        //Creates a li for a layer
        let theLayer = createLayer(projectLayers[i].id, projectLayers[i].type, projectLayers[i].name, projectLayers[i].visibility, projectLayers[i].locked)

        //Adds a eventlistener for the li when clicked
        theLayer.addEventListener("click", function () {
            setCurrentSelectedLayer(projectLayers[i].id)
        })

        //Appends the li to the ul
        appendLayer(theLayer)

        //Checks if a new layers has been added or if the project was loaded for the first time
        //If so we set the first layers to be the current selected one
        if (justAddedNewLayer == true || firstLoad == true) {
            if(firstLoad==true){
                addTransactions("layer")
            }
            setCurrentSelectedLayer(projectLayers[0].id)
            justAddedNewLayer = false
            firstLoad = false
        }
    }
}

document.getElementById("addTileLayer").addEventListener("click",newTileLayer)
document.getElementById("addObjectLayer").addEventListener("click",newObjectLayer)
document.getElementById("deleteLayer").addEventListener("click",deleteLayer)

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// CODE FROM HERE ON DEALS WITH MAPS
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//Draws out the grids for orthogonal map
function initializeMapGridForOrth(mapHeight, mapWidth, tileHeight, tileWidth) {

    var canvas = document.getElementById("canvas")
    canvas.width = mapWidth * tileWidth
    canvas.height = mapHeight * tileHeight

    var ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1
    ctx.setLineDash([1, 1]);

    for (let i = tileWidth; i < tileWidth * mapWidth; i = i + tileWidth) {

        ctx.moveTo(i, 0)
        ctx.lineTo(i, tileHeight * mapHeight)
        ctx.stroke()

    }
    for (let j = tileHeight; j < tileHeight * mapHeight; j = j + tileHeight) {
        ctx.moveTo(0, j)
        ctx.lineTo(tileWidth * mapWidth, j)
        ctx.stroke()
    }
}

function initializeMapGridForIso(mapHeight, mapWidth, tileHeight, tileWidth){
    var canvas = document.getElementById("canvas")
    canvas.width = mapWidth * tileWidth *2
    canvas.height = mapHeight * tileHeight *2

    var ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1
    ctx.setLineDash([1, 1]);

    for (let i = 0; i < mapWidth; i++) {
        for (let j = 0; j < mapHeight; j++) {
            // calculate coordinates
            var init_xPos = canvas.width/2
            var init_yPos = tileHeight
            var x = (i-j) * tileWidth / 2 + init_xPos
            var y = (i+j) * tileHeight / 2 + init_yPos

            // begin drawing
            ctx.beginPath()

            // move to start point
            ctx.moveTo(x - tileWidth / 2, y)

            /**
             *  need to draw each diamond shaped tile
             *   /\
             *   \/
             */

            //draws '/' on top
            ctx.lineTo(x - tileWidth, y + tileHeight / 2)
            //draws '\' on bottom
            ctx.lineTo(x - tileWidth / 2, y + tileHeight)
            //draws '/' on bottom
            ctx.lineTo(x, y + tileHeight / 2)
            //draws '\' on top
            ctx.lineTo(x - tileWidth / 2,  y)

            // draw path
            ctx.stroke()
        }
    }

}
// Setups the map either isometric or orthogonal and setup grid
function createMap() {
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Have to Create a canvas in here and use this function in load layer
    clearCanvas()
    var project = JSON.parse(localStorage.getItem('project'));
    var porjectLayers = project.layers

    var mapHeight = parseInt(project.height)
    var mapWidth = parseInt(project.width)
    var tileHeight = parseInt(project.tileHeight)
    var tileWidth = parseInt(project.tileWidth)

    if (project.orientation == "Orthogonal") {

        initializeMapGridForOrth(mapHeight, mapWidth, tileHeight, tileWidth)

    }  else if(project.orientation=="Isometric"){

        initializeMapGridForIso(mapHeight, mapWidth, tileHeight, tileWidth)

    }  else{

        console.log("Some error has occurred")

    }

}

createMap()
loadLayer()

