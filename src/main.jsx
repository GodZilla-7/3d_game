import "./index.css";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// Load HDRI environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/sunflowers_puresky_1k.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
});

alert("use WASD to move and space to jump");
class Cube {
  constructor(width = 1, height = 1, length = 1, color = 0x00ff00, velocity = new THREE.Vector3(0, 0, 0)) {
    this.width = width;
    this.height = height;
    this.length = length;
    this.color = color;
    this.velocity = velocity;
    this.xAcceleration = false;
    
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, length),
      new THREE.MeshPhysicalMaterial({ color: color })
    );
    this.left=this.mesh.position.x - this.width/2;
    this.right=this.mesh.position.x + this.width/2;
    this.bottom=this.mesh.position.y - this.height/2;
    this.top=this.mesh.position.y + this.height/2;
    this.front=this.mesh.position.z + this.length/2;
    this.back=this.mesh.position.z - this.length/2;
  }
  

  
  


  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
  }
updatePoints(){
  this.left=this.mesh.position.x - this.width/2;
  this.right=this.mesh.position.x + this.width/2;
  this.front=this.mesh.position.z + this.length/2;
  this.back=this.mesh.position.z - this.length/2;
  this.top=this.mesh.position.y + this.height/2;
  this.bottom=this.mesh.position.y - this.height/2;
}
  update(ground) {
    this.updatePoints();
    if(this.xAcceleration){
      this.velocity.x += -0.001;
    }
    this.mesh.position.add(this.velocity);
    this.applyGravity(ground);
  }
  applyGravity(ground){
    this.velocity.y -= 0.005; // Gravity constant
    // Check if cube has collided with ground
    if ((this.mesh.position.y - this.height/2 <= -1.75)&&(this.right >= ground.left && this.left <= ground.right)&&(this.front >= ground.back && this.back <= ground.front)) {  // -1.75 is ground.position.y + ground.height/2
      this.mesh.position.y = -1.75 + this.height/2;  // Place cube right on top of ground
      
      // Bounce effect - reverse y velocity with damping
      this.velocity.y = Math.abs(this.velocity.y) * 0.5; // 0.7 is bounce dampening factor
      
      // Stop bouncing when velocity gets very small
      if (Math.abs(this.velocity.y) < 0.01) {
        this.velocity.y = 0;
      }
    } 
  }
}

function boxCollision({ box1, box2 }) {
  const xCollision = box1.right >= box2.left && box1.left <= box2.right
  const yCollision =
    box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom
  const zCollision = box1.front >= box2.back && box1.back <= box2.front

  return xCollision && yCollision && zCollision
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-12, 5, 20);










const cube = new Cube(1, 1, 1, 0x00ff00);
cube.velocity.set(0,-0.01, 0);
cube.setPosition(-8, 0, 0);
scene.add(cube.mesh);




const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('https://threejs.org/examples/textures/crate.gif'); // Default texture
const normalMap = textureLoader.load('https://threejs.org/examples/textures/crate_normal.jpg'); // Default normal map
const roughnessMap = textureLoader.load('https://threejs.org/examples/textures/crate_roughness.jpg'); // Default roughness map

// Cube Geometry and Material with Maps

const material = new THREE.MeshStandardMaterial({
  map: texture,
  normalMap: normalMap,
  roughnessMap: roughnessMap,
  roughness: 1.0,
});
let loader=new THREE.TextureLoader();
let color=loader.load('/image.jpg');













const ground = new Cube(20, 0.5, 10, "00FFFFFF");
ground.setPosition(0, -2, 0);
ground.mesh.material.map=color;
scene.add(ground.mesh);


const enemies = [];

camera.position.z = 5;
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;






window.addEventListener("keydown", (event) => {
  const moveSpeed = 0.05;
  if(event.code === "KeyW"){
    cube.velocity.x = moveSpeed;
  }
  else if(event.code === "KeyS"){
    cube.velocity.x = -moveSpeed;
  }
  if(event.code === "KeyA"){
    cube.velocity.z = -moveSpeed;
  }
  else if(event.code === "KeyD"){
    cube.velocity.z = moveSpeed;
  }

  if(event.code === "Space" && cube.mesh.position.y < 0){
    cube.velocity.y = 0.15;
  }
});

window.addEventListener("keyup", (event) => {
  if(event.code === "KeyW" || event.code === "KeyS"){
    cube.velocity.x = 0;
  }
  if(event.code === "KeyA" || event.code === "KeyD"){
    cube.velocity.z = 0;
  }
   if(event.code === "Space"){
    cube.velocity.y = 0;
  }
});


let frames = 0;
let spawnRate = 200;
function animate() {
  frames++;
  const animateID = requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
  

  if(frames % spawnRate === 0){
    if (spawnRate >20) {
      spawnRate -= 5;
    }




    const enemy = new Cube(1, 1, Math.random()*2 + 0.5, 0xff0000);
    enemy.mesh.material = material;
    enemy.velocity.set(-0.005,-0.01, 0);
    enemy.setPosition(10, 0, (Math.random()-0.5)*8);
    scene.add(enemy.mesh);
    enemy.mesh.castShadow = true;
    enemy.xAcceleration = true;
    enemies.push(enemy);
    
  }


cube.update(ground);

  enemies.forEach(enemy => {
    enemy.update(ground);
    if(boxCollision({ box1: cube, box2: enemy }) || cube.mesh.position.y < -10){
      
    window.cancelAnimationFrame(animateID);
      alert("Game Over");
      location.reload();
    }
  });
  controls.update();
}
animate();


renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Enable shadows for objects
cube.mesh.castShadow = true;
ground.mesh.receiveShadow = true;

// Add directional light for shadows
const light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(45, 25, 1);
light.castShadow = true;
light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
scene.add(light);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 5);
scene.add(ambientLight);

