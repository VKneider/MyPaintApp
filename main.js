//Main Variables
let CANVAS = document.getElementById("myCanvas");
let CTX = CANVAS.getContext("2d");
let METHOD = "brush";
let MODE = "stroke";
let DRAWING = false;
let prevX, prevY;
let SNAPSHOT;
let RADIUS;
let BACKGROUND = "#ffffff";
let lastColor;
let lastContext = {
    strokeStyle: "#000000",
    fillStyle: "#000000",
    lineWidth: CTX.lineWidth
};
let ACTUAL;
let SPIKES = 5;
let SIDES = 5;

//Background Canvas
let BACKGROUND_CANVAS = document.getElementById("background");
let BACKGROUND_CTX = BACKGROUND_CANVAS.getContext("2d");

//Color Variables
let colorsContainer = document.getElementById("colors");
let COLOR_CIRCLES = document.getElementsByClassName("circle");

//Tools variables
let toolsContainer = document.getElementById("tools");

//figures variables
let shapesContainer = document.getElementById("figures");

//options variables
let optionsContainer = document.getElementById("options");
let colors = ["white", "black", "gray", "blue", "red", "yellow", "green", "purple", "orange", "pink", "custom"];

//Command Registry Variables
let COMMANDS = [];
let AUX = [];
let LAST;

//HTML Front Button and Inputs Declarations
let activateSquare = document.getElementById("square-btn");
let activateCircle = document.getElementById("circle-btn");
let activateTriangle = document.getElementById("triangle-btn");
let activateBrush = document.getElementById("brush-btn");
let activateEraser = document.getElementById("eraser-btn");
let moreWidth = document.getElementById("moreWidth");
let lessWidth = document.getElementById("lessWidth");
let clearCanvasBtn = document.getElementById("clearCanvas-btn");
let modeFill = document.getElementById("fill-color-btn");
let modeFillShape = document.getElementById("fill-shape-btn");
let modeStroke = document.getElementById("stroke-shape-btn");
let backgroundInput = document.getElementById("background-color");
let colorInput = document.getElementById("custom-color");
let changeBackground = document.getElementById("change-background-btn");
let downloadBtn = document.getElementById("download-btn");
let activateStar = document.getElementById("star-btn");
let activateHeart = document.getElementById("heart-btn");
let activateArrow = document.getElementById("arrow-btn");
let activatePolygon = document.getElementById("polygon-btn");

backgroundInput.value = "#ffffff";
colorInput.value = "#ffffff";

// Event Listeners
changeBackground.addEventListener("click", () => {
    if (backgroundInput.value == "#ffffff") return;
    BACKGROUND = backgroundInput.value;
    BACKGROUND_CTX.fillStyle = BACKGROUND;
    BACKGROUND_CTX.rect(0, 0, BACKGROUND_CANVAS.width, BACKGROUND_CANVAS.height);
    BACKGROUND_CTX.fill();
    CTX.clearRect(0, 0, CANVAS.height, CANVAS.width);
    reDraw(CTX);
    CTX.lineWidth = lastContext.lineWidth;
    CTX.strokeStyle = lastContext.strokeStyle;
    CTX.fillStyle = lastContext.fillStyle;
});

moreWidth.addEventListener("click", () => {
    CTX.lineWidth += 5;
    
});
lessWidth.addEventListener("click", () => {
    CTX.lineWidth -= 5;

});



clearCanvasBtn.addEventListener("click", () => {
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    COMMANDS = [];
});

activateStar.addEventListener("click", () => {
    METHOD = "star";
});
activateBrush.addEventListener("click", () => {
    METHOD = "brush";
});
activateSquare.addEventListener("click", () => {
    METHOD = "square";
});
activateCircle.addEventListener("click", () => {
    METHOD = "circle";
});
activateTriangle.addEventListener("click", () => {
    METHOD = "triangle";
});
activateEraser.addEventListener("click", () => {
    METHOD = "eraser";
});
activateHeart.addEventListener("click", () => {
    METHOD = "heart";
});
activateArrow.addEventListener("click", () => {
    METHOD = "arrow";
});

activatePolygon.addEventListener("click", () => {
    METHOD = "polygon";
});

modeFill.addEventListener("click", () => {
    MODE = "fill";
});
modeStroke.addEventListener("click", () => {
    MODE = "stroke";
});
modeFillShape.addEventListener("click", () => {
    MODE = "fill-shape";
});

downloadBtn.addEventListener("click", () => {
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    reDraw(BACKGROUND_CTX);
    saveCanvas();
    BACKGROUND_CTX.clearRect(0, 0, BACKGROUND_CANVAS.width, BACKGROUND_CANVAS.height);
    if (BACKGROUND == "#ffffff") {
        reDraw(CTX);
    } else {
        console.log(BACKGROUND);
        BACKGROUND_CTX.fillStyle = BACKGROUND;
        BACKGROUND_CTX.rect(0, 0, BACKGROUND_CANVAS.width, BACKGROUND_CANVAS.height);
        BACKGROUND_CTX.fill();
        reDraw(CTX);
        CTX.lineWidth = lastContext.lineWidth;
        CTX.strokeStyle = lastContext.strokeStyle;
        CTX.fillStyle = lastContext.fillStyle;
    }
});

CANVAS.addEventListener("mousedown", startPath);

CANVAS.addEventListener("mousemove", e => {
    if (!DRAWING) return;
    draw(e);
});

CANVAS.addEventListener("mouseup", e => {
    DRAWING = false;
    switch (METHOD) {
        case "circle":
        case "heart":
            ACTUAL = {
                prevX: prevX,
                prevY: prevY,
                radius: RADIUS,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
                type: METHOD,
                width: CTX.lineWidth,
                fillStyle: CTX.fillStyle,
                strokeStyle: CTX.strokeStyle,
                mode: MODE
            };
            if (MODE != "fill-shape") {
                AUX.push(ACTUAL);
            }
            break;

        case "square":
        case "triangle":
        case "arrow":
            if (MODE != "fill-shape") {
                ACTUAL = {
                    prevX: prevX,
                    prevY: prevY,
                    offsetX: e.offsetX,
                    offsetY: e.offsetY,
                    type: METHOD,
                    width: CTX.lineWidth,
                    fillStyle: CTX.fillStyle,
                    strokeStyle: CTX.strokeStyle,
                    mode: MODE
                };
                AUX.push(ACTUAL);
            }
            break;

        case "star":
            if (MODE != "fill-shape") {
                RADIUS = Math.sqrt(Math.pow(prevX - e.offsetX, 2) + Math.pow(prevY - e.offsetY, 2));
                ACTUAL = {
                    prevX: prevX,
                    prevY: prevY,
                    radius: RADIUS,
                    offsetX: e.offsetX,
                    offsetY: e.offsetY,
                    type: METHOD,
                    width: CTX.lineWidth,
                    fillStyle: CTX.fillStyle,
                    strokeStyle: CTX.strokeStyle,
                    mode: MODE,
                    spikes: SPIKES
                };
                AUX.push(ACTUAL);
                break;

            }

        case "polygon":
            if (MODE != "fill-shape") {
                RADIUS = Math.sqrt(Math.pow(prevX - e.offsetX, 2) + Math.pow(prevY - e.offsetY, 2));
                ACTUAL = {
                    prevX: prevX,
                    prevY: prevY,
                    radius: RADIUS,
                    offsetX: e.offsetX,
                    offsetY: e.offsetY,
                    type: METHOD,
                    width: CTX.lineWidth,
                    fillStyle: CTX.fillStyle,
                    strokeStyle: CTX.strokeStyle,
                    mode: MODE,
                    sides:SIDES
                };
                AUX.push(ACTUAL);
                break;
    }
    }

    COMMANDS.push(AUX);
    LAST = cloneArray(AUX);
    AUX = [];
});

CANVAS.addEventListener("mouseleave", e => {
    if (!DRAWING) {
        DRAWING = false;
        return;
    }
    DRAWING = false;

    switch (METHOD) {
        case "circle":
        case "heart":
            ACTUAL = {
                prevX: prevX,
                prevY: prevY,
                radius: RADIUS,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
                type: METHOD,
                width: CTX.lineWidth,
                fillStyle: CTX.fillStyle,
                strokeStyle: CTX.strokeStyle,
                mode: MODE
            };
            if (MODE != "fill-shape") {
                AUX.push(ACTUAL);
            }
            break;

        case "square":
        case "triangle":
        case "arrow":
            if (MODE != "fill-shape") {
                ACTUAL = {
                    prevX: prevX,
                    prevY: prevY,
                    offsetX: e.offsetX,
                    offsetY: e.offsetY,
                    type: METHOD,
                    width: CTX.lineWidth,
                    fillStyle: CTX.fillStyle,
                    strokeStyle: CTX.strokeStyle,
                    mode: MODE
                };
                AUX.push(ACTUAL);
            }
            break;

        case "star":
            if (MODE != "fill-shape") {
                ACTUAL = {
                    prevX: prevX,
                    prevY: prevY,
                    radius: RADIUS,
                    offsetX: e.offsetX,
                    offsetY: e.offsetY,
                    type: METHOD,
                    width: CTX.lineWidth,
                    fillStyle: CTX.fillStyle,
                    strokeStyle: CTX.strokeStyle,
                    mode: MODE,
                    spikes: SPIKES
                };
                AUX.push(ACTUAL);
                break;
            }

            case "polygon":
                if (MODE != "fill-shape") {
                    RADIUS = Math.sqrt(Math.pow(prevX - e.offsetX, 2) + Math.pow(prevY - e.offsetY, 2));
                    ACTUAL = {
                        prevX: prevX,
                        prevY: prevY,
                        radius: RADIUS,
                        offsetX: e.offsetX,
                        offsetY: e.offsetY,
                        type: METHOD,
                        width: CTX.lineWidth,
                        fillStyle: CTX.fillStyle,
                        strokeStyle: CTX.strokeStyle,
                        mode: MODE,
                        sides:SIDES
                    };
                    AUX.push(ACTUAL);
                    break;
        }
    }

    COMMANDS.push(AUX);
    LAST = cloneArray(AUX);
    AUX = [];
});

document.addEventListener("DOMContentLoaded", init);

document.addEventListener("keydown", e => {
    if (DRAWING) return;
    switch (e.key) {
        case "+":
            CTX.lineWidth += 5;
            lastContext.lineWidth = CTX.lineWidth;
            break;

        case "-":
            CTX.lineWidth -= 5;
            lastContext.lineWidth = CTX.lineWidth;
            break;

        case "Backspace":
            CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
            COMMANDS = [];
            break;

        case "r":
        case "R":
            console.log(CTX.lineWidth);
            break;

        case "ctrl":
        case "z":
        case "Z":
            undo();
            break;

        case "y":
        case "Y":
            redo();
            break;
            break;

        case "*":
            SPIKES++;
            SIDES++;
            break;

        case "/":
            SPIKES--;
            SIDES--;
            break;
    }
});

//Function to add a class to an html element and remove the class to the rest of the elements
function addClassToElement(element, className) {
    let elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove(className);
    }
    element.classList.add(className);
}

let shapeButtonsContainer = document.getElementsByClassName("btn");
for (let i = 0; i < shapeButtonsContainer.length; i++) {
    shapeButtonsContainer[i].addEventListener("click", e => {
        addClassToElement(shapeButtonsContainer[i], "activeTool");
    });
}

let colorButtonsContainer = document.getElementById("colors-container");
colorButtonsContainer.addEventListener("click", e => {
    if (colorsContainer.classList.contains("visible")) {
        colorsContainer.classList.add("hidden");
        colorsContainer.classList.remove("visible");
    } else {
        colorsContainer.classList.add("visible");
        colorsContainer.classList.remove("hidden");
    }
});

let toolsButtonsContainer = document.getElementById("tools-container");
toolsButtonsContainer.addEventListener("click", () => {
    if (toolsContainer.classList.contains("visible")) {
        toolsContainer.classList.add("hidden");
        toolsContainer.classList.remove("visible");
    } else {
        toolsContainer.classList.add("visible");
        toolsContainer.classList.remove("hidden");
    }
});

let shapesButtonsContainer = document.getElementById("shapes-container");
shapesButtonsContainer.addEventListener("click", () => {
    console.log("prueba");
    if (!shapesContainer.classList.contains("visible")) {
        shapesContainer.classList.add("visible");
        shapesContainer.classList.remove("hidden");
    } else {
        shapesContainer.classList.add("hidden");
        shapesContainer.classList.remove("visible");
    }
});

let optionsButtonsContainer = document.getElementById("options-container");
optionsButtonsContainer.addEventListener("click", () => {
    if (!optionsContainer.classList.contains("visible")) {
        optionsContainer.classList.add("visible");
        optionsContainer.classList.remove("hidden");
    } else {
        optionsContainer.classList.add("hidden");
        optionsContainer.classList.remove("visible");
    }
});

//Function executed on DOMContentLoaded
function init() {
    CANVAS.addEventListener("touchstart", touchHandler, true);
    CANVAS.addEventListener("touchmove", touchHandler, true);
    CANVAS.addEventListener("touchend", touchHandler, true);
    CANVAS.addEventListener("touchcancel", touchHandler, true);
    CANVAS.width = window.innerWidth * 0.9;
    CANVAS.height = window.innerHeight * 0.7;
    BACKGROUND_CANVAS.width = CANVAS.width;
    BACKGROUND_CANVAS.height = CANVAS.height;

    //drawPolygon(CTX, { prevX: 500, prevY: 200, sides: 5, radius: 200, strokeStyle: "red", fillStyle: "blue", mode: "fill", width: 50 })

    for (let i = 0; i < colors.length; i++) {
        colorInput.addEventListener("input", () => {
            if (colors[i] == "custom") {
                color.style.background = colorInput.value;
                color.addEventListener("click", () => {
                    CTX.strokeStyle = colorInput.value;
                    CTX.fillStyle = colorInput.value;
                });
            }
        });
        let color = document.createElement("button");
        color.classList.add("circle");
        color.addEventListener("click", e => {
            CTX.strokeStyle = colors[i];
            CTX.fillStyle = colors[i];
            lastContext.fillStyle = colors[i];
            lastContext.strokeStyle = colors[i];
            lastContext.lineWidth = CTX.lineWidth;
        });
        color.style.background = colors[i];
        colors.id = colors[i];
        colorsContainer.appendChild(color);
    }
}

function startPath(e) {
    DRAWING = true;
    lastContext.fillStyle = CTX.fillStyle;
    lastContext.strokeStyle = CTX.strokeStyle;
    lastContext.lineWidth = CTX.lineWidth;

    switch (METHOD) {
        case "brush":
            ACTUAL = {
                x: e.offsetX,
                y: e.offsetY,
                width: CTX.lineWidth / 2,
                strokeStyle: CTX.strokeStyle,
                fillStyle: CTX.fillStyle,
                type: "first"
            };
            drawBrushEraser(CTX, ACTUAL, true, false);
            AUX.push(ACTUAL);

            break;

        case "arrow":
            SNAPSHOT = CTX.getImageData(0, 0, CANVAS.width, CANVAS.height);
            prevX = e.offsetX;
            prevY = e.offsetY;
            break;

        case "circle":
        case "square":
        case "triangle":
        case "star":
        case "heart":
        case "polygon":
            if (MODE == "stroke" || MODE == "fill") {
                SNAPSHOT = CTX.getImageData(0, 0, CANVAS.width, CANVAS.height);
            }
            prevX = e.offsetX;
            prevY = e.offsetY;
            break;

        case "eraser":
            ACTUAL = {
                x: e.offsetX,
                y: e.offsetY,
                width: CTX.lineWidth / 2,
                type: "first"
            };
            drawBrushEraser(CTX, { x: e.offsetX, y: e.offsetY, width: CTX.lineWidth / 2 }, true, true);
            AUX.push(ACTUAL);
            break;
    }
}

function draw(e) {
    if (!DRAWING) return;

    switch (METHOD) {
        case "brush":
            ACTUAL = {
                x: e.offsetX,
                y: e.offsetY,
                width: CTX.lineWidth,
                strokeStyle: CTX.strokeStyle,
                fillStyle: CTX.fillStyle,
                type: METHOD
            };
            drawBrushEraser(CTX, ACTUAL, false, false);
            AUX.push(ACTUAL);
            break;

        case "circle":
            if (MODE == "stroke" || MODE == "fill") {
                CTX.putImageData(SNAPSHOT, 0, 0);
            }
            RADIUS = Math.sqrt(Math.pow(prevX - e.offsetX, 2) + Math.pow(prevY - e.offsetY, 2));
            ACTUAL = {
                prevX: prevX,
                prevY: prevY,
                radius: RADIUS,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
                type: METHOD,
                width: CTX.lineWidth,
                fillStyle: CTX.fillStyle,
                strokeStyle: CTX.strokeStyle,
                mode: MODE
            };
            drawCircle(CTX, ACTUAL);
            if (MODE == "fill-shape") {
                AUX.push(ACTUAL);
            }

            break;

        case "square":
            if (MODE == "stroke" || MODE == "fill") {
                CTX.putImageData(SNAPSHOT, 0, 0);
            }
            ACTUAL = {
                prevX: prevX,
                prevY: prevY,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
                type: METHOD,
                width: CTX.lineWidth,
                fillStyle: CTX.fillStyle,
                strokeStyle: CTX.strokeStyle,
                mode: MODE
            };
            drawSquare(CTX, ACTUAL);
            if (MODE == "fill-shape") {
                AUX.push(ACTUAL);
            }

            break;

        case "triangle":
            ACTUAL = {
                prevX: prevX,
                prevY: prevY,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
                type: METHOD,
                width: CTX.lineWidth,
                fillStyle: CTX.fillStyle,
                strokeStyle: CTX.strokeStyle,
                mode: MODE
            };
            if (MODE == "stroke" || MODE == "fill") {
                CTX.putImageData(SNAPSHOT, 0, 0);
            }
            drawTriangle(CTX, ACTUAL);
            if (MODE == "fill-shape") {
                AUX.push(ACTUAL);
            }
            break;

        case "arrow":
            ACTUAL = {
                prevX: prevX,
                prevY: prevY,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
                type: METHOD,
                width: CTX.lineWidth,
                fillStyle: CTX.fillStyle,
                strokeStyle: CTX.strokeStyle,
                mode: "fill"
            };
            CTX.putImageData(SNAPSHOT, 0, 0);
            drawArrow(CTX, ACTUAL);
            break;

        case "star":
            if (MODE == "stroke" || MODE == "fill") {
                CTX.putImageData(SNAPSHOT, 0, 0);
            }
            RADIUS = Math.sqrt(Math.pow(prevX - e.offsetX, 2) + Math.pow(prevY - e.offsetY, 2));
            ACTUAL = {
                prevX: prevX,
                prevY: prevY,
                radius: RADIUS,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
                type: METHOD,
                width: CTX.lineWidth,
                fillStyle: CTX.fillStyle,
                strokeStyle: CTX.strokeStyle,
                mode: MODE,
                spikes: SPIKES
            };
            drawStar(CTX, ACTUAL);
            if (MODE == "fill-shape") {
                AUX.push(ACTUAL);
            }
            break;

        case "polygon":
            if (MODE == "stroke" || MODE == "fill") {
                CTX.putImageData(SNAPSHOT, 0, 0);
            }
            RADIUS = Math.sqrt(Math.pow(prevX - e.offsetX, 2) + Math.pow(prevY - e.offsetY, 2));
            ACTUAL = {
                prevX: prevX,
                prevY: prevY,
                radius: RADIUS,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
                type: METHOD,
                width: CTX.lineWidth,
                fillStyle: CTX.fillStyle,
                strokeStyle: CTX.strokeStyle,
                mode: MODE,
                sides:SIDES
            };
            drawPolygon(CTX, ACTUAL);
            if (MODE == "fill-shape") {
                AUX.push(ACTUAL);
            }
            break;

        case "eraser":
            ACTUAL = {
                x: e.offsetX,
                y: e.offsetY,
                width: CTX.lineWidth,
                strokeStyle: CTX.strokeStyle,
                fillStyle: CTX.fillStyle,
                type: METHOD
            };
            drawBrushEraser(CTX, ACTUAL, false, true);
            AUX.push(ACTUAL);
            CTX.strokeStyle = lastContext.strokeStyle;
            CTX.fillStyle = lastContext.fillStyle;
            break;

        case "heart":
            if (MODE == "stroke" || MODE == "fill") {
                CTX.putImageData(SNAPSHOT, 0, 0);
            }
            RADIUS = Math.sqrt(Math.pow(prevX - e.offsetX, 2) + Math.pow(prevY - e.offsetY, 2));
            ACTUAL = {
                prevX: prevX,
                prevY: prevY,
                radius: RADIUS,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
                type: METHOD,
                width: CTX.lineWidth,
                fillStyle: CTX.fillStyle,
                strokeStyle: CTX.strokeStyle,
                mode: MODE
            };
            drawHeart(CTX, ACTUAL);
            if (MODE == "fill-shape") {
                AUX.push(ACTUAL);
            }
            break;
    }
}

function undo() {
    if (COMMANDS.length > 0) {
        LAST = cloneArray(COMMANDS).pop();
    }
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height); //Clears Canvas

    COMMANDS.pop(); //Deletes Last Command
    let actualCommand;

    for (let i = 0; i < COMMANDS.length; i++) {
        for (let j = 0; j < COMMANDS[i].length; j++) {
            actualCommand = COMMANDS[i][j];

            switch (actualCommand.type) {
                case "first":
                    drawBrushEraser(CTX, actualCommand, true, false);
                    break;

                case "brush":
                    drawBrushEraser(CTX, actualCommand, false, false);
                    break;

                case "circle":
                    drawCircle(CTX, actualCommand);

                    break;

                case "triangle":
                    drawTriangle(CTX, actualCommand);
                    break;

                case "square":
                    drawSquare(CTX, actualCommand);
                    break;

                case "first-eraser":
                    drawBrushEraser(CTX, actualCommand, true, true);
                    break;

                case "eraser":
                    drawBrushEraser(CTX, actualCommand, false, true);
                    break;

                case "star":
                    drawStar(CTX, actualCommand);
                    break;

                case "heart":
                    drawHeart(CTX, actualCommand);
                    break;

                case "arrow":
                    drawArrow(CTX, actualCommand);
                    break;

                case "polygon":
                    drawPolygon(CTX, actualCommand);
                    break;
            }
        }
    }
    CTX.lineWidth = lastContext.lineWidth;
    CTX.strokeStyle = lastContext.strokeStyle;
    CTX.fillStyle = lastContext.fillStyle;
}

function redo() {
    if (LAST.length == 0) return;
    COMMANDS.push(LAST);

    for (let j = 0; j < LAST.length; j++) {
        actualCommand = LAST[j];

        switch (actualCommand.type) {
            case "first":
                drawBrushEraser(CTX, actualCommand, true, false);
                break;

            case "triangle":
                drawTriangle(CTX, actualCommand);
                break;

            case "brush":
                drawBrushEraser(CTX, actualCommand, false, false);
                break;

            case "circle":
                drawCircle(CTX, actualCommand);
                break;

            case "square":
                drawSquare(CTX, actualCommand);
                break;

            case "first-eraser":
                drawBrushEraser(CTX, actualCommand, true, true);
                break;

            case "eraser":
                drawBrushEraser(CTX, actualCommand, false, true);
                break;

            case "star":
                drawStar(CTX, actualCommand);
                break;

            case "heart":
                drawHeart(CTX, actualCommand);
                break;

            case "arrow":
                drawArrow(CTX, actualCommand);
                break;
            
            case "polygon":
                drawPolygon(CTX, actualCommand);
                break;
        }
    }
    LAST = [];
    CTX.lineWidth = lastContext.lineWidth;
    CTX.strokeStyle = lastContext.strokeStyle;
    CTX.fillStyle = lastContext.fillStyle;
}

function reDraw(CTX) {
    for (let i = 0; i < COMMANDS.length; i++) {
        for (let j = 0; j < COMMANDS[i].length; j++) {
            actualCommand = COMMANDS[i][j];

            console.log(actualCommand);
            switch (actualCommand.type) {
                case "first":
                    drawBrushEraser(CTX, actualCommand, true, false);
                    break;

                case "heart":
                    drawHeart(CTX, actualCommand);
                    break;

                case "triangle":
                    drawTriangle(CTX, actualCommand);
                    break;

                case "brush":
                    drawBrushEraser(CTX, actualCommand, false, false);
                    break;

                case "circle":
                    drawCircle(CTX, actualCommand);

                    break;

                case "square":
                    drawSquare(CTX, actualCommand);
                    break;

                case "first-eraser":
                    drawBrushEraser(CTX, actualCommand, true, true);
                    break;

                case "eraser":
                    drawBrushEraser(CTX, actualCommand, false, true);
                    break;

                case "star":
                    drawStar(CTX, actualCommand);
                    break;

                case "arrow":
                    drawArrow(CTX, actualCommand);
                    break;

                case "polygon":
                    drawPolygon(CTX, actualCommand);
                    break;
            }
        }
    }
}

function cloneArray(array) {
    return JSON.parse(JSON.stringify(array));
}

function now() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();

    return `${year}-${month}-${day}-${hour}-${minute}`;
}

function saveCanvas() {
    let link = document.createElement("a");
    link.download = now() + "my-drawing.png";
    link.href = BACKGROUND_CANVAS.toDataURL();
    link.click();
    link.remove();
}

function touchHandler(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch (event.type) {
        case "touchstart":
            type = "mousedown";
            break;
        case "touchmove":
            type = "mousemove";
            break;
        case "touchend":
            type = "mouseup";
            break;
        default:
            return;
    }

    // initMouseEvent(type, canBubble, cancelable, view, clickCount,
    //                screenX, screenY, clientX, clientY, ctrlKey,
    //                altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0 /*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function drawStar(CTX, actual) {
    let outerRadius = actual.radius;
    let rot = (Math.PI / 2) * 3;
    let x = actual.prevX;
    let y = actual.prevY;
    let step = Math.PI / actual.spikes;

    CTX.beginPath();
    CTX.lineWidth = actual.width;
    CTX.strokeStyle = actual.strokeStyle;
    CTX.fillStyle = actual.fillStyle;
    CTX.moveTo(actual.prevX, actual.prevY - outerRadius);
    for (i = 0; i < actual.spikes; i++) {
        x = actual.prevX + Math.cos(rot) * outerRadius;
        y = actual.prevY + Math.sin(rot) * outerRadius;
        CTX.lineTo(x, y);
        rot += step;

        x = actual.prevX + (Math.cos(rot) * outerRadius) / 2;
        y = actual.prevY + (Math.sin(rot) * outerRadius) / 2;
        CTX.lineTo(x, y);
        rot += step;
    }
    CTX.lineTo(actual.prevX, actual.prevY - outerRadius);
    CTX.closePath();
    if (actual.mode == "fill") {
        CTX.fill();
    } else {
        CTX.stroke();
    }
}

function drawBrushEraser(CTX, actual, isFirst, isEraser) {
    if ((isEraser && isFirst) || isEraser) {
        CTX.fillStyle = BACKGROUND;
        CTX.strokeStyle = BACKGROUND;
    } else {
        CTX.fillStyle = actual.fillStyle;
        CTX.strokeStyle = actual.strokeStyle;
    }

    if (isFirst) {
        CTX.beginPath();
        CTX.arc(actual.x, actual.y, actual.width, 0, Math.PI * 2);
        CTX.fill();
        CTX.closePath();
        CTX.beginPath();
        CTX.moveTo(actual.x, actual.y);
    } else {
        CTX.lineJoin = "round";
        CTX.lineCap = "round";
        CTX.lineWidth = actual.width;
        CTX.lineTo(actual.x, actual.y);
        CTX.stroke();
    }
}

function drawTriangle(CTX, actual) {
    CTX.beginPath();
    CTX.lineWidth = actual.width;
    CTX.strokeStyle = actual.strokeStyle;
    CTX.fillStyle = actual.fillStyle;
    CTX.moveTo(actual.prevX, actual.prevY);
    CTX.lineTo(actual.offsetX, actual.offsetY);
    CTX.lineTo(actual.prevX * 2 - actual.offsetX, actual.offsetY);
    CTX.closePath();
    if (actual.mode == "fill") {
        CTX.fill();
    } else {
        CTX.stroke();
    }
    CTX.beginPath();
}

function drawCircle(CTX, actual) {
    CTX.beginPath();
    CTX.lineWidth = actual.width;
    CTX.strokeStyle = actual.strokeStyle;
    CTX.fillStyle = actual.fillStyle;
    CTX.arc(actual.prevX, actual.prevY, actual.radius, 0, Math.PI * 2);
    if (actual.mode == "fill") {
        CTX.fill();
    } else {
        CTX.stroke();
    }
}

function drawSquare(CTX, actual) {
    CTX.beginPath();
    CTX.lineWidth = actual.width;
    CTX.strokeStyle = actual.strokeStyle;
    CTX.fillStyle = actual.fillStyle;
    CTX.rect(actual.offsetX, actual.offsetY, (actual.prevX - actual.offsetX) * 2, (actual.prevY - actual.offsetY) * 2);
    if (actual.mode == "fill") {
        CTX.fill();
    } else {
        CTX.stroke();
    }
}

function drawArrow(ctx, actual) {
    let hlen = 5;
    let fromx = actual.prevX;
    let fromy = actual.prevY;
    let tox = actual.offsetX;
    let toy = actual.offsetY;

    let dx = tox - fromx;
    let dy = toy - fromy;
    let angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "miter";
    ctx.lineWidth = actual.width;
    ctx.strokeStyle = actual.strokeStyle;
    ctx.fillStyle = actual.fillStyle;
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - hlen * Math.cos(angle - Math.PI / 6), toy - hlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(tox - (hlen * Math.cos(angle)) / 2, toy - (hlen * Math.sin(angle)) / 2);
    ctx.lineTo(tox - hlen * Math.cos(angle + Math.PI / 6), toy - hlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

function drawHeart(ctx, actual) {
    let x = actual.prevX;
    let y = actual.prevY;
    let width = actual.radius;
    let height = actual.radius;

    ctx.beginPath();
    ctx.lineWidth = actual.width;
    ctx.strokeStyle = actual.strokeStyle;
    ctx.fillStyle = actual.fillStyle;

    let topCurveHeight = height * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(x, y, x - width / 2, y, x - width / 2, y + topCurveHeight);

    // bottom left curve
    ctx.bezierCurveTo(x - width / 2, y + (height + topCurveHeight) / 2, x, y + (height + topCurveHeight) / 2, x, y + height);

    // bottom right curve
    ctx.bezierCurveTo(x, y + (height + topCurveHeight) / 2, x + width / 2, y + (height + topCurveHeight) / 2, x + width / 2, y + topCurveHeight);

    // top right curve
    ctx.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight);

    ctx.closePath();
    if (actual.mode == "fill") {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

//Javascript function to draw polygons on canvas given the number of sides
function drawPolygon(ctx, actual) {
    console.log(actual)
    let sides = actual.sides;
    let radius = actual.radius;
    let x = actual.prevX;
    let y = actual.prevY;
    let rot;
    if (actual.sides % 2 == 0) {
        rot = Math.PI;
    } else {
        rot = Math.PI - 2.2;
    }
    let step = (Math.PI / sides) * 2;
    ctx.beginPath();
    ctx.lineWidth = actual.width;
    ctx.strokeStyle = actual.strokeStyle;
    ctx.fillStyle = actual.fillStyle;
    ctx.moveTo(x + radius * Math.cos(rot), y + radius * Math.sin(rot));
    for (let i = 0; i < sides; i++) {
        rot += step;
        ctx.lineTo(x + radius * Math.cos(rot), y + radius * Math.sin(rot));
    }
    ctx.closePath();
    if (actual.mode == "fill") {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}
