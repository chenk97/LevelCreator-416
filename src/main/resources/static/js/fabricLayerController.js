import {curLayerSelected} from "./layerController.js";
/******************still need work, doesn't work in loop******************/

// function moveLayerUp(layerId){
//     var obj = gridCanvas.getObjects();
//     obj.forEach(function(item, i) {
//         if(item.id===layerId){
//             item.bringForward();
//         }
//     });
//     gridCanvas.renderAll();
// }
//
//
// function moveLayerDown(layerId){
//     var obj = gridCanvas.getObjects();
//     obj.forEach(function(item, i) {
//         if(item.id===layerId){
//             item.sendBackwards();
//         }
//     });
//     gridCanvas.renderAll();
// }


function makeLayerInvisible(){
    var obj = gridCanvas.getObjects();
    obj.forEach(function(item, i) {
        if(item.id===curLayerSelected){
            item.set({opacity: 0});
        }
    });
    gridCanvas.renderAll();
}


function makeLayerVisible(){
    var obj = gridCanvas.getObjects();
    obj.forEach(function(item, i) {
        if(item.id===curLayerSelected){
            item.set({opacity: 1});
        }
    });
    gridCanvas.renderAll();
}


function lockLayer(){
    var obj = gridCanvas.getObjects();
    obj.forEach(function(item, i) {
        if(item.id===curLayerSelected){
            item.set({selectable:false});
        }
    });
    gridCanvas.renderAll();
}


function unlockLayer(){
    var obj = gridCanvas.getObjects();
    obj.forEach(function(item, i) {
        if(item.id===curLayerSelected){
            item.set({selectable:true});
        }
    });
    gridCanvas.renderAll();
}

function removeLayer(layerId){
    var objs = gridCanvas.getActiveObjects();
    objs.forEach(function(item, i) {
        if(item.id===layerId){
            gridCanvas.remove(item);
        }
    });
    gridCanvas.renderAll();
    refreshData();
}

document.getElementById("lockBtn").addEventListener("click", lockLayer);
document.getElementById("unlockBtn").addEventListener("click", unlockLayer);
document.getElementById("trasBtn").addEventListener("click", makeLayerInvisible);
document.getElementById("noTrasBtn").addEventListener("click", makeLayerVisible);