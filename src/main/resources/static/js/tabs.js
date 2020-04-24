$(".nav-tabs").on("click", "a", function(e){
    e.preventDefault();
    $(this).tab('show');
});


$("#minusBtn").on("click", function(){
    var ref_this = $("ul li.nav-item").find(".active");
    //remove the element
});