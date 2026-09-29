import * as THREE from "three";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { XRHandModelFactory } from "three/addons/webxr/XRHandModelFactory.js";

const container = document.getElementById("app");
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });

const orderedJoints = [
    ["thumb-metacarpal", "thumb-phalanx-proximal", "thumb-phalanx-distal", "thumb-tip"],
    ["index-finger-metacarpal", "index-finger-phalanx-proximal", "index-finger-phalanx-intermediate", "index-finger-phalanx-distal", "index-finger-tip"]
    ["middle-finger-metacarpal", "middle-finger-phalanx-proximal", "middle-finger-phalanx-intermediate", "middle-finger-phalanx-distal", "middle-finger-tip"]
    ["ring-finger-metacarpal", "ring-finger-phalanx-proximal", "ring-finger-phalanx-intermediate", "ring-finger-phalanx-distal", "ring-finger-tip"]
    ["pinky-finger-metacarpal", "pinky-finger-phalanx-proximal", "pinky-finger-phalanx-intermediate", "pinky-finger-phalanx-distal", "pinky-finger-tip"]
];

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);

const VRCamera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, -1).normalize();
scene.add(light);

VRCamera.position.set(0, 1.6, 3);

const handModelFactory = new XRHandModelFactory();

const leftHand = renderer.xr.getHand(0);
const rightHand = renderer.xr.getHand(1);



leftHand.add(handModelFactory.createHandModel(leftHand, "mesh"));
rightHand.add(handModelFactory.createHandModel(rightHand, "mesh"));

scene.add(leftHand, rightHand);

const vrButton = VRButton.createButton(renderer, {
    optionalFeatures: ["hand-tracking"]

});
document.body.appendChild(vrButton);



function readHandTracking() {
    for (const hand of [leftHand, rightHand]) {
        const indexTip = hand.joints["index-finger-tip"];

        if (indexTip) {
            console.log(indexTip.position);
        }
    }
}

renderer.setAnimationLoop(() => {
    readHandTracking();
    renderer.render(scene, VRCamera);
});

window.addEventListener("resize", () => {
    VRCamera.aspect = container.clientWidth / container.clientHeight;
    VRCamera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

