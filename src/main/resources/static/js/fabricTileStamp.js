//extend image to be able to covert with canvas
import {curLayerSelected} from "./layerController.js";
var _clipboard;
var ctrlDown = false;

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
                        top: top-(height-height%tileH)/2,
                        left: left-(width-width%tileW)/2,
                    });
                    cloned.forEachObject(function (obj) {
                        obj.set({
                            top: obj.top/offset,
                            left: obj.left/offset,
                            selectable: true,
                            hasControls: false,
                            lockScalingX: true,
                            lockScalingY: true,
                            id: curLayerSelected, //set id to layer id
                        });
                        obj.setCoords();
                        gridCanvas.add(obj);
                    });
                    gridCanvas.setActiveObject(cloned);
                    gridCanvas.discardActiveObject();
                    gridCanvas.getObjects().forEach(item=>{
                        if(item.id===curLayerSelected){
                            //remove out bounded tiles to avoid overlapping on same layer
                            if(item.left<boundBox.left-tileW/2||item.left>boundBox.left+boundBox.width
                                ||item.top<boundBox.top-tileH/2||item.top>boundBox.top+boundBox.height){
                                gridCanvas.remove(item);
                            }else{
                                item.set({
                                    top:closest(lineYN, item.top),
                                    left:closest(lineXN, item.left),
                                });
                            }
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
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true,
                        id: curLayerSelected,
                    });
                    gridCanvas.add(cloned);
                    currentTileset.discardActiveObject();//so we can select next one
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


var canvasWrapper = document.getElementById('canvasStorage');
canvasWrapper.tabIndex = 1000;

canvasWrapper.addEventListener('keydown', function(e) {
    //Copy paste function for canvas objects

    //If ctrl is pressed, set ctrlDown to true
    if (e.keyCode == 17) ctrlDown = true;

    //Handle ctrl+c
    if (ctrlDown && e.keyCode == 67) {
        console.log("ctrl+c detected");
        Copy();
    }
    //handle ctrl+v
    if (ctrlDown && e.keyCode == 86) {
        console.log("ctrl+v detected");
        Paste();
    }
    //Delete selected items with the delete button
    if(e.keyCode == 46){
        console.log("delete key press detected");
        eraseTile();
    }
}, false);

//Set ctrlDown to false when we release the ctrl key
canvasWrapper.addEventListener('keyup', function(e) {
    if (e.keyCode == 17) {
        console.log("key released");
        ctrlDown = false;
    }
});




//copy & paste!!!! still need to work on key short cut and positioning!!!!
function Copy() {
    // clone what are you copying since you
    // may want copy and paste on different moment.
    // and you do not want the changes happened
    // later to reflect on the copy.
    gridCanvas.getActiveObject().clone(function(cloned) {
        _clipboard = cloned;
    });
}

function Paste() {
    // clone again, so you can do multiple copies.
    _clipboard.clone(function(cloned) {
        gridCanvas.discardActiveObject();
        cloned.set({
            top: cloned.top + tileH/2,
            left: cloned.left + tileW/2,
            evented: true,
        });
        if (cloned.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            cloned.canvas = gridCanvas;
            cloned.forEachObject(function (obj) {
                obj.set({
                    selectable: true,
                    hasControls: false,
                    lockScalingX: true,
                    lockScalingY: true,
                    id: curLayerSelected, //set id to layer id
                });
                obj.setCoords();
                gridCanvas.add(obj);
            });
            // // this should solve the unselectability
            // cloned.setCoords();
        } else {
            cloned.set({
                selectable: true,
                hasControls: false,
                lockScalingX: true,
                lockScalingY: true,
                id: curLayerSelected, //set id to layer id
            });
            gridCanvas.add(cloned);
        }
        _clipboard.top += tileH/2;
        _clipboard.left += tileW/2;
        gridCanvas.setActiveObject(cloned);
        gridCanvas.requestRenderAll();
    });
}



export function refreshData(){
    //moved object loss their url
    let map = JSON.parse(localStorage.getItem("map"));
    map.canvas = gridCanvas.toJSON();
    localStorage.setItem("map", JSON.stringify(map));
}


document.getElementById("selectBtn").addEventListener("click", clearUrl);
document.getElementById("eraseBtn").addEventListener("click", eraseTile);