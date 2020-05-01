function createMap() {
    var mapOrientation = document.getElementById("orientation").value
    var mapWidth = Number(document.getElementById("mapWidth").value)
    var mapHeight = Number(document.getElementById("mapHeight").value)
    var tileWidth = Number(document.getElementById("tileWidth").value)
    var tileHeight = Number(document.getElementById("tileHeight").value)

    var map = {
        orientation: mapOrientation,
        width: mapWidth,
        height: mapHeight,
        tileWidth: tileWidth,
        tileHeight: tileHeight,
        nextTiledLayerid: 2,
        nextObjectId: 1,
        gidCnt:1,
        canvas: null,
        layers: [
            {
                type: "tile",
                id: 1,
                name: "Tile Layer",
                properties: [],
                position: 1,//larger position index on top
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



