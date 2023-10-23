// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/bGz7mv2vD6g

function Population(populationCount) {
  // Array of rockets
  this.rockets = [];
  // Amount of rockets
  this.popsize = populationCount;
  // Amount parent rocket partners
  this.matingpool = [];

  // Associates a rocket to an array index
  for (var i = 0; i < this.popsize; i++) {
    this.rockets[i] = new Rocket(this);
  }
  
  this.allDone = function() {
    for (var i = 0; i < this.rockets.length; i++) {
      if(!this.rockets[i].done()) {
        return false;
      }
    }
    return true;
  }
  
  this.successCount = function() {
    let count = 0;
    for(let i = 0; i < this.rockets.length; ++i) {
      if (this.rockets[i].completed) {
        ++count;
      }
    }
    return count;
  }

  this.evaluate = function() {

    var maxfit = 0;
    // Iterate through all rockets and calcultes their fitness
    for (var i = 0; i < this.popsize; i++) {
      // Calculates fitness
      this.rockets[i].calcFitness();
      // If current fitness is greater than max, then make max equal to current
      if (this.rockets[i].fitness > maxfit) {
        maxfit = this.rockets[i].fitness;
      }
    }
    // Normalises fitnesses
    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i].fitness /= maxfit;
    }

    this.matingpool = [];
    // Take rockets fitness make in to scale of 1 to 100
    // A rocket with high fitness will highly likely will be in the mating pool
    for (var i = 0; i < this.popsize; i++) {
      var n = this.rockets[i].fitness * 100;
      for (var j = 0; j < n; j++) {
        this.matingpool.push(this.rockets[i]);
      }
    }
  }
  
  this.selection = function() {
    var newRockets = [];
    
    for (var i = 0; i < this.rockets.length; i++) {
      // Picks random dna
      var parentA = random(this.matingpool).dna;
      var parentB = random(this.matingpool).dna;
      // Creates child by using crossover function
      var child = parentA.crossover(parentB);
      child.mutation();
      // Creates new rocket with child dna
      newRockets[i] = new Rocket(pop, child);
    }
    return newRockets;
  }
  
  // Selects appropriate genes for child
  this.nextPopulation = function() {

    var pop = new Population(this.popsize);
    // This instance of rockets are the new rockets
    //this.rockets = newRockets;
    return pop;
  }

  // Calls for update and show functions
  this.run = function() {
    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i].update();
      // Displays rockets to screen
      this.rockets[i].show();
    }
  }
}
