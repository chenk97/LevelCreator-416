//extend image to be able to covert with canvas
import {curLayerSelected} from "./layerController.js";

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
        //limit the mouse click detection inside boundBox
        if(gridCanvas.getPointer(e.e).y<boundBox.top || gridCanvas.getPointer(e.e).y>boundBox.top+boundBox.height
            ||gridCanvas.getPointer(e.e).x<boundBox.left ||gridCanvas.getPointer(e.e).x>boundBox.left+boundBox.width){
            return;
        }
        let top = closest(lineYN, gridCanvas.getPointer(e.e).y-tileH/2);
        let left = closest(lineXN, gridCanvas.getPointer(e.e).x-tileW/2);
        if(clonedObject){
            clonedObject.clone(function(cloned) {
                if (cloned.type === 'activeSelection') {
                    let width = cloned.width * cloned.scaleX;
                    let height = cloned.height * cloned.scaleY;
                    cloned.set({
                        top: top-height/2,
                        left: left-width/2,
                    });
                    cloned.forEachObject(function (obj) {
                        obj.lockScalingX = true;
                        obj.lockScalingY = true;
                        obj.set({
                            top: obj.top/offset,
                            left: obj.left/offset,
                            selectable: true,
                            hasControls: false,
                            id: curLayerSelected, //set id to layer id
                        });
                        obj.setCoords();
                        gridCanvas.add(obj);
                    });
                    gridCanvas.setActiveObject(cloned);
                    gridCanvas.discardActiveObject();
                    gridCanvas.getObjects().forEach(item=>{
                        if(item.id===curLayerSelected){
                            item.set({
                                top:closest(lineYN, item.top),
                                left:closest(lineXN, item.left),
                            });
                        }
                    });
                    gridCanvas.renderAll();
                }else{
                    gridCanvas.getObjects().forEach(item=>{//check if there is an object at the same layer and position
                        if (item.selectable && item.id === curLayerSelected) {
                            if(item.top === top && item.left ===left){
                                gridCanvas.remove(item);
                            }
                        }
                    });
                    cloned.set({
                        top: top,
                        left: left,
                        id: curLayerSelected,
                    });
                    gridCanvas.add(cloned);
                    currentTileset.discardActiveObject();
                }
            });
        }else{return;}
        refreshData();
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
    gridCanvas.getActiveObjects().forEach(item=>{
        if(item.id === curLayerSelected){
            gridCanvas.remove(item);
        }
    });
    gridCanvas.renderAll();
    refreshData();
}


function clearUrl(){
    clonedObject = null;
}

//check type so we can set object scalable or not
function checkLayerType() {
    let map = JSON.parse(localStorage.getItem('map'));
    for(var i = 0; i < map.layers.length; i++){
        if(map.layers[i].id === curLayerSelected){
            return map.layers[i].type;
        }
    }
}


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



export function refreshData(){
    //moved object loss their url
    let map = JSON.parse(localStorage.getItem("map"));
    map.canvas = gridCanvas.toJSON();
    localStorage.setItem("map", JSON.stringify(map));
}


document.getElementById("selectBtn").addEventListener("click", clearUrl);
document.getElementById("eraseBtn").addEventListener("click", eraseTile);