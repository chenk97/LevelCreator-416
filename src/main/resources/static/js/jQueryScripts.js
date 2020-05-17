// !!!!!!!FOR CHECKING IF PROJECT SAVED!!!!!!!
// Redirection for levelcreator sign to home from workspace
function deleteLayer(link) {
    let map = JSON.parse(localStorage.getItem('map'));
    let projectNewStatus = map.new
    let theProjectID = map.id

    if(projectNewStatus==0){ // Project is new
        $.ajax({
            contentType: "application/json",
            type: "PUT",
            data: JSON.stringify(theProjectID),
            url: "/deleteNewProject",
            success: function (data) {
                console.log('Project sucessfully Deleted');
                window.location = link
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error while deleting new project');
            }
        });
    }else{
        window.location = link
    }
}

$("#goHomeSign").on('click', function () {
    if (saved == false) {
        $("#exampleModal10").modal()
        document.getElementById("exitButton").addEventListener("click", function () {
            deleteLayer("/home")
        })
    } else {
        window.location = "/home";
    }

});
//Redirection for home to go to home from workspace
$("#goHome").on('click', function () {
    if (saved == false) {
        $("#exampleModal10").modal()
        document.getElementById("exitButton").addEventListener("click", function () {
            deleteLayer("/home")
        })
    } else {
        window.location = "/home";
    }

});
//Redirection for work to go to mywork from workspace
$("#goWork").on('click', function () {
    if (saved == false) {
        $("#exampleModal10").modal()
        document.getElementById("exitButton").addEventListener("click", function () {
            deleteLayer("/myWork")
        })
    } else {
        window.location = "/myWork";
    }


});
//Redirection for to go to profile from workspace
$("#goToProfile").on('click', function () {
    if (saved == false) {
        $("#exampleModal10").modal()
        document.getElementById("exitButton").addEventListener("click", function () {
            deleteLayer("/profile")
        })
    } else {
        window.location = "/profile";
    }

});
//Redirection for work to go to logout from workspace
$("#goToLogout").on('click', function () {
    if (saved == false) {
        $("#exampleModal10").modal()
        document.getElementById("exitButton").addEventListener("click", function () {
            deleteLayer("/logout")
        })
    } else {
        window.location = "/logout";
    }

});
// !!!!!!!FOR CHECKING IF PROJECT SAVED!!!!!!!


// FOR PROPERTY PANEL MODAL
$("#propertyPanelModal").draggable({
    handle: ".propertyPanelModalHeader"
});

$("button[data-number=1]").click(function () {
    $('#propertyPanelModal').modal('hide');
});

$("button[data-number=2]").click(function () {
    $('#addPropertyModal').modal('hide');
});

$("button[data-number=3]").click(function () {
    $('#addPropertyModal').modal('hide');
});
// FOR PROPERTY PANEL MODAL


//FOR LITERALLY CANVAS MODAL
//FOR LITERALLY CANVAS MODAL