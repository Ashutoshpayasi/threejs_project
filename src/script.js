import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

var avatarUrl = 'https://models.readyplayer.me/64cc7f508aad831fded2b972.glb';
let currentAvatar = null; // Initialize with null
//https://models.readyplayer.me/64cd26af3f92df4413de523a.glb
//https://models.readyplayer.me/64cd2b5783cb753a24f1662a.glb
//https://models.readyplayer.me/64cd2b5783cb753a24f1662a.glb


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);

// Create a simple room
const roomGeometry = new THREE.BoxGeometry(10, 10, 10);
const roomMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC });
const room = new THREE.Mesh(roomGeometry, roomMaterial);
scene.add(room);

// Position the camera within the room
camera.position.set(0, 5, 15);
camera.lookAt(0, 5, 0);
orbit.update();


// Load and position the avatar
const avatarLoader = new GLTFLoader();
function Loadavatar(avatarUrl)
    {
        if (currentAvatar !== null) {
            scene.remove(currentAvatar); // Remove the previous avatar from the scene
        }

        avatarLoader.load(avatarUrl, (gltf) => {
        const avatar = gltf.scene;
        avatar.scale.set(2,2,2)
        scene.add(avatar);
        avatar.position.set(0, 5, 0);
        currentAvatar = avatar; // Update the currentAvatar reference
    }, undefined, (error) => {
        console.error('Error loading avatar:', error);
    });
}

Loadavatar(avatarUrl);

// Add some lighting to the scene
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Handle window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

// Render loop
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();


function displayIframe() {
    const frame = document.getElementById('frame');
    frame.src = `https://nocapmeta-pycfu7.readyplayer.me/avatar?frameApi`;
    frame.hidden = false;
}
const customizeButton = document.getElementById('customizeButton');
customizeButton.addEventListener('click', displayIframe)

window.addEventListener('message', subscribe);

function subscribe(event) {
    const json = parse(event);

    if (json?.source !== 'readyplayerme') {
        return;
    }

    // Susbribe to all events sent from Ready Player Me once frame is ready
    if (json.eventName === 'v1.frame.ready') {
        frame.contentWindow.postMessage(
            JSON.stringify({
                target: 'readyplayerme',
                type: 'subscribe',
                eventName: 'v1.**'
            }),
            '*'
        );
    }

    // Get avatar GLB URL
    if (json.eventName === 'v1.avatar.exported') {
        const avatarUrlElement = document.getElementById('avatarUrl');
        avatarUrlElement.innerHTML = `Avatar URL: ${json.data.url}`;
        const frame = document.getElementById('frame');
        frame.hidden = true;
        avatarUrl = json.data.url;
        console.log(`actual url: ${json.data.url}`);
        console.log(`AVATAR URL: ${avatarUrl}`);
        Loadavatar(avatarUrl);
        // reload the three js env with the new avatar
    }
}

function parse(event) {
    try {
        return JSON.parse(event.data);
    } catch (error) {
        return null;
    }
}


//adding functionalities

// Add event listener for background color change button
const changeBackgroundColorButton = document.getElementById('changeBackgroundColorButton');
const backgroundColorPicker = document.getElementById('backgroundColorPicker');

changeBackgroundColorButton.addEventListener('click', () => {
    const newBackgroundColor = backgroundColorPicker.value;
    document.body.style.backgroundColor = newBackgroundColor;
});

// Add event listener for color change button
const changeColorButton = document.getElementById('changeColorButton');
const colorPicker = document.getElementById('colorPicker');

changeColorButton.addEventListener('click', () => {
    const newColor = new THREE.Color(colorPicker.value);
    
    // Smoothly transition room color
    const colorChangeDuration = 1000; // Animation duration in milliseconds
    const originalColor = room.material.color.clone();
    let startTime = null;

    function animateColor(timestamp) {
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / colorChangeDuration, 1);

        const interpolatedColor = originalColor.clone().lerp(newColor, progress);
        room.material.color.copy(interpolatedColor);

        if (progress < 1) {
            requestAnimationFrame(animateColor);
        }
    }

    requestAnimationFrame(animateColor);
});


///

// Add event listener for camera movement button
const moveCameraButton = document.getElementById('moveCameraButton');

moveCameraButton.addEventListener('click', () => {
    const targetPosition = new THREE.Vector3(10, 5, 20);  // Example target position
    
    // Smoothly transition camera position
    const cameraMoveDuration = 1000; // Animation duration in milliseconds
    const startPosition = camera.position.clone();
    let startTime = null;

    function animateCamera(timestamp) {
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / cameraMoveDuration, 1);

        const newPosition = new THREE.Vector3();
        newPosition.x = THREE.MathUtils.lerp(startPosition.x, targetPosition.x, progress);
        newPosition.y = THREE.MathUtils.lerp(startPosition.y, targetPosition.y, progress);
        newPosition.z = THREE.MathUtils.lerp(startPosition.z, targetPosition.z, progress);

        camera.position.copy(newPosition);

        if (progress < 1) {
            requestAnimationFrame(animateCamera);
        }
    }

    requestAnimationFrame(animateCamera);
});


// Add event listener for background color change button


// Get the canvas container element

