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


function makeLayerInvisible(layerId){
    var obj = gridCanvas.getObjects();
    obj.forEach(function(item, i) {
        if(item.id===layerId){
            item.set({opacity: 0});
        }
    });
    gridCanvas.renderAll();
}


function makeLayerVisible(layerId){
    var obj = gridCanvas.getObjects();
    obj.forEach(function(item, i) {
        if(item.id===layerId){
            item.set({opacity: 1});
        }
    });
    gridCanvas.renderAll();
}


function lockLayer(layerId){
    var obj = gridCanvas.getObjects();
    obj.forEach(function(item, i) {
        if(item.id===layerId){
            item.set({selectable:false});
        }
    });
    gridCanvas.renderAll();
}


function unlockLayer(layerId){
    var obj = gridCanvas.getObjects();
    obj.forEach(function(item, i) {
        if(item.id===layerId){
            item.set({selectable:true});
        }
    });
    gridCanvas.renderAll();
}

