import {curLayerSelected} from "./layerController.js";
import {refreshData} from "./fabricTileStamp.js";

function moveLayerUp(){
    console.log("moveup layer:"+curLayerSelected);
    gridCanvas.getObjects().forEach(item=>{
        if(item.id===curLayerSelected){
            gridCanvas.bringForward(item,true);
        }
    });
    gridCanvas.renderAll();
    refreshData();
}


function moveLayerDown(){
    console.log("movedown layer:"+curLayerSelected);
    gridCanvas.getObjects().forEach(item=>{
        if(item.id===curLayerSelected){
            gridCanvas.sendBackwards(item,true);
        }
    });
    gridCanvas.renderAll();
    refreshData();
}


function makeLayerInvisible(){
    gridCanvas.getObjects().forEach(item=>{
        if(item.id===curLayerSelected){
            item.set({opacity: 0});
        }
    });
    gridCanvas.renderAll();
}


function makeLayerVisible(){
    gridCanvas.getObjects().forEach(item=>{
        if(item.id===curLayerSelected){
            item.set({opacity: 1});
        }
    });
    gridCanvas.renderAll();
}


function lockLayer(){
    gridCanvas.getObjects().forEach(item=>{
        if(item.id===curLayerSelected){
            item.set({selectable:false});
        }
    });
    gridCanvas.renderAll();
}


function unlockLayer(){
    gridCanvas.getObjects().forEach(item=>{
        if(item.id===curLayerSelected){
            item.set({selectable:true});
        }
    });
    gridCanvas.renderAll();
}

function removeLayer(layerId){
    gridCanvas.getActiveObjects().forEach(item=>{
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
document.getElementById("upBtn").addEventListener("click", moveLayerUp);
document.getElementById("downBtn").addEventListener("click", moveLayerDown);