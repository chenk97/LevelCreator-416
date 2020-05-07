//Global variable to be used to indicate the currently selected layers id
import {addTransactions} from "./redoAndUndo.js";

export var curLayerSelected
var firstLoad = true
var justAddedNewLayer = false

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

    let propertyIcon = document.createElement("i")
    propertyIcon.setAttribute("class", "fas fa-th-list")
    propertyIcon.addEventListener("click", function () {
        $("#propertyPanelModal").modal({show: true})
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
    li.appendChild(propertyIcon)

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
    loadLayerProperty(layerId)
    curLayerSelected = layerId
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
    addTransactions("layer")
    loadLayer()
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
    }

    map.nextTiledLayerid += 1
    map.layers.unshift(newTileLayer)
    localStorage.setItem('map', JSON.stringify(map));
    justAddedNewLayer = true
    addTransactions("layer")
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
        properties: [],
        visibility: true,
        locked: false,
        x: 0,
        y: 0,
    }
    map.nextTiledLayerid += 1
    map.layers.unshift(newObjectLayer)
    localStorage.setItem('map', JSON.stringify(map));
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
    let map = JSON.parse(localStorage.getItem('map'));
    let mapLayers = map.layers

    for (let i = 0; i < mapLayers.length; i++) {
        //Creates a li for a layer
        let theLayer = createLayer(mapLayers[i].id, mapLayers[i].type, mapLayers[i].name, mapLayers[i].visibility, mapLayers[i].locked)

        //Adds a eventlistener for the li when clicked
        theLayer.addEventListener("click", function () {
            setCurrentSelectedLayer(mapLayers[i].id)
        })


        //Appends the li to the ul
        appendLayer(theLayer)

        //Checks if a new layers has been added or if the project was loaded for the first time
        //If so we set the first layers to be the current selected one
        if (justAddedNewLayer == true || firstLoad == true) {
            if (firstLoad == true) {
                addTransactions("layer")
            }
            setCurrentSelectedLayer(mapLayers[0].id)
            justAddedNewLayer = false
            firstLoad = false
        }
    }
}

document.getElementById("addTileLayer").addEventListener("click", newTileLayer)
document.getElementById("addObjectLayer").addEventListener("click", newObjectLayer)
document.getElementById("deleteLayer").addEventListener("click", deleteLayer)


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// CODE FROM HERE ON DEALS WITH PROPERTIES
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//Reset the property list
function resetPropertyList() {
    document.getElementById("propertyList").innerHTML = ""
}

// Reset the name input and drop down to default value
function resetNewPropertyModal() {
    document.getElementById('addNewPropertyButton').disabled = true;
    document.getElementById("newPropertyName").value = ""
    document.getElementById("newPropertyType").value = "bool"
}

//Checks if the property name the user is trying to add already exist or not for that layer
function checkIfPropertyNameExist(name) {
    let map = JSON.parse(localStorage.getItem('map'));
    let mapLayer = map.layers
    let currentLayerProperties

    for (let p = 0; p < mapLayer.length; p++) {
        if (mapLayer[p].id == curLayerSelected) {
            currentLayerProperties = mapLayer[p].properties
        }
    }

    for (let x = 0; x < currentLayerProperties.length; x++) {
        if (currentLayerProperties[x].name == name) {
            return true
        }
    }
    return false
}


// Adds a new property to current selected layer
function addNewProperty() {

    let name = document.getElementById("newPropertyName").value
    let nameExist = checkIfPropertyNameExist(name) // Checks if name exist already or not. True if exist and false if doesnt exist
    if (nameExist == true) {
        console.log("Property name already exist!")
        return
    }
    let type = document.getElementById("newPropertyType").value
    let value = ""
    if (type == "bool") {
        value = false
    }
    if (type == "number") {
        value = 0
    }

    let newProperty = {
        name: name,
        type: type,
        value: value
    }

    let map = JSON.parse(localStorage.getItem('map'));
    let mapLayer = map.layers
    for (let x = 0; x < mapLayer.length; x++) {
        if (mapLayer[x].id == curLayerSelected) {
            mapLayer[x].properties.push(newProperty)
        }
    }
    map.layers = mapLayer
    localStorage.setItem('map', JSON.stringify(map));
    loadLayerProperty(curLayerSelected)
}

//function to change property name
function changeProperty(type,propertyIndex) {
    let map = JSON.parse(localStorage.getItem('map'));
    let mapLayer = map.layers
    let currentLayerProperties
    let theLayerNumber
    for (let p = 0; p < mapLayer.length; p++) {
        if (mapLayer[p].id == curLayerSelected) {
            currentLayerProperties = mapLayer[p].properties
            theLayerNumber = p
        }
    }

    for (let x = 0; x < currentLayerProperties.length; x++) {

        if (x == propertyIndex) {
            if(type=="name"){
                currentLayerProperties[x].name = event.target.value

            }else{
                if(event.target.type=="checkbox"){
                    currentLayerProperties[x].value=event.target.checked
                }else{
                    currentLayerProperties[x].value = event.target.value

                }

            }
        }
    }

    map.layers[theLayerNumber].properties = currentLayerProperties
    localStorage.setItem('map', JSON.stringify(map));

}

//function to change property name
// function changePropertyValue(propertyIndex){
//     let map = JSON.parse(localStorage.getItem('map'));
//     let mapLayer = map.layers
//     let currentLayerProperties
//     let theLayerNumber
//     for (let p = 0; p < mapLayer.length; p++) {
//         if (mapLayer[p].id == curLayerSelected) {
//             currentLayerProperties = mapLayer[p].properties
//             theLayerNumber = p
//         }
//     }
//
//     for (let x = 0; x < currentLayerProperties.length; x++) {
//         console.log(currentLayerProperties[x].name)
//         if (x == propertyIndex) {
//             currentLayerProperties[x].value = event.target.value
//         }
//     }
//
//     map.layers[theLayerNumber].properties = currentLayerProperties
//     localStorage.setItem('map', JSON.stringify(map));
// }



function loadLayerProperty(currentLayerId) {
    resetPropertyList()
    let map = JSON.parse(localStorage.getItem('map'));
    let mapLayer = map.layers
    let currentLayerProperties

    for (let p = 0; p < mapLayer.length; p++) {
        if (mapLayer[p].id == currentLayerId) {
            currentLayerProperties = mapLayer[p].properties
        }
    }

    for (let c = 0; c < currentLayerProperties.length; c++) {

        let li = document.createElement("li")
        li.setAttribute("class", "list-group-item propertyListItem")

        let rowDiv = document.createElement("div")
        rowDiv.setAttribute("class", "row")

        let nameDiv = document.createElement("div")
        nameDiv.setAttribute("class", "col-5")

        let valueDiv = document.createElement("div")
        valueDiv.setAttribute("class", "col-7")

        let nameInput = document.createElement("INPUT")
        nameInput.setAttribute("value", currentLayerProperties[c].name)
        nameInput.setAttribute("type", "text")
        nameInput.setAttribute("class", "propertyTextInput")

        nameInput.addEventListener("input", function () {
            changeProperty("name",c)
        })

        let valueInput

        if (currentLayerProperties[c].type == "bool") {
            valueInput = document.createElement("INPUT")
            valueInput.setAttribute("type", "checkbox")
            // valueInput.setAttribute("value", currentLayerProperties[c].value)
            valueInput.checked=currentLayerProperties[c].value
            valueInput.setAttribute("class", "checkBoxAndColorBox")
        } else if (currentLayerProperties[c].type == "color") {
            valueInput = document.createElement("INPUT")
            valueInput.setAttribute("type", "color")
            valueInput.setAttribute("value", currentLayerProperties[c].value)
            valueInput.setAttribute("class", "checkBoxAndColorBox")
        } else if (currentLayerProperties[c].type == "number") {
            valueInput = document.createElement("INPUT")
            valueInput.setAttribute("type", "number")
            valueInput.setAttribute("value", currentLayerProperties[c].value)
            valueInput.setAttribute("step", "any")
            valueInput.setAttribute("class", "propertyTextInput")
        } else {
            valueInput = document.createElement("INPUT")
            valueInput.setAttribute("type", "text")
            valueInput.setAttribute("value", currentLayerProperties[c].value)
            valueInput.setAttribute("class", "propertyTextInput")
        }

        valueInput.addEventListener("input",function(){
            changeProperty("value",c)
        })
        nameDiv.appendChild(nameInput)
        valueDiv.appendChild(valueInput)

        rowDiv.appendChild(nameDiv)
        rowDiv.appendChild(valueDiv)

        li.appendChild(rowDiv)

        let propList = document.getElementById("propertyList")
        propList.appendChild(li)


    }
}


document.getElementById("addNewPropertyButton").addEventListener("click", addNewProperty)
document.getElementById("openAddPropertyModal").addEventListener("click", resetNewPropertyModal)

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// CODE FROM HERE ON DEALS WITH MAPS
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//Draws out the grids for orthogonal map
// function initializeMapGridForOrth(mapHeight, mapWidth, tileHeight, tileWidth) {
//
//     var canvas = document.getElementById("canvas")
//     canvas.width = mapWidth * tileWidth
//     canvas.height = mapHeight * tileHeight
//
//     var ctx = canvas.getContext('2d')
//     ctx.strokeStyle = 'black'
//     ctx.lineWidth = 1
//     ctx.setLineDash([1, 1]);
//
//     for (i = tileWidth; i < tileWidth * mapWidth; i = i + tileWidth) {
//
//         ctx.moveTo(i, 0)
//         ctx.lineTo(i, tileHeight * mapHeight)
//         ctx.stroke()
//
//     }
//     for (j = tileHeight; j < tileHeight * mapHeight; j = j + tileHeight) {
//         ctx.moveTo(0, j)
//         ctx.lineTo(tileWidth * mapWidth, j)
//         ctx.stroke()
//     }
// }
//
// function initializeMapGridForIso(mapHeight, mapWidth, tileHeight, tileWidth){
//     var canvas = document.getElementById("canvas")
//     canvas.width = mapWidth * tileWidth *2
//     canvas.height = mapHeight * tileHeight *2
//
//     var ctx = canvas.getContext('2d')
//     ctx.strokeStyle = 'black'
//     ctx.lineWidth = 1
//     ctx.setLineDash([1, 1]);
//
//     for (i = 0; i < mapWidth; i++) {
//         for (j = 0; j < mapHeight; j++) {
//             // calculate coordinates
//             var init_xPos = canvas.width/2
//             var init_yPos = tileHeight
//             var x = (i-j) * tileWidth / 2 + init_xPos
//             var y = (i+j) * tileHeight / 2 + init_yPos
//
//             // begin drawing
//             ctx.beginPath()
//
//             // move to start point
//             ctx.moveTo(x - tileWidth / 2, y)
//
//             /**
//              *  need to draw each diamond shaped tile
//              *   /\
//              *   \/
//              */
//
//             //draws '/' on top
//             ctx.lineTo(x - tileWidth, y + tileHeight / 2)
//             //draws '\' on bottom
//             ctx.lineTo(x - tileWidth / 2, y + tileHeight)
//             //draws '/' on bottom
//             ctx.lineTo(x, y + tileHeight / 2)
//             //draws '\' on top
//             ctx.lineTo(x - tileWidth / 2,  y)
//
//             // draw path
//             ctx.stroke()
//         }
//     }
//
// }
// // Setups the map either isometric or orthogonal and setup grid
// function createMap() {
//     //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//     // Have to Create a canvas in here and use this function in load layer
//     clearCanvas()
//     var project = JSON.parse(localStorage.getItem('project'));
//     var porjectLayers = project.layers
//
//     var mapHeight = parseInt(project.height)
//     var mapWidth = parseInt(project.width)
//     var tileHeight = parseInt(project.tileHeight)
//     var tileWidth = parseInt(project.tileWidth)
//
//     if (project.orientation == "Orthogonal") {
//
//         initializeMapGridForOrth(mapHeight, mapWidth, tileHeight, tileWidth)
//
//     }  else if(project.orientation=="Isometric"){
//
//         initializeMapGridForIso(mapHeight, mapWidth, tileHeight, tileWidth)
//
//     }  else{
//
//         console.log("Some error has occurred")
//
//     }
//
// }
//
// createMap()
loadLayer()
