import { useEffect, useRef } from "react";
import Sketch from "react-p5";
import "./ParticleVisualization.scss";

const ParticleVisualization = (props) => {
  const mountRef = useRef(null);

  let particles, sliders, m, n, v, N;
  let equity, surveil, uniColor;

  let climate = 5;

  //throttles color range so it stays between red and purple
  let maxColor = 260;

  //variable associated with stroke
  let strokeVar = 1;

  // chladni frequency params
  let a = 1,
    b = 1;

  // vibration strength params
  let A = 0.02;
  let minWalk = 0.002;

  const settings = {
    nParticles: 10000,
    canvasSize: [1280, 720],
    //set Color Mode - HSB Hue, Saturation, Brightness, Alpha
  };

  const pi = 3.1415926535;

  // chladni 2D closed-form solution - returns between -1 and 1
  const chladni = (x, y, a, b, m, n, p5) =>
    a * p5.sin(pi * n * x) * p5.sin(pi * m * y) +
    b * p5.sin(pi * m * x) * p5.sin(pi * n * y);

  useEffect(() => {});

  /* Initialization */

  const setupParticles = (p5) => {
    // particle array
    particles = [];
    for (let i = 0; i < settings.nParticles; i++) {
      particles[i] = new Particle(p5);
    }
  };

  class Particle {
    constructor(p5) {
      this.x = p5.random(0, 1);
      this.y = p5.random(0, 1);
      console.log(this.y);
      this.prevX = this.x;
      this.prevY = this.y;
      let stochasticAmplitude;

      //create age degradation
      this.age = p5.random(1000, 5000);

      let currentHue = p5.map(climate, 1, 10, 0, maxColor);

      this.h = p5.random(p5.abs(currentHue - 5), p5.abs(currentHue + 5));
      this.colorDif = currentHue - this.h;

      this.s = p5.random(75, 100);
      this.b = p5.random(75, 100);

      //assign randomized color to variable
      this.color = [this.h, this.s, this.b, 100];
      this.stroke = p5.map(this.age, 5000, 1000, 0, 1);

      this.updateOffsets(p5);
    }

    move(p5) {
      // what is our chladni value i.e. how much are we vibrating? (between -1 and 1, zeroes are nodes)
      let mMap = p5.map(p5.abs((p5.width / 4) * this.x), 0, p5.width / 2, 1, m);
      let nMap = p5.map(p5.abs((p5.width / 4) * this.y), 0, p5.width / 2, 1, n);
      let eq = chladni(this.x, this.y, a, b, mMap, nMap, p5);

      // set the amplitude of the move -> proportional to the vibration
      this.stochasticAmplitude = v * p5.abs(eq);

      if (this.stochasticAmplitude <= minWalk)
        this.stochasticAmplitude = minWalk;
      this.prevX = this.x;
      this.prevY = this.y;

      // perform one random walk
      this.x += p5.random(-this.stochasticAmplitude, this.stochasticAmplitude);
      this.y += p5.random(-this.stochasticAmplitude, this.stochasticAmplitude);

      if (this.age > -10) {
        this.age -= 1 * this.stroke * equity;
      }

      this.updateOffsets(p5);
    }

    updateOffsets(p5) {
      // handle edges
      if (this.x <= 0) this.x = 0;
      if (this.x >= 1) this.x = 1;
      if (this.y <= 0) this.y = 0;
      if (this.y >= 1) this.y = 1;

      // convert to screen space
      this.xOff = (p5.width / 2) * this.x;
      this.yOff = (p5.height / 2) * this.y;
      this.xPrevOff = (p5.width / 2) * this.prevX;
      this.yPrevOff = (p5.height / 2) * this.prevY;
    }

    show(p5) {
      p5.colorMode(p5.HSB, 360, 100, 100, 100);
      // print(uniColor + ", " + this.h)

      let colorChange = this.colorDif * p5.map(surveil, 1, 10, 10, 1);
      // print(colorChange);

      //update Hue
      if (this.h > uniColor) {
        this.h = p5.abs(this.h - p5.abs(uniColor - this.h) + colorChange);
        if (this.h > maxColor) {
          this.h = maxColor;
        } else if (this.h < 0) {
          this.h = 0;
        }
      } else if (this.h < uniColor) {
      }
      {
        this.h = p5.abs(this.h + p5.abs(uniColor - this.h) + colorChange);
        if (this.h > maxColor) {
          this.h = maxColor;
        } else if (this.h < 0) {
          this.h = 0;
        }
      }

      this.s = p5.map(this.age, 0, 500, 0, 100);

      //update color
      this.color = [this.h, this.s, this.b, 100];

      //set up stroke calculation
      let particleStroke = null;

      let strokeRatio = this.stroke * equity;

      //d efine a ratio of potentiality for stroke widths (equity slider)
      // this is kind of a mess because there are different ratios at different breakpoints
      // I don't advise messing with it
      if (equity <= 2) {
        if (strokeRatio <= 1.5) {
          particleStroke = 2;
        } else {
          particleStroke = 4;
        }
      } else if (equity <= 4) {
        if (strokeRatio <= 1.5) {
          particleStroke = 2;
        } else if (strokeRatio <= 2.75) {
          particleStroke = 4;
        } else if (strokeRatio <= 3) {
          particleStroke = 10;
        } else if (strokeRatio <= 3.5) {
          particleStroke = 1;
        } else {
          particleStroke = 2;
        }
      } else if (equity <= 5) {
        if (strokeRatio <= 1.75) {
          particleStroke = 2;
        } else if (strokeRatio <= 2.75) {
          particleStroke = 4;
        } else if (strokeRatio <= 3.5) {
          particleStroke = 1;
        } else if (strokeRatio <= 4) {
          particleStroke = 6;
        } else if (strokeRatio <= 4.05) {
          particleStroke = 10;
        } else if (strokeRatio <= 5) {
          particleStroke = 1;
        }
      } else if (equity <= 7) {
        if (strokeRatio <= 1.75) {
          particleStroke = 2;
        } else if (strokeRatio <= 2.75) {
          particleStroke = 4;
        } else if (strokeRatio <= 3.5) {
          particleStroke = 1;
        } else if (strokeRatio <= 4) {
          particleStroke = 6;
        } else if (strokeRatio <= 4.1) {
          particleStroke = 10;
        } else if (strokeRatio <= 5) {
          particleStroke = 2;
        } else if (strokeRatio <= 5.01) {
          particleStroke = 30;
        } else if (strokeRatio <= 6.2) {
          particleStroke = 2;
        } else if (strokeRatio <= 6.3) {
          particleStroke = 10;
        } else if (strokeRatio <= 7.1) {
          particleStroke = 1;
        }
      } else if (equity <= 9) {
        if (strokeRatio <= 0.01) {
          particleStroke = 50;
        } else if (strokeRatio <= 0.1) {
          particleStroke = 10;
        } else if (strokeRatio <= 1) {
          particleStroke = 6;
        } else if (strokeRatio <= 3) {
          particleStroke = 2;
        } else {
          particleStroke = 1;
        }
      } else if (equity <= 10) {
        if (strokeRatio <= 0.004) {
          particleStroke = 50;
        } else if (strokeRatio <= 0.09) {
          particleStroke = 10;
        } else {
          particleStroke = 1;
        }
      }
      // end of stroke width bs

      //set drawn stroke
      p5.strokeWeight(particleStroke);
      p5.stroke(...this.color);

      if (surveil > 8.5) {
        //create quadrant symmetry — as lines

        p5.line(this.xOff, this.yOff, this.xPrevOff, this.yPrevOff);
        p5.line(
          p5.width - this.xOff,
          this.yOff,
          p5.width - this.xPrevOff,
          this.yPrevOff
        );
        p5.line(
          this.xOff,
          p5.height - this.yOff,
          this.xPrevOff,
          p5.height - this.yPrevOff
        );
        p5.line(
          p5.width - this.xOff,
          p5.height - this.yOff,
          p5.width - this.xPrevOff,
          p5.height - this.yPrevOff
        );
      } else {
        //create quadrant symmetry — as points
        p5.point(this.xOff, this.yOff);
        p5.point(p5.width - this.xOff, this.yOff);
        p5.point(this.xOff, p5.height - this.yOff);
        p5.point(p5.width - this.xOff, p5.height - this.yOff);
      }
    }
  }

  const moveParticles = (p5) => {
    let movingParticles = particles.slice(0, N);

    // particle movement
    for (let i = movingParticles.length - 1; i >= 0; i--) {
      particles[i].move(p5);
      particles[i].show(p5);
      if (particles[i].age <= -5) {
        particles.splice(i, 1);

        let p = new Particle(p5);
        particles.push(p);
      }
    }
  };

  //get slider value and change corresponding parameters
  const updateParams = (p5) => {
    equity = sliders.equity.value();
    climate = sliders.climate.value();
    surveil = sliders.surveil.value();
    m = p5.map(equity, 1, 10, 1, 40);
    n = p5.map(surveil, 1, 10, 1, 40);
    v = p5.map(climate, 1, 10, 0.05, 0.001);
    N = sliders.num.value();
    uniColor = p5.map(climate, 1, 10, 0, 260);
  };

  //redraw screen background
  const wipeScreen = (p5) => {
    //alpha value preserves some particle history, creates slower rate of change when variables adjusted
    p5.background(10, 10);
    p5.stroke(255);
  };
  // run at DOM load
  const setup = (p5, canvasParentRef) => {
    // p5.createCanvas(500, 500).parent(canvasParentRef);
    p5.createCanvas(...settings.canvasSize).parent(canvasParentRef);

    p5.frameRate(30);

    // get slider parameters
    sliders = {
      num: p5.select("#numSlider"), // number
      equity: p5.select("#equitySlider"),
      climate: p5.select("#climateSlider"),
      surveil: p5.select("#surveilSlider"),
    };
    setupParticles(p5);
  };
  // run each frame
  const draw = (p5) => {
    wipeScreen(p5);
    // checkAddress();
    updateParams(p5);
    moveParticles(p5);
  };

  return (
    <div className="particleVisualization">
      {/* <div ref={mountRef} className="threejsCanvas"></div> */}
      <h1>Settings</h1>
      <form id="settings">
        <label htmlFor="equitySlider">Distribution - Accumulation:</label>
        <input
          name="equitySlider"
          type="range"
          id="equitySlider"
          min="1"
          max="10"
          step="0.1"
          defaultValue="5"
        />

        <label htmlFor="climateSlider">Reactive - Proactive:</label>
        <input
          name="climateSlider"
          type="range"
          id="climateSlider"
          min="1"
          max="10"
          step=".1"
          defaultValue="5"
        />

        <label htmlFor="surveilSlider">Expansion - Constriction:</label>
        <input
          name="surveilSlider"
          type="range"
          id="surveilSlider"
          min="1"
          max="10"
          step=".1"
          defaultValue="5"
        />

        <label htmlFor="numSlider">number of particles:</label>
        <input
          name="numSlider"
          type="range"
          id="numSlider"
          min="1000"
          max="20000"
          step="1000"
          defaultValue="10000"
        />
      </form>
      <div ref={mountRef} className="sketch-container"></div>
      <Sketch setup={setup} draw={draw} />;
    </div>
  );
};

export default ParticleVisualization;
