import * as THREE from "three";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { XRHandModelFactory } from "three/addons/webxr/XRHandModelFactory.js";
import { checkInteractionPinch } from "./handInteraction";
import { distanceBetween } from "./helper";

const container = document.getElementById("app");
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });

// const orderedJoints = [
//     ["thumb-metacarpal", "thumb-phalanx-proximal", "thumb-phalanx-distal", "thumb-tip"],
//     ["index-finger-metacarpal", "index-finger-phalanx-proximal", "index-finger-phalanx-intermediate", "index-finger-phalanx-distal", "index-finger-tip"]
//     ["middle-finger-metacarpal", "middle-finger-phalanx-proximal", "middle-finger-phalanx-intermediate", "middle-finger-phalanx-distal", "middle-finger-tip"]
//     ["ring-finger-metacarpal", "ring-finger-phalanx-proximal", "ring-finger-phalanx-intermediate", "ring-finger-phalanx-distal", "ring-finger-tip"]
//     ["pinky-finger-metacarpal", "pinky-finger-phalanx-proximal", "pinky-finger-phalanx-intermediate", "pinky-finger-phalanx-distal", "pinky-finger-tip"]
// ];

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

const hemisphereLight = new THREE.HemisphereLight(
    0xffffff, // sky color
    0x444444, // ground color
    1.5,
);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(2, 4, 2);
scene.add(light, hemisphereLight);


// TODO: Fix lighting so that it's easier to see environment


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
// TODO: Change main HTML page to make seeing VR button easier
document.body.appendChild(vrButton);

const mainPlaneGeo = new THREE.BoxGeometry(5, 0.5, 5);
const mainPlaneMat = new THREE.MeshBasicMaterial({ color: "grey" });
const mainPlane = new THREE.Mesh(mainPlaneGeo, mainPlaneMat);
mainPlane.position.y = -0.5;
scene.add(mainPlane);

const sphereGeo = new THREE.SphereGeometry(0.10, 8, 16);
const sphereMat = new THREE.MeshBasicMaterial({ color: 'green' });
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.position.set(0, 1, -0.5);

scene.add(sphere)

const indexTipPosition = new THREE.Vector3();




function readHandTracking() {
    for (const hand of [leftHand, rightHand]) {
        const checkInt = checkInteractionPinch(hand);
        const indexTip = hand.joints["index-finger-tip"];
        const pinchDistance = distanceBetween(indexTip, sphere);
        if (checkInt) {
            if (pinchDistance <= 0.1) {

                // TODO: Currently pinch hold is inconsistent, will just need to do pinch toggle

                // Have to copy the world position of an object and place onto the desired object to move
                indexTip.getWorldPosition(indexTipPosition);
                sphere.position.copy(indexTipPosition);
                sphere.material.color.set("red");
            }
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

