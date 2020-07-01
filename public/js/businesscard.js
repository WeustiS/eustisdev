import * as THREE from "./threejs/three.js";
import { OrbitControls } from "./threejs/OrbitControls.js";
import "/firebase/app";
import "/firebase/auth";
import "/firebase/analytics";
import "/firebase/functions";
import "/firebase/database";
// TODO make this not a module.npm I all above
// TODO
// eventual raycasting https://github.com/mrdoob/three.js/issues/671
var camera, scene, renderer;
var mesh;
var FlyInXYTheta = Math.random() * Math.PI * 2; // random rotation
let clock = undefined;

let visitRef = firebase
  .database()
  .ref("websitedata/visits")
  .then(snapshot => {
    console.log(snapshot.val());
  });
var count = 0;
visitRef.on("value", function(snapshot) {
  console.log(snapshot.val(), "abc");
  loadCount(snapshot.val());
});
clock = init();
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
  return Math.cos(1.5 * Math.PI * t) * 30 * (1 / (t + 0.3) ** 3);
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
function getRandomColor() {
  var letters = "0123456789ABCD"; // no EF for contrast :)
  var color = "";
  for (var i = 0; i < 6; i++) {
    let char = letters[Math.floor(Math.random() * 14)];
    letters.replace(char, ""); // non-replacement, for fun
    color += char;
  }
  return parseInt("0x" + color);
}

function loadCount(count) {
  var obj = scene.getObjectByName(" count");
  obj.geometry.dispose();
  var loader = new THREE.FontLoader();
  let str = String(count);
  loader.load("/files/helvetiker.typeface.json", function(font) {
    var textGeo = new THREE.TextGeometry(str, {
      font: font,

      size: 25,
      height: 0.01,
      curveSegments: 10,

      bevelThickness: 0.01,
      bevelSize: 5,
      bevelEnabled: false
    });

    var text_material = new THREE.MeshBasicMaterial({
      color: 0xcfcfcf
    });

    var mesh = new THREE.Mesh(textGeo, text_material);
    mesh.name = "visitcount";
    mesh.position.set(-175, -90, 1.5);

    scene.add(mesh);
  });
}

function init(clock) {
  THREE.Cache.enabled = true;
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  clock = new THREE.Clock();
  camera.position.z = 300;
  camera.position.y = 50;

  scene = new THREE.Scene();
  var card_texture = new THREE.TextureLoader().load(
    "./../images/papertexture.jpg"
  );

  var card_geometry = new THREE.BoxBufferGeometry(350, 200, 3, 10, 10, 1);
  var card_material = new THREE.MeshBasicMaterial({ map: card_texture });

  mesh = new THREE.Mesh(card_geometry, card_material);
  scene.add(mesh);

  var loader = new THREE.FontLoader();

  loader.load("/files/helvetiker.typeface.json", function(font) {
    var textGeo = new THREE.TextGeometry(
      count != 0 ? toString(count) : "eustis",
      {
        font: font,

        size: 50,
        height: 0.01,
        curveSegments: 10,

        bevelThickness: 0.01,
        bevelSize: 5,
        bevelEnabled: false
      }
    );
    var text_material = new THREE.MeshBasicMaterial({
      color: getRandomColor()
    });

    var text_mesh = new THREE.Mesh(textGeo, text_material);
    text_mesh.name = "visitcount";
    text_mesh.position.set(-97, 0, 1.6);

    scene.add(text_mesh);
  });

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
