var img = new Image(),
    imgW,
    imgH,
    tileW,
    tileH;

//draw with offset
var offset = 1.1;
var clonedObject;

function addTileset(input){
    console.log("adding tileset...");
    var fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('id', '_fake_canvas');
    var ctx = fakeCanvas.getContext("2d");
    let map = JSON.parse(localStorage.getItem('map'));
    var canvas = addTileCanvas(newCanvasId());
    let newTileset = {
        id: newCanvasId(),
        image: null,
        canvasId : canvas.id,
    };
    //get file name, the tab name ll be the same as it
    // var fileInput = document.getElementById('fileBtn');
    // newTileset.source = fileInput.value.split(/(\\|\/)/g).pop();
    //import image to local storage and load to table
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            // Save image into localStorage
            newTileset.image = e.target.result;//save image to localstorage
            img.src = newTileset.image;
            img.onload = function(){
                init(fakeCanvas, ctx);
                var tiles = getTiles();
                var fabricCanvas = new fabric.Canvas(canvas.id,{
                    width: tileW*tileCountX + (tileCountX-1)* (tileW*(offset-1)) + 20,
                    height: tileH*tileCountY + (tileCountY-1)* (tileH*(offset-1)) + 20,
                    selectable:false,
                });
                drawTiles(tiles, fabricCanvas);
                fakeCanvas = null;
                $('#_fake_canvas').remove();
            };
            try {
                map.tilesets.push(newTileset);
                localStorage.setItem("map", JSON.stringify(map));
                console.log("Storage success");
            }
            catch (e) {
                console.log("Storage failed: " + e);
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}


function saveDrawnTileset() {
    let customizedImg = lc.getImage().toDataURL();
    let fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('id', '_fake_canvas');
    let ctx = fakeCanvas.getContext("2d");
    let map = JSON.parse(localStorage.getItem('map'));
    let canvas = addTileCanvas(newCanvasId());
    let newTileset = {
        id: newCanvasId(),
        image: null,
        canvasId : canvas.id,
    };
    newTileset.image = customizedImg;
    img.src = customizedImg;
    img.onload = function(){
        init(fakeCanvas, ctx);
        var tiles = getTiles();
        var fabricCanvas = new fabric.Canvas(canvas.id,{
            width: tileW*tileCountX + (tileCountX-1)* (tileW*(offset-1)) + 20,
            height: tileH*tileCountY + (tileCountY-1)* (tileH*(offset-1)) + 20,
            selectable:false,
        });
        drawTiles(tiles, fabricCanvas);

        fakeCanvas = null;
        $('#_fake_canvas').remove();
    };
    map.tilesets.push(newTileset);
    localStorage.setItem("map", JSON.stringify(map));
}


function init(canvas, ctx) {
    let map = JSON.parse(localStorage.getItem('map'));
    imgW = img.width;
    console.log(imgW);
    imgH = img.height;
    console.log(imgH);
    tileW = map.tileWidth;
    tileH = map.tileHeight;
    tileCountX = ~~(imgW / tileW);
    tileCountY = ~~(imgH / tileH);
    canvas.width = tileW*tileCountX + (tileCountX-1)* (tileW*(offset-1));
    canvas.height = tileH*tileCountY + (tileCountY-1)* (tileH*(offset-1));
    //check how many full tiles we can fit
    //right and bottom sides of the image will get cropped
    // map.gidCnt += tileCountX * tileCountY;
    // localStorage.setItem('map', JSON.stringify(map));
    console.log("xcount: " + tileCountX);
    console.log("ycount: " + tileCountY);
    console.log("counts: " + tileCountX * tileCountY);
    ctx.drawImage(img, 0, 0);
    imgData = ctx.getImageData(0, 0, imgW, imgH).data;
    // ctx.clearRect(0, 0, imgW, imgH);
}


//get imgdata index from img px positions
function indexX(x) {
    var i = x * 4;
    if (i > imgData.length) console.warn("X out of bounds");
    return i;
}
function indexY(y) {
    var i = imgW * 4 * y;
    if (i > imgData.length) console.warn("Y out of bounds");
    return i;
}
function getIndex(x, y) {
    var i = indexX(x) + indexY(y);
    if (i > imgData.length) console.warn("XY out of bounds");
    return i;
}

//get a tile of size tileW*tileH from position xy
function getTile(x, y) {
    var tile = [];
    //loop over rows
    for (var i = 0; i < tileH; i++) {
        //slice original image from x to x + tileW, concat
        tile.push(...imgData.slice(getIndex(x, y + i), getIndex(x + tileW, y + i)));
    }
    //convert back to typed array and to imgdata object
    tile = new ImageData(new Uint8ClampedArray(tile), tileW, tileH);
    //save original position
    tile.x = x;
    tile.y = y;
    return tile;
}


//generate all tiles
function getTiles() {
    var tiles = [];
    for (var yi = 0; yi < tileCountY; yi++) {
        for (var xi = 0; xi < tileCountX; xi++) {
            tiles.push(getTile(xi * tileW, yi * tileH));
        }
    }
    return tiles;
}


function drawTiles(tiles, fabricCanvas) {
    //loop through each tile in array
    let map = JSON.parse(localStorage.getItem('map'));
    for(var i = 0; i < tiles.length; i++){
        var c = document.createElement('canvas');
        c.setAttribute('id', '_temp_canvas');
        var ctx = c.getContext('2d');
        c.width = map.tileWidth;
        c.height = map.tileHeight;
        let d = tiles[i];
        c.getContext('2d').putImageData(d, 0, 0);
        var image = fabric.Image.fromURL(c.toDataURL(), function(img) {
            img.left = d.x * offset + 10;
            img.top = d.y * offset + 10;
            fabricCanvas.add(img);
            // img.bringToFront();
            img.lockMovementX = true;
            img.lockMovementY = true;
            img.lockScalingX = true;
            img.lockScalingY = true;
            img.hasControls = false;
            img.setCoords();
            c = null;
            $('#_temp_canvas').remove();
            // fabricCanvas.renderAll();
        });
    }

    fabricCanvas.on('selection:created',function(e){
        //try group selection here
        e.target.set({
            selectable: true,
            lockScalingX: true,
            lockScalingY: true,
            lockMovementX: true,
            lockMovementY: true,
            hasControls: false,
        });

        let obj = fabricCanvas.getActiveObject();

        obj.clone(function(cloned) {
            clonedObject = cloned;
            if(obj.type !== 'activeSelection'){
                fabricCanvas.discardActiveObject();
            }
        });

    });

    // tiles.forEach((d,i) => ctx.putImageData(d, d.x * offset, d.x * offset));
}


function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.remove();
}


function newCanvasId(){
    let map = JSON.parse(localStorage.getItem('map'));
    var id;
    if(map.tilesets.length === 0){
        id = 1;
    }else{
        id = map.tilesets[map.tilesets.length - 1].id + 1;
    }
    return id;
}


function addTileCanvas(id){
    $(".nav-tabs").append(`<li class="nav-item"><a class="nav-link" id = "tileset${id}" href="#tileset_${id}" data-toggle="tab">Tileset#${id}</a></li>`);
    $('.tab-content').append(`<div class="tab-pane" id="tileset_${id}" style="overflow: auto;max-height:300px;"><canvas id ="canvas_${id}"/></div>`);
    $(`a[href="#tileset_${id}"]`).click();
    var canvas = document.getElementById("canvas_"+id);
    return canvas;
}


function reloadTileset(){
    let map = JSON.parse(localStorage.getItem('map'));
    for(var i = 0; i < map.tilesets.length; i++ ){
        var tileset = map.tilesets[i];
        var canvas = addTileCanvas(tileset.id);
        img.src = tileset.image;
        console.log(img.src);
        img.onload = function(){
            var fakeCanvas = document.createElement('canvas');
            fakeCanvas.setAttribute('id', '_fake_canvas');
            var ctx = fakeCanvas.getContext("2d");
            init(fakeCanvas, ctx);
            var tiles = getTiles();
            var fabricCanvas = new fabric.Canvas(canvas.id,{
                width: tileW*tileCountX + (tileCountX-1)* (tileW*(offset-1)) + 20,
                height: tileH*tileCountY + (tileCountY-1)* (tileH*(offset-1)) + 20,
                selectable:false,
            });
            drawTiles(tiles, fabricCanvas);
            fakeCanvas = null;
            $('#_fake_canvas').remove();
        };
    }
}


reloadTileset();