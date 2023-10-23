// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/bGz7mv2vD6g

function DNA(genes, color, length) {
  this.mutationRate = 0.01;
  if (color) {
    this.color = color;
  } else {
    this.color = [random(255), random(255), random(255)];
  }
  this.colorChannelMixer = function (
    colorChannelA,
    colorChannelB,
    amountToMix
  ) {
    //colorChannelA and colorChannelB are ints ranging from 0 to 255
    var channelA = colorChannelA * amountToMix;
    var channelB = colorChannelB * (1 - amountToMix);
    return parseInt(channelA + channelB);
  };

  //rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
  //example (red): rgbA = [255,0,0]
  this.colorMixer = function (rgbA, rgbB, amountToMix) {
    var r = this.colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
    var g = this.colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
    var b = this.colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
    if (random(1) < this.mutationRate * 3) {
      r = random(255);
      g = random(255);
      b = random(255);
    }
    
    return [r, g, b];
  };

  this.randomGene = function () {
    let gene = p5.Vector.random2D();
    gene.setMag(random(maxforce));
    return gene;
  };

  // Receives genes and create a dna object
  if (genes) {
    this.genes = genes;
  }
  // If no genes just create random dna
  else {
    this.genes = [];
    for (var i = 0; i < lifespan; i++) {
      // Gives random vectors
      this.genes[i] = this.randomGene();
    }
  }
  // Performs a crossover with another member of the species
  this.crossover = function (partner) {
    var newColor = this.colorMixer(
      this.color,
      partner.color,
      random(0.25, 0.5)
    );
    var newgenes = [];
    // Picks random midpoint
    var mid = floor(random(this.genes.length));
    for (var i = 0; i < this.genes.length; i++) {
      // If i is greater than mid the new gene should come from this partner
      if (i > mid) {
        newgenes[i] = this.genes[i];
      }
      // If i < mid new gene should come from other partners gene's
      else {
        newgenes[i] = partner.genes[i];
      }
    }
    // Gives DNA object an array
    return new DNA(newgenes, newColor);
  };

  // Adds random mutation to the genes to add variance.
  this.mutation = function () {
    for (var i = 0; i < this.genes.length; i++) {
      // if random number less than 0.01, new gene is then random vector
      if (random(1) < this.mutationRate) {
        this.genes[i] = this.randomGene();
      }
    }
  };
}
