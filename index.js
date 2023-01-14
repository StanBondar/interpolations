const canvas = document.getElementById("canvas");
const select = document.getElementById("interpolation-select");
const ctx = canvas.getContext("2d");
const cp1X = document.getElementById("controlPoint1X");
const cp1Y = document.getElementById("controlPoint1Y");
const cp2X = document.getElementById("controlPoint2X");
const cp2Y = document.getElementById("controlPoint2Y");

const interpolations = {
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

function countPointValue(initialValue) {
  return initialValue * 300 + 30;
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

function drawAxes() {
  // Draw x-axis line
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.lineTo(340, 30);
  ctx.stroke();

  // Draw y-axis line
  ctx.beginPath();
  ctx.moveTo(30, 0);
  ctx.lineTo(30, 340);
  ctx.stroke();
}

function drawExtremePoints() {
  const { start, end } = extremePoints;
  ctx.fillStyle = "red";
  ctx.beginPath();
  // Start point
  ctx.arc(
    countPointValue(start.x),
    countPointValue(start.y),
    5,
    0,
    2 * Math.PI
  );
  // End point
  ctx.arc(countPointValue(end.x), countPointValue(end.y), 5, 0, 2 * Math.PI);
  ctx.fill();
}

function drawCurve() {
  const { start, end } = extremePoints;
  // Cubic Bézier curve
  ctx.beginPath();
  ctx.moveTo(countPointValue(start.x), countPointValue(start.y));
  ctx.bezierCurveTo(
    countPointValue(cp1X.value),
    countPointValue(cp1Y.value),
    countPointValue(cp2X.value),
    countPointValue(cp2Y.value),
    countPointValue(end.x),
    countPointValue(end.y)
  );
  ctx.stroke();
}

// Control points
// ctx.fillStyle = "red";
// ctx.beginPath();
// ctx.arc(cp1.x, cp1.y, 5, 0, 2 * Math.PI); // Control point one
// ctx.arc(cp2.x, cp2.y, 5, 0, 2 * Math.PI); // Control point two
// ctx.fill();

function selectChangeHandler() {
  console.log(select.value);
}

select.addEventListener("change", selectChangeHandler);

initForm();
drawAxes();
drawExtremePoints();
drawCurve();
