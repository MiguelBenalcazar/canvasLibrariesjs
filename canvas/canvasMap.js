const container = document.getElementById('main-container');
const containerCanvas = document.getElementById('container');
const canvas_img = document.getElementById('canvasMap');
const canvas_layer = document.getElementById('canvasLayer');
const zoom_container = document.getElementById('zoom');


let canvasName = document.getElementById('canvasName');
let canvasHeight = document.getElementById('canvasHeight');
let canvasWidth = document.getElementById('canvasWidth');
let canvasScale = document.getElementById('canvasScale');
let canvasPercentage = document.getElementById('canvasPercentage');

var stage_img = new createjs.Stage("canvasMap");
var stage_layer = new createjs.Stage("canvasLayer");


stage_img.enableMouseOver(10);
stage_layer.enableMouseOver(10);


var containerSize = {
    width: container.clientWidth,
    height: container.clientHeight
}

// ------------------------------------------------------------------------------------------------------------
// ZOOM VARIABLES
// ------------------------------------------------------------------------------------------------------------
let mapName = "";

let size = {
    width: 0,
    height: 0
}

let currentSize = {
    width: 0,
    height: 0
}

let SCROLL_SENSITIVITY = 0.05;
let cameraZoom = 1;
let MIN_ZOOM = 0.2;
let MAX_ZOOM = 3;

let translation = {
    x: 0,
    y: 0
}

let clickPrevious = {
    x: 0,
    y: 0
}

let overCanvas = false;

function changeCursor(element, type) {
    element.style.cursor = type;
    element.style.cursor = `-moz-${type}`;
    element.style.cursor = `-webkit-${type}`;
}

function canvasLocation(canvas, translation) {
    canvas.style.top = `${translation.y}px`;
    canvas.style.left = `${translation.x}px`;
}

function updateContainerSize(containerSize) {
    containerSize = {
        width: container.clientWidth,
        height: container.clientHeight
    }
    return containerSize
}

function percentageZoom(scale, maxScale, minScale) {
    let slope = 100 / (maxScale - minScale);
    let y = slope * (scale - minScale);

    if (y > 100) {
        y = 100;
    }
    if (y < 0) {
        y = 0;
    }
    return `${y.toFixed(0)}%`;
}

function translationCanvas(containerSize, canvas, translation) {
    translation.x = (containerSize.width - canvas.width) / 2;
    translation.y = (containerSize.height - canvas.height) / 2;
    if (translation.x < 0) {
        translation.x = 0;
    }
    if (translation.y < 0) {
        translation.y = 0;
    }
    return translation
}

function canvasMapInformation() {
    canvasName.innerHTML = mapName;
    canvasHeight.innerHTML = canvas_img.height;
    canvasWidth.innerHTML = canvas_img.width;
    canvasScale.innerHTML = cameraZoom.toFixed(2);
    canvasPercentage.innerHTML = percentageZoom(cameraZoom, MAX_ZOOM, MIN_ZOOM);
}

function zoomIn() {
    if (cameraZoom < MAX_ZOOM) {
        cameraZoom = cameraZoom + SCROLL_SENSITIVITY

        //canvas
        currentSize.width = size.width * cameraZoom
        currentSize.height = size.height * cameraZoom
        canvas_img.height = canvas_layer.height = currentSize.height;
        canvas_img.width = canvas_layer.width = currentSize.width

        stage_layer.scale = cameraZoom;
        stage_img.scale = cameraZoom;

        stage_layer.update();
        stage_img.update();


    }

    changeCursor(canvas_layer, "zoom-in");
    canvasMapInformation();
    containerSize = updateContainerSize(containerSize)
    translation = translationCanvas(containerSize, canvas_img, translation)
    canvasLocation(canvas_img, translation)
    canvasLocation(canvas_layer, translation)
}

function zoomOut() {
    if (cameraZoom > MIN_ZOOM) {
        cameraZoom = cameraZoom - SCROLL_SENSITIVITY

        //canvas
        currentSize.width = size.width * cameraZoom
        currentSize.height = size.height * cameraZoom
        canvas_img.height = canvas_layer.height = currentSize.height;
        canvas_img.width = canvas_layer.width = currentSize.width


        stage_layer.scale = cameraZoom;
        stage_img.scale = cameraZoom;

        stage_layer.update();
        stage_img.update();


    }



    changeCursor(canvas_layer, "zoom-out");
    canvasMapInformation();
    containerSize = updateContainerSize(containerSize);
    translation = translationCanvas(containerSize, canvas_img, translation)
    canvasLocation(canvas_img, translation)
    canvasLocation(canvas_layer, translation)
}

container.addEventListener("wheel", (evt) => {
    if (evt.altKey) {
        evt.preventDefault();

        let scroll = evt.deltaY * -0.01;
        let offset = {
            x: containerCanvas.scrollLeft,
            y: containerCanvas.scrollTop
        };
        let image_loc = {
            x: evt.pageX + offset.x,
            y: evt.pageY + offset.y
        }

        let zoom_point = {
            x: image_loc.x / cameraZoom,
            y: image_loc.y / cameraZoom
        }

        if (scroll > 0) {
            zoomIn();
            let zoom_point_new = {
                x: zoom_point.x * cameraZoom,
                y: zoom_point.y * cameraZoom
            }

            let newScroll = {
                x: zoom_point_new.x - evt.pageX,
                y: zoom_point_new.y - evt.pageY
            }

            containerCanvas.scrollTop = newScroll.y
            containerCanvas.scrollLeft = newScroll.x
        } else {
            zoomOut();

            let zoom_point_new = {
                x: zoom_point.x * cameraZoom,
                y: zoom_point.y * cameraZoom
            }

            let newScroll = {
                x: zoom_point_new.x - evt.pageX,
                y: zoom_point_new.y - evt.pageY
            }

            containerCanvas.scrollTop = newScroll.y
            containerCanvas.scrollLeft = newScroll.x
        }




    }


});



// ------------------------------------------------------------------------------------------------------------
// LOAD IMAGE IN CANVAS
// ------------------------------------------------------------------------------------------------------------

var image = new Image();
// image.src = "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg";
// image.src = "./cat.jpg";
image.src = "./test.jpg"
mapName = image.src;
// wait to load the image
image.onload = (evt) => {

    var bitmap = new createjs.Bitmap(evt.target);

    size.width = canvas_img.width = canvas_layer.width = bitmap.image.width;
    size.height = canvas_img.height = canvas_layer.height = bitmap.image.height;

    currentSize.width = size.width
    currentSize.height = size.height

    var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(500, 120, 40).endFill();
    var circle1 = new createjs.Shape();
    circle1.graphics.beginFill("blue").drawCircle(5, 10, 25).endFill();

    stage_img.addChild(bitmap);
    stage_img.update();

    stage_layer.addChild(circle);
    stage_layer.addChild(circle1);
    stage_layer.update();

    canvasMapInformation();
    containerSize = updateContainerSize(containerSize);
    translation = translationCanvas(containerSize, canvas_img, translation)
    canvasLocation(canvas_img, translation)
    canvasLocation(canvas_layer, translation)


}


container.addEventListener("mouseover", (evt) => {
    zoom_container.style.display = 'inline';
});

container.addEventListener("mouseout", (evt) => {
    zoom_container.style.display = 'none';
});

container.addEventListener('mousedown', (evt) => {
    clickPrevious.x = evt.pageX;
    clickPrevious.y = evt.pageY;

    changeCursor(canvas_layer, "grab");

})

containerCanvas.addEventListener('mousemove', (evt) => {
    if (evt.buttons) {
        let dragX = 0;
        let dragY = 0;

        // skip the drag when the x position was not changed
        if (evt.pageX - clickPrevious.x !== 0) {
            dragX = clickPrevious.x - evt.pageX
            clickPrevious.x = evt.pageX
        }
        // skip the drag when the y position was not changed
        if (evt.pageY - clickPrevious.y !== 0) {
            dragY = clickPrevious.y - evt.pageY
            clickPrevious.y = evt.pageY
        }

        // scrollBy x and y
        if (dragX !== 0 || dragY !== 0) {
            containerCanvas.scrollBy(dragX, dragY)
        }

        changeCursor(canvas_layer, "grabbing");

    }
})



// ------------------------------------------------------------------------------------------------------------
// TEST 
// ------------------------------------------------------------------------------------------------------------


var variable_names = {};

function addCircle() {
    var border = 100
    for (i = 0; i < border; i++) {

        variable_names['robot_' + i] = new createjs.Shape();

        variable_names['robot_' + i].graphics.beginFill(getRandomColor()).drawCircle(0, 0, 10).endFill();
        variable_names['robot_' + i].x = getRandomArbitrary(0, size.width)
        variable_names['robot_' + i].y = getRandomArbitrary(0, size.height)
        variable_names['robot_' + i].name = 'robot_' + i
        stage_layer.addChild(variable_names['robot_' + i]);
        stage_layer.update();

        variable_names['robot_' + i].addEventListener('mouseover', handleMouseOver);

    }
}

// function handleTick_robot1(event) {
//     var shape = stage_layer.getChildByName("robot_1");
//     console.log(shape)

//     shape.y -= 10;
//     stage_layer.update();
// }



function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function handleMouseOver(evt) {
    evt.target.graphics.clear().beginFill('blue').drawCircle(51, 100, 100).endFill();
    evt.target.x = getRandomArbitrary(0, size.width)
    evt.target.y = getRandomArbitrary(0, size.height)
    stage_layer.update();
}


stage_layer.on("stagemousedown", (evt) => {
    let x = evt.stageX / stage_layer.scale;
    let y = evt.stageY / stage_layer.scale;

    var ellipse = new createjs.Shape();
    ellipse.graphics.beginStroke("black").drawRect(x - 25, y - 25, 50, 50).endStroke;
    //create shadow for the object
    ellipse.shadow = new createjs.Shadow('#000', 4, 4, 5);
    stage_layer.addChild(ellipse);
    stage_layer.update();

})