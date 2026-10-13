import * as THREE from "three";
import { distanceBetween } from "./helper.js";

export function checkInteractionPinch(hand) {
    const indexTip = hand.joints["index-finger-tip"];
    const thumbTip = hand.joints["thumb-tip"];

    const distance = distanceBetween(indexTip, thumbTip);

    return distance !== null && distance <= 0.01;
};

// TODO: Obtain rotation of hands

// TODO: Obtain a few more interactions of hands using joint positions