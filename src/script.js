import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// --- Basic Scene Setup ---
let mixer; // Animation mixer for the 3D model
let currentModel = null; // Reference to the currently loaded model
let currentModelType = 'littlestTokyo'; // 'littlestTokyo' or 'soldier'
const clock = new THREE.Clock(); // Clock for animation timing

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(5, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows for more realistic lighting
document.body.appendChild(renderer.domElement);

// Create PMREMGenerator for environment map
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

// --- Floor (Plane) ---
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true; // Plane can receive shadows
scene.add(plane);

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 50); // Light from a single point in all directions
pointLight.position.set(-5, 5, 0);
pointLight.castShadow = true;
scene.add(pointLight);

// --- Model Loading ---
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./jsm/libs/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

// Function to load a model
function loadModel(modelPath, scale = 1) {
    // Remove the current model from the scene if it exists
    if (currentModel) {
        scene.remove(currentModel);
    }
    
    console.log('Attempting to load model:', modelPath);
    loader.load(modelPath, function (gltf) {
        console.log('Model loaded successfully:', modelPath);
        const model = gltf.scene;
        
        // Scale and position the model
        model.scale.set(scale, scale, scale);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x * scale;
        model.position.y = -box.min.y * scale; // Place model on the ground
        model.position.z = -center.z * scale;
        
        scene.add(model);
        currentModel = model;

        // Set up animation mixer
        mixer = new THREE.AnimationMixer(model);
        if (gltf.animations && gltf.animations.length > 0) {
            console.log('Playing animation:', gltf.animations[0].name);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
        } else {
            console.log('No animations found in model');
        }

        // Start animation loop if not already running
        if (!renderer.animationLoop) {
            renderer.setAnimationLoop(animate);
        }
    }, function (progress) {
        // Progress callback
        if (progress.total > 0) {
            console.log('Loading progress:', Math.round((progress.loaded / progress.total) * 100) + '%');
        }
    }, function (error) {
        console.error('Error loading model:', modelPath, error);
        
        // Check if it's an HTML response error (404 page instead of GLB file)
        if (error && error.message && error.message.includes('Unexpected token')) {
            console.log('Received HTML instead of GLB file - file not found');
        }
    });
}

// Load the initial model
loadModel('./LittlestTokyo.glb', 0.01);

// --- Model Switching ---
// Add event listener for the switch button
document.getElementById('switchModel').addEventListener('click', function() {
    // Switch between models
    if (currentModelType === 'littlestTokyo') {
        // Switch to Soldier
        loadModel('./Soldier.glb', 1);
        currentModelType = 'soldier';
        this.textContent = 'Switch to LittlestTokyo';
    } else {
        // Switch to LittlestTokyo
        loadModel('./LittlestTokyo.glb', 0.01);
        currentModelType = 'littlestTokyo';
        this.textContent = 'Switch to Soldier';
    }
});

// --- GUI Setup ---
const gui = new GUI();

// Ambient Light Controls
const ambientFolder = gui.addFolder('Ambient Light');
ambientFolder.add(ambientLight, 'intensity', 0, 2, 0.1).name('Intensity');
ambientFolder.add(ambientLight, 'visible').name('Toggle On/Off');

// Directional Light Controls
const directionalFolder = gui.addFolder('Directional Light');
directionalFolder.add(directionalLight, 'intensity', 0, 2, 0.1).name('Intensity');
directionalFolder.add(directionalLight, 'visible').name('Toggle On/Off');
directionalFolder.add(directionalLight.position, 'x', -10, 10, 0.1).name('Position X');
directionalFolder.add(directionalLight.position, 'y', -10, 10, 0.1).name('Position Y');
directionalFolder.add(directionalLight.position, 'z', -10, 10, 0.1).name('Position Z');

// Point Light Controls
const pointFolder = gui.addFolder('Point Light');
pointFolder.add(pointLight, 'intensity', 0, 3, 0.1).name('Intensity');
pointFolder.add(pointLight, 'visible').name('Toggle On/Off');
pointFolder.add(pointLight.position, 'x', -10, 10, 0.1).name('Position X');
pointFolder.add(pointLight.position, 'y', -10, 10, 0.1).name('Position Y');
pointFolder.add(pointLight.position, 'z', -10, 10, 0.1).name('Position Z');

// --- Animation Loop ---
function animate() {
    const delta = clock.getDelta();
    
    // Update mixer if it exists
    if (mixer) {
        mixer.update(delta);
    } else {
        // For procedural geometry, rotate any objects with rotationSpeed
        scene.traverse(function (object) {
            if (object.isMesh && object.userData.rotationSpeed) {
                object.rotation.y += object.userData.rotationSpeed;
            }
        });
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});