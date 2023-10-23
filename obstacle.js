function Obstacle(x, y, _width, _height) {
  this.y = y == undefined ? random(100, height - 100) : y;
  this.width = _width == undefined ? random(20, width / 2) : _width;
  this.x = x == undefined ? random(width - this.width) : x;
  this.right = this.x + this.width;
  this.height = _height == undefined ? 10 : _height;
  this.bottom = this.y + this.height;

  this.containsPoint = function (x, y) {
    return x > this.x && x < this.right && y > this.y && y < this.bottom;
  };
  
  this.show = function () {
    // Renders barrier for rockets
    noStroke();
    fill(100, 0, 0);
    rect(this.x, this.y, this.width, this.height);
  };
}
