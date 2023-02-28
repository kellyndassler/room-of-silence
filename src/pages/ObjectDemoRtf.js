import * as THREE from "three";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from "@react-three/drei";
import "./ObjectDemoRtf.scss";

const ObjectDemoRtf = () => {

  // colors
  const backgroundColor = new THREE.Color(0xF6F4E9);
  const surfaceColor = new THREE.Color(0xFFFFFF);
  const containerBodyColor = new THREE.Color(0xCE7D7B);
  const lightingColor = new THREE.Color(0xFFFFFF);

  return (
    <div className="objectDemoRft">
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
          <mesh
            position={[0, 0.126, 0]}
            castShadow>
            <boxGeometry args={[1, 0.25, 0.5]} />
            <meshStandardMaterial color={containerBodyColor} />
          </mesh>
          <ambientLight
            // color={lightingColor}
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
    </div>
  );
}

export default ObjectDemoRtf;