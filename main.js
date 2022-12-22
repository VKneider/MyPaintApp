//Main Variables
let CANVAS = document.getElementById("myCanvas")
let CTX = CANVAS.getContext("2d")
let METHOD = "brush";
let MODE = "stroke"
let DRAWING = false;
let prevX, prevY;
let SNAPSHOT;
let RADIUS;
let BACKGROUND = "#ffffff"
let lastColor;
let lastContext = {
    strokeStyle: '#000000',
    fillStyle: '#000000',
    lineWidth: CTX.lineWidth
}


//Background Canvas
let BACKGROUND_CANVAS = document.getElementById('background')
let BACKGROUND_CTX = BACKGROUND_CANVAS.getContext('2d')


//Color Variables
let colorsContainer = document.getElementById("colors")
let COLOR_CIRCLES = document.getElementsByClassName("circle")
let colors = ["white", "black", "gray", "blue", "red", "yellow", "green", "purple", "orange", "pink", "aqua", "cyan"];


//Command Registry Variables
let COMMANDS = [];
let AUX = [];
let LAST;



//HTML Front Button and Inputs Declarations
let activateSquare = document.getElementById('square-btn')
let activateCircle = document.getElementById('circle-btn')
let activateTriangle = document.getElementById('triangle-btn')
let activateBrush = document.getElementById('brush-btn')
let activateEraser = document.getElementById('eraser-btn')
let moreWidth = document.getElementById('moreWidth')
let lessWidth = document.getElementById('lessWidth')
let clearCanvasBtn = document.getElementById('clearCanvas-btn')
let modeFill = document.getElementById('fill-color-btn')
let modeFillShape = document.getElementById('fill-shape-btn')
let modeStroke = document.getElementById('stroke-shape-btn')
let backgroundInput = document.getElementById('background-color')
let changeBackground = document.getElementById('change-background-btn')
let downloadBtn = document.getElementById('download-btn')
let activateStar = document.getElementById('star-btn')



backgroundInput.value = "#ffffff"

// Event Listeners
changeBackground.addEventListener('click', () => {
    if (backgroundInput.value == "#ffffff") return;
    BACKGROUND = backgroundInput.value;
    BACKGROUND_CTX.fillStyle = BACKGROUND;
    BACKGROUND_CTX.rect(0, 0, BACKGROUND_CANVAS.width, BACKGROUND_CANVAS.height)
    BACKGROUND_CTX.fill()
    CTX.clearRect(0, 0, CANVAS.height, CANVAS.width)
    reDraw(CTX);
})

moreWidth.addEventListener('click', () => { CTX.lineWidth += 10; })
lessWidth.addEventListener('click', () => { CTX.lineWidth -= 10; })

clearCanvasBtn.addEventListener('click', () => {
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    COMMANDS = []
})

activateStar.addEventListener('click', () => { METHOD = "star" })
activateBrush.addEventListener('click', () => { METHOD = "brush" })
activateSquare.addEventListener('click', () => { METHOD = "square" })
activateCircle.addEventListener('click', () => { METHOD = "circle" })
activateTriangle.addEventListener('click', () => { METHOD = "triangle" })
activateEraser.addEventListener('click', () => { METHOD = "eraser" })
modeFill.addEventListener('click', () => { MODE = "fill" })
modeStroke.addEventListener('click', () => { MODE = "stroke" })
modeFillShape.addEventListener('click', () => { MODE = "fill-shape" })

downloadBtn.addEventListener('click', () => {
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height)
    reDraw(BACKGROUND_CTX)
    saveCanvas()
    BACKGROUND_CTX.clearRect(0, 0, BACKGROUND_CANVAS.width, BACKGROUND_CANVAS.height)
    BACKGROUND = backgroundInput.value;
    BACKGROUND_CTX.fillStyle = BACKGROUND;
    BACKGROUND_CTX.rect(0, 0, BACKGROUND_CANVAS.width, BACKGROUND_CANVAS.height)
    BACKGROUND_CTX.fill()
    reDraw(CTX)
    
})

CANVAS.addEventListener('mousedown', startPath)

CANVAS.addEventListener('mousemove', e => {
    if (!DRAWING) return;
    draw(e)

})

CANVAS.addEventListener('mouseup', e => {

    DRAWING = false;
    switch (METHOD) {
        case 'circle':
            if (MODE != "fill-shape") { AUX.push({ prevX: prevX, prevY: prevY, radius: RADIUS, type: METHOD, width: CTX.lineWidth, fillStyle: CTX.fillStyle, strokeStyle: CTX.strokeStyle, mode: MODE }) }
            break;

        case 'brush':
            break;

        case 'square':
            if (MODE != "fill-shape") { AUX.push({ prevX: prevX, prevY: prevY, offsetX: e.offsetX, offsetY: e.offsetY, type: METHOD, width: CTX.lineWidth, fillStyle: CTX.fillStyle, strokeStyle: CTX.strokeStyle, mode: MODE }) }
            break;

        case 'triangle':
            if (MODE != "fill-shape") { AUX.push({ prevX: prevX, prevY: prevY, offsetX: e.offsetX, offsetY: e.offsetY, type: METHOD, width: CTX.lineWidth, fillStyle: CTX.fillStyle, strokeStyle: CTX.strokeStyle, mode: MODE }) }
            break;
    }

    COMMANDS.push(AUX)
    LAST = cloneArray(AUX)
    AUX = []
})



CANVAS.addEventListener('mouseleave', (e) => {
    if (!DRAWING) { DRAWING = false; return; }
    DRAWING = false;

    switch (METHOD) {
        case 'circle':
            if(MODE!="fill-shape"){AUX.push({ prevX: prevX, prevY: prevY, radius: RADIUS, type: METHOD, width: CTX.lineWidth, fillStyle: CTX.fillStyle, strokeStyle: CTX.strokeStyle, mode: MODE }) }
            break;

        case 'square':
        case 'triangle':
        if(MODE != "fill-shape"){

            AUX.push({ prevX: prevX, prevY: prevY, offsetX: e.offsetX, offsetY: e.offsetY, type: METHOD, width: CTX.lineWidth, fillStyle: CTX.fillStyle, strokeStyle: CTX.strokeStyle, mode: MODE }) 

        }

            break;

    }
    COMMANDS.push(AUX)
    LAST = cloneArray(AUX)
    AUX = []
})

document.addEventListener('DOMContentLoaded', init)

document.addEventListener('keydown', e => {

    switch (e.key) {
        case '+':
            CTX.lineWidth += 10;
            lastContext.lineWidth = CTX.lineWidth;
            break;

        case '-':
            CTX.lineWidth -= 10;
            lastContext.lineWidth = CTX.lineWidth;
            break;

        case 'Backspace':
            CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
            COMMANDS = []
            break;

        case 'r':
            case 'R':
            console.log(COMMANDS)
            break;

        case 'ctrl':
        case 'z':
            case 'Z':
            if (DRAWING) return;
            undo()
            break;

        
        case 'y':
            case 'Y':
            if (DRAWING) return;
            redo()
            break;
            break;


    }

})


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



    for (let i = 0; i < colors.length; i++) {
        let color = document.createElement("button");
        color.classList.add("circle")
        color.addEventListener("click", (e) => {
            CTX.strokeStyle = colors[i]
            CTX.fillStyle = colors[i]
            lastContext.fillStyle = colors[i]
            lastContext.strokeStyle = colors[i]
            lastContext.lineWidth = CTX.lineWidth;
        })
        color.style.background = colors[i]
        colors.id = colors[i];
        colorsContainer.appendChild(color)
    }


    drawStar(175, 100, 12, 30, 10);
    drawStar(500, 100, 5, 100, 50);
}


function startPath(e) {

    DRAWING = true;
    lastContext.fillStyle = CTX.fillStyle;
    lastContext.strokeStyle = CTX.strokeStyle;
    lastContext.lineWidth = CTX.lineWidth;

    switch (METHOD) {

        case 'brush':
            CTX.beginPath();
            CTX.arc(e.offsetX, e.offsetY, CTX.lineWidth / 2, 0, Math.PI * 2);
            CTX.fill();
            CTX.closePath()
            CTX.beginPath()
            CTX.moveTo(e.offsetX, e.offsetY)
            AUX.push({ x: e.offsetX, y: e.offsetY, width: CTX.lineWidth / 2, from: 0, to: Math.PI * 2, fillStyle: CTX.fillStyle, type: 'first' })
            break;

        case 'circle':
        case 'square':
        case 'triangle':
        case 'star':
            if (MODE == "stroke" || MODE == "fill") { SNAPSHOT = CTX.getImageData(0, 0, CANVAS.width, CANVAS.height); }
            prevX = e.offsetX;
            prevY = e.offsetY;
            break;

        case 'eraser':
            CTX.beginPath();
            CTX.fillStyle = BACKGROUND;
            CTX.arc(e.offsetX, e.offsetY, CTX.lineWidth / 2, 0, Math.PI * 2);
            CTX.fill();
            CTX.closePath()
            CTX.beginPath()
            CTX.moveTo(e.offsetX, e.offsetY)
            AUX.push({ x: e.offsetX, y: e.offsetY, width: CTX.lineWidth / 2, from: 0, to: Math.PI * 2, type: 'first-eraser' })
            break;

    }

}


function draw(e) {

    if (!DRAWING) return;

    switch (METHOD) {
        case 'brush':
            CTX.lineCap = "round";
            CTX.lineJoin = "round";
            CTX.lineTo(e.offsetX, e.offsetY)
            CTX.stroke()
            AUX.push({ x: e.offsetX, y: e.offsetY, width: CTX.lineWidth, strokeStyle: CTX.strokeStyle, type: METHOD })
            break;

        case 'circle':

            if (MODE == "stroke" || MODE == "fill") { CTX.putImageData(SNAPSHOT, 0, 0); }
            CTX.beginPath()
            RADIUS = Math.sqrt(Math.pow((prevX - e.offsetX), 2) + Math.pow((prevY - e.offsetY), 2));
            CTX.arc(prevX, prevY, RADIUS, 0, Math.PI * 2);
            if (MODE == "fill-shape") { AUX.push({ prevX: prevX, prevY: prevY, radius: RADIUS, offsetX: e.offsetX, offsetY: e.offsetY, type: METHOD, width: CTX.lineWidth, fillStyle: CTX.fillStyle, strokeStyle: CTX.strokeStyle, mode: MODE }) }
            if (MODE == "fill") { CTX.fill() } else { CTX.stroke() }
            break;

        case 'square':
            if (MODE == "stroke" || MODE == "fill") { CTX.putImageData(SNAPSHOT, 0, 0); }
            CTX.beginPath()
            CTX.rect(prevX, prevY, prevX - e.offsetX, prevY - e.offsetY);
            if (MODE == "fill-shape") { AUX.push({ prevX: prevX, prevY: prevY, offsetX: e.offsetX, offsetY: e.offsetY, type: METHOD, width: CTX.lineWidth, fillStyle: CTX.fillStyle, strokeStyle: CTX.strokeStyle, mode: MODE }) }
            if (MODE == "fill") { CTX.fill(); } else { CTX.stroke() }

            break;

        case 'triangle':
            if (MODE == "stroke" || MODE == "fill") { CTX.putImageData(SNAPSHOT, 0, 0); }
            CTX.beginPath()
            CTX.moveTo(prevX, prevY);
            CTX.lineTo(e.offsetX, e.offsetY);
            CTX.lineTo(prevX*2-e.offsetX, e.offsetY);
            CTX.closePath()
            if (MODE == "fill-shape") { AUX.push({ prevX: prevX, prevY: prevY, offsetX: e.offsetX, offsetY: e.offsetY, type: METHOD, width: CTX.lineWidth, fillStyle: CTX.fillStyle, strokeStyle: CTX.strokeStyle, mode: MODE }) }
            if (MODE == "fill") { CTX.fill(); } else { CTX.stroke() }
            break;



        case 'star':
            if (MODE == "stroke" || MODE == "fill") { CTX.putImageData(SNAPSHOT, 0, 0); }
            CTX.beginPath()
            CTX.moveTo(prevX, prevY);
            CTX.lineTo(e.offsetX, e.offsetY);
            CTX.lineTo(prevX*2+e.offsetX, e.offsetY);
            CTX.stroke()
            CTX.closePath()

            break;

        case 'eraser':
            CTX.strokeStyle = BACKGROUND;
            CTX.lineCap = "round";
            CTX.lineJoin = "round";
            CTX.lineTo(e.offsetX, e.offsetY)
            CTX.stroke()
            AUX.push({ x: e.offsetX, y: e.offsetY, width: CTX.lineWidth, type: 'eraser' })
            CTX.strokeStyle = lastContext.strokeStyle;
            CTX.fillStyle = lastContext.fillStyle;
            break;

    }

}


function undo() {

    if (COMMANDS.length > 0) { LAST = cloneArray(COMMANDS).pop() }
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height); //Clears Canvas

    COMMANDS.pop() //Deletes Last Command
    let actual;

    for (let i = 0; i < COMMANDS.length; i++) {

        for (let j = 0; j < COMMANDS[i].length; j++) {
            actual = COMMANDS[i][j]

            switch (actual.type) {
                case 'first':
                    CTX.beginPath();
                    CTX.strokeStyle = actual.strokeStyle;
                    CTX.fillStyle = actual.fillStyle;
                    CTX.arc(actual.x, actual.y, actual.width, actual.from, actual.to);
                    CTX.fill();
                    CTX.closePath()
                    CTX.beginPath()
                    CTX.moveTo(actual.x, actual.y)
                    break;

                case 'brush':

                    CTX.lineJoin = "round"
                    CTX.lineCap = "round";
                    CTX.lineWidth = actual.width;
                    CTX.strokeStyle = actual.strokeStyle;
                    CTX.lineTo(actual.x, actual.y)
                    CTX.stroke()
                    CTX.lineJoin = "round";
                    break;

                case 'circle':
                    CTX.beginPath()
                    CTX.lineWidth = actual.width;
                    CTX.strokeStyle = actual.strokeStyle;
                    CTX.fillStyle = actual.fillStyle;
                    CTX.arc(actual.prevX, actual.prevY, actual.radius, 0, Math.PI * 2);
                    if (actual.mode == "fill") { CTX.fill() } else { CTX.stroke(); }

                    break;

                case 'triangle':
                    
                    CTX.beginPath()
                    CTX.lineWidth = actual.width;
                    CTX.strokeStyle = actual.strokeStyle;
                    CTX.fillStyle = actual.fillStyle;
                    CTX.moveTo(actual.prevX, actual.prevY);
                    CTX.lineTo(actual.offsetX, actual.offsetY);
                    CTX.lineTo(actual.prevX*2-actual.offsetX, actual.offsetY);
                    CTX.closePath()
                    if (actual.mode == "fill") { CTX.fill() } else { CTX.stroke(); }
                    break;

                case 'square':
                    CTX.beginPath()
                    CTX.lineWidth = actual.width;
                    CTX.strokeStyle = actual.strokeStyle;
                    CTX.fillStyle = actual.fillStyle;
                    CTX.rect(actual.prevX, actual.prevY, actual.prevX - actual.offsetX, actual.prevY - actual.offsetY);
                    if (actual.mode == "fill") { CTX.fill() } else { CTX.stroke() }
                    break;

                case 'first-eraser':
                    CTX.beginPath();
                    CTX.fillStyle = BACKGROUND;
                    CTX.arc(actual.x, actual.y, actual.width, actual.from, actual.to);
                    CTX.fill();
                    CTX.closePath()
                    CTX.beginPath()
                    CTX.moveTo(actual.x, actual.y)
                    break;

                case 'eraser':
                    CTX.lineJoin = "round"
                    CTX.lineCap = "round";
                    CTX.lineWidth = actual.width;
                    CTX.strokeStyle = BACKGROUND;
                    CTX.lineTo(actual.x, actual.y)
                    CTX.stroke()
                    CTX.lineJoin = "round";
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
    COMMANDS.push(LAST)

    for (let j = 0; j < LAST.length; j++) {
        actual = LAST[j];


        switch (actual.type) {
            case 'first':
                CTX.beginPath();
                CTX.beginPath();
                CTX.strokeStyle = actual.strokeStyle;
                CTX.arc(actual.x, actual.y, actual.width, actual.from, actual.to);
                CTX.fill();
                CTX.closePath()
                CTX.beginPath()
                CTX.moveTo(actual.x, actual.y)
                CTX.fillStyle = actual.fillStyle;
                break;

            case 'triangle':
                    
                CTX.beginPath()
                CTX.lineWidth = actual.width;
                CTX.strokeStyle = actual.strokeStyle;
                CTX.fillStyle = actual.fillStyle;
                CTX.moveTo(actual.prevX, actual.prevY);
                CTX.lineTo(actual.offsetX, actual.offsetY);
                CTX.lineTo(actual.prevX*2-actual.offsetX, actual.offsetY);
                CTX.closePath()
                if (actual.mode == "fill") { CTX.fill() } else { CTX.stroke(); }
                break;

            case 'brush':
                CTX.lineJoin = "round"
                CTX.lineCap = "round";
                CTX.lineWidth = actual.width;
                CTX.strokeStyle = actual.strokeStyle;
                CTX.lineTo(actual.x, actual.y)
                CTX.stroke()
                CTX.lineJoin = "round";
                break;

            case 'circle':

                CTX.beginPath()
                CTX.lineWidth = actual.width;
                CTX.strokeStyle = actual.strokeStyle;
                CTX.fillStyle = actual.fillStyle;
                CTX.arc(actual.prevX, actual.prevY, actual.radius, 0, Math.PI * 2);
                if (actual.mode == "fill") { CTX.fill() } else { CTX.stroke(); }
                break;

            case 'square':
                CTX.beginPath()
                CTX.lineWidth = actual.width;
                CTX.strokeStyle = actual.strokeStyle;
                CTX.fillStyle = actual.fillStyle;
                CTX.rect(actual.prevX, actual.prevY, actual.prevX - actual.offsetX, actual.prevY - actual.offsetY);
                if (actual.mode == "fill") { CTX.fill() } else { CTX.stroke() }
                break;

            case 'first-eraser':
                CTX.beginPath();
                CTX.fillStyle = BACKGROUND;
                CTX.arc(actual.x, actual.y, actual.width, actual.from, actual.to);
                CTX.fill();
                CTX.closePath()
                CTX.beginPath()
                CTX.moveTo(actual.x, actual.y)
                break;

            case 'eraser':
                CTX.lineJoin = "round"
                CTX.lineCap = "round";
                CTX.lineWidth = actual.width;
                CTX.strokeStyle = BACKGROUND;
                CTX.lineTo(actual.x, actual.y)
                CTX.stroke()
                CTX.lineJoin = "round";
                CTX.strokeStyle = lastColor;
                CTX.fillStyle = lastColor;
                break;


        }

    }
    LAST = []
    CTX.lineWidth = lastContext.lineWidth;
    CTX.strokeStyle = lastContext.strokeStyle;
    CTX.fillStyle = lastContext.fillStyle;
}



function reDraw(CTX) {

    for (let i = 0; i < COMMANDS.length; i++) {

        for (let j = 0; j < COMMANDS[i].length; j++) {
            actual = COMMANDS[i][j]

            switch (actual.type) {
                case 'first':
                    CTX.beginPath();
                    CTX.strokeStyle = actual.strokeStyle;
                    CTX.fillStyle = actual.fillStyle;
                    CTX.arc(actual.x, actual.y, actual.width, actual.from, actual.to);
                    CTX.fill();
                    CTX.closePath()
                    CTX.beginPath()
                    CTX.moveTo(actual.x, actual.y)
                    CTX.fillStyle = actual.fillStyle;
                    break;

                    case 'triangle':
                    
                    CTX.beginPath()
                    CTX.lineWidth = actual.width;
                    CTX.strokeStyle = actual.strokeStyle;
                    CTX.fillStyle = actual.fillStyle;
                    CTX.moveTo(actual.prevX, actual.prevY);
                    CTX.lineTo(actual.offsetX, actual.offsetY);
                    CTX.lineTo(actual.prevX*2-actual.offsetX, actual.offsetY);
                    CTX.closePath()
                    if (actual.mode == "fill") { CTX.fill() } else { CTX.stroke(); }
                    break;

                case 'brush':

                    CTX.lineJoin = "round"
                    CTX.lineCap = "round";
                    CTX.lineWidth = actual.width;
                    CTX.strokeStyle = actual.strokeStyle;
                    CTX.lineTo(actual.x, actual.y)
                    CTX.stroke()
                    CTX.lineJoin = "round";
                    break;

                case 'circle':
                    CTX.beginPath()
                    CTX.lineWidth = actual.width;
                    CTX.strokeStyle = actual.strokeStyle;
                    CTX.fillStyle = actual.fillStyle;
                    CTX.arc(actual.prevX, actual.prevY, actual.radius, 0, Math.PI * 2);
                    if (actual.mode == "fill") { CTX.fill() } else { CTX.stroke(); }

                    break;

                case 'square':
                    CTX.beginPath()
                    CTX.lineWidth = actual.width;
                    CTX.strokeStyle = actual.strokeStyle;
                    CTX.fillStyle = actual.fillStyle;
                    CTX.rect(actual.prevX, actual.prevY, actual.prevX - actual.offsetX, actual.prevY - actual.offsetY);
                    if (actual.mode == "fill") { CTX.fill() } else { CTX.stroke() }
                    break;

                case 'first-eraser':
                    CTX.beginPath();
                    CTX.fillStyle = BACKGROUND;
                    CTX.arc(actual.x, actual.y, actual.width, actual.from, actual.to);
                    CTX.fill();
                    CTX.closePath()
                    CTX.beginPath()
                    CTX.moveTo(actual.x, actual.y)
                    break;

                case 'eraser':
                    CTX.lineJoin = "round"
                    CTX.lineCap = "round";
                    CTX.lineWidth = actual.width;
                    CTX.strokeStyle = BACKGROUND;
                    CTX.lineTo(actual.x, actual.y)
                    CTX.stroke()
                    CTX.lineJoin = "round";
                    break;



            }
        }
    }


}



function cloneArray(array) {
    return JSON.parse(JSON.stringify(array))
}


function now() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();

    return `${year}-${month}-${day}-${hour}-${minute}`
}

function saveCanvas() {
    let link = document.createElement('a');
    link.download = now() + 'my-drawing.png';
    link.href = BACKGROUND_CANVAS.toDataURL()
    link.click();
    link.remove()
}

function touchHandler(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch (event.type) {
        case "touchstart": type = "mousedown"; break;
        case "touchmove": type = "mousemove"; break;
        case "touchend": type = "mouseup"; break;
        default: return;
    }

    // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //                screenX, screenY, clientX, clientY, ctrlKey, 
    //                altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    CTX.strokeSyle = "#000";
    CTX.beginPath();
    CTX.moveTo(cx, cy - outerRadius)
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        CTX.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        CTX.lineTo(x, y)
        rot += step
    }
    CTX.lineTo(cx, cy - outerRadius)
    CTX.closePath();
    CTX.lineWidth=5;
    CTX.strokeStyle='blue';
    CTX.stroke();
    CTX.fillStyle='skyblue';
    CTX.fill();

}


//Function to draw a star with offset coordinates with a given radius html canvas 
