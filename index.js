var canvasSize = [800,800];
var canvasCenter = [
  canvasSize[0] / 2,
  canvasSize[1] / 2
];
var drawingRadius = canvasCenter[0] > canvasCenter[1]
                  ? canvasCenter[0] - 25
                  : canvasCenter[1] - 25;
var currentCycle = 0;
var targetCorners = [];
var currentPos = {x:canvasCenter[0], y:canvasCenter[1]}; // keeps track of the drawing heads pos

/* Tweakable vars */
var cornersToDraw =7;
var pointsToDrawPerCycle = 200000;
var stopDrawingAfter = 10000; // Cycles


var c
var ctx
function setup()
{
  pixelDensity(1);
  createCanvas(...canvasSize);
  background(0);
  let white = color(255,255,255)
  stroke(white);
  fill(white);
  calcStartAngle();
  drawCorners(cornersToDraw);
  ellipse(...canvasCenter, 5);
 c=document.getElementById("defaultCanvas0");
 ctx=c.getContext("2d");
}

function calcAnglePointToPoint(from, to)
{
  return Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
}

function calcDistPointToPoint(from, to)
{
  let vector = {
    x: from.x - to.x,
    y: from.y - to.y
  }
  let dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  return dist;
}

function calcPosByAngleAndDist(angle, distance)
{
  pos = {
    x: 0,
    y: 0
  };

  pos.x = Math.cos(radians(angle)) * distance;
  pos.y = Math.sin(radians(angle)) * distance;

  return pos;
}

// Halfway pos
function getPosTowardsTarget(current, target)
{
  let angle = calcAnglePointToPoint(current, target);
  let dist = calcDistPointToPoint(current, target);
  let pos = calcPosByAngleAndDist(angle, dist * 1/2);
  pos.x += current.x;
  pos.y += current.y;
  return pos;
}

  var angle = 0;
  var angleGap = 360 / cornersToDraw;
//calculate starting angle for even numbered shapes
function calcStartAngle()
{
  if(cornersToDraw%2==0)
  {
  	angle=180/cornersToDraw;

      drawingRadius=drawingRadius/Math.cos(angle * Math.PI / 180)*0.97;
  	pos = calcPosByAngleAndDist(angle, drawingRadius);
      pos.x += canvasCenter[0];
      pos.y += canvasCenter[1];
      targetCorners.push(pos);
  	cornersToDraw -= 1;
      ellipse(pos.x, pos.y, 5);
  }
}


function drawCorners(cornersToDraw)
{
  let angleVariation = 0;
  for(let i = 0; i < cornersToDraw; i++)
  {
   // angleGap = (360 - angle) / (cornersToDraw - i);

	// Tweak division amount for different variation amounts
    angleVariation = angleGap - angleGap / 1.1;

	// Use angleGap like this if you want perfect shapes
    angle += angleGap // random(angleVariation, angleGap);


    pos = calcPosByAngleAndDist(angle, drawingRadius);
    pos.x += canvasCenter[0];
    pos.y += canvasCenter[1];
    targetCorners.push(pos);

    ellipse(pos.x, pos.y, 5);
  }
}

function draw()
{
  currentCycle++;
  if(currentCycle <= stopDrawingAfter)
  {
    var imgData = ctx.getImageData(0, 0, canvasSize[0], canvasSize[1]);
    var trgtPixel = 0;
	var modValue;
    for(var i = 0; i < pointsToDrawPerCycle; i++)
    {
      let trgt = Math.floor(random(0, targetCorners.length));
      let newPos = getPosTowardsTarget(currentPos, targetCorners[trgt]);
      newPos.x = Math.round(newPos.x)
      newPos.y = Math.round(newPos.y)
      trgtPixel = (newPos.y*canvasSize[0] + newPos.x) * 4;
//	  formula to get form full array: Datapos = (newPos.y*canvasSize[0] - (CanvasSize[0] - newPos.x) * 4)
  	  if (currentCycle%100<=50){
	  if(imgData.data[trgtPixel+(trgt%3)]<255){
        imgData.data[trgtPixel+(trgt%3)] +=18;
      }
  	  else if (imgData.data[trgtPixel+(trgt%3+1)]<255){
        imgData.data[trgtPixel+(trgt%3+1)]+=18;
      }} else {
		 if(imgData.data[trgtPixel+(trgt%3)]>0){
        imgData.data[trgtPixel+(trgt%3)] -=18;
      }
  	  else if (imgData.data[trgtPixel+(trgt%3+1)]>0){
        imgData.data[trgtPixel+(trgt%3+1)]-=18;
		}
	  }


 currentPos = newPos;
    }
    ctx.putImageData(imgData, 0, 0);
  }
}