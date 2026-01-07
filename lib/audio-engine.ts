"use client";

import { useRef, useState } from "react";

class NoiseNode {
    context: AudioContext;
    node: AudioBufferSourceNode | null = null;
    gainNode: GainNode;
    type: 'white' | 'pink' | 'brown';

    constructor(context: AudioContext, type: 'white' | 'pink' | 'brown') {
        this.context = context;
        this.type = type;
        this.gainNode = context.createGain();
        this.gainNode.connect(context.destination);
        this.gainNode.gain.value = 0;
    }

    createBuffer() {
        const bufferSize = 2 * this.context.sampleRate;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            if (this.type === 'white') {
                output[i] = Math.random() * 2 - 1;
            } else if (this.type === 'pink') {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            } else { // brown
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
                // Simple approximation for brown/pink, refining:
            }
        }

        // Better algorithms:
        if (this.type === 'pink') {
            let b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11;
                b6 = white * 0.115926;
            }
        } else if (this.type === 'brown') {
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            }
        }

        return buffer;
    }

    start() {
        if (this.node) return;
        this.node = this.context.createBufferSource();
        this.node.buffer = this.createBuffer();
        this.node.loop = true;
        this.node.connect(this.gainNode);
        this.node.start();
    }

    stop() {
        if (this.node) {
            this.node.stop();
            this.node.disconnect();
            this.node = null;
        }
    }

    setVolume(value: number) {
        // value 0 to 1
        this.gainNode.gain.setTargetAtTime(value, this.context.currentTime, 0.1);
        if (value > 0 && !this.node) {
            this.start();
        } else if (value === 0 && this.node) {
            // Optional: stop if silent for efficiency, or keep running
            // this.stop(); 
        }
    }
}

// Variables for brown noise closure
let lastOut = 0;

export function useAudioEngine() {
    const contextRef = useRef<AudioContext | null>(null);
    const nodesRef = useRef<Record<string, NoiseNode>>({});
    const [volumes, setVolumes] = useState({ white: 0, pink: 0, brown: 0 });
    const initialized = useRef(false);

    const init = () => {
        if (initialized.current) return;
        const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
        const ctx = new Ctx();
        contextRef.current = ctx;

        nodesRef.current = {
            white: new NoiseNode(ctx, 'white'),
            pink: new NoiseNode(ctx, 'pink'),
            brown: new NoiseNode(ctx, 'brown'),
        };
        initialized.current = true;
    };

    const setVolume = (type: 'white' | 'pink' | 'brown', val: number) => {
        if (!initialized.current) init();
        if (contextRef.current?.state === 'suspended') {
            contextRef.current.resume();
        }

        nodesRef.current[type].setVolume(val);
        setVolumes(prev => ({ ...prev, [type]: val }));
    };

    return { volumes, setVolume };
}
