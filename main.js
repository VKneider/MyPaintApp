let CANVAS = document.getElementById("myCanvas")
let CTX = CANVAS.getContext("2d")
let colorsContainer = document.getElementById("colors")
let colors = ["white","black","gray","blue","red","yellow","green","purple","orange","pink","aqua", "cyan"];
let COLOR_CIRCLES = document.getElementsByClassName("circle")


CTX.lineCap="round";
CTX.lineJoin="round";

let backup = document.createElement("canvas")

let DRAWING=false;

let COMMANDS = [];
let AUX = [];
let LAST;

function pushAndExecute(){

AUX.push(arguments)
execute.apply(null, arguments)
return;
}

function saveCommand(){ COMMANDS.push(arguments)}



function init(){

    CANVAS.width = window.innerWidth - 2;
    CANVAS.height = window.innerHeight * 0.8;

    for(let i=0;i<colors.length;i++){
        let color = document.createElement("button");
        color.classList.add("circle")
        color.addEventListener("click", (e)=>{
            CTX.strokeStyle=colors[i]
            CTX.fillStyle=colors[i]
        })
        color.style.background=colors[i]
        colors.id=colors[i];
        colorsContainer.appendChild(color)
    }
    
    
}


function startPath(e){
    
    DRAWING=true;
    CTX.beginPath();
    CTX.arc(e.offsetX, e.offsetY, CTX.lineWidth/2,0,Math.PI*2);
    CTX.fill();
    CTX.closePath()
    CTX.beginPath()
    CTX.moveTo(e.offsetX, e.offsetY)
    AUX.push({x:e.offsetX,y: e.offsetY,width: CTX.lineWidth/2,from:0,to:Math.PI*2, fillStyle:CTX.fillStyle})
    
}
function draw(e){
   
    if(!DRAWING) return;

    CTX.lineCap="round";
    CTX.lineJoin="round";
    CTX.lineTo(e.offsetX, e.offsetY)
    CTX.stroke()

    AUX.push({x:e.offsetX, y:e.offsetY, width:CTX.lineWidth, strokeStyle:CTX.strokeStyle})

}


CANVAS.addEventListener('mousedown', startPath)

CANVAS.addEventListener('mousemove', e=>{
    if(!DRAWING) return;
    draw(e)
    
})


CANVAS.addEventListener('mouseup', e=>{
    DRAWING=false;
    COMMANDS.push(AUX)
    LAST=AUX;
    AUX=[]
})


document.addEventListener('DOMContentLoaded', init)

document.addEventListener('keydown', e=>{

    
    console.log(e.key)

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

        case 'ctrl':
            case 'z':
                deleteAndRestore()
                break;

            case 'y':
                restore()
                break;
        break;
        
        case 'r':
            
            alert(COMMANDS.length)
            break;
    }

})

function deleteAndRestore(){
    
    if(COMMANDS.length>0){LAST=COMMANDS[COMMANDS.length-1]}
    
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    COMMANDS.pop()
    let actual;
    
    for(let i=0; i<COMMANDS.length;i++){

        for(let j=0; j<COMMANDS[i].length;j++){
            actual=COMMANDS[i][j]

            if (j==0){
                
                CTX.beginPath();
                CTX.fillStyle=actual.fillStyle;
                CTX.arc(actual.x,actual.y,actual.width,actual.from,actual.to);
                CTX.fill();
                CTX.closePath()
                CTX.beginPath()
                CTX.moveTo(actual.x, actual.y)    

            }
            
            CTX.lineCap="round";
            CTX.lineJoin="round";
            CTX.lineWidth=actual.width;
            CTX.strokeStyle=actual.strokeStyle;
            CTX.lineTo(actual.x, actual.y)
            CTX.stroke()
        }
    }
}

function restore(){
    
    if(LAST.length==0)return;
    COMMANDS.push(LAST)
    for(let j=0; j<LAST.length;j++){
        actual=LAST[j];

        if (j==0){
            
            CTX.beginPath();
            CTX.fillStyle=actual.fillStyle;
            CTX.arc(actual.x,actual.y,actual.width,actual.from,actual.to);
            CTX.fill();
            CTX.closePath()
            CTX.beginPath()
            CTX.moveTo(actual.x, actual.y)    

        }
        
        CTX.lineCap="round";
        CTX.lineJoin="round";
        CTX.lineWidth=actual.width;
        CTX.strokeStyle=actual.strokeStyle;
        CTX.lineTo(actual.x, actual.y)
        CTX.stroke()
    }

    LAST=[]
}