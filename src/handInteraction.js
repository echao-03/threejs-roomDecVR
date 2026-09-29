import * as THREE from "three";
import distanceBetween from "./helper.js";

export function checkInteractionPinch(hand) {
    let indexTip = hand.joints["index-finger-tip"];
    let thumbTip = hand.joints["thumb-tip"];

    let distance = distanceBetween(indexTip, thumbTip);

    // TODO: Obtain distance between both finger tips. 
    // If both finger tips distance is < some number 0.001 maybe, then return True, else False
};

// TODO: Obtain rotation of hands

// TODO: Obtain a few more interactions of hands using joint positions