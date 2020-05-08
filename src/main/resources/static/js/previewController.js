var myCanvas = document.getElementById("grid_canvas");
var convertedImg = document.getElementById("previewImg");

$('#previewModal').on('shown.bs.modal', function(){

    var dataURI = myCanvas.toDataURL();
    convertedImg.src = dataURI;
});