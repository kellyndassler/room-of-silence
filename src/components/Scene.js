import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function Scene(props) {
  const {currentAnim, stepAnim, scrollSectionPerc} = props;
  const { scene, animations } = useGLTF("/assets/models/scene.glb");

  const mixer = new THREE.AnimationMixer(scene);
  let clip = null;

  useEffect(() => {
    clip = THREE.AnimationClip.findByName(animations, (currentAnim === null) ? "default" : currentAnim);
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    action.play();

    return () => {
      if (currentAnim !== null) {
        mixer.setTime(clip.duration);
      }
    }
})

  useFrame((state, delta) => {
    if (clip && stepAnim) {
      mixer.setTime(scrollSectionPerc * clip.duration)
    } else {
      mixer.update(delta);
    }
  })

  return (
      <primitive
        object={scene}
        onClick={props.handleClick}
        onPointerOver={props.handlePointerOver}
        onPointerOut={props.handlePointerOut}
        position={[-4, -1.5, 1]}
        rotation={[-.1, .1, 0]}
      />
  );
}

useGLTF.preload("/assets/models/scene.glb");
