import { useState, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from "@react-three/drei";
import "./ClickTarget.scss";

import InfoOverlay from "../components/InfoOverlay";

// new component for target hover spheres
const Target = ({ x, y, z, id, hoverState, setHoverState }) => {
  const clickTargetColor = new THREE.Color(0xa4c993);
  const targetMesh = useRef();
  const baseSize = 0.9;
  const pulseSize = 0.1;
  // animation frames (useFrame needs to be included within a component within Canvas context)
  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    // animation to have the size pulse 
    targetMesh.current.scale.x = pulseSize * Math.sin(a * 1.5) + baseSize;
    targetMesh.current.scale.y = pulseSize * Math.sin(a * 1.5) + baseSize;
    targetMesh.current.scale.z = pulseSize * Math.sin(a * 1.5) + baseSize;
  })
  return (
    <mesh
      ref={targetMesh}
      onPointerOver={(e) => setHoverState(id)}
      onPointerOut={(e) => setHoverState(0)}
      position={[x, y, z]}>
      <sphereGeometry args={[0.05, 32, 16]} />
      <meshStandardMaterial color={clickTargetColor} opacity={hoverState === id ? 0.85 : 0.6} transparent />
    </mesh>
  )
}

const ClickTarget = () => {

  const [hoverState, setHoverState] = useState(0);

  // colors
  const backgroundColor = new THREE.Color(0xF6F4E9);
  const surfaceColor = new THREE.Color(0xFFFFFF);
  const containerBodyColor = new THREE.Color(0xCE7D7B);
  const lidColor = new THREE.Color(0x95b7e6);
  const lightingColor = new THREE.Color(0xFFFFFF);

  return (
    <div className="clicktargetDemo">
      {/* DOM STUFF */}
      <div className="textOverlayTop">
        <h1 className="title">Dispatch Goods</h1>
        <p className="prompt">click and drag to explore our reusable container</p>
      </div>
      <div className="infoOverlayContainer">
        <InfoOverlay header={"Learn more"} body={"Hover over different parts of the container to learn more"} visible={hoverState === 0} />
        <InfoOverlay header={"Lid Feature"} body={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "} visible={hoverState === 1} />
        <InfoOverlay header={"Another Lid Feature"} body={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "} visible={hoverState === 2} />

      </div>

      {/* THREE JS CANVAS */}
      <div id="canvas-container">
        <Canvas
          shadows
          // match vanilla three.js tonemapping
          onCreated={({ gl }) => { gl.toneMapping = THREE.NoToneMapping }}
          camera={{
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 100,
            position: [0.2, 0.6, 1.2],
          }}
        >
          <color attach="background" args={[backgroundColor]} />
          {/* surface plane */}
          <mesh
            rotation={[Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[2.5, 1.5]} />
            <meshStandardMaterial
              color={surfaceColor}
              side={THREE.DoubleSide} />
          </mesh>
          {/* entire container group */}
          <group
            rotation={[0, -0.4, 0]}
          >
            {/* lid group */}
            <group
              position={[0, 0.45, 0]}
            >
              <mesh
                castShadow>
                <boxGeometry args={[1.05, 0.02, 0.55]} />
                <meshStandardMaterial color={lidColor} />
              </mesh>
              <Target x={0.4} y={0} z={0.25} id={1} hoverState={hoverState} setHoverState={setHoverState} />
              <Target x={-0.5} y={0} z={-0.2} id={2} hoverState={hoverState} setHoverState={setHoverState} />
            </group>
            {/* container body */}
            <mesh
              position={[0, 0.126, 0]}
              castShadow>
              <boxGeometry args={[1, 0.25, 0.5]} />
              <meshStandardMaterial color={containerBodyColor} />
            </mesh>
          </group>
          {/* lighting */}
          <ambientLight
            color={lightingColor}
            intensity={0.8}
          />
          <directionalLight
            castShadow
            color={lightingColor}
            intensity={0.3}
            position={[0.6, 1, 0.3]}
            shadowMapWidth={2000}
          />
          {/* controls */}
          <OrbitControls
            target={[0, 0.25, 0]}
            enableDamping
            enableZoom={false}
            enablePan={false} />
        </Canvas>
      </div>
    </div>
  );
}

export default ClickTarget;