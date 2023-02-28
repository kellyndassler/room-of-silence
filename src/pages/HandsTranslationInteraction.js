import * as THREE from "three";
import { useState } from "react";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from "@react-three/drei";
import MPHands from "../components/MPHands";
import "./HandsTranslationInteraction.scss";

const MoveableObject = ({meshGeometry, handLandmarks}) => {
    
    let meshPosition = [0, 0, 0];
    const containerBodyColor = new THREE.Color(0xCE7D7B);

    // *** hand array refers to index finger as 8
    if(handLandmarks.length !== 0) {
        meshPosition = [-handLandmarks[0][8].x, -handLandmarks[0][8].y, handLandmarks[0][8].z]
    }
    
    return (
        <mesh
            position={meshPosition}
            castShadow>
            <boxGeometry args={meshGeometry} />
            <meshStandardMaterial color={containerBodyColor} />
          </mesh>
    );
 }

const HandsTranslationInteraction = () => {

  // colors
  const backgroundColor = new THREE.Color(0xF6F4E9);
  const surfaceColor = new THREE.Color(0xFFFFFF);
  const lightingColor = new THREE.Color(0xFFFFFF);

  const meshGeometry = [1, 0.25, 0.5];

  //hand positions
  const [handLandmarks, setHandLandmarks] = useState([]);

  return (
    <>
    <MPHands 
        handLandmarks={handLandmarks}
        setHandLandmarks={setHandLandmarks}/>
      <div className="textOverlayTop">
        <h1 className="title">Dispatch Goods</h1>
        <p className="prompt">click and drag to explore our reusable container</p>
      </div>
      <div className="textOverlayBottom">
        <p className="prompt">scroll down for more (doesn't actually work yet) </p>
      </div>
      <div id="canvas-container">
        <Canvas
          shadows
          gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
          // linear
          camera={{
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 100,
            position: [0.2, 0.4, 1]
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
          <MoveableObject
            boxGeometry={meshGeometry}
            handLandmarks={handLandmarks}
          />
          <ambientLight
            intensity={0.8}
          />
          <directionalLight
            castShadow
            color={lightingColor}
            intensity={0.3}
            position={[0.6, 1, 0.3]}
            shadowMapWidth={2000}
          />
          <OrbitControls enableDamping/>
        </Canvas>
      </div>
    </>
  );
}

export default HandsTranslationInteraction;