// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/bGz7mv2vD6g

// Constructor function
function Rocket(population, dna) {
  this.population = population;
  // Physics of rocket at current instance
  this.pos = createVector(width / 2, height - 5);
  this.vel = createVector();
  this.acc = createVector();
  // Checks rocket has reached target
  this.completed = false;
  // Checks if rocket had crashed
  this.crashed = false;
  this.dead = false;
  // Gives a rocket dna
  if (dna) {
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }
  this.fitness = 0;
  this.age = 0;
  this.min_distance = height;

  // Object can recieve force and add to acceleration
  this.applyForce = function (force) {
    this.acc.add(force);
  };

  this.done = function () {
    return this.completed || this.crashed || this.dead;
  };

  // Calulates fitness of rocket
  this.calcFitness = function () {
    if (this.age < (lifespan/3)) {
      return 1;
    }
    // Takes distance to target
    var d = dist(this.pos.x, this.pos.y, target.x, target.y);
    if (d < this.min_distance) {
      this.min_distance = d;
    }

    d = d - this.min_distance;

    // Maps range of fitness
    this.fitness = map(d, 0, width, width, 0);

    // If rocket gets to target increase fitness of rocket
    if (this.completed) {
      this.fitness += lifespan - this.age;
      this.fitness *= 100;
    } else {
      this.fitness += this.age;
    }
    // If rocket does not get to target decrease fitness
    if (this.crashed) {
      this.fitness /= 100;
      // if (this.hitBarrier()) {
      //   var distanceFromMiddle = dist(this.pos.x, this.pos.y, (rx + rw/2),  (ry + rh/2));
      //   this.fitness = Math.ceil(this.fitness / map(distanceFromMiddle, 0, rw/2, 1, 10));
      // }
    }
  };

  this.hitBarrier = function () {
    for (let i = 0; i < obstacles.length; ++i) {
      if (obstacles[i].containsPoint(this.pos.x, this.pos.y)) {
        return true;
      }
    }
    return false;
  };

  // Updates state of rocket
  this.update = function () {
    if (!this.done()) {
      this.age++;
      if (this.age >= lifespan ) {
        this.dead = true;
      }
        
      // Checks distance from rocket to target
      var d = dist(this.pos.x, this.pos.y, target.x, target.y);
      // If distance less than 10 pixels, then it has reached target
      if (d < 10) {
        this.completed = true;
      }
      // Rocket hit the barrier
      if (this.hitBarrier()) {
        this.crashed = true;
      }
      
      // Rocket has hit left or right of window
      if (this.pos.x > width || this.pos.x < 0) {
        this.crashed = true;
      }
      // Rocket has hit top or bottom of window
      if (this.pos.y > height || this.pos.y < 0) {
        this.crashed = true;
      }

      //applies the random vectors defined in dna to consecutive frames of rocket
      this.applyForce(this.dna.genes[count]);
      // if rocket has not got to goal and not crashed then update physics engine
      if (!this.done()) {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.vel.limit(4);
      }
    }
  };
  // displays rocket to window
  this.show = function () {
    // push and pop allow's rotating and translation not to affect other objects
    push();
    //color customization of rockets
    noStroke();
    if (this.crashed || this.dead) {
      fill(
        this.dna.color[0] / 1.5,
        this.dna.color[1] / 1.5,
        this.dna.color[2] / 1.5,
        250
      );
    } else {
      fill(this.dna.color[0], this.dna.color[1], this.dna.color[2], 250);
    }
    let sizeW = map(this.age, 0, lifespan, 2, 12);
    let sizeH = map(this.age, 0, lifespan, 10, 35);

    //translate to the postion of rocket
    translate(this.pos.x, this.pos.y);
    //rotates to the angle the rocket is pointing
    rotate(this.vel.heading());
    //creates a rectangle shape for rocket
    rectMode(CENTER);
    rect(0, 0, sizeH, sizeW);
    fill(100);
    rect((-sizeH - 5) / 2 + 5, 0, 5, sizeW);
    rectMode();
    if (!this.done()) {
      fill(220, 0, 0);
      let flameLength = map(
        this.dna.genes[this.age].mag(),
        0,
        maxforce,
        1,
        sizeH / 3
      );
      rect((-sizeH - flameLength) / 2, 0, flameLength, sizeW / 2);
    }
    pop();
  };
}
