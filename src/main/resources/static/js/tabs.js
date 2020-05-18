$(".nav-tabs").on("click", "a", function(e){
    e.preventDefault();
    $(this).tab('show');
});


$("#minusBtn").on("click", function(e){
    e.preventDefault();
    let map = JSON.parse(localStorage.getItem('map'));
    var ref_this = $("ul.nav-tabs li.nav-item a.active");
    console.log(ref_this.attr("id"));
    var element = document.getElementById(ref_this.attr("id")).parentElement;
    element.remove();
    var href = ref_this.attr('href').substring(1);
    var canvasid = $('.tab-pane[id="' + href + '"]').children('div')
        .first().children('canvas').attr("id");
    console.log("canvasid: " + canvasid);
    for(var i =0 ; i < map.tilesets.length; i++){
        if (map.tilesets[i].canvasId === canvasid){
           map.tilesets.splice(i, 1);
        }
    }
    localStorage.setItem("map", JSON.stringify(map));
    $('.tab-pane[id="' + href + '"]').remove();
    //remove related tileset
    $(".nav-tabs li").children('a').first().click();
});


$('form[name = "collaboratorForm"]').on('submit', function(event){
    event.preventDefault();
});


function addCollaborator(){
        console.log("adding!!!!!!!!!!!!!!!!!!!")
        // event.preventDefault();
        let map = JSON.parse(localStorage.getItem('map'));
        let username = document.getElementById("collaboratorName").value;
        $.post({
            contentType: "application/json",
            type: "POST",
            url : 'addCollaborator',
            data : JSON.stringify({
                "projectId": map.id,
                "username": username,
            }),
            success: function (response) {
                console.log('done add');
                $('#collaborators').replaceWith($(response));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error while add');
            },
            complete: function(data) {
                console.log("SEMPRE FUNFA!");
            }
        });
}


function removeCollaborator(collaborator){
        console.log("deleting!!!!!!!!!!!!!!!!!!!")
        // event.preventDefault();
        let map = JSON.parse(localStorage.getItem('map'));
        let username = collaborator;
        console.log(username);
        $.post({
            contentType: "application/json",
            type: "POST",
            url : 'removeCollaborator',
            data : JSON.stringify({
                "projectId": map.id,
                "username": username,
            }),
            success: function (response) {
                console.log('done remove');
                console.log(response);
                $('#collaborators').replaceWith($(response));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error while remove');
            },
            complete: function(data) {
                console.log("SEMPRE FUNFA!");
            }
        });

}