// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/bGz7mv2vD6g

var populations = [];
// Each rocket is alive till this many frames
var lifespan = 700;
// Made to display count on screen
var lifeP;
var historyP;
// Keeps track of frames
var count = 0;
// Where rockets are trying to go
var target;
// Max force applied to rocket
var maxforce = 0.75;

var populationCount = 1000;

var generation = 0;

var obstaclesCount = 5;
var obstacles = [];

var paused = false;
function setup() {
  createCanvas(750, 750);
  populations[0] = new Population(populationCount);
  lifeP = createP();
  lifeP.elt.setAttribute('style', 'white-space: pre; font-family: monospace;')
  historyP = createP();
  historyP.elt.setAttribute('style', 'white-space: pre; font-family: monospace;')
  target = createVector(width / 2, 50);
  for (let i = 0; i < obstaclesCount - 1; ++i) {
    obstacles.push(new Obstacle());
  }
  if (obstaclesCount > 0) {
    obstacles.push(new Obstacle(random(0, width - 10), random(100, height - 100), 10, random(height / 2)))
  }
}

function draw() {
  if (paused) {
    textSize(100); 
    text("PAUSED", 100, 150); 
  } else {
    background(0);
    let newPops = [];
    for (let popIndex = populations.length - 1; popIndex >= 0; --popIndex) {
      let population = populations[popIndex];
      population.run();
      // Displays count to window
      let successes = population.successCount();
      let percentageSuccessful = Math.round(successes/populationCount * 100);
      let percentPipes = '';
      for (let i = 0; i < percentageSuccessful; ++i) {
        percentPipes += '|';
      }
      for (let i = percentageSuccessful; i < 100; ++i) {
        percentPipes += ' ';
      }
      lifeP.html(
        `Generation: ${generation} Time: ${count + 1 % lifespan}/${lifespan} Successes: ${successes}/${populationCount} (${percentageSuccessful}%)\r\n[${percentPipes}]`
      );
  
      count++;
  
      if (count % lifespan == 0 || population.allDone()) {
        population.evaluate();
        //population = population.nextPopulation();
        population.rockets = population.selection();
        count = 0;
        generation++;
        historyP.elt.textContent = lifeP.elt.textContent + "\r\n" + historyP.elt.textContent;
      }
  //     if (count % lifespan == lifespan * 3 / 4) {
  //       population.evaluate();
  //       let newPop = population.nextPopulation();
  //       newPops.push(newPop);
  //       // Population = new Population();
  //       generation++;
  //     }
  
  //     if (population.allDone()) {
  //       console.log("all done");
  //       populations.splice(popIndex, 1);
  //     }
    }
  
    for (let i = 0; i < newPops.length; i++) {
      populations.push(newPops[i]);
    }
  
    for (let i = 0; i < obstacles.length; ++i) {
      obstacles[i].show();
    }
  
    // Renders target
    fill(250);
    ellipse(target.x, target.y, 16, 16);
    }
}


function keyPressed() {
  if (key === 'p') {
    paused = !paused;
  }
}

function mouseDragged() {
  console.log(mouse.position);
}
