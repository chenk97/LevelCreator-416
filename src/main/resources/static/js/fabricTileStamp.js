var map = JSON.parse(localStorage.getItem('map'));


gridCanvas.on('selection:created',function(e){
    currentTarget = "";
    e.target.set({
        lockScalingX: true,
        lockScalingY: true,
        hasControls: false,
    });
});


gridCanvas.on({
    'object:selected': (e)=>{
        currentTarget = "";
    }
});


gridCanvas.on({
    'object:moving':(e)=>{
        let top = closest(lineYN, e.target.top);
        let left = closest(lineXN, e.target.left);
        e.target.set({
            top: top,
            left: left,
        })
    }
});


gridCanvas.on({
    'mouse:up':(e)=>{
        let top = closest(lineYN, gridCanvas.getPointer(e.e).y-tileH/2);
        let left = closest(lineXN, gridCanvas.getPointer(e.e).x-tileW/2);
        new fabric.Image.fromURL(currentTarget, function(im) {
            im.scaleToWidth(tileW);
            im.scaleToHeight(tileH);
            gridCanvas.add(im);
            im.set({
                top: top,
                left: left,
                selectable: true,
                hasControls: false,
            });
            im.lockScalingX = true;
            im.lockScalingY = true;
            im.setCoords();

        });

        var map = JSON.parse(localStorage.getItem("map"));

        for(var i = 0; i < map.layers.length; i ++){
            let layer = map.layers[i];
            if(layer.id === curLayerSelected){
                //as image object is not recoverable by loadfromJSON,
                //save info for rebuilding and image object
                let image = {src: currentTarget, top: top, left: left};
                layer.data.push(image);
                // console.log(JSON.stringify(JSON.stringify(im)));
                localStorage.setItem("map", JSON.stringify(map));
            }
        }

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


