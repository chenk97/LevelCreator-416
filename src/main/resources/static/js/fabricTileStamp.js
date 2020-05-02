//extend image to be able to covert with canvas
import {curLayerSelected} from "./layerController.js";
var clonedGroup;
var clipboard = null;

fabric.Image.prototype.toObject = (function(toObject) {
    return function() {
        return fabric.util.object.extend(toObject.call(this), {
            src: this.toDataURL()
        });
    };
})(fabric.Image.prototype.toObject);


gridCanvas.on('selection:created',function(e){
    // currentTarget = "";
    e.target.set({
        lockScalingX: true,
        lockScalingY: true,
        hasControls: false,
    });
});


// gridCanvas.on({
//     'object:selected': (e)=>{
//         currentTarget = "";
//     }
// });


gridCanvas.on({
    'object:moving':(e)=>{
        let top = closest(lineYN, e.target.top);
        let left = closest(lineXN, e.target.left);
        e.target.set({
            top: top,
            left: left,
        });
        refreshData();
    }
});



gridCanvas.on({
    'mouse:up':(e)=>{
        let top = closest(lineYN, gridCanvas.getPointer(e.e).y-tileH/2);
        let left = closest(lineXN, gridCanvas.getPointer(e.e).x-tileW/2);
        if(currentTarget){
            $.each(gridCanvas.getObjects(), function (i, e) {//check if there is an object at the same layer and position
                if (e.selectable && e.id === curLayerSelected) {
                    if(e.top === top && e.left ===left){
                        gridCanvas.remove(e);
                    }
                }
            });

            var img = new fabric.Image.fromURL(currentTarget, function(im) {
                im.scaleToWidth(tileW);
                im.scaleToHeight(tileH);
                im.set({
                    top: top,
                    left: left,
                    selectable: true,
                    hasControls: false,
                    id: curLayerSelected, //set id to layer id
                });
                im.lockScalingX = true;
                im.lockScalingY = true;
                im.setCoords();
                gridCanvas.add(im);
                im.bringToFront();
                gridCanvas.renderAll();
                refreshData();
            });
        }else{return;}
        //get object id by iterating all objects on canvas
        // var obj = gridCanvas.getObjects();
        // obj.forEach(function(item, i) {
        //     console.log(item.id);
        // });
    }
});


function closest(arr, closestTo){
    let smallestD = Math.abs(closestTo - arr[0]);
    let c = 0;
    for(let i = 1; i < arr.length; i++){
        let closestD = Math.abs(closestTo - arr[i]);
        if (closestD < smallestD){
            smallestD = closestD;
            c = i;
        }
    }
    return arr[c];
}


function eraseTile(){
    var objs = gridCanvas.getActiveObjects();
    objs.forEach(function(item, i) {
            gridCanvas.remove(item);
        });
    gridCanvas.renderAll();
    refreshData();
}

function clearUrl(){
    currentTarget = null;
}

document.getElementById("selectBtn").addEventListener("click", clearUrl);
document.getElementById("eraseBtn").addEventListener("click", eraseTile);


// function Copy() {
//     // Single Object
//     if(gridCanvas.getActiveObject()) {
//         // Does this object require an async clone?
//         if(!fabric.util.getKlass(gridCanvas.getActiveObject().type).async) {
//             clipboard = gridCanvas.getActiveObject().clone();
//         } else {
//             gridCanvas.getActiveObject().clone(function(clone) {
//                 clipboard= clone;
//             });
//         }
//     }
//
//     // Group of Objects (all groups require async clone)
//     if(gridCanvas.getActiveGroup()) {
//         gridCanvas.getActiveGroup().clone(function(clone) {
//             clipboard = clone;
//         });
//     }
// }
//
//
// function Paste() {
//     // Do we have an object in our clipboard?
//     if(clipboard) {
//         // Lets see if we need to clone async
//         if(!fabric.util.getKlass(clipboard.type).async) {
//             var obj = clipboard.clone();
//             //need to get mouse position
//             obj.setTop(obj.top += 10);
//             obj.setLeft(obj.left += 10);
//             gridCanvas.add(obj);
//             // We do not need to clone async, all groups require async clone
//             gridCanvas.setActiveObject(obj);
//             clipboard = obj;
//         }  else {
//             clipboard.clone(function(clone) {
//                 clone.setTop(clone.top += 10);
//                 clone.setLeft(clone.left += 10);
//                 clone.forEachObject(function(obj){
//                     gridCanvas.add(obj);
//                 });
//
//                 gridCanvas.deactivateAll();
//
//                 // We need to clone async, but this doesnt mean its a group
//                 if(clipboard.isType("group")) {
//                     gridCanvas.setActiveGroup(clone);
//                 } else {
//                     gridCanvas.setActiveObject(clone);
//                 }
//                 clipboard = clone;
//             });
//         }
//     }
//     canvas.renderAll();
// }



function refreshData(){
    //moved object loss their url
    let map = JSON.parse(localStorage.getItem("map"));
    map.canvas = gridCanvas.toJSON();
    localStorage.setItem("map", JSON.stringify(map));
}