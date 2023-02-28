import { useState } from "react";
import * as THREE from "three";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from "@react-three/drei";
import "./Hover.scss";

import InfoOverlay from "../components/InfoOverlay";

const Hover = () => {


  const [hoverState, setHoverState] = useState(null);

  // colors
  const backgroundColor = new THREE.Color(0xF6F4E9);
  const surfaceColor = new THREE.Color(0xFFFFFF);
  const containerBodyColor = new THREE.Color(0xCE7D7B);
  const lidColor = new THREE.Color(0x95b7e6);
  const lightingColor = new THREE.Color(0xFFFFFF);
  const hoverColor = new THREE.Color(0xb5b5b5);


  return (
    <div className="hoverDemo">
      {/* DOM STUFF */}
      <div className="textOverlayTop">
        <h1 className="title">Dispatch Goods</h1>
        <p className="prompt">click and drag to explore our reusable container</p>
      </div>
      <div className="infoOverlayContainer">
        <InfoOverlay header={"Learn more"} body={"Hover over different parts of the container to learn more"} visible={hoverState === null} />
        <InfoOverlay header={"The Lid"} body={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "} visible={hoverState === "lid"} />
        <InfoOverlay header={"The Container Body"} body={"dunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolor"} visible={hoverState === "container"} />

      </div>

      {/* THREE JS CANVAS */}
      <div id="canvas-container">
        <Canvas
          shadows
          // match vanilla three.js tonemapping
          onCreated={({ gl }) => { gl.toneMapping = THREE.NoToneMapping }}
          // linear
          camera={{
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 100,
            position: [0.2, 0.6, 1.2],
          }}
        >
          <color attach="background" args={[backgroundColor]} />
          <mesh
            rotation={[Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[2.5, 1.5]} />
            <meshStandardMaterial
              color={surfaceColor}
              side={THREE.DoubleSide} />
          </mesh>
          <group
            rotation={[0, -0.4, 0]}
          >
            <mesh
              onPointerOver={(e) => setHoverState("lid")}
              onPointerOut={(e) => setHoverState(null)}
              position={[0, 0.45, 0]}
              castShadow>
              <boxGeometry args={[1.05, 0.02, 0.55]} />
              <meshStandardMaterial color={hoverState === "lid" ? hoverColor : lidColor} />
            </mesh>
            <mesh
              onPointerOver={(e) => setHoverState("container")}
              onPointerOut={(e) => setHoverState(null)}
              position={[0, 0.126, 0]}
              castShadow>
              <boxGeometry args={[1, 0.25, 0.5]} />
              <meshStandardMaterial color={hoverState === "container" ? hoverColor : containerBodyColor} />
            </mesh>
          </group>
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

export default Hover;