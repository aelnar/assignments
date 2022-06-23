// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// global vars
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_size;

function setupWebGL() {

  canvas = document.getElementById('webgl');

  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);

}

function connectVariablesToGLSL(){

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

// global vars for asg2
let g_globalAngle = 20; // in rubric: gAnimalGlobalRotation
let g_wings = 5;
let g_beak = 0;
let g_animate = false;

function addActionsToUI(){

  // new buttons just dropped
  document.getElementById("onButton").onclick = function() { g_animate = true; };
  document.getElementById("offButton").onclick = function() { g_animate = false; };

  // ayo new sliders just dropped
  document.getElementById("wingSlider").addEventListener('mousemove', function () {g_wings = this.value; renderAllShapes(); });
  document.getElementById("beakSlider").addEventListener('mousemove', function () {g_beak = this.value; renderAllShapes(); });
  document.getElementById("angleSlider").addEventListener('mousemove', function () {g_globalAngle = this.value; renderAllShapes(); });

}

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  addActionsToUI();

  gl.clearColor(0.0, 1.0, 0.0, 1.0);

  //renderAllShapes();

  requestAnimationFrame(tick);

}

var g_start = performance.now()/1000.0;
var g_secs = performance.now()/(1000.0-g_start);

// in rubric: tick
function tick() {

  g_secs = performance.now()/(1000.0-g_start);
  //console.log(performance.now());

  renderAllShapes();

  requestAnimationFrame(tick);
}

// in rubric: renderScene()
function renderAllShapes(){

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // in rubric: render() = drawCube()
  // see Cube class

  // body - gray
  var body = new Cube();
  body.color = [0.82,0.82,0.82,1.0];
  body.matrix.translate(-.18, -0.35, -0.24);
  body.matrix.scale(0.3, 0.5, 0.3);
  body.render();

  // head - yellow
  var head = new Cube();
  head.color = [1.0,1.0,0.0,1.0];
  head.matrix.translate(-.13, 0.12, -0.19);
  head.matrix.scale(0.2, 0.23, 0.2);
  head.render();

  // head - gray
  var head1 = new Cube();
  head1.color = [0.76,0.76,0.76,1.0];
  head1.matrix.translate(-.13, 0.35, -0.29);
  head1.matrix.scale(0.2, 0.08, 0.3);
  head1.render();

  // beak - top
  var beak = new Cube();
  beak.color = [0.0,0.0,0.0,1.0];
  beak.matrix.translate(-.08, (0.24+g_beak*0.01), -0.26);
  beak.matrix.scale(0.1, 0.08, 0.08);
  beak.render();

  // beak - bottom
  var beak = new Cube();
  beak.color = [0.0,0.0,0.0,1.0];
  beak.matrix.translate(-.08, (0.17-g_beak*0.01), -0.26);
  beak.matrix.scale(0.1, 0.08, 0.08);
  beak.render();

  // eye 1 - black
  var eye1 = new Cube();
  eye1.color = [0.0,0.0,0.0,1.0];
  eye1.matrix.translate(-.14, 0.28, -0.17);
  eye1.matrix.scale(0.06, 0.06, 0.06);
  eye1.render();

  // eye 2 - black
  var eye2 = new Cube();
  eye2.color = [0.0,0.0,0.0,1.0];
  eye2.matrix.translate(.02, 0.28, -0.17);
  eye2.matrix.scale(0.06, 0.06, 0.06);
  eye2.render();

  // wing 1 - gray
  var wing1 = new Cube();
  wing1.color = [0.76,0.76,0.76,1.0];
  wing1.matrix.translate(-0.13, 0.36, 0.19);
  wing1.matrix.invert();
  if(g_animate){
    wing1.matrix.rotate(g_wings*Math.sin(g_secs),0,0,1);
  }
  else{
    wing1.matrix.rotate(g_wings,0,0,1);
  }
  wing1.matrix.scale(0.07, 0.5, 0.2);
  wing1.render();

  // wing 2 - gray
  var wing2 = new Cube();
  wing2.color = [0.76,0.76,0.76,1.0];
  wing2.matrix.translate(0.25, 0.36, 0.19);
  wing2.matrix.invert();
  if(g_animate){
    wing2.matrix.rotate(-g_wings*Math.sin(g_secs),0,0,1);
  }
  else{
    wing2.matrix.rotate(-g_wings,0,0,1);
  }
  wing2.matrix.scale(0.07, 0.5, 0.2);
  wing2.render();

  // tail
  var tail = new Cube();
  tail.color = [0.76,0.76,0.76,1.0];
  tail.matrix.translate(-0.18, -0.26, 0.06);
  tail.matrix.scale(0.3, 0.03, 0.4);
  tail.matrix.rotate(90,1,0,0);
  tail.render();

  // foot 1
  var foot1 = new Cube();
  foot1.color = [1.0,1.0,1.0,1.0];
  foot1.matrix.translate(-0.15, -0.51, -0.14);
  foot1.matrix.scale(0.05, 0.2, 0.05);
  foot1.render();

  // foot 2 - pink
  var foot2 = new Cube();
  foot2.color = [1.0,1.0,1.0,1.0];
  foot2.matrix.translate(0.04, -0.51, -0.14);
  foot2.matrix.scale(0.05, 0.2, 0.05);
  foot2.render();


}
