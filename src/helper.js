import * as THREE from "three";

export function distanceBetween(obj1, obj2) {
    obj1.updatematrixWorld(true);
    obj2.updatematrixWorld(true);
    const vectorA = new THREE.Vector3();
    const vectorB = new THREE.Vector3();

    obj1.getWorldPosition(vectorA);
    obj2.getWorldPosition(vectorB);

    return vectorA.distanceTo(vectorB);
}