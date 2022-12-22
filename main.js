//Main Canvas
let CANVAS = document.getElementById("myCanvas")
let CTX = CANVAS.getContext("2d")
let METHOD="brush";
let MODE="stroke"
let DRAWING=false;
let prevX, prevY;
let SNAPSHOT;
let RADIUS;
let BACKGROUND="#ffffff"
let lastColor;




//Background Canvas
let BACKGROUND_CANVAS = document.getElementById('background')
let BACKGROUND_CTX = BACKGROUND_CANVAS.getContext('2d')


//Color Variables
let colorsContainer = document.getElementById("colors")
let COLOR_CIRCLES = document.getElementsByClassName("circle")
let colors = ["white","black","gray","blue","red","yellow","green","purple","orange","pink","aqua", "cyan"];


//COMMAND REGISTRY
let COMMANDS = [];
let AUX = [];
let LAST;



//HTML BUTTONS AND LISTENERS

let backgroundInput = document.getElementById('background-color')
backgroundInput.value="#ffffff"

let changeBackground = document.getElementById('change-background-btn')
changeBackground.addEventListener('click', ()=>{
    if(backgroundInput.value=="#ffffff") return;
    
    
    BACKGROUND = backgroundInput.value;
    BACKGROUND_CTX.fillStyle=BACKGROUND;
    BACKGROUND_CTX.rect(0,0,BACKGROUND_CANVAS.width, BACKGROUND_CANVAS.height)
    BACKGROUND_CTX.fill()
    reDraw();
})

/*
backgroundInput.addEventListener('change', ()=>{
    BACKGROUND=backgroundInput.value;
    BACKGROUND_CTX.fillStyle=BACKGROUND;
    BACKGROUND_CTX.rect(0,0,BACKGROUND_CANVAS.width, BACKGROUND_CANVAS.height)
    BACKGROUND_CTX.fill()
})
*/

let activateSquare = document.getElementById('square-btn')
let activateCircle = document.getElementById('circle-btn')
let activateTriangle = document.getElementById('triangle-btn')
let activateBrush = document.getElementById('brush-btn')
let activateEraser = document.getElementById('eraser-btn')
let moreWidth =document.getElementById('moreWidth')
let lessWidth =document.getElementById('lessWidth')
let clearCanvasBtn = document.getElementById('clearCanvas-btn')

moreWidth.addEventListener('click', ()=>{CTX.lineWidth+=10;})
lessWidth.addEventListener('click', ()=>{CTX.lineWidth-=10;})
clearCanvasBtn.addEventListener('click', ()=>{
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    COMMANDS=[]
})

activateBrush.addEventListener('click', ()=>{METHOD="brush"})
activateSquare.addEventListener('click', ()=>{METHOD="square"})
activateCircle.addEventListener('click', ()=>{METHOD="circle"})
activateTriangle.addEventListener('click', ()=>{METHOD="triangle"})
activateEraser.addEventListener('click', ()=>{METHOD="eraser"})


let modeFill = document.getElementById('fill-color-btn')
let modeFillShape = document.getElementById('fill-shape-btn')
let modeStroke = document.getElementById('stroke-shape-btn')

modeFill.addEventListener('click', ()=>{MODE="fill"})
modeStroke.addEventListener('click', ()=>{MODE="stroke"})
modeFillShape.addEventListener('click', ()=>{MODE="fill-shape"})

//Function executed on DOMContentLoaded
function init(){
    
    
    CANVAS.addEventListener("touchstart", touchHandler, true);
    CANVAS.addEventListener("touchmove", touchHandler, true);
    CANVAS.addEventListener("touchend", touchHandler, true);
    CANVAS.addEventListener("touchcancel", touchHandler, true);    
    CANVAS.width = window.innerWidth*0.9;
    CANVAS.height = window.innerHeight * 0.7;
    BACKGROUND_CANVAS.width=CANVAS.width;
    BACKGROUND_CANVAS.height=CANVAS.height;

    for(let i=0;i<colors.length;i++){
        let color = document.createElement("button");
        color.classList.add("circle")
        color.addEventListener("click", (e)=>{
            CTX.strokeStyle=colors[i]
            CTX.fillStyle=colors[i]
            lastColor=colors[i]
        })
        color.style.background=colors[i]
        colors.id=colors[i];
        colorsContainer.appendChild(color)
    } 
}


function startPath(e){
    
    DRAWING=true;
    
    
    switch (METHOD) {

        case 'brush':
            CTX.beginPath();
            CTX.arc(e.offsetX, e.offsetY, CTX.lineWidth/2,0,Math.PI*2);
            CTX.fill();
            CTX.closePath()
            CTX.beginPath()
            CTX.moveTo(e.offsetX, e.offsetY)
            AUX.push({x:e.offsetX,y: e.offsetY,width: CTX.lineWidth/2,from:0,to:Math.PI*2, fillStyle:CTX.fillStyle, type:'first'})
            break;
    
        case 'circle':
            if(MODE=="stroke"|| MODE=="fill"){SNAPSHOT = CTX.getImageData(0, 0, CANVAS.width, CANVAS.height);}
            prevX=e.offsetX;
            prevY=e.offsetY;
        break;

        case 'square':
            if(MODE=="stroke"|| MODE=="fill"){SNAPSHOT = CTX.getImageData(0, 0, CANVAS.width, CANVAS.height);}
            CTX.beginPath();
            prevX=e.offsetX;
            prevY=e.offsetY;
        break;

        case 'eraser':
            CTX.beginPath();
            CTX.fillStyle=BACKGROUND;
            CTX.arc(e.offsetX, e.offsetY, CTX.lineWidth/2,0,Math.PI*2);
            CTX.fill();
            CTX.closePath()
            CTX.beginPath()
            CTX.moveTo(e.offsetX, e.offsetY)
            AUX.push({x:e.offsetX,y: e.offsetY,width: CTX.lineWidth/2,from:0,to:Math.PI*2, type:'first-eraser'})
        
    }
    
}


function draw(e){
   
    if(!DRAWING)return;
    
    switch (METHOD) {
        case 'brush':
            CTX.lineCap="round";
            CTX.lineJoin="round";
            CTX.lineTo(e.offsetX, e.offsetY)
            CTX.stroke()
            AUX.push({x:e.offsetX, y:e.offsetY, width:CTX.lineWidth, strokeStyle:CTX.strokeStyle, type:METHOD})
            break;

        case 'circle':
            
            if(MODE=="stroke" || MODE=="fill"){CTX.putImageData(SNAPSHOT, 0, 0); }
            CTX.beginPath()
            RADIUS =  Math.sqrt(Math.pow((prevX - e.offsetX), 2) + Math.pow((prevY - e.offsetY), 2));
            CTX.arc(prevX, prevY, RADIUS,0,Math.PI*2);
            if(MODE=="fill-shape"){AUX.push({prevX:prevX, prevY:prevY, radius:RADIUS, offsetX:e.offsetX, offsetY:e.offsetY, type:METHOD, width: CTX.lineWidth, fillStyle:CTX.fillStyle, strokeStyle:CTX.strokeStyle, mode:MODE})}
            if(MODE=="fill"){CTX.fill()} else {CTX.stroke()}
            break;
        
        case 'square':
            if(MODE=="stroke" || MODE=="fill"){CTX.putImageData(SNAPSHOT, 0, 0); }
            CTX.beginPath()
            CTX.rect(prevX, prevY, prevX-e.offsetX, prevY-e.offsetY);
            if(MODE=="fill-shape"){AUX.push({prevX:prevX, prevY:prevY, offsetX:e.offsetX, offsetY:e.offsetY, type:METHOD, width: CTX.lineWidth, fillStyle:CTX.fillStyle, strokeStyle:CTX.strokeStyle, mode:MODE})}
            if(MODE=="fill"){CTX.fill();} else {CTX.stroke()}

            break;
        
            case 'eraser':
            CTX.strokeStyle=BACKGROUND;
            CTX.lineCap="round";
            CTX.lineJoin="round";
            CTX.lineTo(e.offsetX, e.offsetY)
            CTX.stroke()
            AUX.push({x:e.offsetX, y:e.offsetY, width:CTX.lineWidth, type:'eraser'})
            CTX.strokeStyle=lastColor;
            CTX.fillStyle=lastColor;
            break;
    
        
    }
    

}



CANVAS.addEventListener('mousedown', startPath)

CANVAS.addEventListener('mousemove', e=>{
    if(!DRAWING) return;
    draw(e)
    
})

CANVAS.addEventListener('mouseup', e=>{

    DRAWING=false;
    switch(METHOD){
        case 'circle':
            if(MODE!="fill-shape"){AUX.push({prevX:prevX, prevY:prevY, radius:RADIUS, type:METHOD, width: CTX.lineWidth, fillStyle:CTX.fillStyle, strokeStyle:CTX.strokeStyle, mode:MODE})}
            
            break;
            
        case 'brush':
            break;
                
        case 'square':
            if(MODE!="fill-shape"){AUX.push({prevX:prevX, prevY:prevY, offsetX:e.offsetX, offsetY:e.offsetY, type:METHOD, width: CTX.lineWidth, fillStyle:CTX.fillStyle, strokeStyle:CTX.strokeStyle, mode:MODE})}
            
            break;
        
        }



            COMMANDS.push(AUX)
            LAST=AUX.map(x=>{x})
            AUX=[]
        })
        


CANVAS.addEventListener('mouseleave', ()=>{ DRAWING=false;})










document.addEventListener('DOMContentLoaded', init)

document.addEventListener('keydown', e=>{

    switch(e.key){
        case '+':
            CTX.lineWidth+=10;
            break;
        
        case '-':
            CTX.lineWidth-=10;
            break;
        
        case 'Backspace':
            CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
            COMMANDS=[]
            break;

        case 'r':
            console.log(LAST)
            break;
        case 'ctrl':
            case 'z':
                undo()
                break;

            case 'y':
                redo()
                break;
        break;
        
        
    }

})


function undo(){
    
    if(COMMANDS.length>0){LAST=COMMANDS[COMMANDS.length-1]}
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height); //Clears Canvas
    
    COMMANDS.pop() //Deletes Last Command
    let actual;
    
    for(let i=0; i<COMMANDS.length;i++){

        for(let j=0; j<COMMANDS[i].length;j++){
            actual=COMMANDS[i][j]
            
            switch (actual.type) {
                case 'first':
                    CTX.beginPath();
                    CTX.arc(actual.x,actual.y,actual.width,actual.from,actual.to);
                    CTX.fill();
                    CTX.closePath()
                    CTX.beginPath()
                    CTX.moveTo(actual.x, actual.y)    
                    CTX.fillStyle=actual.fillStyle;
                break;
            
                case 'brush':
                    
                    CTX.lineJoin="round"
                    CTX.lineCap="round";
                    CTX.lineWidth=actual.width;
                    CTX.strokeStyle=actual.strokeStyle;
                    CTX.lineTo(actual.x, actual.y)
                    CTX.stroke()
                    CTX.lineJoin="round";
                break;
    
                case 'circle':
                    CTX.beginPath()
                    CTX.lineWidth=actual.width;
                    CTX.strokeStyle=actual.strokeStyle;
                    CTX.fillStyle=actual.fillStyle;
                    CTX.arc(actual.prevX,actual.prevY, actual.radius,0,Math.PI*2);
                    if(actual.mode=="fill"){CTX.fill()} else {CTX.stroke();}
                    
                break;

                case 'square':
                    CTX.beginPath()
                    CTX.lineWidth=actual.width;
                    CTX.strokeStyle=actual.strokeStyle;
                    CTX.fillStyle=actual.fillStyle;
                    CTX.rect(actual.prevX, actual.prevY, actual.prevX-actual.offsetX, actual.prevY-actual.offsetY);
                    if(actual.mode=="fill"){CTX.fill()} else {CTX.stroke()}
                    break;

                    case 'first-eraser':
                    CTX.beginPath();
                    CTX.fillStyle=BACKGROUND;
                    CTX.arc(actual.x,actual.y,actual.width,actual.from,actual.to);
                    CTX.fill();
                    CTX.closePath()
                    CTX.beginPath()
                    CTX.moveTo(actual.x, actual.y)    
                    break;
                
                case 'eraser':
                    CTX.lineJoin="round"
                    CTX.lineCap="round";
                    CTX.lineWidth=actual.width;
                    CTX.strokeStyle=BACKGROUND;
                    CTX.lineTo(actual.x, actual.y)
                    CTX.stroke()
                    CTX.lineJoin="round";
                    CTX.strokeStyle=lastColor;
                    CTX.fillStyle=lastColor;
                    break;
            }
        }
    }
}

function redo(){
    
    if(LAST.length==0)return;
    COMMANDS.push(LAST)

    for(let j=0; j<LAST.length;j++){
        actual=LAST[j];

        switch (actual.type) {
            case 'first':
                CTX.beginPath();
                CTX.beginPath();
                CTX.arc(actual.x,actual.y,actual.width,actual.from,actual.to);
                CTX.fill();
                CTX.closePath()
                CTX.beginPath()
                CTX.moveTo(actual.x, actual.y)    
                CTX.fillStyle=actual.fillStyle;
            break;
        
            case 'brush':
            CTX.lineJoin="round"
            CTX.lineCap="round";
            CTX.lineWidth=actual.width;
            CTX.strokeStyle=actual.strokeStyle;
            CTX.lineTo(actual.x, actual.y)
            CTX.stroke()
            CTX.lineJoin="round";
            break;

            case 'circle':
                console.log('redo')
                CTX.beginPath()
                CTX.lineWidth=actual.width;
                CTX.strokeStyle=actual.strokeStyle;
                CTX.fillStyle=actual.fillStyle;
                CTX.arc(actual.prevX,actual.prevY, actual.radius,0,Math.PI*2);
                if(actual.mode=="fill"){CTX.fill()} else {CTX.stroke();}
            break;

            case 'square':
                    CTX.beginPath()
                    CTX.lineWidth=actual.width;
                    CTX.strokeStyle=actual.strokeStyle;
                    CTX.fillStyle=actual.fillStyle;
                    CTX.rect(actual.prevX, actual.prevY, actual.prevX-actual.offsetX, actual.prevY-actual.offsetY);
                    if(actual.mode=="fill"){CTX.fill()} else {CTX.stroke()}
                    break;
            
                    case 'first-eraser':
                        CTX.beginPath();
                        CTX.fillStyle=BACKGROUND;
                        CTX.arc(actual.x,actual.y,actual.width,actual.from,actual.to);
                        CTX.fill();
                        CTX.closePath()
                        CTX.beginPath()
                        CTX.moveTo(actual.x, actual.y)    
                        break;
                    
                    case 'eraser':
                        CTX.lineJoin="round"
                        CTX.lineCap="round";
                        CTX.lineWidth=actual.width;
                        CTX.strokeStyle=BACKGROUND;
                        CTX.lineTo(actual.x, actual.y)
                        CTX.stroke()
                        CTX.lineJoin="round";
                        CTX.strokeStyle=lastColor;
                        CTX.fillStyle=lastColor;
                        break;
            

        }
        
    }

    LAST=[]
}

function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup";   break;
        default:           return;
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


function reDraw(){

    

    CTX.clearRect(0,0,CANVAS.height,CANVAS.width)
    for(let i=0; i<COMMANDS.length;i++){

        for(let j=0; j<COMMANDS[i].length;j++){
            actual=COMMANDS[i][j]
            
            switch (actual.type) {
                case 'first':
                    CTX.beginPath();
                    CTX.arc(actual.x,actual.y,actual.width,actual.from,actual.to);
                    CTX.fill();
                    CTX.closePath()
                    CTX.beginPath()
                    CTX.moveTo(actual.x, actual.y)    
                    CTX.fillStyle=actual.fillStyle;
                break;
            
                case 'brush':
                    
                    CTX.lineJoin="round"
                    CTX.lineCap="round";
                    CTX.lineWidth=actual.width;
                    CTX.strokeStyle=actual.strokeStyle;
                    CTX.lineTo(actual.x, actual.y)
                    CTX.stroke()
                    CTX.lineJoin="round";
                break;
    
                case 'circle':
                    CTX.beginPath()
                    CTX.lineWidth=actual.width;
                    CTX.strokeStyle=actual.strokeStyle;
                    CTX.fillStyle=actual.fillStyle;
                    CTX.arc(actual.prevX,actual.prevY, actual.radius,0,Math.PI*2);
                    if(actual.mode=="fill"){CTX.fill()} else {CTX.stroke();}
                    
                break;

                case 'square':
                    CTX.beginPath()
                    CTX.lineWidth=actual.width;
                    CTX.strokeStyle=actual.strokeStyle;
                    CTX.fillStyle=actual.fillStyle;
                    CTX.rect(actual.prevX, actual.prevY, actual.prevX-actual.offsetX, actual.prevY-actual.offsetY);
                    if(actual.mode=="fill"){CTX.fill()} else {CTX.stroke()}
                    break;
                
                case 'first-eraser':
                    CTX.beginPath();
                    CTX.fillStyle=BACKGROUND;
                    CTX.arc(actual.x,actual.y,actual.width,actual.from,actual.to);
                    CTX.fill();
                    CTX.closePath()
                    CTX.beginPath()
                    CTX.moveTo(actual.x, actual.y)    
                    break;
                
                case 'eraser':
                    CTX.lineJoin="round"
                    CTX.lineCap="round";
                    CTX.lineWidth=actual.width;
                    CTX.strokeStyle=BACKGROUND;
                    CTX.lineTo(actual.x, actual.y)
                    CTX.stroke()
                    CTX.lineJoin="round";
                    break;
                

                
            }
        }
    }


}

function clearCanvas(canvas){
    canvas.clearRect(0,0,canvas.width, canvas.height);
}