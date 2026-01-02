"use client"

import Realistic from "react-canvas-confetti/dist/presets/realistic";

export function Confetti() {
    return <Realistic autorun={{ speed: 1, duration: 1000 }} />;
}
