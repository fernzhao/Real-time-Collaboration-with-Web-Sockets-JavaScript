
var words = [];


let start = -1;
let score1;
let score2;
let user1Name = "";



let user2Name = "";
let userControl = [];
let userx = 25;
for(let i = 0; i < 6; i++){
  userControl.push({x:userx,
                    y:400,
                    radius:10,
                    vx:0,
                    vy:0,
                    color: "black"
                    });
  userx = userx+30;

}


let plate1 =   {x:100,
                   y:100,
                   radius: 95,
                   score:0}

let plate2 =   {x:100,
                   y:100,
                   radius: 70,
                   score:0}

let plate3 =   {x:100,
                   y:100,
                   radius: 45,
                   score:0}
let plate4 =   {x:100,
                   y:100,
                   radius: 20,
                   score:0}
/*let ball = {x:400,
            y:300,
            radius:50,
            xDirection:2,
            yDirection:2};*/
var movingString = {
  word: "Moving",
  x: 100,
  y: 100,
  xDirection: 1, //+1 for leftwards, -1 for rightwards
  yDirection: 1, //+1 for downwards, -1 for upwards
  stringWidth: 50, //will be updated when drawn
  stringHeight: 24
}; //assumed height based on drawing point size

//intended for keyboard control
var movingBox = {
  x: 50,
  y: 50,
  width: 100,
  height: 100
};

var timer; //used to control the free moving word
var pollingTimer; //timer to poll server for location updates

let check = 0;
let flag = 1;
let lastX = 0;
let lastY = 0;
let wait = 0;

var wordBeingMoved; //word being dragged by mouse
var wordTargetRect = { x: 0, y: 0, width: 0, height: 0 }; //bounding box around word being targeted

var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById("canvas1"); //our drawing canvas
var canvas2 = document.getElementById("canvas2");
var fontPointSize = 18; //point size for word text
var wordHeight = 20; //estimated height of a string in the editor
var editorFont = "Arial"; //font for your editor

//connect to server and retain the socket
var socket = io('http://' + window.document.location.host)
//var socket = io('http://localhost:3000')
// [ball,user1Control,user2Control

socket.on('blueBoxData', function(data) {
  console.log("data: " + data);
  console.log("typeof: " + typeof data);
  var locationData = JSON.parse(data);
  userControl = locationData[0];



  user1Name = locationData[1];
  console.log("Name: "+user1Name);
  user2Name = locationData[2];
  flag = locationData[4];
  check = locationData[3];
  //user3Control = locationData[6];
//  user4Control = locationData[7];
//  user5Control = locationData[8];
//  user6Control = locationData[9];
  drawCanvas();
})

function wait1(){
  wait = 0;
}

function getWordAtLocation(aCanvasX, aCanvasY) {
  //locate the word targeted by aCanvasX, aCanvasY
  //find a word whose bounding box contains location (aCanvasX, aCanvasY)


}

var drawCanvas = function() {
  var context = canvas.getContext("2d");
  var context2 = canvas2.getContext("2d");

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height); //erase canvas

  context.font = "" + fontPointSize + "pt " + editorFont;
  context.fillStyle = "cornflowerblue";
  context.strokeStyle = "blue";


   if(start > -1){
    context.fillText(user1Name,50,300);
    context.strokeText(user1Name,50,300);
    context.fillText(user2Name,150,300);
    context.strokeText(user2Name,150,300);
    context.fillText(":",500,100);
    context.strokeText(":",500,100);
  }


  //draw box around word last targeted with mouse -for debugging
  context.strokeStyle = "red";
  context.beginPath();
  context.fillStyle = 'blue';
  context.arc(plate1.x,plate1.y,plate1.radius,0,2*Math.PI);
  context.fill();
  context.beginPath();


  context.fillStyle = 'white';
  context.arc(plate2.x,plate2.y,plate2.radius,0,2*Math.PI);
  context.fill();
  context.beginPath();


  context.fillStyle = 'red';
  context.arc(plate3.x,plate3.y,plate3.radius,0,2*Math.PI);
  context.fill();
  context.beginPath();

  context.fillStyle = 'white';
  context.arc(plate4.x,plate4.y,plate4.radius,0,2*Math.PI);
  context.fill();
  context.beginPath();

  //canvas2
  context2.fillStyle = "white";
  context2.rect(0,0,500,500);
  context2.fill();
  context2.beginPath();

  context2.fillStyle = 'blue';
  context2.arc(250,250,237,0,2*Math.PI);
  context2.fill();
  context2.beginPath();


  context2.fillStyle = 'white';
  context2.arc(250,250,175,0,2*Math.PI);
  context2.fill();
  context2.beginPath();


  context2.fillStyle = 'red';
  context2.arc(250,250,112,0,2*Math.PI);
  context2.fill();
  context2.beginPath();

  context2.fillStyle = 'white';
  context2.arc(250,250,50,0,2*Math.PI);
  context2.fill();
  context2.beginPath();



  for(let i = 0; i < 6; i++){
    context.fillStyle = userControl[i].color;
    context.arc(userControl[i].x,userControl[i].y,userControl[i].radius,0,2*Math.PI);
    context.fill();
    context.beginPath();
    if(userControl[i].y <= 200){
      context2.fillStyle = userControl[i].color;
      context2.arc(userControl[i].x*2.5,userControl[i].y*2.5,userControl[i].radius*2.5,0,2*Math.PI);
      context2.fill();
      context2.beginPath();
    }

  }
  if(lastX != 0 && lastY != 0){
    console.log("drawline");
    context.strokeSytle = "black";
    context.beginPath();
    context.moveTo(lastX,lastY);
    context.lineTo(userControl[check].x,userControl[check].y);
    context.stroke();
  }



  /*context.strokeStyle = 'black';
  context.arc(ball.x,ball.y,ball.radius,0,2*Math.PI);
  context.stroke();*/
};

function handleMouseDown(e) {
  //get mouse location relative to canvas top left\
  if(start != -1){
  if(start === check % 2){
  if(check % 2 === 0){
    userControl[check].color = "purple";
  }
  else{
    userControl[check].color = "green";
  }
  if(wait === 0){
  var rect = canvas.getBoundingClientRect();
  //var canvasX = e.clientX - rect.left;
  //var canvasY = e.clientY - rect.top;
  var canvasX = e.pageX - rect.left; //use jQuery event object pageX and pageY
  var canvasY = e.pageY - rect.top;
  console.log("mouse down:" + canvasX + ", " + canvasY);

  //wordBeingMoved = getWordAtLocation(canvasX, canvasY);
  //wordBeingMoved = userControl[check];
  //console.log(wordBeingMoved.word);
  lastX = userControl[check].x;
  lastY = userControl[check].y;
  //console.log("lastX: " + lastX);
  //console.log("lastY: " + lastY);
  if (userControl[check] != null) {
    deltaX = userControl[check].x - canvasX;
    deltaY = userControl[check].y - canvasY;
    //attache mouse move and mouse up handlers
    $("#canvas1").mousemove(handleMouseMove);
    $("#canvas1").mouseup(handleMouseUp);
  }

  // Stop propagation of the event and stop any default
  //  browser action
  e.stopPropagation();
  e.preventDefault();
  //wait = 1;
  //check++;
}
  //check++;
  drawCanvas();
}
}
}

function handleMouseMove(e) {
  console.log("mouse move");

  //get mouse location relative to canvas top left
  var rect = canvas.getBoundingClientRect();
  var canvasX = e.pageX - rect.left;
  var canvasY = e.pageY - rect.top;



  let distanceX = userControl[check].x-lastX;
  let distanceY = userControl[check].y-lastY;
  //console.log("DistanceX: " + distanceX);
  //console.log("DistanceY: "+ distanceY);
  userControl[check].vx = -distanceX/3;
  userControl[check].vy = -distanceY/3;
  console.log("VX: " + userControl[check].vx);



  userControl[check].x = canvasX + deltaX;
  userControl[check].y = canvasY + deltaY;

  e.stopPropagation();


  drawCanvas();
}

function handleMouseUp(e) {
  console.log("mouse up");
  e.stopPropagation();

  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler
  lastX = 0;
  lastY = 0;
  wait = 1;
  //console.log(wait);
  check++;
  if(flag === 1){
    flag = 2;
  }
  else{
    flag = 1;
  }
  console.log(flag);
  drawCanvas(); //redraw the canvas
}

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs

function handleSubmitButton(){
  words = [];
  let userText = $('#userTextField').val();
  $('#userTextField').val('');
  if(start === -1 && userText && userText != ''){
    if(user1Name === ""){
      user1Name = userText;
      start = 0;
    }
    else if(user2Name === ""){
      user2Name = userText;
      start = 1;
    }
    else{
      //words.push({word:"No more space ,please try later",x:100,y:100});
    }
  }
  var dataObj = [userControl,user1Name,user2Name,check,flag
                 ];
  var jsonString = JSON.stringify(dataObj);
  socket.emit('blueBoxData', jsonString);

}

function handleTimer() {
for(let j = 0; j < 6; j++){
if(userControl[j] != null){


  if(userControl[j].vx != 0 && lastX === 0 || userControl[j].vy != 0 && lastX === 0){
    userControl[j].x += userControl[j].vx ;
    userControl[j].y += userControl[j].vy ;
    userControl[j].vx *= 0.95;
    userControl[j].vy *= 0.95;

    //userControl[0].vx -= 0.1;
    //userControl[0].vy -= 0.1;


  if(userControl[j].y <= 10){
    userControl[j].y = 10;
    userControl[j].vy = 0;
  }
  if(userControl[j].y >= 490){
    userControl[j].y = 490;
    userControl[j].vy = 0;
  }
  if(userControl[j].x <= 10){
    //userControl[check-1].x = 5;
    userControl[j].vx = -userControl[j].vx;
  }
  if(userControl[j].x >= 190){
    //userControl[check-1].x = 200;
    userControl[j].vx = -userControl[j].vx;
  }
  if(Math.abs(userControl[j].vx) < 0.2){
    userControl[j].vx = 0;
  }
  if(Math.abs(userControl[j].vy) < 0.2){
    userControl[j].vy = 0;
  }
  for(let i = 0; i < 6; i++){
    d = Math.sqrt(Math.pow(userControl[i].x - userControl[j].x,2)+Math.pow(userControl[i].y - userControl[j].y ,2));
    //console.log("D: "+d);
    if(d < 20 && i != j){
      impact(userControl[j],userControl[i]);
    }
  }

  var dataObj = [userControl,user1Name,user2Name,check,flag
                 ];
  var jsonString = JSON.stringify(dataObj);
  socket.emit('blueBoxData', jsonString);
  if(Math.abs(userControl[check-1].vx) < 0.2 && Math.abs(userControl[check-1].vy) < 0.2){
    //check++;
    wait = 0;
    //wait = 0;
  }
}
}


}
  drawCanvas();

}

function impact(ball1,ball2){
  ball2.vx = 0.8*ball1.vx;
  ball2.vy = 0.8*ball1.vy;
  ball1.vx = -0.2*ball1.vx;
  ball1.vy = -0.2*ball1.vy;
  ball1.x += ball1.vx;
  ball2.x += ball2.vx;
  ball1.y += ball1.vy;
  ball2.y += ball2.vy;

}

function giveUp(){
  if(start === 0){
    user1Name = "";
  }
  else if(start === 1){
    user2Name = "";
  }
  start = -1;
  var dataObj = [userControl,user1Name,user2Name,check,flag
                 ];
  var jsonString = JSON.stringify(dataObj);
  socket.emit('blueBoxData', jsonString);
}

//KEY CODES
//should clean up these hard coded key codes
var RIGHT_ARROW = 39;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var DOWN_ARROW = 40;

function pollingTimerHandler() {

}

function handleKeyDown(e) {

}

function handleKeyUp(e) {
  console.log("key UP: " + e.which);

}

$(document).ready(function() {
  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown);
  //add keyboard handler to document
  $(document).keydown(handleKeyDown);
  $(document).keyup(handleKeyUp);

  timer = setInterval(handleTimer, 100); //tenth of second
  pollingTimer = setInterval(pollingTimerHandler, 100); //quarter of a second
  //timer.clearInterval(); //to stop

  drawCanvas();
});
