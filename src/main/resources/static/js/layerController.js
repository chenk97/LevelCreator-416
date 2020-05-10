//Global variable to be used to indicate the currently selected layers id
import {addTransactions} from "./redoAndUndo.js";
import {makeLayerVisible} from "./fabricLayerController.js";
import {makeLayerInvisible} from "./fabricLayerController.js";
import {lockLayer} from "./fabricLayerController.js";
import {unlockLayer} from "./fabricLayerController.js";
import {removeLayer} from "./fabricLayerController.js";
import {moveMapLayerDown} from "./fabricLayerController.js";
import {moveMapLayerUp} from "./fabricLayerController.js";
import {restackLayer} from "./fabricLayerController.js";

export var curLayerSelected = ""
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
}

function checkVisibility() {
    let map = JSON.parse(localStorage.getItem("map"));
    for (let i = 0; i < map.layers.length; i++) {
        if (map.layers[i].id == event.target.parentElement.id) {
            return map.layers[i].visibility;
        }
    }
}

export function checkLockStatus(layerId) {
    let map = JSON.parse(localStorage.getItem("map"));
    for (let i = 0; i < map.layers.length; i++) {
        if (map.layers[i].id == layerId) {
            return map.layers[i].locked;
        }
    }
}

//Creates a layer to be added to layer panel
function createLayer(theLayerId, type, name, visibility, locked) {

    // Change Icon Base On Visibility
    let visIcon = document.createElement("i")
    visibility == true ? visIcon.setAttribute("class", "fas fa-eye liItems") : visIcon.setAttribute("class", "fas fa-eye-slash liItems")

    visIcon.addEventListener("click", function (e) {
        event.stopPropagation()
        if (checkVisibility()) {
            makeLayerInvisible(e.target.parentElement.id);
            changeVisbility(theLayerId);
            loadLayer()
            setCurrentSelectedLayer(curLayerSelected)
        } else {
            console.log(checkVisibility())
            makeLayerVisible(e.target.parentElement.id);
            changeVisbility(theLayerId);
            loadLayer()
            setCurrentSelectedLayer(curLayerSelected)
        }

    });

    // Change Icon Base on Layer or Object Layer
    let typeIcon = document.createElement("i")
    type == "tile" ? typeIcon.setAttribute("class", "fas fa-th typeIcon") : typeIcon.setAttribute("class", "fas fa-cubes typeIcon")

    // Add Lock Icon
    let lockIcon = document.createElement("i")
    locked == false ? lockIcon.setAttribute("class", "fas fa-lock-open liItems") : lockIcon.setAttribute("class", "fas fa-lock liItems")
    lockIcon.addEventListener("click", function (e) {
        event.stopPropagation()
        if (checkLockStatus(e.target.parentElement.id)) {//true= layer is locked
            console.log(checkLockStatus(e.target.parentElement.id))
            console.log("unlocking the layer")
            unlockLayer(e.target.parentElement.id);
            changeLockStatus(theLayerId);
            loadLayer()
            setCurrentSelectedLayer(curLayerSelected)
        } else { //false = layer is unlocked
            console.log(checkLockStatus(e.target.parentElement.id))
            console.log("locking the layer")
            lockLayer(e.target.parentElement.id);
            changeLockStatus(theLayerId);
            loadLayer()
            setCurrentSelectedLayer(curLayerSelected)
        }
    })

    let propertyIcon = document.createElement("i")
    propertyIcon.setAttribute("class", "fas fa-clipboard-list propertyIcon")
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

    curLayerSelected = layerId
    loadLayerProperty(curLayerSelected)
}

//Delete the current that is selected base on the global variable curLayerSelected
function deleteLayer() {

    if (curLayerSelected == "") {
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
}

//Adds a new tile layer to layer panel
function newTileLayer() {
    let map = JSON.parse(localStorage.getItem('map'));
    let newTileLayer = {
        type: "tile",
        id: map.nextLayerid,
        name: "Tile Layer" + map.nextLayerid,
        properties: [],
        visibility: true,
        locked: false,
        height: map.height,
        width: map.width,
        x: 0,
        y: 0,
    }
    map.nextLayerid += 1
    map.layers.unshift(newTileLayer)
    localStorage.setItem('map', JSON.stringify(map));
    justAddedNewLayer = true
}

//Adds a new object layer to layer panel
function newObjectLayer() {
    let map = JSON.parse(localStorage.getItem('map'));
    let newObjectLayer = {
        type: "object",
        id: map.nextLayerid,
        name: "Object Layer" + map.nextLayerid,
        properties: [],
        visibility: true,
        locked: false,
        x: 0,
        y: 0,
    }
    map.nextLayerid += 1
    map.layers.unshift(newObjectLayer)
    localStorage.setItem('map', JSON.stringify(map));
    justAddedNewLayer = true

}

function moveLayerUp() {
    if (curLayerSelected == "") {
        console.log("No layer has been selected")
        return
    }

    let map = JSON.parse(localStorage.getItem('map'));
    let mapLayers = map.layers

    let indexOfLayer
    for (let x = 0; x < mapLayers.length; x++) {
        if (mapLayers[x].id == curLayerSelected) {
            indexOfLayer = x
            break
        }
    }
    if (indexOfLayer > 0) {
        let sub = mapLayers[indexOfLayer]
        mapLayers[indexOfLayer] = mapLayers[indexOfLayer - 1]
        mapLayers[indexOfLayer - 1] = sub
    }

    map.layers = mapLayers
    localStorage.setItem('map', JSON.stringify(map));

}

function moveLayerDown() {
    if (curLayerSelected == "") {
        console.log("No layer has been selected")
        return
    }
    let map = JSON.parse(localStorage.getItem('map'));
    let mapLayers = map.layers

    let indexOfLayer
    for (let x = 0; x < mapLayers.length; x++) {
        if (mapLayers[x].id == curLayerSelected) {
            indexOfLayer = x
            break
        }
    }

    if (indexOfLayer != -1 && indexOfLayer < mapLayers.length - 1) {
        let sub = mapLayers[indexOfLayer]
        mapLayers[indexOfLayer] = mapLayers[indexOfLayer + 1]
        mapLayers[indexOfLayer + 1] = sub
    }

    map.layers = mapLayers
    localStorage.setItem('map', JSON.stringify(map));

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
            restackLayer();//reset the previously moved layer to right spot
            gridCanvas.getObjects().forEach(item => {
                if(item.id==curLayerSelected){
                    gridCanvas.bringToFront(item);
                }
            });
            if (!checkLockStatus(curLayerSelected)) {//if notLocked
                gridCanvas.forEachObject(obj => {
                    if (obj.id === curLayerSelected) {
                        obj.set({selectable: true});
                    }
                });
            }
        });


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

document.getElementById("addTileLayer").addEventListener("click", function () {
    newTileLayer()
    addTransactions("layer")
    loadLayer()
})
document.getElementById("addObjectLayer").addEventListener("click", function () {
    newObjectLayer()
    addTransactions("layer")
    loadLayer()
})

document.getElementById("deleteLayer").addEventListener("click", function(){
    deleteLayer()
    addTransactions("layer")
    loadLayer()
    removeLayer(curLayerSelected)
    curLayerSelected = ""
    loadLayerProperty()
    restackLayer()
})

document.getElementById("upBtn").addEventListener("click", function () {
    moveLayerUp()
    loadLayer()
    // moveMapLayerUp()
    setCurrentSelectedLayer(curLayerSelected)
    restackLayer();
})
document.getElementById("downBtn").addEventListener("click", function () {
    moveLayerDown()
    loadLayer()
    // moveMapLayerDown()
    setCurrentSelectedLayer(curLayerSelected)
    restackLayer();
})

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
        window.alert("Property name already exist!")
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

// Allow change to properties if user make any
function changeProperty(type, propertyIndex) {
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
            if (type == "name") {
                currentLayerProperties[x].name = event.target.value
            } else {
                if (event.target.type == "checkbox") {
                    currentLayerProperties[x].value = event.target.checked
                } else {
                    currentLayerProperties[x].value = event.target.value
                }
            }
        }
    }
    map.layers[theLayerNumber].properties = currentLayerProperties
    localStorage.setItem('map', JSON.stringify(map));
}

function deleteProperty(propertyIndex) {
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

    currentLayerProperties.splice(propertyIndex, 1)

    map.layers[theLayerNumber].properties = currentLayerProperties
    localStorage.setItem('map', JSON.stringify(map));
    loadLayerProperty(curLayerSelected)
}

function loadLayerProperty(currentLayerId) {
    resetPropertyList()

    if (curLayerSelected == "") {
        return
    }
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
        rowDiv.setAttribute("class", "row propertyRow")

        let nameDiv = document.createElement("div")
        nameDiv.setAttribute("class", "col-4 propertyNameCol")

        let valueDiv = document.createElement("div")
        valueDiv.setAttribute("class", "col-7 propertyValueCol")

        let deleteDiv = document.createElement("div")
        deleteDiv.setAttribute("class", "col-md-auto propertyDeleteCol")

        let nameInput = document.createElement("INPUT")
        nameInput.setAttribute("value", currentLayerProperties[c].name)
        nameInput.setAttribute("type", "text")
        nameInput.setAttribute("class", "propertyTextInput")

        nameInput.addEventListener("input", function () {
            changeProperty("name", c)
        })

        let valueInput

        if (currentLayerProperties[c].type == "bool") {
            valueInput = document.createElement("INPUT")
            valueInput.setAttribute("type", "checkbox")
            // valueInput.setAttribute("value", currentLayerProperties[c].value)
            valueInput.checked = currentLayerProperties[c].value
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

        valueInput.addEventListener("input", function () {
            changeProperty("value", c)
        })

        let deleteIcon = document.createElement("i")
        deleteIcon.setAttribute("class", "fas fa-trash-alt")

        deleteIcon.addEventListener("click", function () {
            deleteProperty(c)
        })

        nameDiv.appendChild(nameInput)
        valueDiv.appendChild(valueInput)
        deleteDiv.appendChild(deleteIcon)

        rowDiv.appendChild(nameDiv)
        rowDiv.appendChild(valueDiv)
        rowDiv.appendChild(deleteDiv)

        li.appendChild(rowDiv)

        let propList = document.getElementById("propertyList")
        propList.appendChild(li)


    }
}


document.getElementById("addNewPropertyButton").addEventListener("click", function () {

    if (curLayerSelected != "") {
        addNewProperty()
    } else {
        window.alert("No Layer Selected!")
    }
})
document.getElementById("openAddPropertyModal").addEventListener("click", resetNewPropertyModal)


loadLayer()
