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

// Load the layers that the project has
function loadLayer() {
    //Get the object from local storage
    var project = JSON.parse(localStorage.getItem('project'));
    var projectLayers = project.layers

    //Get the <ul>
    var layerList = document.getElementById("layerList")
    layerList.innerHTML = ""

    for (var x = 0; x < projectLayers.length; x++) {
        // create a new list item
        var li = document.createElement("li");
        li.className = "list-group-item"

        // scenario when it a tile layer
        if (projectLayers[x].type == "tile") {

            // Change icon base on if layer is visble or not
            var visible
            if (projectLayers[x].visibility == true) {
                visible = "<span class=\"fas fa-eye\" style=\"float:right;margin-right:20px; margin-top: 5px;\"></span>"
            } else {
                visible = "<span class=\"fas fa-eye-slash\" style=\"float:right;margin-right:20px; margin-top: 5px;\"></span>"
            }

            // Creates a layer by creating a list item
            //It add the input for name and adds the visible icon and the lock icon
            li.innerHTML = " <div class=\"md-form\">\n" +
                "              <i class=\"fas fa-th\"></i>\n" +
                "              <input type=\"text\"    class=\"form-control\">\n" +
                "            </div>" +
                "            <div>\n" +
                visible +
                "              <span class=\"fas fa-lock-open\" style=\"float:right;margin-right:5px;margin-top: 5px;\"></span>\n" +
                "            </div>"

            //adds the <li> to the <ul>
            layerList.appendChild(li)

    // scenario when it a object layer
        } else {

        }

    }

}

createMap()
loadLayer()
// setInterval(loadLayer,1000/60)
// var retrievedObject = localStorage.getItem('project');
// console.log( JSON.parse(retrievedObject))