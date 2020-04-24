//Generate project object to be stored in localstorage
function createJson() {
    console.log("hi")
    var mapOrientation = document.getElementById("orientation").value
    var mapWidth = Number(document.getElementById("mapWidth").value)
    var mapHeight = Number(document.getElementById("mapHeight").value)
    var tileWidth = Number(document.getElementById("tileWidth").value)
    var tileHeight = Number(document.getElementById("tileHeight").value)
    var dataArray = new Array(mapWidth * mapHeight).fill(0)

    var project = {
        orientation: mapOrientation,
        width: mapWidth,
        height: mapHeight,
        tileWidth: tileWidth,
        tileHeight: tileHeight,
        nextTiledLayerid: 2,
        nextObjectId: 1,
        gidCnt:1,
        layers: [
            {
                type: "tile",
                id: 1,
                name: "Tile Layer",
                data: dataArray,
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
    }

    localStorage.setItem('project', JSON.stringify(project));
}

