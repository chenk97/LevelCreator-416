//Global variable to be used to indicate the currently selected layers id
var curLayerSelected
var firstLoad = true
var justAddedNewLayer = false
// // Setups the map either isometric or orthogonal and setup grid
// function createMap() {
//     //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//     // Have to Create a canvas in here and use this function in load layer
//
//
//     var project = JSON.parse(localStorage.getItem('project'));
//
//     var mapHeight = parseInt(project.height)
//     var mapWidth = parseInt(project.width)
//     var tileHeight = parseInt(project.tileHeight)
//     var tileWidth = parseInt(project.tileWidth)
//
//     if (project.orientation == "Orthogonal") {
//
//         var canvas = document.getElementById("canvas")
//         canvas.width = mapWidth * tileWidth
//         canvas.height = mapHeight * tileHeight
//
//         var ctx = canvas.getContext('2d')
//         ctx.strokeStyle = 'black'
//         ctx.lineWidth = 1
//         ctx.setLineDash([1, 1]);
//         for (i = tileWidth; i < tileWidth * mapWidth; i = i + tileWidth) {
//
//             ctx.moveTo(i, 0)
//             ctx.lineTo(i, tileHeight * mapHeight)
//             ctx.stroke()
//
//         }
//         for (j = tileHeight; j < tileHeight * mapHeight; j = j + tileHeight) {
//             ctx.moveTo(0, j)
//             ctx.lineTo(tileWidth * mapWidth, j)
//             ctx.stroke()
//         }
//     } else {
//         console.log("Isometric not implemented yet")
//     }
// }
//
// //Draw the map and places any tiles on it
// function drawCanvas() {
//
// }

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

//Creates a layer to be added to layer panel
function createLayer(theLayerId, type, name, visibility) {

    // Change Icon Base On Visibility
    let visIcon
    visIcon = document.createElement("i")
    if (visibility == true) {
        visIcon.setAttribute("class", "fas fa-eye liItems")
    } else {
        visIcon.setAttribute("class", "fas fa-eye-slash liItems")
    }

    // Change Icon Base on Layer or Object Layer
    let typeIcon
    typeIcon = document.createElement("i")
    if (type == "tile") {
        typeIcon.setAttribute("class", "fas fa-th typeIcon")
    } else {
        typeIcon.setAttribute("class", "fas fa-cubes typeIcon")
    }

    // Add Lock Icon
    let lockIcon
    lockIcon = document.createElement("i")
    lockIcon.setAttribute("class", "fas fa-lock-open liItems")

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

//Helps append canvas to canvas div
// function appendCanvas(canvas){
//     let canvasStorage=document.getElementById("canvasStorage")
//
// }

//SetCurrentSelectedLayer loops through all Li elements and checks if li.id equals the layer.id in database. If so change the background of that li and set curLayerSelected to the layerId.
function setCurrentSelectedLayer(layerId) {
    let layerList = document.getElementById("layerList")
    let layer = layerList.getElementsByTagName("li")

    for (let i = 0; i < layer.length; i++) {
        if (layer[i].id != layerId) {
            layer[i].style.backgroundColor = "white"
        } else {
            layer[i].style.backgroundColor = "#a8d1ff"

        }
    }

    console.log("Layer selected with layer Id: " + layerId)
    curLayerSelected = layerId
}

//Function for removing all layers from layer panel
function clearLayerPanel() {
    document.getElementById("layerList").innerHTML = ""
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
        height: project.height,
        width: project.width,
        x: 0,
        y: 0,
    }

    project.nextTiledLayerid += 1
    project.layers.unshift(newTileLayer)
    localStorage.setItem('project', JSON.stringify(project));
    justAddedNewLayer = true
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
        x: 0,
        y: 0,
    }
    project.nextTiledLayerid += 1
    project.layers.unshift(newObjectLayer)
    localStorage.setItem('project', JSON.stringify(project));
    justAddedNewLayer = true
    loadLayer()
}

// Load the layers that the project has
function loadLayer() {
    clearLayerPanel()
    //Get the object from local storage
    let project = JSON.parse(localStorage.getItem('project'));
    let projectLayers = project.layers

    for (let i = 0; i < projectLayers.length; i++) {
        //Creates a li for a layer
        let theLayer = createLayer(projectLayers[i].id, projectLayers[i].type, projectLayers[i].name, projectLayers[i].visibility)
        //Adds a eventlistener for the li when clicked
        theLayer.addEventListener("click", function () {
            setCurrentSelectedLayer(projectLayers[i].id)
        })
        //Appends the li to the ul
        appendLayer(theLayer)

        //Checks if a new layers has been added or if the project was loaded for the first time
        //If so we set the first layers to be the current selected one
        if (justAddedNewLayer == true || firstLoad == true) {
            setCurrentSelectedLayer(projectLayers[0].id)
            justAddedNewLayer = false
            firstLoad = false
        }


        // let canvas = document.createElement("CANVAS");
        // appendCanvas(canvas)
    }
}


loadLayer()