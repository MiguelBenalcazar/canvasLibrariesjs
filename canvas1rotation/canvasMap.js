const container = document.getElementById("main-container");
const containerCanvas = document.getElementById("container");
const canvas_img = document.getElementById("canvasMap");

const zoom_container = document.getElementById("zoom");

let canvasName = document.getElementById("canvasName");
let canvasHeight = document.getElementById("canvasHeight");
let canvasWidth = document.getElementById("canvasWidth");
let canvasScale = document.getElementById("canvasScale");
let canvasPercentage = document.getElementById("canvasPercentage");
let rotationDeg = document.getElementById("rotationDeg");
let fps = document.getElementById("fps");

var stage_img = new createjs.Stage("canvasMap");
var containerCreatejs = new createjs.Container();

let refreshFrequency = 30;

stage_img.enableMouseOver(10);

var containerSize = {
  width: container.clientWidth,
  height: container.clientHeight,
};

// ------------------------------------------------------------------------------------------------------------
// ZOOM VARIABLES
// ------------------------------------------------------------------------------------------------------------
let mapName = "";

let size = {
  width: 0,
  height: 0,
};

let currentSize = {
  width: 0,
  height: 0,
};

let originalSize = {
  width: 0,
  height: 0,
};

let translationOriginal = {
  x: 0,
  y: 0,
};

let SCROLL_SENSITIVITY = 0.05;
let cameraZoom = 1;
let MIN_ZOOM = 0.2;
let MAX_ZOOM = 3;

let translation = {
  x: 0,
  y: 0,
};

let clickPrevious = {
  x: 0,
  y: 0,
};

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

// function divLocation(div, translation) {
//     div.style.transform = `translate(${translation.x}px,${translation.y}px)`;
// }

function updateContainerSize(containerSize) {
  containerSize = {
    width: container.clientWidth,
    height: container.clientHeight,
  };
  return containerSize;
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
  return `${y.toFixed(0)} % `;
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
  return translation;
}

function rotationShow() {
  let deg = 0;
  if (containerCreatejs.rotation < 0) {
    deg = (360 + containerCreatejs.rotation).toFixed(0);
  } else {
    deg = containerCreatejs.rotation.toFixed(0);
  }
  if (deg >= 360) {
    deg = 0;
  }
  return deg;
}

function canvasMapInformation() {
  let mapNamelast = mapName.split("/");
  canvasName.innerHTML = mapNamelast[mapNamelast.length - 1];
  canvasHeight.innerHTML = (originalSize.height * cameraZoom).toFixed(0);
  canvasWidth.innerHTML = (originalSize.width * cameraZoom).toFixed(0);
  canvasScale.innerHTML = cameraZoom.toFixed(2);
  canvasPercentage.innerHTML = percentageZoom(cameraZoom, MAX_ZOOM, MIN_ZOOM);
  rotationDeg.innerHTML = rotationShow();
  fps.innerHTML = refreshFrequency;
}

function zoomIn() {
  if (cameraZoom < MAX_ZOOM) {
    cameraZoom = cameraZoom + SCROLL_SENSITIVITY;

    //canvas
    currentSize.width = size.width * cameraZoom;
    currentSize.height = size.height * cameraZoom;
    canvas_img.height = currentSize.height;
    canvas_img.width = currentSize.width;

    // stage_layer.scale = cameraZoom;
    stage_img.scale = cameraZoom;
  }

  changeCursor(canvas_img, "zoom-in");

  containerSize = updateContainerSize(containerSize);
  translation = translationCanvas(containerSize, canvas_img, translation);
  canvasLocation(canvas_img, translation);
}

function zoomOut() {
  if (cameraZoom > MIN_ZOOM) {
    cameraZoom = cameraZoom - SCROLL_SENSITIVITY;

    //canvas
    currentSize.width = size.width * cameraZoom;
    currentSize.height = size.height * cameraZoom;
    canvas_img.height = currentSize.height;
    canvas_img.width = currentSize.width;

    stage_img.scale = cameraZoom;
  }

  changeCursor(canvas_img, "zoom-out");

  containerSize = updateContainerSize(containerSize);
  translation = translationCanvas(containerSize, canvas_img, translation);
  canvasLocation(canvas_img, translation);
}

container.addEventListener("wheel", (evt) => {
  if (evt.altKey) {
    evt.preventDefault();

    let scroll = evt.deltaY * -0.01;
    let offset = {
      x: containerCanvas.scrollLeft,
      y: containerCanvas.scrollTop,
    };
    let image_loc = {
      x: evt.pageX + offset.x,
      y: evt.pageY + offset.y,
    };

    let zoom_point = {
      x: image_loc.x / cameraZoom,
      y: image_loc.y / cameraZoom,
    };

    if (scroll > 0) {
      zoomIn();
      let zoom_point_new = {
        x: zoom_point.x * cameraZoom,
        y: zoom_point.y * cameraZoom,
      };

      let newScroll = {
        x: zoom_point_new.x - evt.pageX,
        y: zoom_point_new.y - evt.pageY,
      };

      containerCanvas.scrollTop = newScroll.y;
      containerCanvas.scrollLeft = newScroll.x;
    } else {
      zoomOut();

      let zoom_point_new = {
        x: zoom_point.x * cameraZoom,
        y: zoom_point.y * cameraZoom,
      };

      let newScroll = {
        x: zoom_point_new.x - evt.pageX,
        y: zoom_point_new.y - evt.pageY,
      };

      containerCanvas.scrollTop = newScroll.y;
      containerCanvas.scrollLeft = newScroll.x;
    }
  }
});

// ------------------------------------------------------------------------------------------------------------
// LOAD IMAGE IN CANVAS
// ------------------------------------------------------------------------------------------------------------

createjs.Ticker.setFPS(refreshFrequency);
createjs.Ticker.addEventListener("tick", function () {
  stage_img.update();
  canvasMapInformation();
});

// ------------------------------------------------------------------------------------------------------------
// LOAD IMAGE IN CANVAS
// ------------------------------------------------------------------------------------------------------------

var image = new Image();
// image.src = "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg";
// image.src = "./cat.jpg";
image.src = "./test.jpg";
mapName = image.src;
// wait to load the image
image.onload = (evt) => {
  var bitmap = new createjs.Bitmap(evt.target);
  console.log("sdfsdf");
  console.log(bitmap);
  console.log("----");

  originalSize.width = bitmap.image.width;
  originalSize.height = bitmap.image.height;

  let h = Math.sqrt(
    Math.pow(bitmap.image.width, 2) + Math.pow(bitmap.image.height, 2)
  );
  size.width = size.height = h;

  bitmap.x = h / 2 - originalSize.width / 2;
  bitmap.y = h / 2 - originalSize.height / 2;

  canvas_img.width = h;
  canvas_img.height = h;
  stage_img.canvas.width = h;
  stage_img.canvas.height = h;

  currentSize.width = size.width;
  currentSize.height = size.height;

  translationOriginal.x = h / 2 - originalSize.width / 2;
  translationOriginal.y = h / 2 - originalSize.height / 2;

  // var circle = new createjs.Shape();
  // circle.graphics.beginFill("red").drawCircle(500 + translationOriginal.x, 120 + translationOriginal.y, 40).endFill();
  // var circle1 = new createjs.Shape();
  // circle1.graphics.beginFill("blue").drawCircle(5 + translationOriginal.x, 10 + translationOriginal.y, 25).endFill();

  containerCreatejs.addChild(bitmap);
  // containerCreatejs.addChild(circle);
  // containerCreatejs.addChild(circle1);

  containerCreatejs.regX = h / 2;
  containerCreatejs.regY = h / 2;

  containerCreatejs.x = h / 2;
  containerCreatejs.y = h / 2;

  stage_img.addChild(containerCreatejs);

  // stage_img.regX = h / 2;
  // stage_img.regY = h / 2;
  // stage_img.x = h / 2;
  // stage_img.y = h / 2;

  containerSize = updateContainerSize(containerSize);
  translation = translationCanvas(containerSize, canvas_img, translation);
  canvasLocation(canvas_img, translation);
};

container.addEventListener("mouseover", (evt) => {
  zoom_container.style.display = "inline";
});

container.addEventListener("mouseout", (evt) => {
  zoom_container.style.display = "none";
});

containerCanvas.addEventListener("mousedown", (evt) => {
  evt.preventDefault();
  if (evt.altKey && evt.ctrlKey && evt.buttons == 4  ) {
    console.log(evt)
    // clickPrevious.x = evt.pageX ;
    // clickPrevious.y = evt.pageY ;
    clickPrevious.x = evt.layerX ;
    clickPrevious.y = evt.layerY ;
 

    console.log("ECUADOR");
    console.log(clickPrevious);
    console.log(stage_img.scale)
    changeCursor(canvas_img, "grab");
  }
});

containerCanvas.addEventListener("mousemove", (evt) => {
  evt.preventDefault();
  if (evt.altKey &&  evt.ctrlKey &&  evt.buttons == 4 ) {
    let dragX = 0;
    let dragY = 0;

    // let x = evt.pageX;
    // let y = evt.pageY;

    let x = evt.layerX;
    let y = evt.layerY;

    console.log(x, y);
    // skip the drag when the x position was not changed
    if (x - clickPrevious.x !== 0) {
      dragX = clickPrevious.x - x;
      clickPrevious.x = x;
    }
    // skip the drag when the y position was not changed
    if (y - clickPrevious.y !== 0) {
      dragY = clickPrevious.y - y;
      clickPrevious.y = y;
    }

    // scrollBy x and y
    if (dragX !== 0 || dragY !== 0) {
      containerCanvas.scrollBy(dragX, dragY);
    }

    changeCursor(canvas_img, "grabbing");
    clickPrevious.x = x ;
    clickPrevious.y = y ;
  }
});

// ------------------------------------------------------------------------------------------------------------
// ROTATION
// ------------------------------------------------------------------------------------------------------------
function deg2rad(deg) {
  return (deg * Math.PI) / 180;
}

function rad2deg(rad) {
  return (rad * 180) / Math.PI;
}

function rotate() {
  let rotationDeg = 90;
  containerCreatejs.rotation = containerCreatejs.rotation + rotationDeg;

  if (containerCreatejs.rotation >= 360) {
    containerCreatejs.rotation = containerCreatejs.rotation - 360;
  }
}

let startAngle = 0;
let rotationFlag = false;
let rotationFlagEnable = false;

canvas_img.addEventListener("mousemove", (evt) => {
  if (rotationFlag) {
    if (evt.buttons == 1 && evt.altKey && evt.ctrlKey) {
      rotationFlagEnable = true;
    } else {
      rotationFlagEnable = false;
    }
  } else {
    rotationFlagEnable = false;
  }
});

stage_img.on("stagemouseup", (evt) => {
  evt.preventDefault();
  rotationFlag = false;
});

stage_img.on("stagemousedown", (evt) => {
  evt.preventDefault();

  let x = evt.stageX / stage_img.scale;
  let y = evt.stageY / stage_img.scale;

  let center = {
    x: containerCreatejs.regX,
    y: containerCreatejs.regY,
  };

  let get_x = x - center.x;
  let get_y = y - center.y;
  startAngle = containerCreatejs.rotation - rad2deg(Math.atan2(get_y, get_x));
  rotationFlag = true;
});

stage_img.on("stagemousemove", (evt) => {
  evt.preventDefault();

  if (rotationFlag && rotationFlagEnable) {
    let x = evt.stageX / stage_img.scale;
    let y = evt.stageY / stage_img.scale;

    let center = {
      x: containerCreatejs.regX,
      y: containerCreatejs.regY,
    };

    let get_x = x - center.x;
    let get_y = y - center.y;

    let angle = rad2deg(Math.atan2(get_y, get_x)) + startAngle;
    containerCreatejs.rotation = angle;
    // stage_img.rotation = angle
    // canvas_img.style.webkitTransform = 'rotate(' + angle + 'deg)';
  } else {
    rotationFlag = false;
    rotationFlagEnable = false;
  }
});

// ------------------------------------------------------------------------------------------------------------
// TEST
// ------------------------------------------------------------------------------------------------------------

var variable_names = {};

function addCircle() {
  var border = 100;
  for (i = 0; i < border; i++) {
    variable_names["robot_" + i] = new createjs.Shape();

    variable_names["robot_" + i].graphics
      .beginFill(getRandomColor())
      .drawCircle(0, 0, 10)
      .endFill();
    variable_names["robot_" + i].x = getRandomArbitrary(0, originalSize.width);
    variable_names["robot_" + i].y = getRandomArbitrary(0, originalSize.height);
    variable_names["robot_" + i].name = "robot_" + i;
    containerCreatejs.addChild(variable_names["robot_" + i]);
    // stage_layer.addChild(variable_names['robot_' + i]);
    // stage_layer.update();

    variable_names["robot_" + i].addEventListener("mouseover", handleMouseOver);
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
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function handleMouseOver(evt) {
  evt.target.graphics
    .clear()
    .beginFill("blue")
    .drawCircle(51, 100, 100)
    .endFill();
  evt.target.x = getRandomArbitrary(0, size.width);
  evt.target.y = getRandomArbitrary(0, size.height);
  // stage_layer.update();
}

function insertImage() {
  var circle = new createjs.Shape();
  circle.graphics
    .beginFill("red")
    .drawCircle(500 + translationOriginal.x, 120 + translationOriginal.y, 40)
    .endFill();
  var circle1 = new createjs.Shape();
  circle1.graphics
    .beginFill("blue")
    .drawCircle(0 + translationOriginal.x, 0 + translationOriginal.y, 25)
    .endFill();
  var circle2 = new createjs.Shape();
  circle2.graphics
    .beginFill("green")
    .drawCircle(
      originalSize.width + translationOriginal.x,
      originalSize.height + translationOriginal.y,
      25
    )
    .endFill();

  containerCreatejs.addChild(circle);
  containerCreatejs.addChild(circle1);
  containerCreatejs.addChild(circle2);
}

// stage_img.on("stagemousedown", (evt) => {
//   evt.preventDefault();

//   let x = evt.stageX / stage_img.scale;
//   let y = evt.stageY / stage_img.scale;

//   let pt = stage_img.localToGlobal(x, y);
//   let newCoordinates = containerCreatejs.globalToLocal(pt.x, pt.y);

//   var ellipse = new createjs.Shape();
//   ellipse.graphics
//     .beginStroke("black")
//     .drawRect(newCoordinates.x - 25, newCoordinates.y - 25, 50, 50).endStroke;
//   //create shadow for the object
//   ellipse.shadow = new createjs.Shadow("#000", 4, 4, 5);
//   // stage_img.addChild(ellipse);
//   containerCreatejs.addChild(ellipse);
//   // stage_layer.update();
// });
