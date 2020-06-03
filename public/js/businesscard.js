import * as THREE from "./threejs/three.js";
import { OrbitControls } from "./threejs/OrbitControls.js";

var camera, scene, renderer;
var mesh;
var FlyInXDir = Math.random() > 0.5 ? -1 : 1; // random direction
var FlyInXYTheta = Math.random() * Math.PI; // random rotation
let clock = init();
animate(clock);

function flyInPath(t, dir) {
  let [a, b, c, d] = [[0, 0], [1, 1.3], [0.5, 1], [1, 1]];
  return [
    FlyInPathx(a, b, c, d, t),
    FlyInPathy(a, b, c, d, t),
    FlyInPathz(a, b, c, d, t)
  ];
}
function FlyInPathx(a, b, c, d, t) {
  return Math.cos(1.5 * Math.PI * t) * 30 * (1 / (t + 0.25) ** 3);
}
function FlyInPathy(a, b, c, d, t) {
  return 550 - 500 * cubicBezier(a, b, c, d)(t)[1];
}
function FlyInPathz(a, b, c, d, t) {
  return 700 - 400 * cubicBezier(a, b, c, d)(t)[1];
}
function cubicBezier(a, b, c, d) {
  return t => {
    return [
      (1 - t) ** 3 * a[0] +
        3 * (1 - t) ** 2 * b[0] * t +
        3 * (1 - t) * c[0] * t ** 2 +
        t ** 3 * d[0],
      (1 - t) ** 3 * a[1] +
        3 * (1 - t) ** 2 * b[1] * t +
        3 * (1 - t) * c[1] * t ** 2 +
        t ** 3 * d[1]
    ];
  };
}
function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  var clock = new THREE.Clock();
  camera.position.z = 300;
  camera.position.y = 50;

  scene = new THREE.Scene();

  var geometry = new THREE.BoxBufferGeometry(350, 200, 3, 10, 10, 1);
  var material = new THREE.MeshBasicMaterial();
  material.wireframe = true;
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 200;
  controls.maxDistance = 700;
  controls.target.set(0, 1, 0);
  controls.update();
  window.addEventListener("resize", onWindowResize, false);

  return clock;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  var elapsedTime = clock.getElapsedTime();
  let transitionTime = 2.5;
  if (elapsedTime < transitionTime && true) {
    let x, y, z;
    [x, y, z] = flyInPath(elapsedTime / transitionTime);
    let xrot = x * Math.cos(FlyInXYTheta) - y * Math.sin(FlyInXYTheta); // rotate
    let yrot = x * Math.sin(FlyInXYTheta) + y * Math.cos(FlyInXYTheta); // rotate

    x =
      (1 - elapsedTime / transitionTime) * xrot +
      (elapsedTime / transitionTime) * x; // taper
    y =
      (1 - elapsedTime / transitionTime) * yrot +
      (elapsedTime / transitionTime) * y; // taper
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
  }
  render();
}

function render() {
  renderer.render(scene, camera);
}
