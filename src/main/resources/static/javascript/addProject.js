function createJson() {
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
        nextObjectLayerId: 1,
        layers: [
            {
                type: "tile",
                id: 1,
                data: dataArray,
                properties: [],
                visibie: true,
                height: mapHeight,
                width: mapWidth,
                x: 0,
                y: 0,
            }
        ],
        tilesets: []
    }
}