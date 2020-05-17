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

    var projectJson = JSON.parse(localStorage.getItem('map'));
    let theProjectName = projectJson.name
    let theProjectID = projectJson.id
    projectJson.canvas = JSON.stringify(gridCanvas.toJSON());
    let stringifyProject = JSON.stringify(projectJson)

    project = {
        "id": theProjectID,
        "name": theProjectName,
        "screenshot": getProjectScreenshot(),
        "mapJSON": stringifyProject
    }
    $.ajax({
        contentType: "application/json",
        type: "PUT",
        data: JSON.stringify(project),
        url: "/updateProject",
        success: function (data) {
            console.log('done updating');
            // window.location = "/myWork";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error while put');
        }
    });
}

document.getElementById("saveWork").addEventListener("click", function () {
    saveWork()
})