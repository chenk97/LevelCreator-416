var saved = false

function getProjectScreenshot() {
    gridCanvas.discardActiveObject();
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
    // projectJson.canvas = JSON.stringify(gridCanvas.toJSON());
    let stringifyProject = JSON.stringify(projectJson)

    project = {
        "id": theProjectID,
        "name": theProjectName,
        "screenshot": getProjectScreenshot(),
        "mapJSON": stringifyProject,
        "canvasJSON":JSON.stringify(gridCanvas.toJSON()),
    }
    $('#progress').show();
    $('body').css('pointer-events', 'none');
    $.ajax({
        contentType: "application/json",
        type: "PUT",
        data: JSON.stringify(project),
        url: "/updateProject",
        success: function (data) {
            $('#progress').hide();
            $('body').css('pointer-events', 'all');
            console.log('done updating');
            saved = true;
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