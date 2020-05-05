//extend image to be able to covert with canvas
import {curLayerSelected} from "./layerController.js";
var _clipboard;
var ctrlDown = false;
var objScaleX = 1;
var objScaleY = 1;

fabric.Image.prototype.toObject = (function(toObject) {
    return function() {
        return fabric.util.object.extend(toObject.call(this), {
            src: this.toDataURL()
        });
    };
})(fabric.Image.prototype.toObject);


gridCanvas.on('selection:created',function(e){
    //disable group scaling
    if(e.target.type === "activeSelection"){
        e.target.set({
            lockScalingX: true,
            lockScalingY: true,
            hasControls: false,
        });
    }
});



gridCanvas.on({
    'object:moving':(e)=>{
        if(checkLayerType() === "tile"){
            let top = closest(lineYN, e.target.top);
            let left = closest(lineXN, e.target.left);
            e.target.set({
                top: top,
                left: left,
            });
        }
        refreshData();
    }
});



gridCanvas.on({
    'mouse:up':(e)=>{
        //limit the mouse click detection inside boundBox
        let cursorX = gridCanvas.getPointer(e.e).x,
            cursorY = gridCanvas.getPointer(e.e).y;
        if(cursorY<boundBox.top || cursorY>boundBox.top+boundBox.height
            ||cursorX<boundBox.left ||cursorX>boundBox.left+boundBox.width){
            return;
        }
        if(checkLayerType() === "tile"){
            let top = closest(lineYN, cursorY-tileH/2);
            let left = closest(lineXN, cursorX-tileW/2);
            //need to clean the area
            if(clonedObject){
                clonedObject.clone(function(cloned) {
                    if (cloned.type === 'activeSelection') {
                        let width = cloned.width * cloned.scaleX;
                        let height = cloned.height * cloned.scaleY;
                        //clean area
                        let cloneTop = top-(Math.floor(height/tileH)*tileH)/2;
                        let cloneLeft = left-(Math.floor(width/tileW)*tileW)/2;
                        areaClean(width, height, closest(lineXN,cloneLeft+tileW/2), closest(lineYN,cloneTop+tileH/2));
                        cloned.set({
                            top: cloneTop,
                            left: cloneLeft,
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
        }else if(checkLayerType() === "object"){
            let top = cursorY-tileH/2;
            let left = cursorX-tileW/2;
            if(clonedObject){
                clonedObject.clone(function(cloned) {
                    if (cloned.type !== 'activeSelection') {
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
                            enableRetinaScaling:true,
                            id: curLayerSelected,
                        });
                        cloned.setCoords();
                        gridCanvas.add(cloned);
                        gridCanvas.setActiveObject(cloned);
                        currentTileset.discardActiveObject();//so we can select next one
                    }else{
                        currentTileset.discardActiveObject();//discard group selection for object layer
                    }
                });
            }else{return;}
        }
        //refresh canvas data after change
        refreshData();
    }
});


function areaClean(width, height, left, top){
    let col = Math.floor((width+tileW*(offset-1))/offset/tileW);
    let row = Math.floor((height+tileH*(offset-1))/offset/tileH);
    console.log("columns to clean:" + col);
    console.log("rows to clean:" + row);
    for(var i = 0; i < row; i++){
        for(var j = 0; j < col; j++){
            console.log("row:"+i+", col:"+j);
            gridCanvas.getObjects().forEach(item=>{
                if((item.id === curLayerSelected) && (item.left === left+j*tileW)
                    && (item.top === top + i*tileH)){
                    gridCanvas.remove(item);
                    gridCanvas.requestRenderAll();
                }
            });
        }
    }
}


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
    if(checkLayerType() === "tile"){
        gridCanvas.getActiveObject().clone(function(cloned) {
            _clipboard = cloned;
        });
    }
    else if(checkLayerType() === "object"){
        var obj = gridCanvas.getActiveObject();
        if(gridCanvas.getActiveObject().type !== 'activeSelection'){
            objScaleX = obj.scaleX;
            objScaleY = obj.scaleY;
            if(obj.width*objScaleX !== tileW || obj.height*objScaleY !== tileH){
                console.log("scaled!");
                obj.set({
                    scaleX: 1,
                    scaleY: 1,
                });
                gridCanvas.renderAll();
                obj.clone(function(cloned) {
                    _clipboard = cloned;
                });
                obj.set({
                    scaleX: objScaleX,
                    scaleY: objScaleY,
                });
                gridCanvas.renderAll();
            }else{
                gridCanvas.getActiveObject().clone(function(cloned) {
                    _clipboard = cloned;
                });
            }
        }else{
            gridCanvas.discardActiveObject();
        }
    }
}

function Paste() {
    // clone again, so you can do multiple copies.
    if(_clipboard){
        _clipboard.clone(function(cloned) {
            gridCanvas.discardActiveObject();
            cloned.set({
                top: cloned.top + tileH/2,
                left: cloned.left + tileW/2,
                evented: true,
            });
            //group clone - only for tile layer
            if (cloned.type === 'activeSelection' && checkLayerType() === "tile") {
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
            //single clone
            } else {
                if(checkLayerType() === "tile"){
                    cloned.set({
                        selectable: true,
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true,
                        id: curLayerSelected, //set id to layer id
                    });
                    cloned.setCoords();
                    gridCanvas.add(cloned);
                }else if(checkLayerType() === "object"){
                    cloned.set({
                        selectable: true,
                        id: curLayerSelected, //set id to layer id
                    });
                    //rescale
                    if(objScaleX !== 1 || objScaleY !== 1){
                        cloned.set({
                            scaleX: objScaleX,
                            scaleY: objScaleY,
                        });
                    }
                    cloned.setCoords();
                    gridCanvas.add(cloned);
                }
            }
            _clipboard.top += tileH/2;
            _clipboard.left += tileW/2;
            gridCanvas.setActiveObject(cloned);
            gridCanvas.requestRenderAll();
        });
    }else{console.log("empty clipboard");}
}



export function refreshData(){
    //moved object loss their url
    let map = JSON.parse(localStorage.getItem("map"));
    map.canvas = gridCanvas.toJSON();
    localStorage.setItem("map", JSON.stringify(map));
}


document.getElementById("selectBtn").addEventListener("click", clearUrl);
document.getElementById("eraseBtn").addEventListener("click", eraseTile);