$(".nav-tabs").on("click", "a", function(e){
    e.preventDefault();
    $(this).tab('show');
});


$("#minusBtn").on("click", function(){
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
    };
    console.log(map);
    localStorage.setItem("map", JSON.stringify(map));
    $('.tab-pane[id="' + href + '"]').remove();
    //remove related tileset
    $(".nav-tabs li").children('a').first().click();
});