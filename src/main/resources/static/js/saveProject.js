function getProjectScreenshot() {
    gridCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    removeGrid()

    let x = document.getElementById("grid_canvas")

    let image = x.toDataURL()
    addGrid()
    return image
}


function saveWork() {
    console.log("Saving Work")
    let map = localStorage.getItem('map');
    map.canvas = JSON.stringify(gridCanvas.toJSON());
    var projectJson = JSON.parse(localStorage.getItem('map'));


    if (projectJson.id == "") {
        // Sending request for project
        project = {
            "name": projectJson.name,
            "screenshot": getProjectScreenshot(),
            "mapJSON": map
        }
        $.ajax({
            contentType: "application/json",
            type: "POST",
            data: JSON.stringify(project),
            url: "/saveProject",
            success: function (data) {
                console.log('done');
                window.location = "/myWork";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error while post');
            }
        });

    } else {
        project = {
            "id": projectJson.id,
            "name": projectJson.name,
            "screenshot": getProjectScreenshot(),
            "mapJSON": map
        }

        $.ajax({
            contentType: "application/json",
            type: "PUT",
            data: JSON.stringify(project),
            url: "/updateProject",
            success: function (data) {
                console.log('done updating');
                window.location = "/myWork";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error while put');
            }
        });

    }


}

document.getElementById("saveWork").addEventListener("click", function () {
    saveWork()
})