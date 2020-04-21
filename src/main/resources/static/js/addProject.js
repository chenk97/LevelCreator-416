// Generate project object to be stored in localstorage
function createJson() {
    console.log("hi")
    var mapOrientation = document.getElementById("orientation").value
    var mapWidth = document.getElementById("mapWidth").value
    var mapHeight = document.getElementById("mapHeight").value
    var tileWidth = document.getElementById("tileWidth").value
    var tileHeight = document.getElementById("tileHeight").value
    var dataArray = new Array(mapWidth * mapHeight).fill(0)

    var project = {
        orientation: mapOrientation,
        width: mapWidth,
        height: mapHeight,
        tileWidth: tileWidth,
        tileHeight: tileHeight,
        nextTiledLayerid: 2,
        nextObjectId: 1,
        layers: [
            {
                type: "tile",
                id: 1,
                name: "Tile Layer 1",
                data: dataArray,
                properties: [],
                visibility: true,
                height: mapHeight,
                width: mapWidth,
                x: 0,
                y: 0,
            },
            {
                type: "tile",
                id: 2,
                name: "Tile Layer 2",
                data: dataArray,
                properties: [],
                visibility: true,
                height: mapHeight,
                width: mapWidth,
                x: 0,
                y: 0,
            }
        ],
        tilesets: []
    }

    localStorage.setItem('project', JSON.stringify(project));
}

// Setups the map either isometric or orthogonal and setup grid
function createMap() {
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Have to Create a canvas in here and use this function in load layer


    var project = JSON.parse(localStorage.getItem('project'));

    var mapHeight = parseInt(project.height)
    var mapWidth = parseInt(project.width)
    var tileHeight = parseInt(project.tileHeight)
    var tileWidth = parseInt(project.tileWidth)

    if (project.orientation == "Orthogonal") {

        var canvas = document.getElementById("canvas")
        canvas.width = mapWidth * tileWidth
        canvas.height = mapHeight * tileHeight

        var ctx = canvas.getContext('2d')
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 1
        ctx.setLineDash([1, 1]);
        for (i = tileWidth; i < tileWidth * mapWidth; i = i + tileWidth) {

            ctx.moveTo(i, 0)
            ctx.lineTo(i, tileHeight * mapHeight)
            ctx.stroke()

        }
        for (j = tileHeight; j < tileHeight * mapHeight; j = j + tileHeight) {
            ctx.moveTo(0, j)
            ctx.lineTo(tileWidth * mapWidth, j)
            ctx.stroke()
        }
    } else {
        console.log("Isometric not implemented yet")
    }
}

//Draw the map and places any tiles on it
function drawCanvas() {

}

var currentLayer

// Cretes a layer to be addded to list
function createLayer(name) {

    let li = document.createElement("li");
    li.className = "list-group-item"

    let x = document.createElement("INPUT")
    x.setAttribute("type", "text")
    x.setAttribute("value", name)



    li.appendChild(x)
    return li
}

function appendLayer(layer) {
    let layerList = document.getElementById("layerList")
    layerList.appendChild(layer)
}

// Load the layers that the project has
function loadLayer() {
    //Get the object from local storage
    let project = JSON.parse(localStorage.getItem('project'));

    let projectLayers = project.layers


    for (let i = 0; i < projectLayers.length; i++) {

        let projectName = createLayer(projectLayers[i].name)
        appendLayer(projectName)

    }
}

createMap()
loadLayer()
// setInterval(loadLayer,1000/60)
// var retrievedObject = localStorage.getItem('project');
// console.log( JSON.parse(retrievedObject))