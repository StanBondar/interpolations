const canvas = document.getElementById("canvas");
const select = document.getElementById("interpolation-select");
const ctx = canvas.getContext("2d");
const cp1X = document.getElementById("controlPoint1X");
const cp1Y = document.getElementById("controlPoint1Y");
const cp2X = document.getElementById("controlPoint2X");
const cp2Y = document.getElementById("controlPoint2Y");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const BB = canvas.getBoundingClientRect();
const offsetX = BB.left;
const offsetY = BB.top;

let isDragging = false;

const interpolations = {
  null: {
    cp1: { x: 0, y: 0 },
    cp2: { x: 1, y: 1 },
  },
  ease: {
    cp1: { x: 0.25, y: 0.1 },
    cp2: { x: 0.25, y: 1 },
  },
  "ease-in": {
    cp1: { x: 0.42, y: 0 },
    cp2: { x: 1, y: 1 },
  },
  "ease-out": {
    cp1: { x: 0, y: 0 },
    cp2: { x: 0.58, y: 1 },
  },
  "ease-in-out": {
    cp1: { x: 0.42, y: 0 },
    cp2: { x: 0.58, y: 1 },
  },
  "sine-in-out": {
    cp1: { x: 0.45, y: 0.05 },
    cp2: { x: 0.55, y: 0.95 },
  },
};

function countXPointValue(initialValue) {
  return initialValue * 300 + 30;
}

function countYPointValue(value) {
  return -(value * 300 + 30) + HEIGHT;
}

function getXValueFromPoint(number) {
  return +Number((number - 30) / 300).toFixed(2);
}

function getYValueFromPoint(number) {
  return +Number((-(number - HEIGHT) - 30) / 300).toFixed(2);
}

const extremePoints = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

function initForm() {
  select.value = "ease";
  cp1X.value = interpolations.ease.cp1.x;
  cp1Y.value = interpolations.ease.cp1.y;
  cp2X.value = interpolations.ease.cp2.x;
  cp2Y.value = interpolations.ease.cp2.y;
}

function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawLine(
  finishX,
  finishY,
  startX = 0,
  startY = 0,
  fillColor = "black"
) {
  ctx.strokeStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(finishX, finishY);
  ctx.stroke();
  ctx.closePath();
}

function drawAxes() {
  // Draw x-axis line
  drawLine(340, 310, 0, 310);
  // Draw y-axis line
  drawLine(30, 340, 30, 0);
}

function drawPoint(x, y, fillColor = "red") {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(countXPointValue(x), countYPointValue(y), 5, 0, 2 * Math.PI);
  ctx.fill();
}

function drawControlLine(controlPoint, extremePoint, fillColor) {
  drawLine(
    countXPointValue(controlPoint.x),
    countYPointValue(controlPoint.y),
    countXPointValue(extremePoint.x),
    countYPointValue(extremePoint.y),
    fillColor
  );
  drawPoint(controlPoint.x, controlPoint.y, fillColor);
}

function drawExtremePoints() {
  const { start, end } = extremePoints;
  ctx.fillStyle = "red";
  ctx.beginPath();
  // Start point
  ctx.arc(
    countXPointValue(start.x),
    countYPointValue(start.y),
    5,
    0,
    2 * Math.PI
  );
  // End point
  ctx.arc(countXPointValue(end.x), countYPointValue(end.y), 5, 0, 2 * Math.PI);
  ctx.fill();
}

function drawCurve() {
  const { start, end } = extremePoints;
  ctx.beginPath();
  ctx.moveTo(countXPointValue(start.x), countYPointValue(start.y));
  ctx.bezierCurveTo(
    countXPointValue(cp1X.value),
    countYPointValue(cp1Y.value),
    countXPointValue(cp2X.value),
    countYPointValue(cp2Y.value),
    countXPointValue(end.x),
    countYPointValue(end.y)
  );
  ctx.stroke();
}

function drawAll() {
  clear();
  ctx.fillStyle = "grey";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawAxes();
  drawExtremePoints();
  drawCurve();
  drawControlLine(
    { x: cp1X.value, y: cp1Y.value },
    extremePoints.start,
    "yellow"
  );
  drawControlLine(
    { x: cp2X.value, y: cp2Y.value },
    extremePoints.end,
    "yellow"
  );
}

function selectChangeHandler() {
  const { cp1, cp2 } = interpolations[select.value];
  cp1X.value = cp1.x;
  cp1Y.value = cp1.y;
  cp2X.value = cp2.x;
  cp2Y.value = cp2.y;
  drawAll();
}

function inputChangeHandler() {
  select.value = "null";
  drawAll();
}

function isCursorOverCP(cursorX, cursorY) {
  const isOverCP1 =
    countXPointValue(cursorX) >= countXPointValue(cp1X.value) - 10 &&
    countXPointValue(cursorX) <= countXPointValue(cp1X.value) + 10 &&
    countYPointValue(cursorY) >= countYPointValue(cp1Y.value) - 10 &&
    countYPointValue(cursorY) <= countYPointValue(cp1Y.value) + 10;
  const isOverCP2 =
    countXPointValue(cursorX) >= countXPointValue(cp2X.value) - 10 &&
    countXPointValue(cursorX) <= countXPointValue(cp2X.value) + 10 &&
    countYPointValue(cursorY) >= countYPointValue(cp2Y.value) - 10 &&
    countYPointValue(cursorY) <= countYPointValue(cp2Y.value) + 10;
  return { isOverCP1, isOverCP2 };
}

select.addEventListener("change", selectChangeHandler);
cp1X.addEventListener("change", inputChangeHandler);
cp1Y.addEventListener("change", inputChangeHandler);
cp2X.addEventListener("change", inputChangeHandler);
cp2Y.addEventListener("change", inputChangeHandler);

function dragCPHandler(x, y, isCp1, isCp2) {
  if (isCp1) {
    cp1X.value = x;
    cp1Y.value = y;
  }
  if (isCp2) {
    cp2X.value = x;
    cp2Y.value = y;
  }
  drawAll();
}

function mouseMoveHandler(e) {
  e.preventDefault();
  const { clientX, clientY } = e.clientX ? e : e.touches[0];
  const mx = parseInt(clientX - offsetX);
  const my = parseInt(clientY - offsetY);
  const coundexMX = getXValueFromPoint(mx);
  const coundexMY = getYValueFromPoint(my);
  const { isOverCP1, isOverCP2 } = isCursorOverCP(coundexMX, coundexMY);
  if (isOverCP1 || isOverCP2) {
    canvas.style.cursor = isDragging ? "grabbing" : "grab";
    if (isDragging) {
      dragCPHandler(coundexMX, coundexMY, isOverCP1, isOverCP2);
    }
  } else {
    canvas.style.cursor = "initial";
    isDragging = false;
  }
}

function mouseDownHandler(e) {
  e.preventDefault();
  const { clientX, clientY } = e.clientX ? e : e.touches[0];
  const mx = parseInt(clientX - offsetX);
  const my = parseInt(clientY - offsetY);
  const coundexMX = getXValueFromPoint(mx);
  const coundexMY = getYValueFromPoint(my);
  const { isOverCP1, isOverCP2 } = isCursorOverCP(coundexMX, coundexMY);
  if (isOverCP1 || isOverCP2) {
    canvas.style.cursor = "grabbing";
    isDragging = true;
  }
}

function mouseUpHandler() {
  canvas.style.cursor = "grab";
  isDragging = false;
}

canvas.addEventListener("mousedown", mouseDownHandler);
canvas.addEventListener("mouseup", mouseUpHandler);
canvas.addEventListener("mousemove", mouseMoveHandler);

canvas.addEventListener("touchstart", mouseDownHandler);
canvas.addEventListener("touchend", mouseUpHandler);
canvas.addEventListener("touchmove", mouseMoveHandler);

initForm();
drawAll();
