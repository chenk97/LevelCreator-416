var img = new Image(),
    imgW,
    imgH,
    tileW,
    tileH;

//draw with offset
var offset = 1.1;

function addFirstTileset(input){
    var canvas = document.getElementById("myCanvas"),
        ctx = canvas.getContext("2d");
    let project = JSON.parse(localStorage.getItem('project'));
    //creat new tileset object
    let newTileset = {
        firstgid : project.gidCnt,
        id: project.tilesets.length + 1,
        source: null,
        image: null
    };

    //get file name, the tab name ll be the same as it
    var fileInput = document.getElementById('realBtn');
    newTileset.source = fileInput.value.split(/(\\|\/)/g).pop();
    console.log(newTileset.source);

    //import image to local storage and load to table
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            // Save image into localStorage
            newTileset.image = e.target.result;//save image to localstorage
            console.log(newTileset.image);
            project.tilesets.push(newTileset);
            //delete original tab
            //add new tab
            img.onload = function(){
                init(canvas, ctx);
                var tiles = getTiles();
                drawTiles(tiles, ctx);
            };
            img.src = newTileset.image;
            try {
                localStorage.setItem("project", JSON.stringify(project));
                console.log("Storage success");
            }
            catch (e) {
                console.log("Storage failed: " + e);
            }
        };
        reader.readAsDataURL(input.files[0]);
        var fakeBtn = document.getElementById("fakeBtn");
        fakeBtn.style.display = "none";
        var firstTileset = document.getElementById("Tileset#1");
        firstTileset.style.maxHeight = "256px";
        firstTileset.style.overflow = "scroll";
    }

}


function addTileset(input){
    let project = JSON.parse(localStorage.getItem('project'));
    //creat new tileset object
    let newTileset = {
        firstgid : project.gidCnt,
        id: project.tilesets.length + 1,
        source: null,
        image: null
    };
    var canvas = addTileCanvas();
    console.log("canvas:"+ canvas);
    var ctx = canvas.getContext("2d");
    console.log(canvas);
    //get file name, the tab name ll be the same as it
    var fileInput = document.getElementById('fileBtn');
    newTileset.source = fileInput.value.split(/(\\|\/)/g).pop();
    console.log(newTileset.source);
    //import image to local storage and load to table
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            // Save image into localStorage
            newTileset.image = e.target.result;//save image to localstorage
            console.log(newTileset.image);
            project.tilesets.push(newTileset);
            img.onload = function(){
                init(canvas, ctx);
                var tiles = getTiles();
                drawTiles(tiles, ctx);
            };
            img.src = newTileset.image;

            try {
                localStorage.setItem("project", JSON.stringify(project));
                console.log("Storage success");
            }
            catch (e) {
                console.log("Storage failed: " + e);
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}


function init(canvas, ctx) {
    let project = JSON.parse(localStorage.getItem('project'));
    imgW = img.width;
    console.log(imgW);
    imgH = img.height;
    console.log(imgH);
    tileW = project.tileWidth;
    tileH = project.tileHeight;
    tileCountX = ~~(imgW / tileW);
    tileCountY = ~~(imgH / tileH);
    canvas.width = tileW*tileCountX + (tileCountX-1)* (tileW*(offset-1));
    canvas.height = tileH*tileCountY + (tileCountY-1)* (tileH*(offset-1));
    //check how many full tiles we can fit
    //right and bottom sides of the image will get cropped
    project.gidCnt += tileCountX * tileCountY;
    localStorage.setItem('project', JSON.stringify(project));
    console.log("xcount: " + tileCountX);
    console.log("ycount: " + tileCountY);
    console.log("counts: " + tileCountX * tileCountY);
    console.log("gid: " + project.gidCnt);
    ctx.drawImage(img, 0, 0);
    imgData = ctx.getImageData(0, 0, imgW, imgH).data;
    ctx.clearRect(0, 0, imgW, imgH);
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
    console.log("tiles array size:" + tiles.length);
    return tiles;
}


function drawTiles(tiles, ctx) {
    //loop through each tile in array
    tiles.forEach((d,i) => ctx.putImageData(d, d.x * offset, d.y * offset));
}


// function removeElement(elementId) {
//     // Removes an element from the document
//     var element = document.getElementById(elementId);
//     element.remove();
// }

//
function addTileCanvas(){
    var id = $(".nav-tabs").children().length + 1;
    $(".nav-tabs").append(`<li class="nav-item"><a class="nav-link" id = "tileset${id}" href="#tileset_${id}">Tileset#${id}</a></li>`);
    $('.tab-content').append(`<div class="tab-pane" id="tileset_${id}" style="overflow: scroll;max-height:256px;"><canvas id ="canvas_${id}"/></div>`);
    $(`a[href="#tileset_${id}"]`).click();
    var canvas = document.getElementById("canvas_"+id);
    return canvas;
}


