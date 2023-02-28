
import {  useState, useEffect, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import "./ScrollAnimation.scss";

import Scene from '../components/Scene'

const animations = [
  {
    section: "heading",
    anim: "scaling",
    stepAnim: true,
    hover: false
  },
  {
    section: "sustainable",
    anim: null,
    stepAnim: false,
    hover: false
  },
  {
    section: "stacking",
    anim: "drop",
    stepAnim: false,
    hover: false
  },
  {
    section: "features",
    anim: null,
    stepAnim: false,
    hover: true
  },
  {
    section: "label-qr-code",
    anim: null,
    stepAnim: false,
    hover: false
  },
  {
    section: "closing",
    anim: null,
    stepAnim: false,
    hover: false
  }
]

const ScrollListener = (props) => {
  const { setCurrentSection,
          currentSection,
          sectionsTops,
          setScrollSectionPerc,
          canvasRef} = props;
  const sectionHeight = window.innerHeight;

  useEffect(() => {
    window.addEventListener('scroll', scrollSection);

    return () => {
      window.removeEventListener('scroll', scrollSection); // prevent duplicate
    };
  });

  const scrollSection = () => {
      // determine section
      let newSection = -1;
      if (window.scrollY > sectionsTops[currentSection].top) {
        newSection = currentSection + 1;
      } else if (currentSection > 0 && (window.scrollY < sectionsTops[ currentSection-1].top )) {
        newSection = currentSection - 1;
      }

      if (newSection === sectionsTops.length) {
        // last section have model scroll up with section
        const offset = (sectionsTops[sectionsTops.length - 1].top + (sectionsTops[sectionsTops.length - 1].height / 4))
        if (window.scrollY > offset) {
          canvasRef.current.style.top = (offset - window.scrollY) + 'px';
        }
      } else {
        if (newSection !== -1) {
          setCurrentSection(newSection);
          setScrollSectionPerc(1);
        } else {
          /* currently on first animation is step animation */
          const percent = (currentSection === 0) ? window.scrollY/sectionsTops[currentSection].top : 0;
          setScrollSectionPerc(percent);
        }
      }
  }
}

const ScrollAnimation = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [scrollSectionPerc, setScrollSectionPerc] = useState(0);
  const [sectionsTops, setSectionsTops] = useState([]);

  const lightingColor = new THREE.Color(0xFFFFFF);
  const sectionsRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const sections = sectionsRef.current.children;
    const thresholds = [];
    for (let i=0; i<sections.length; i++) {
      thresholds.push({
        top: window.scrollY + sections[i].getBoundingClientRect().top - sections[0].getBoundingClientRect().height/2,
        height: sections[i].getBoundingClientRect().height
      })
    }
    setSectionsTops(thresholds);
  }, []);

  return (
    <div className="scrollAnimationDemo">
      
      <div id="canvas-container" ref={canvasRef}>
        <Canvas
          shadows
          camera={{
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 1000,
            position: [5, 2, 6]
          }}
        >
          <Suspense fallback={null}>
            <Scene
                currentAnim={animations[currentSection].anim}
                stepAnim={ animations[currentSection].stepAnim}
                scrollSectionPerc={scrollSectionPerc}
                handlePointerOver={e => (e.stopPropagation(), setCurrentSelection(animations[currentSection].hover ? e.object.name : null))}
                handlePointerOut={e => (e.stopPropagation(), setCurrentSelection(null))}
                //handleClick={e => (e.stopPropagation(), console.log(e.object))}
             />
          </Suspense>

          <directionalLight
            castShadow
            color={lightingColor}
            intensity={1}
            position={[10, 10, 20]}
          />

          <ScrollListener
            canvasRef={canvasRef}
            sectionsTops = {sectionsTops}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            setScrollSectionPerc = {setScrollSectionPerc}
          />

        </Canvas>
      </div>

      {/* text sections */}
      <div className="heading">
        <div className="text">
          <h1 className="bc">Dispatch Goods</h1>
          <h2 className="display">Creating Affordable & Reusable Containers for Restaurants</h2>
          <p>Dispath Goods already has a large range of reusable metal containers that they provide to partner restaurants
            for a small fee for takeaway use. After use, DG collects the dirty containers from the restaurants or directly
            from the customers' homes to clean and then give it back to the restaurants. Although the return rate is very high,
            the containers are very expensive and not suitable for all restaurants.
          </p>
          <p>Dispath Goods would therefore like to offer a very cheap reusable container, which can replace the single-use "black food boxes". The new container should only be slightly more expensive for the restaurants than their disposables but should look high-quality to be recognized as a reusable product, but also not too premium so that customers don't keep it at home, as there is no deposit on the containers.</p>

        </div>
      </div>

      <div className="sections" ref={sectionsRef}>
        <div className="section">
          <div className="text">
            <h2>Sustainable Container</h2>
            <p>Demo: Animation time based on scroll position ( Zoom )</p>
            <p>Lorem ipsum dolor sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
              non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>

        <div className="section">
          <div className="text">
            <h2>Easy Stacking without Getting Stucked</h2>
            <p> Demo: Animation trigger on section enter ( Stacking )</p>
            <p>Lorem ipsum dolor sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
              non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>

        <div className="section">
          <div className="text">
            <h2>Features for better food experience</h2>
            <p>Demo: Hover hotspots display callout ( hover cube )</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            </p>

            {(animations[currentSection].section === "features") && ((currentSelection === "Cube01") || (currentSelection === "Cube02")) &&
              <div className={"selected-text"}>
                <h3>Expanded content</h3>
                <p>Lorem ipsseum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            }
          </div>
        </div>

        <div className="section">
          <div className="text">
            <h2>Mold-In Label with Individual Tracking with QR Cpde</h2>
            <p>Demo: None</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
            </p>
          </div>
        </div>
      </div>
      <div className="closing">
        <div className="decription">
          <h3 >Making It Real for Sustainable World</h3>
          <p>What happened after project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <a href="Visit Dispatch Goods website " title=""></a>
        </div>
        <div className="feature">
          <img src="/assets/images/stacking-clip.png" className="img-closer" alt="Man at a counter preparing food with stacks of food containers" />
        </div>
      </div>
    </div>
  )
}

export default ScrollAnimation;
