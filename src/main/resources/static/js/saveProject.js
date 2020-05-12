function getProjectScreenshot(){
    gridCanvas.setViewportTransform([1,0,0,1,0,0]);
    removeGrid()

    let x = document.getElementById("grid_canvas")

    let image = x.toDataURL()
    addGrid()
    return image
}


function saveWork() {
    var projectJson = JSON.parse(localStorage.getItem('map'));

    map = {
        "mapJSON": JSON.stringify(gridCanvas.toJSON()),
        "layersJSON": JSON.stringify(projectJson.layers),
        "tilesetJSON": JSON.stringify(projectJson.tilesets)
    }

    project ={
        "name": projectJson.name,
        "screenshot":getProjectScreenshot()
    }

    //Sending request for map
    $.ajax({
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify(map),
        url: "/saveMap",
        success: function (data) {
            console.log('done');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error while post');
        }
    });

    //Sending request for project
    $.ajax({
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify(project),
        url: "/saveProject",
        success: function (data) {
            console.log('done');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error while post');
        }
    });
}

document.getElementById("saveWork").addEventListener("click", function () {
    saveWork()
})