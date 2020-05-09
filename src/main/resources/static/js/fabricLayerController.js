import {curLayerSelected} from "./layerController.js";
import {refreshData} from "./fabricTileStamp.js";

export function moveMapLayerUp() {
    console.log("moveup layer:" + curLayerSelected);
    gridCanvas.getObjects().forEach(item => {
        if (item.id === curLayerSelected) {
            gridCanvas.bringForward(item, true);
        }
    });
    gridCanvas.renderAll();
    refreshData();
}


export function moveMapLayerDown() {
    console.log("movedown layer:" + curLayerSelected);
    gridCanvas.getObjects().forEach(item => {
        if (item.id === curLayerSelected) {
            gridCanvas.sendBackwards(item, true);
        }
    });
    gridCanvas.renderAll();
    refreshData();
}


export function makeLayerInvisible(layerId) {
    gridCanvas.getObjects().forEach(item => {
        if (item.id == layerId) {
            item.set({opacity: 0});
        }
    });
    gridCanvas.renderAll();
}


export function makeLayerVisible(layerId) {
    gridCanvas.getObjects().forEach(item => {
        if (item.id == layerId) {
            item.set({opacity: 1});
        }
    });
    gridCanvas.renderAll();
}


export function lockLayer(layerId) {
    gridCanvas.getObjects().forEach(item => {
        if (item.id == layerId) {
            item.set({selectable: false});
        }
    });
    gridCanvas.renderAll();
}


export function unlockLayer(layerId) {
    gridCanvas.getObjects().forEach(item => {
        if (item.id == layerId) {
            item.set({selectable: true});
        }
    });
    gridCanvas.renderAll();
}

export function removeLayer(layerId) {
    gridCanvas.getActiveObjects().forEach(item => {
        if (item.id === layerId) {
            gridCanvas.remove(item);
        }
    });
    gridCanvas.renderAll();
    refreshData();
}

// document.getElementById("lockBtn").addEventListener("click", lockLayer);
// document.getElementById("unlockBtn").addEventListener("click", unlockLayer);
// document.getElementById("trasBtn").addEventListener("click", makeLayerInvisible);
// document.getElementById("noTrasBtn").addEventListener("click", makeLayerVisible);
