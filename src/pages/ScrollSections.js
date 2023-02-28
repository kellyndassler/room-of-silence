import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import "./ScrollSections.scss";

// components object placeholders
const PlaceholderGeometry = ({ sectionNum, active }) => {

  // colors
  const activeColor = new THREE.Color(0xa4c993);
  const inactiveColor = new THREE.Color(0xc2c2c2);

  // ref
  const meshRef = useRef();

  // animation frames (useFrame needs to be included within a component within Canvas context)
  let geometryPositionX = 2;
  let objectsDistance = 4;
  useFrame(({ clock, camera }) => {
    // rotate animation
    const a = clock.getElapsedTime();
    meshRef.current.rotation.y = a * 0.5;
    // update camera position to match scroll
    camera.position.y = -window.scrollY / window.innerHeight * objectsDistance;
  });

  return (
    <mesh
      ref={meshRef}
      position={[geometryPositionX, -objectsDistance * sectionNum, 0]}
    >
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={active === sectionNum ? activeColor : inactiveColor} />
    </mesh>
  )
}

const ScrollListener = ({ setActiveMeshState }) => {
  let sectionHeight = window.innerHeight;
  let currentSection = 0;

  // do something when user scrolls to a new section
  window.addEventListener('scroll', () => {
    const newSection = Math.round(window.scrollY / sectionHeight);
    if (newSection !== currentSection) {
      setActiveMeshState(newSection);
      currentSection = newSection;
    }
  });
}

const Section = () => {
  return (
    <div className="section">
      <h1>This is a section</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </div>
  );
}

const ScrollSections = () => {

  const [activeMeshState, setActiveMeshState] = useState(0);

  // colors
  const backgroundColor = new THREE.Color(0xF6F4E9);
  const lightingColor = new THREE.Color(0xFFFFFF);

  return (
    <div className="scrollSectionsDemo">
      <div id="canvas-container">
        <Canvas
          camera={{
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 100,
            position: [0, 0, 5],
          }}
        >
          <color attach="background" args={[backgroundColor]} />
          {/* meshes */}
          <PlaceholderGeometry
            sectionNum={0}
            active={activeMeshState}
          />
          <PlaceholderGeometry
            sectionNum={1}
            active={activeMeshState}
          />
          <PlaceholderGeometry
            sectionNum={2}
            active={activeMeshState}
          />
          {/* lighting */}
          <ambientLight
            color={lightingColor}
            intensity={0.8}
          />
          <directionalLight
            castShadow
            color={lightingColor}
            intensity={0.5}
            position={[0.6, 1, 0.3]}
            shadowMapWidth={2000}
          />
          {/* scroll listener */}
          <ScrollListener setActiveMeshState={setActiveMeshState} />
        </Canvas>
      </div>

      {/* text sections */}
      <Section />
      <Section />
      <Section />
    </div>
  )
}

export default ScrollSections;