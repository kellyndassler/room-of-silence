let particles, sliders, m, n, v, N;
let equity, surveil, uniColor;

let climate = 5;

//throttles color range so it stays between red and purple
let maxColor = 260;

//variable associated with stroke
let strokeVar = 1;

// chladni frequency params
let a=1, b=1;

// vibration strength params
let A = 0.02;
let minWalk = 0.002;

const settings = {
  nParticles : 10000,
  canvasSize : [1280, 720],
  //set Color Mode - HSB Hue, Saturation, Brightness, Alpha
}

const pi = 3.1415926535;

// chladni 2D closed-form solution - returns between -1 and 1
const chladni = (x, y, a, b, m, n) => 
  a * sin(pi*n*x) * sin(pi*m*y) 
+ b * sin(pi*m*x) * sin(pi*n*y);


/* Initialization */

const DOMinit = () => {
  let canvas = createCanvas(...settings.canvasSize);
  canvas.parent('sketch-container');

  frameRate(30)

  // get slider parameters
  sliders = {
    num : select('#numSlider'), // number
    equity : select('#equitySlider'),
    climate : select('#climateSlider'),
    surveil : select('#surveilSlider'),
  }
}

const setupParticles = () => {
  // particle array
  particles = [];
  for (let i = 0; i < settings.nParticles; i++) {
    particles[i] = new Particle();
  }
}


/* Particle dynamics */

class Particle {

  constructor() {
    this.x = random(0,1);
    this.y = random(0,1);
    this.prevX = this.x;
    this.prevY = this.y;
    this.stochasticAmplitude;

    //create age degradation
    this.age = random(1000,5000);


    let currentHue = map(climate, 1,10,0,maxColor);


    this.h = random(abs(currentHue - 5),abs(currentHue + 5));
    this.colorDif = currentHue - this.h;

    this.s = random(75, 100);
    this.b = random(75,100);

    //assign randomized color to variable
    this.color = [this.h, this.s, this.b, 100];
    this.stroke = map(this.age, 5000,1000,0,1);
    
    this.updateOffsets();
  }

  move() {
    // what is our chladni value i.e. how much are we vibrating? (between -1 and 1, zeroes are nodes)
    let mMap = map(abs(width/4 * this.x), 0, width/2, 1, m);
    let nMap = map(abs(width/4 * this.y), 0,width/2, 1, n);
    let eq = chladni(this.x, this.y, a, b, mMap, nMap);

    // set the amplitude of the move -> proportional to the vibration
    this.stochasticAmplitude = v * abs(eq);

    if (this.stochasticAmplitude <= minWalk) this.stochasticAmplitude = minWalk;
    this.prevX = this.x;
    this.prevY = this.y;

    // perform one random walk
    this.x += random(-this.stochasticAmplitude, this.stochasticAmplitude);
    this.y += random(-this.stochasticAmplitude, this.stochasticAmplitude);



    if(this.age > -10){
      this.age -=1*this.stroke * equity;
    }
 
    this.updateOffsets();
  }

  updateOffsets() {
    // handle edges
    if (this.x <= 0) this.x = 0;
    if (this.x >= 1) this.x = 1;
    if (this.y <= 0) this.y = 0;
    if (this.y >= 1) this.y = 1;

    // convert to screen space
    this.xOff = width/2 * this.x;
    this.yOff = height/2 * this.y;
    this.xPrevOff = width/2 * this.prevX;
    this.yPrevOff = height/2 * this.prevY;
  }

  show() {
    colorMode(HSB, 360, 100, 100, 100);
    // print(uniColor + ", " + this.h)

    let colorChange = this.colorDif * map(surveil,1,10,10,1);
    print(colorChange);

    //update Hue
    if(this.h > uniColor){
      this.h = abs(this.h - abs(uniColor - this.h) + colorChange);
      if (this.h > maxColor) {
        this.h = maxColor;
      } else if (this.h < 0){
        this.h = 0;
      }
    } else if (this.h < uniColor) {}{
          this.h = abs(this.h + abs(uniColor - this.h) + colorChange);
          if (this.h > maxColor) {
            this.h = maxColor;
          } else if (this.h < 0){
            this.h = 0;
          }
    }

    this.s = map(this.age, 0,500,0,100);

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

    } else if (equity <=10) {
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
    strokeWeight(particleStroke);
    stroke(...this.color);

    if(surveil > 8.5){
      //create quadrant symmetry — as lines

      line(this.xOff, this.yOff, this.xPrevOff, this.yPrevOff)
      line(width - this.xOff, this.yOff, width - this.xPrevOff, this.yPrevOff)
      line(this.xOff, height - this.yOff, this.xPrevOff, height - this.yPrevOff)
      line(width - this.xOff, height - this.yOff, width - this.xPrevOff, height - this.yPrevOff)

    } else {
      //create quadrant symmetry — as points
      point(this.xOff, this.yOff)
      point(width - this.xOff, this.yOff)
      point(this.xOff, height - this.yOff)
      point(width - this.xOff, height - this.yOff)

    }



  }
}

const moveParticles = () => {
  let movingParticles = particles.slice(0, N);

  // particle movement
  for(let i = movingParticles.length - 1; i >= 0; i--) {
    particles[i].move();
    particles[i].show();
    if(particles[i].age <= -5){
      particles.splice(i,1);

      let p = new Particle();
      particles.push(p);
    }
  }
}

//get slider value and change corresponding parameters
const updateParams = () => {

  equity = sliders.equity.value();
  climate = sliders.climate.value();
  surveil = sliders.surveil.value();
  m = map(equity,1,10,1,40);
  n = map(surveil,1,10,1,40);
  v = map(climate, 1,10,0.05,0.001)
  N = sliders.num.value();
  uniColor = map(climate, 1,10,0,260)
}

//redraw screen background
const wipeScreen = () => {
  //alpha value preserves some particle history, creates slower rate of change when variables adjusted
  background(10,10);
  stroke(255);
}


/* Timing */

// run at DOM load
function setup() {
  DOMinit();
  setupParticles();
}
// run each frame
function draw() {
  wipeScreen();
  // checkAddress();
  updateParams();
  moveParticles();
}
