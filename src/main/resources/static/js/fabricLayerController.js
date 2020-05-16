import {curLayerSelected} from "./layerController.js";
import {refreshData} from "./fabricTileStamp.js";
import {checkMapType} from "./fabricTileStamp.js";

export function moveMapLayerUp() {
    console.log("moveup layer:" + curLayerSelected);
    gridCanvas.getObjects().forEach(item => {
        if (item.layer === curLayerSelected) {
            gridCanvas.bringForward(item, true);
        }
    });
    gridCanvas.renderAll();
    refreshData();
}


export function moveMapLayerDown() {
    console.log("movedown layer:" + curLayerSelected);
    gridCanvas.getObjects().forEach(item => {
        if (item.layer === curLayerSelected) {
            gridCanvas.sendBackwards(item, true);
        }
    });
    gridCanvas.renderAll();
    refreshData();
}


export function makeLayerInvisible(layerId) {
    gridCanvas.getObjects().forEach(item => {
        if (item.layer == layerId) {
            console.log(item.layer)
            item.set({opacity: 0});
        }
    });
    gridCanvas.renderAll();
}


export function makeLayerVisible(layerId) {
    gridCanvas.getObjects().forEach(item => {
        if (item.layer == layerId) {
            item.set({opacity: 1});
        }
    });
    gridCanvas.renderAll();
}


export function lockLayer(layerId) {
    gridCanvas.getObjects().forEach(item => {
        if (item.layer == layerId) {
            item.set({selectable: false});
        }
    });
    gridCanvas.renderAll();
}


export function unlockLayer(layerId) {
    gridCanvas.getObjects().forEach(item => {
        if (item.layer == layerId) {
            item.set({selectable: true});
        }
    });
    gridCanvas.renderAll();
}

export function removeLayer(layerId) {
    gridCanvas.getObjects().forEach(item => {
        if (item.layer === layerId) {
            console.log(item);
            gridCanvas.remove(item);
        }
    });
    gridCanvas.discardActiveObject();
    gridCanvas.renderAll();
    refreshData();
}


export function getLayerStack(){
    let layerStack = [];
    $('ul#layerList').each(function() {
        $(this).find('li').each(function(){
            layerStack.push( $(this).attr('id') );
        });
    });
    return layerStack;
}


function checkPrint(){
    console.log(getLayerStack());
}


export function restackLayer() {
    let layerStack = getLayerStack();
    for(let i = 0; i < layerStack.length; i++){
        gridCanvas.getObjects().forEach(item => {
            if(item.layer==layerStack[i]){
                gridCanvas.sendToBack(item);
            }
        });
        if(checkMapType() === "Orthogonal"){
            lineX.forEach(line=>{
                gridCanvas.sendToBack(line);
            });
            lineY.forEach(line=>{
                gridCanvas.sendToBack(line);
            });
        }else if(checkMapType() === "Isometric"){
            isoLines.forEach(line=>{
                gridCanvas.sendToBack(line);
            });
        }
    }
    gridCanvas.renderAll();
}

// function trans(){
//     boundBox.set({stroke:'transparent'});
//     lineX.forEach(line=>{
//         line.set({stroke:'transparent'});
//     });
//     lineY.forEach(line=>{
//         line.set({stroke:'transparent'});
//     });
//     gridCanvas.renderAll();
// }

// document.getElementById("lockBtn").addEventListener("click", trans);
// document.getElementById("unlockBtn").addEventListener("click", unlockLayer);
// document.getElementById("trasBtn").addEventListener("click", makeLayerInvisible);
// document.getElementById("noTrasBtn").addEventListener("click", makeLayerVisible);
