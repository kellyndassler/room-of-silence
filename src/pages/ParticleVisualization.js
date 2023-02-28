import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./ParticleVisualization.scss";

const ParticleVisualization = () => {

  const mountRef = useRef(null);

  useEffect(() => {
    let mountRefValue = null;

    // set up
    var scene = new THREE.Scene();
    // camera
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0.2, 0.4, 1);
    // renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;

    // full screen
    renderer.setSize(window.innerWidth, window.innerHeight);
    // add to dom
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
      mountRefValue = mountRef.current;
    }


    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // colors
    const backgroundColor = new THREE.Color(0xF6F4E9);
    const surfaceColor = new THREE.Color(0xFFFFFF);
    const containerBodyColor = new THREE.Color(0xCE7D7B);

    // scene
    scene.background = backgroundColor;

    // surface
    let surfaceGeom = new THREE.PlaneGeometry(2.5, 1.5);
    let surfaceMat = new THREE.MeshStandardMaterial({ color: surfaceColor, side: THREE.DoubleSide });
    let surface = new THREE.Mesh(surfaceGeom, surfaceMat);
    surface.rotation.x = Math.PI / 2;
    surface.receiveShadow = true;
    scene.add(surface);

    // container
    var geometry = new THREE.BoxGeometry(1, 0.25, 0.5);
    var material = new THREE.MeshStandardMaterial({ color: containerBodyColor });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.y = 0.126;
    cube.castShadow = true;
    camera.lookAt(cube.position);
    scene.add(cube);

    // lighting
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.8)
    scene.add(ambientLight)


    let testSize = 2000;
    const mainLight = new THREE.DirectionalLight('#FFFFFF', 0.3);
    mainLight.position.set(.6, 1, .3)
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = testSize;
    mainLight.shadow.mapSize.height = testSize;
    // mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 3;
    scene.add(mainLight);

    // animation 
    var animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    // maintain full screen on resize
    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onWindowResize, false);

    animate();

    return () => {
      if (mountRefValue) {
        mountRefValue.removeChild(renderer.domElement)
      }
    }
  }, []);

  return (
    <div className="particleVisualization">
      <div className="textOverlayTop">
        <h1 className="title">Dispatch Goods</h1>
        <p className="prompt">click and drag to explore our reusable container</p>
      </div>
      <div className="textOverlayBottom">
        <p className="prompt">scroll down for more (doesn't actually work yet) </p>
      </div>
      <div ref={mountRef} className="threejsCanvas"></div>
    </div>
  );
}

export default ParticleVisualization;